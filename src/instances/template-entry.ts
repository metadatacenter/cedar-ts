import { parseAsciiIdentifier } from '../leaves/index.js';
import type { FieldEntry } from './field-entry.js';

// InstanceEntry and TemplateEntry — see grammar.md §Instances.
// TemplateEntry is the recursive construct that supports arbitrarily
// deep nested template structure: it contains InstanceEntry*, where each
// InstanceEntry may itself be a further TemplateEntry.
//
// Multi-valued EmbeddedTemplates are represented by multiple TemplateEntry
// entries sharing the same EmbeddedArtifactKey within the containing
// TemplateInstance — in contrast to multi-valued EmbeddedFields, whose multiple
// values are collected within a single FieldEntry.
//
// The child entries live in `entries` (an InstanceEntry list), parallel to
// Template.entries on the schema side; this is distinct from FieldEntry.values,
// which carries data Values.

export type InstanceEntry = FieldEntry | TemplateEntry;

export interface TemplateEntry {
  readonly kind: 'TemplateEntry';
  readonly key: string;
  readonly entries: readonly InstanceEntry[];
}

// `key` is validated against the ASCII-identifier pattern.
export function templateEntry(
  key: string,
  entries: readonly InstanceEntry[] = [],
): TemplateEntry {
  return {
    kind: 'TemplateEntry',
    key: parseAsciiIdentifier(key),
    entries,
  };
}

export const isTemplateEntry = (
  x: unknown,
): x is TemplateEntry =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateEntry';
