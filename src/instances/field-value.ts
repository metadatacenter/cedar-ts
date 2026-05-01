import { parseAsciiIdentifier } from '../leaves/index.js';
import type { Value } from '../field-families/index.js';

// FieldValue — see grammar.md §Instances.
// Carries one or more typed Values for an EmbeddedField in the referenced
// Template. Per the grammar's `Value+`, a FieldValue MUST contain at least
// one Value: absence of a value for an optional field is represented by
// omitting the FieldValue entirely (grammar §Instances).
//
// Multi-valued EmbeddedFields collect all values for one embedding in a
// single FieldValue (in contrast to multi-cardinality EmbeddedTemplates,
// which use multiple NestedTemplateInstance entries with the same key).
//
// Field/value family alignment with the referenced field's FieldSpec is
// enforced at validation rather than at this structural layer.

export interface FieldValue {
  readonly kind: 'FieldValue';
  readonly key: string;
  readonly values: readonly [Value, ...Value[]];
}

// `key` is validated against the ASCII-identifier pattern.
export function fieldValue(
  key: string,
  ...values: [Value, ...Value[]]
): FieldValue {
  return { kind: 'FieldValue', key: parseAsciiIdentifier(key), values };
}

export const isFieldValue = (x: unknown): x is FieldValue =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'FieldValue';
