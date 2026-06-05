import { parseAsciiIdentifier } from '../leaves/index.js';
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
//
// The child entries live in `members` (an InstanceValue list), parallel to
// Template.members on the schema side; this is distinct from FieldValue.values,
// which carries data Values.

export type InstanceValue = FieldValue | NestedTemplateInstance;

export interface NestedTemplateInstance {
  readonly kind: 'NestedTemplateInstance';
  readonly key: string;
  readonly members: readonly InstanceValue[];
}

// `key` is validated against the ASCII-identifier pattern.
export function nestedTemplateInstance(
  key: string,
  members: readonly InstanceValue[] = [],
): NestedTemplateInstance {
  return {
    kind: 'NestedTemplateInstance',
    key: parseAsciiIdentifier(key),
    members,
  };
}

export const isNestedTemplateInstance = (
  x: unknown,
): x is NestedTemplateInstance =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'NestedTemplateInstance';
