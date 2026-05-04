// =====================================================================
// metadata — wire-form serialize/parse for the descriptive / temporal-
// provenance / schema-versioning / annotations / artifact-metadata
// productions.
// =====================================================================

import { CedarConstructionError, isIri, iri } from '../leaves/index.js';
import { isLiteral } from '../literals/index.js';
import {
  type DescriptiveMetadata,
  type TemporalProvenance,
  type SchemaVersioning,
  type Status,
  type Annotation,
  type AnnotationValue,
  type ArtifactMetadata,
  type SchemaArtifactMetadata,
  descriptiveMetadata,
  temporalProvenance,
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

// ---- DescriptiveMetadata ---------------------------------------------

export function serializeDescriptiveMetadata(x: DescriptiveMetadata): unknown {
  const out: Record<string, unknown> = {
    name: serializeMultilingualString(x.name),
    altLabels: x.altLabels.map(serializeMultilingualString),
  };
  if (x.description !== undefined)
    out['description'] = serializeMultilingualString(x.description);
  if (x.identifier !== undefined) out['identifier'] = x.identifier;
  if (x.preferredLabel !== undefined)
    out['preferredLabel'] = serializeMultilingualString(x.preferredLabel);
  return out;
}

export function parseDescriptiveMetadata(
  x: unknown,
  where = 'DescriptiveMetadata',
): DescriptiveMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'name',
    'description',
    'identifier',
    'preferredLabel',
    'altLabels',
  ]);
  rejectNullProperty(o, 'description');
  rejectNullProperty(o, 'identifier');
  rejectNullProperty(o, 'preferredLabel');
  if (!('name' in o)) {
    throw new CedarConstructionError(`${where}: missing required "name"`);
  }
  if (!('altLabels' in o)) {
    throw new CedarConstructionError(`${where}: missing required "altLabels"`);
  }
  const altRaw = expectArray(o['altLabels'], `${where}.altLabels`);
  const init: {
    name: ReturnType<typeof parseMultilingualString>;
    description?: ReturnType<typeof parseMultilingualString>;
    identifier?: string;
    preferredLabel?: ReturnType<typeof parseMultilingualString>;
    altLabels: readonly ReturnType<typeof parseMultilingualString>[];
  } = {
    name: parseMultilingualString(o['name'], `${where}.name`),
    altLabels: altRaw.map((e, i) =>
      parseMultilingualString(e, `${where}.altLabels[${i}]`),
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
  return descriptiveMetadata(init);
}

// ---- TemporalProvenance ----------------------------------------------

export function serializeTemporalProvenance(x: TemporalProvenance): unknown {
  return {
    createdOn: serializeIsoDateTimeStamp(x.createdOn),
    createdBy: serializeIri(x.createdBy),
    modifiedOn: serializeIsoDateTimeStamp(x.modifiedOn),
    modifiedBy: serializeIri(x.modifiedBy),
  };
}

export function parseTemporalProvenance(
  x: unknown,
  where = 'TemporalProvenance',
): TemporalProvenance {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy']);
  for (const k of ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy'] as const) {
    if (!(k in o)) {
      throw new CedarConstructionError(`${where}: missing required ${JSON.stringify(k)}`);
    }
  }
  return temporalProvenance({
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
  // annotation() accepts string IRIs + AnnotationValue.
  if (isLiteral(body)) {
    return annotation(propertyIri, body);
  }
  return annotation(propertyIri, body);
}

// ---- ArtifactMetadata ------------------------------------------------

export function serializeArtifactMetadata(x: ArtifactMetadata): unknown {
  return {
    descriptiveMetadata: serializeDescriptiveMetadata(x.descriptiveMetadata),
    provenance: serializeTemporalProvenance(x.provenance),
    annotations: x.annotations.map(serializeAnnotation),
  };
}

export function parseArtifactMetadata(
  x: unknown,
  where = 'ArtifactMetadata',
): ArtifactMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['descriptiveMetadata', 'provenance', 'annotations']);
  if (!('descriptiveMetadata' in o)) {
    throw new CedarConstructionError(`${where}: missing required "descriptiveMetadata"`);
  }
  if (!('provenance' in o)) {
    throw new CedarConstructionError(`${where}: missing required "provenance"`);
  }
  if (!('annotations' in o)) {
    throw new CedarConstructionError(`${where}: missing required "annotations"`);
  }
  const annoArr = expectArray(o['annotations'], `${where}.annotations`);
  return artifactMetadata({
    descriptiveMetadata: parseDescriptiveMetadata(
      o['descriptiveMetadata'],
      `${where}.descriptiveMetadata`,
    ),
    provenance: parseTemporalProvenance(o['provenance'], `${where}.provenance`),
    annotations: annoArr.map((e, i) =>
      parseAnnotation(e, `${where}.annotations[${i}]`),
    ),
  });
}

// ---- SchemaArtifactMetadata ------------------------------------------

export function serializeSchemaArtifactMetadata(x: SchemaArtifactMetadata): unknown {
  return {
    artifact: serializeArtifactMetadata(x.artifact),
    versioning: serializeSchemaVersioning(x.versioning),
  };
}

export function parseSchemaArtifactMetadata(
  x: unknown,
  where = 'SchemaArtifactMetadata',
): SchemaArtifactMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['artifact', 'versioning']);
  if (!('artifact' in o)) {
    throw new CedarConstructionError(`${where}: missing required "artifact"`);
  }
  if (!('versioning' in o)) {
    throw new CedarConstructionError(`${where}: missing required "versioning"`);
  }
  return schemaArtifactMetadata({
    artifact: parseArtifactMetadata(o['artifact'], `${where}.artifact`),
    versioning: parseSchemaVersioning(o['versioning'], `${where}.versioning`),
  });
}
