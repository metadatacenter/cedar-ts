// =====================================================================
// instances — wire-form serialize/parse for TemplateInstance, FieldEntry,
// TemplateEntry, and the InstanceEntry union.
// =====================================================================
//
// Wire form (wire-grammar.md §13):
//
//   TemplateInstance ::: object {
//     "kind": "TemplateInstance"
//     id:          string
//     metadata:    ArtifactMetadata
//     templateRef: string
//     entries:     array<InstanceEntry>
//   }
//
//   InstanceEntry ::: FieldEntry | TemplateEntry     // discr: kind
//
//   FieldEntry ::: object {
//     "kind": "FieldEntry"
//     key:    string
//     values: nonEmptyArray<Value>
//   }
//
//   TemplateEntry ::: object {
//     "kind": "TemplateEntry"
//     key:    string
//     entries: array<InstanceEntry>
//   }

import { CedarConstructionError } from '../leaves/index.js';
import {
  type FieldEntry,
  type TemplateEntry,
  type InstanceEntry,
  type TemplateInstance,
  fieldEntry,
  templateEntry,
  templateInstance,
} from '../instances/index.js';
import type { Value } from '../field-families/index.js';
import {
  expectObject,
  expectArray,
  expectNonEmptyArray,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
} from './parse-utils.js';
import {
  serializeTemplateInstanceId,
  parseTemplateInstanceId,
  serializeTemplateId,
  parseTemplateId,
} from './collapsed-wrappers.js';
import {
  serializeCatalogMetadata,
  parseCatalogMetadata,
} from './metadata.js';
import { serializeValue, parseValue } from './values.js';

// ---- FieldEntry ------------------------------------------------------

export function serializeFieldValue(x: FieldEntry): unknown {
  return {
    kind: 'FieldEntry',
    key: x.key,
    values: x.values.map((v) => serializeValue(v)),
  };
}

export function parseFieldValue(x: unknown, where = 'FieldEntry'): FieldEntry {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'key', 'values']);
  if (o['kind'] !== 'FieldEntry') {
    throw new CedarConstructionError(`${where}: expected kind "FieldEntry"`);
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('values' in o)) {
    throw new CedarConstructionError(`${where}: missing required "values"`);
  }
  const key = expectString(o['key'], `${where}.key`);
  const arr = expectNonEmptyArray(o['values'], `${where}.values`);
  const values = arr.map((e, i) => parseValue(e, `${where}.values[${i}]`));
  return fieldEntry(key, ...(values as [Value, ...Value[]]));
}

// ---- TemplateEntry ------------------------------------------

export function serializeNestedTemplateInstance(
  x: TemplateEntry,
): unknown {
  return {
    kind: 'TemplateEntry',
    key: x.key,
    entries: x.entries.map((v) => serializeInstanceValue(v)),
  };
}

export function parseNestedTemplateInstance(
  x: unknown,
  where = 'TemplateEntry',
): TemplateEntry {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'key', 'entries']);
  if (o['kind'] !== 'TemplateEntry') {
    throw new CedarConstructionError(
      `${where}: expected kind "TemplateEntry"`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('entries' in o)) {
    throw new CedarConstructionError(`${where}: missing required "entries"`);
  }
  const key = expectString(o['key'], `${where}.key`);
  const arr = expectArray(o['entries'], `${where}.entries`);
  const entries = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.entries[${i}]`),
  );
  return templateEntry(key, entries);
}

// ---- InstanceEntry union --------------------------------------------

const INSTANCE_ENTRY_KINDS = ['FieldEntry', 'TemplateEntry'] as const;

export function serializeInstanceValue(x: InstanceEntry): unknown {
  if (x.kind === 'FieldEntry') return serializeFieldValue(x);
  return serializeNestedTemplateInstance(x);
}

export function parseInstanceValue(
  x: unknown,
  where = 'InstanceEntry',
): InstanceEntry {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, INSTANCE_ENTRY_KINDS, where);
  if (k === 'FieldEntry') return parseFieldValue(x, where);
  return parseNestedTemplateInstance(x, where);
}

// ---- TemplateInstance ------------------------------------------------

export function serializeTemplateInstance(x: TemplateInstance): unknown {
  return {
    kind: 'TemplateInstance',
    id: serializeTemplateInstanceId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    templateRef: serializeTemplateId(x.templateRef),
    entries: x.entries.map((v) => serializeInstanceValue(v)),
  };
}

export function parseTemplateInstance(
  x: unknown,
  where = 'TemplateInstance',
): TemplateInstance {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'id',
    'modelVersion',
    'metadata',
    'templateRef',
    'entries',
  ]);
  if (o['kind'] !== 'TemplateInstance') {
    throw new CedarConstructionError(
      `${where}: expected kind "TemplateInstance"`,
    );
  }
  for (const k of ['id', 'modelVersion', 'metadata', 'templateRef', 'entries']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  const arr = expectArray(o['entries'], `${where}.entries`);
  const entries = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.entries[${i}]`),
  );
  return templateInstance({
    id: parseTemplateInstanceId(o['id'], `${where}.id`),
    modelVersion: expectString(o['modelVersion'], `${where}.modelVersion`),
    metadata: parseCatalogMetadata(o['metadata'], `${where}.metadata`),
    templateRef: parseTemplateId(o['templateRef'], `${where}.templateRef`),
    entries,
  });
}
