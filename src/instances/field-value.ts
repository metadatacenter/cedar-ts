import {
  type EmbeddedArtifactKey,
  embeddedArtifactKey,
} from '../embedded/index.js';
import type { Value } from '../values/index.js';

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
  readonly kind: 'field_value';
  readonly key: EmbeddedArtifactKey;
  readonly values: readonly [Value, ...Value[]];
}

// The `key` argument accepts a fully-built EmbeddedArtifactKey or a bare
// string (validated against the ASCII-identifier pattern via embeddedArtifactKey).
export function fieldValue(
  key: EmbeddedArtifactKey | string,
  ...values: [Value, ...Value[]]
): FieldValue {
  return { kind: 'field_value', key: embeddedArtifactKey(key), values };
}

export const isFieldValue = (x: unknown): x is FieldValue =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'field_value';
