// =====================================================================
// metadata — wire-form serialize/parse for the lifecycle-metadata,
// schema-artifact-versioning, annotations, and artifact-metadata productions.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  type LifecycleMetadata,
  type SchemaArtifactVersioning,
  type Status,
  type Annotation,
  type AnnotationValue,
  type CatalogMetadata,
  lifecycleMetadata,
  schemaArtifactVersioning,
  annotation,
  catalogMetadata,
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
  annotationStringValue,
  annotationIriValue,
  isAnnotationStringValue,
  isAnnotationIriValue,
} from '../metadata/annotations.js';

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

// ---- SchemaArtifactVersioning + Status ---------------------------------------

const STATUS_VALUES = ['draft', 'published'] as const;

export function serializeStatus(x: Status): string {
  return x;
}

export function parseStatus(x: unknown, where = 'Status'): Status {
  return expectStringEnum(x, STATUS_VALUES, where);
}

export function serializeSchemaArtifactVersioning(x: SchemaArtifactVersioning): unknown {
  const out: Record<string, unknown> = {
    version: x.version,
    status: x.status,
  };
  if (x.previousVersion !== undefined)
    out['previousVersion'] = serializeIri(x.previousVersion);
  if (x.derivedFrom !== undefined) out['derivedFrom'] = serializeIri(x.derivedFrom);
  return out;
}

export function parseSchemaArtifactVersioning(
  x: unknown,
  where = 'SchemaArtifactVersioning',
): SchemaArtifactVersioning {
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
  return schemaArtifactVersioning(init);
}

// ---- AnnotationValue (kind-discriminated) ----------------------------
//
// Wire form (per wire-grammar.md §5.4):
//   { kind: "AnnotationStringValue", value, lang? }
//   { kind: "AnnotationIriValue", iri }

export function serializeAnnotationValue(x: AnnotationValue): unknown {
  if (isAnnotationStringValue(x)) {
    const out: Record<string, unknown> = {
      kind: 'AnnotationStringValue',
      value: x.value,
    };
    if (x.lang !== undefined) out['lang'] = x.lang.value;
    return out;
  }
  return { kind: 'AnnotationIriValue', iri: x.iri.value };
}

export function parseAnnotationValue(
  x: unknown,
  where = 'AnnotationValue',
): AnnotationValue {
  const o = expectObject(x, where);
  const k = o['kind'];
  if (k === 'AnnotationStringValue') {
    expectKnownProperties(o, ['kind', 'value', 'lang']);
    rejectNullProperty(o, 'lang');
    if (!('value' in o)) {
      throw new CedarConstructionError(`${where}: missing required "value"`);
    }
    const value = expectString(o['value'], `${where}.value`);
    if ('lang' in o) {
      return annotationStringValue(value, expectString(o['lang'], `${where}.lang`));
    }
    return annotationStringValue(value);
  }
  if (k === 'AnnotationIriValue') {
    expectKnownProperties(o, ['kind', 'iri']);
    if (!('iri' in o)) {
      throw new CedarConstructionError(`${where}: missing required "iri"`);
    }
    return annotationIriValue(expectString(o['iri'], `${where}.iri`));
  }
  throw new CedarConstructionError(
    `${where}: expected kind "AnnotationStringValue" or "AnnotationIriValue"; got ${JSON.stringify(k)}`,
  );
}

// Suppress unused-import warning — `isAnnotationIriValue` is exposed
// through the metadata barrel.
void isAnnotationIriValue;

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
  return annotation(propertyIri, body);
}

// ---- CatalogMetadata ------------------------------------------------
//
// Wire form is flat: the descriptive properties (preferredLabel,
// description, externalSourceId, altLabels) sit directly alongside
// `lifecycle` and `annotations`. Empty `altLabels` and `annotations`
// are elided. `preferredLabel` is optional.
//
// Versioning (SchemaArtifactVersioning) is NOT part of CatalogMetadata;
// on schema artifacts it lives as a separate top-level slot on the
// artifact itself.

const CATALOG_METADATA_KEYS = [
  'preferredLabel',
  'description',
  'externalSourceId',
  'altLabels',
  'lifecycle',
  'annotations',
] as const;

export function serializeCatalogMetadata(x: CatalogMetadata): unknown {
  const out: Record<string, unknown> = {};
  if (x.preferredLabel !== undefined)
    out['preferredLabel'] = serializeMultilingualString(x.preferredLabel);
  if (x.description !== undefined)
    out['description'] = serializeMultilingualString(x.description);
  if (x.externalSourceId !== undefined)
    out['externalSourceId'] = x.externalSourceId;
  if (x.altLabels.length > 0)
    out['altLabels'] = x.altLabels.map(serializeMultilingualString);
  out['lifecycle'] = serializeLifecycleMetadata(x.lifecycle);
  if (x.annotations.length > 0)
    out['annotations'] = x.annotations.map(serializeAnnotation);
  return out;
}

export function parseCatalogMetadata(
  x: unknown,
  where = 'CatalogMetadata',
): CatalogMetadata {
  const o = expectObject(x, where);
  expectKnownProperties(o, [...CATALOG_METADATA_KEYS]);
  rejectNullProperty(o, 'preferredLabel');
  rejectNullProperty(o, 'description');
  rejectNullProperty(o, 'externalSourceId');
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
    preferredLabel?: ReturnType<typeof parseMultilingualString>;
    description?: ReturnType<typeof parseMultilingualString>;
    externalSourceId?: string;
    altLabels: readonly ReturnType<typeof parseMultilingualString>[];
    lifecycle: LifecycleMetadata;
    annotations: readonly Annotation[];
  } = {
    altLabels: altRaw.map((e, i) =>
      parseMultilingualString(e, `${where}.altLabels[${i}]`),
    ),
    lifecycle: parseLifecycleMetadata(o['lifecycle'], `${where}.lifecycle`),
    annotations: annoArr.map((e, i) =>
      parseAnnotation(e, `${where}.annotations[${i}]`),
    ),
  };
  if ('preferredLabel' in o)
    init.preferredLabel = parseMultilingualString(
      o['preferredLabel'],
      `${where}.preferredLabel`,
    );
  if ('description' in o)
    init.description = parseMultilingualString(o['description'], `${where}.description`);
  if ('externalSourceId' in o)
    init.externalSourceId = expectString(
      o['externalSourceId'],
      `${where}.externalSourceId`,
    );
  return catalogMetadata(init);
}
