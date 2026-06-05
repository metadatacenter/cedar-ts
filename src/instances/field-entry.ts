import { parseAsciiIdentifier } from '../leaves/index.js';
import type { Value } from '../field-families/index.js';

// FieldEntry — see grammar.md §Instances.
// Carries one or more typed Values for an EmbeddedField in the referenced
// Template. Per the grammar's `Value+`, a FieldEntry MUST contain at least
// one Value: absence of a value for an optional field is represented by
// omitting the FieldEntry entirely (grammar §Instances).
//
// Multi-valued EmbeddedFields collect all values for one embedding in a
// single FieldEntry (in contrast to multi-cardinality EmbeddedTemplates,
// which use multiple TemplateEntry entries with the same key).
//
// Field/value family alignment with the referenced field's FieldSpec is
// enforced at validation rather than at this structural layer.

export interface FieldEntry {
  readonly kind: 'FieldEntry';
  readonly key: string;
  readonly values: readonly [Value, ...Value[]];
}

// `key` is validated against the ASCII-identifier pattern.
export function fieldEntry(
  key: string,
  ...values: [Value, ...Value[]]
): FieldEntry {
  return { kind: 'FieldEntry', key: parseAsciiIdentifier(key), values };
}

export const isFieldEntry = (x: unknown): x is FieldEntry =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'FieldEntry';
