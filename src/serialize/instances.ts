// =====================================================================
// instances — wire-form serialize/parse for TemplateInstance, FieldValue,
// NestedTemplateInstance, and the InstanceValue union.
// =====================================================================
//
// Wire form (wire-grammar.md §13):
//
//   TemplateInstance ::: object {
//     "kind": "TemplateInstance"
//     id:          string
//     metadata:    ArtifactMetadata
//     templateRef: string
//     members:     array<InstanceValue>
//   }
//
//   InstanceValue ::: FieldValue | NestedTemplateInstance     // discr: kind
//
//   FieldValue ::: object {
//     "kind": "FieldValue"
//     key:    string
//     values: nonEmptyArray<Value>
//   }
//
//   NestedTemplateInstance ::: object {
//     "kind": "NestedTemplateInstance"
//     key:    string
//     members: array<InstanceValue>
//   }

import { CedarConstructionError } from '../leaves/index.js';
import {
  type FieldValue,
  type NestedTemplateInstance,
  type InstanceValue,
  type TemplateInstance,
  fieldValue,
  nestedTemplateInstance,
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

// ---- FieldValue ------------------------------------------------------

export function serializeFieldValue(x: FieldValue): unknown {
  return {
    kind: 'FieldValue',
    key: x.key,
    values: x.values.map((v) => serializeValue(v)),
  };
}

export function parseFieldValue(x: unknown, where = 'FieldValue'): FieldValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'key', 'values']);
  if (o['kind'] !== 'FieldValue') {
    throw new CedarConstructionError(`${where}: expected kind "FieldValue"`);
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
  return fieldValue(key, ...(values as [Value, ...Value[]]));
}

// ---- NestedTemplateInstance ------------------------------------------

export function serializeNestedTemplateInstance(
  x: NestedTemplateInstance,
): unknown {
  return {
    kind: 'NestedTemplateInstance',
    key: x.key,
    members: x.members.map((v) => serializeInstanceValue(v)),
  };
}

export function parseNestedTemplateInstance(
  x: unknown,
  where = 'NestedTemplateInstance',
): NestedTemplateInstance {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'key', 'members']);
  if (o['kind'] !== 'NestedTemplateInstance') {
    throw new CedarConstructionError(
      `${where}: expected kind "NestedTemplateInstance"`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('members' in o)) {
    throw new CedarConstructionError(`${where}: missing required "members"`);
  }
  const key = expectString(o['key'], `${where}.key`);
  const arr = expectArray(o['members'], `${where}.members`);
  const members = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.members[${i}]`),
  );
  return nestedTemplateInstance(key, members);
}

// ---- InstanceValue union --------------------------------------------

const INSTANCE_VALUE_KINDS = ['FieldValue', 'NestedTemplateInstance'] as const;

export function serializeInstanceValue(x: InstanceValue): unknown {
  if (x.kind === 'FieldValue') return serializeFieldValue(x);
  return serializeNestedTemplateInstance(x);
}

export function parseInstanceValue(
  x: unknown,
  where = 'InstanceValue',
): InstanceValue {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, INSTANCE_VALUE_KINDS, where);
  if (k === 'FieldValue') return parseFieldValue(x, where);
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
    members: x.members.map((v) => serializeInstanceValue(v)),
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
    'members',
  ]);
  if (o['kind'] !== 'TemplateInstance') {
    throw new CedarConstructionError(
      `${where}: expected kind "TemplateInstance"`,
    );
  }
  for (const k of ['id', 'modelVersion', 'metadata', 'templateRef', 'members']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  const arr = expectArray(o['members'], `${where}.members`);
  const members = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.members[${i}]`),
  );
  return templateInstance({
    id: parseTemplateInstanceId(o['id'], `${where}.id`),
    modelVersion: expectString(o['modelVersion'], `${where}.modelVersion`),
    metadata: parseCatalogMetadata(o['metadata'], `${where}.metadata`),
    templateRef: parseTemplateId(o['templateRef'], `${where}.templateRef`),
    members,
  });
}
