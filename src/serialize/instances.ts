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
//     values:      array<InstanceValue>
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
//     values: array<InstanceValue>
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
  serializeArtifactMetadata,
  parseArtifactMetadata,
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
    values: x.values.map((v) => serializeInstanceValue(v)),
  };
}

export function parseNestedTemplateInstance(
  x: unknown,
  where = 'NestedTemplateInstance',
): NestedTemplateInstance {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'key', 'values']);
  if (o['kind'] !== 'NestedTemplateInstance') {
    throw new CedarConstructionError(
      `${where}: expected kind "NestedTemplateInstance"`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('values' in o)) {
    throw new CedarConstructionError(`${where}: missing required "values"`);
  }
  const key = expectString(o['key'], `${where}.key`);
  const arr = expectArray(o['values'], `${where}.values`);
  const values = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.values[${i}]`),
  );
  return nestedTemplateInstance(key, values);
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
    metadata: serializeArtifactMetadata(x.metadata),
    templateRef: serializeTemplateId(x.templateRef),
    values: x.values.map((v) => serializeInstanceValue(v)),
  };
}

export function parseTemplateInstance(
  x: unknown,
  where = 'TemplateInstance',
): TemplateInstance {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata', 'templateRef', 'values']);
  if (o['kind'] !== 'TemplateInstance') {
    throw new CedarConstructionError(
      `${where}: expected kind "TemplateInstance"`,
    );
  }
  for (const k of ['id', 'metadata', 'templateRef', 'values']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  const arr = expectArray(o['values'], `${where}.values`);
  const values = arr.map((e, i) =>
    parseInstanceValue(e, `${where}.values[${i}]`),
  );
  return templateInstance({
    id: parseTemplateInstanceId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
    templateRef: parseTemplateId(o['templateRef'], `${where}.templateRef`),
    values,
  });
}
