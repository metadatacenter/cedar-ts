import {
  type EmbeddedArtifactKey,
  embeddedArtifactKey,
} from '../embedded/index.js';
import type { FieldValue } from './field-value.js';

// InstanceValue and NestedTemplateInstance — see grammar.md §Instances.
// NestedTemplateInstance is the recursive construct that supports arbitrarily
// deep nested template structure: it contains InstanceValue*, where each
// InstanceValue may itself be a further NestedTemplateInstance.
//
// Multi-valued EmbeddedTemplates are represented by multiple NestedTemplateInstance
// entries sharing the same EmbeddedArtifactKey within the containing
// TemplateInstance — in contrast to multi-valued EmbeddedFields, whose multiple
// values are collected within a single FieldValue.

export type InstanceValue = FieldValue | NestedTemplateInstance;

export interface NestedTemplateInstance {
  readonly kind: 'nested_template_instance';
  readonly key: EmbeddedArtifactKey;
  readonly values: readonly InstanceValue[];
}

// The `key` argument accepts a fully-built EmbeddedArtifactKey or a bare
// string (validated against the ASCII-identifier pattern via embeddedArtifactKey).
export function nestedTemplateInstance(
  key: EmbeddedArtifactKey | string,
  values: readonly InstanceValue[] = [],
): NestedTemplateInstance {
  return {
    kind: 'nested_template_instance',
    key: embeddedArtifactKey(key),
    values,
  };
}

export const isNestedTemplateInstance = (
  x: unknown,
): x is NestedTemplateInstance =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'nested_template_instance';
