// =====================================================================
// metadata — wire-form serialize/parse for the lifecycle-metadata,
// schema-versioning, annotations, and artifact-metadata productions.
// =====================================================================

import { CedarConstructionError, isIri, iri } from '../leaves/index.js';
import { isLiteral } from '../literals/index.js';
import {
  type LifecycleMetadata,
  type SchemaVersioning,
  type Status,
  type Annotation,
  type AnnotationValue,
  type ArtifactMetadata,
  type SchemaArtifactMetadata,
  lifecycleMetadata,
  schemaVersioning,
  annotation,
  artifactMetadata,
  schemaArtifactMetadata,
} from '../metadata/index.js';
import {
  expectObject,
  expectArray,
  expectString,
  expectKnownProperties,
  expectStringEnum,
  rejectNullProperty,
} from './parse-utils.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import { serializeIri, serializeIsoDateTimeStamp } from './collapsed-wrappers.js';
import {
  serializeLiteral,
  parseLiteral,
} from './literals.js';

// ---- LifecycleMetadata -----------------------------------------------

export function serializeLifecycleMetadata(x: LifecycleMetadata): unknown {
  return {
    createdOn: serializeIsoDateTimeStamp(x.createdOn),
    createdBy: serializeIri(x.createdBy),
    modifiedOn: serializeIsoDateTimeStamp(x.modifiedOn),
    modifiedBy: serializeIri(x.modifiedBy),
  };
}

export function parseLifecycleMetadata(
  x: unknown,
  where = 'LifecycleMetadata',
): LifecycleMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy']);
  for (const k of ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy'] as const) {
    if (!(k in o)) {
      throw new CedarConstructionError(`${where}: missing required ${JSON.stringify(k)}`);
    }
  }
  return lifecycleMetadata({
    createdOn: expectString(o['createdOn'], `${where}.createdOn`),
    createdBy: expectString(o['createdBy'], `${where}.createdBy`),
    modifiedOn: expectString(o['modifiedOn'], `${where}.modifiedOn`),
    modifiedBy: expectString(o['modifiedBy'], `${where}.modifiedBy`),
  });
}

// ---- SchemaVersioning + Status ---------------------------------------

const STATUS_VALUES = ['draft', 'published'] as const;

export function serializeStatus(x: Status): string {
  return x;
}

export function parseStatus(x: unknown, where = 'Status'): Status {
  return expectStringEnum(x, STATUS_VALUES, where);
}

export function serializeSchemaVersioning(x: SchemaVersioning): unknown {
  const out: Record<string, unknown> = {
    version: x.version,
    status: x.status,
  };
  if (x.previousVersion !== undefined)
    out['previousVersion'] = serializeIri(x.previousVersion);
  if (x.derivedFrom !== undefined) out['derivedFrom'] = serializeIri(x.derivedFrom);
  return out;
}

export function parseSchemaVersioning(
  x: unknown,
  where = 'SchemaVersioning',
): SchemaVersioning {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'version',
    'status',
    'previousVersion',
    'derivedFrom',
  ]);
  rejectNullProperty(o, 'previousVersion');
  rejectNullProperty(o, 'derivedFrom');
  if (!('version' in o)) {
    throw new CedarConstructionError(`${where}: missing required "version"`);
  }
  if (!('status' in o)) {
    throw new CedarConstructionError(`${where}: missing required "status"`);
  }
  const init: {
    version: string;
    status: Status;
    previousVersion?: string;
    derivedFrom?: string;
  } = {
    version: expectString(o['version'], `${where}.version`),
    status: parseStatus(o['status'], `${where}.status`),
  };
  if ('previousVersion' in o)
    init.previousVersion = expectString(o['previousVersion'], `${where}.previousVersion`);
  if ('derivedFrom' in o)
    init.derivedFrom = expectString(o['derivedFrom'], `${where}.derivedFrom`);
  return schemaVersioning(init);
}

// ---- AnnotationValue (property-set discriminated) --------------------
//
// Wire form:
//   { value }                 → SimpleLiteral
//   { value, lang }           → LangTaggedLiteral
//   { value, datatype }       → TypedLiteral
//   { iri }                   → Iri (wrapped at this polymorphic position)
//
// Multi-match (e.g. {value, iri}) is rejected.

export function serializeAnnotationValue(x: AnnotationValue): unknown {
  if (isIri(x)) return { iri: x.value };
  return serializeLiteral(x);
}

export function parseAnnotationValue(
  x: unknown,
  where = 'AnnotationValue',
): AnnotationValue {
  const o = expectObject(x, where);
  const hasIri = 'iri' in o;
  const hasValue = 'value' in o;
  if (hasIri && hasValue) {
    throw new CedarConstructionError(
      `${where}: object MUST NOT carry both "iri" and "value"`,
    );
  }
  if (hasIri) {
    expectKnownProperties(o, ['iri']);
    return iri(expectString(o['iri'], `${where}.iri`));
  }
  if (hasValue) {
    return parseLiteral(x, where);
  }
  throw new CedarConstructionError(
    `${where}: object MUST carry either "iri" or "value"`,
  );
}

// ---- Annotation ------------------------------------------------------

export function serializeAnnotation(x: Annotation): unknown {
  return {
    property: serializeIri(x.property),
    body: serializeAnnotationValue(x.body),
  };
}

export function parseAnnotation(x: unknown, where = 'Annotation'): Annotation {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['property', 'body']);
  if (!('property' in o)) {
    throw new CedarConstructionError(`${where}: missing required "property"`);
  }
  if (!('body' in o)) {
    throw new CedarConstructionError(`${where}: missing required "body"`);
  }
  const propertyIri = expectString(o['property'], `${where}.property`);
  const body = parseAnnotationValue(o['body'], `${where}.body`);
  if (isLiteral(body)) {
    return annotation(propertyIri, body);
  }
  return annotation(propertyIri, body);
}

// ---- ArtifactMetadata ------------------------------------------------
//
// Wire form is flat: the descriptive properties (name, description,
// identifier, preferredLabel, altLabels) sit directly alongside
// `lifecycle` and `annotations`. Empty `altLabels` and `annotations`
// are elided.

const ARTIFACT_METADATA_KEYS = [
  'name',
  'description',
  'identifier',
  'preferredLabel',
  'altLabels',
  'lifecycle',
  'annotations',
] as const;

function writeArtifactMetadataBody(
  x: ArtifactMetadata,
  out: Record<string, unknown>,
): void {
  out['name'] = serializeMultilingualString(x.name);
  if (x.description !== undefined)
    out['description'] = serializeMultilingualString(x.description);
  if (x.identifier !== undefined) out['identifier'] = x.identifier;
  if (x.preferredLabel !== undefined)
    out['preferredLabel'] = serializeMultilingualString(x.preferredLabel);
  if (x.altLabels.length > 0)
    out['altLabels'] = x.altLabels.map(serializeMultilingualString);
  out['lifecycle'] = serializeLifecycleMetadata(x.lifecycle);
  if (x.annotations.length > 0)
    out['annotations'] = x.annotations.map(serializeAnnotation);
}

function readArtifactMetadataBody(
  o: Record<string, unknown>,
  where: string,
): ArtifactMetadata {
  rejectNullProperty(o, 'description');
  rejectNullProperty(o, 'identifier');
  rejectNullProperty(o, 'preferredLabel');
  if (!('name' in o)) {
    throw new CedarConstructionError(`${where}: missing required "name"`);
  }
  if (!('lifecycle' in o)) {
    throw new CedarConstructionError(`${where}: missing required "lifecycle"`);
  }
  const altRaw =
    'altLabels' in o ? expectArray(o['altLabels'], `${where}.altLabels`) : [];
  const annoArr =
    'annotations' in o
      ? expectArray(o['annotations'], `${where}.annotations`)
      : [];
  const init: {
    name: ReturnType<typeof parseMultilingualString>;
    description?: ReturnType<typeof parseMultilingualString>;
    identifier?: string;
    preferredLabel?: ReturnType<typeof parseMultilingualString>;
    altLabels: readonly ReturnType<typeof parseMultilingualString>[];
    lifecycle: LifecycleMetadata;
    annotations: readonly Annotation[];
  } = {
    name: parseMultilingualString(o['name'], `${where}.name`),
    altLabels: altRaw.map((e, i) =>
      parseMultilingualString(e, `${where}.altLabels[${i}]`),
    ),
    lifecycle: parseLifecycleMetadata(o['lifecycle'], `${where}.lifecycle`),
    annotations: annoArr.map((e, i) =>
      parseAnnotation(e, `${where}.annotations[${i}]`),
    ),
  };
  if ('description' in o)
    init.description = parseMultilingualString(o['description'], `${where}.description`);
  if ('identifier' in o)
    init.identifier = expectString(o['identifier'], `${where}.identifier`);
  if ('preferredLabel' in o)
    init.preferredLabel = parseMultilingualString(
      o['preferredLabel'],
      `${where}.preferredLabel`,
    );
  return artifactMetadata(init);
}

export function serializeArtifactMetadata(x: ArtifactMetadata): unknown {
  const out: Record<string, unknown> = {};
  writeArtifactMetadataBody(x, out);
  return out;
}

export function parseArtifactMetadata(
  x: unknown,
  where = 'ArtifactMetadata',
): ArtifactMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, [...ARTIFACT_METADATA_KEYS]);
  return readArtifactMetadataBody(o, where);
}

// ---- SchemaArtifactMetadata ------------------------------------------
//
// Wire form is fully flat: the inner `ArtifactMetadata`'s properties
// are promoted to direct children alongside `versioning`. There is
// no `artifact` wrapper.

const SCHEMA_ARTIFACT_METADATA_KEYS = [
  ...ARTIFACT_METADATA_KEYS,
  'versioning',
] as const;

export function serializeSchemaArtifactMetadata(x: SchemaArtifactMetadata): unknown {
  const out: Record<string, unknown> = {};
  writeArtifactMetadataBody(x.artifact, out);
  out['versioning'] = serializeSchemaVersioning(x.versioning);
  return out;
}

export function parseSchemaArtifactMetadata(
  x: unknown,
  where = 'SchemaArtifactMetadata',
): SchemaArtifactMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, [...SCHEMA_ARTIFACT_METADATA_KEYS]);
  if (!('versioning' in o)) {
    throw new CedarConstructionError(`${where}: missing required "versioning"`);
  }
  return schemaArtifactMetadata({
    artifact: readArtifactMetadataBody(o, where),
    versioning: parseSchemaVersioning(o['versioning'], `${where}.versioning`),
  });
}
