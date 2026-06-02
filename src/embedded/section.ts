import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { EmbeddedArtifact } from './index.js';

// Section — see grammar.md §Sections.
// A grouping member of a Template (or of another Section): it gathers
// TemplateMember constructs under a heading. Sectioning is semantic
// organisation, not presentation. A Section carries no EmbeddedArtifactKey,
// contributes no instance data, and is transparent to instance matching.
//
// `members` is again a TemplateMember sequence, so sections nest.

export type Collapsibility = 'none' | 'startsExpanded' | 'startsCollapsed';
export const COLLAPSIBILITIES: readonly Collapsibility[] = Object.freeze([
  'none',
  'startsExpanded',
  'startsCollapsed',
]);

// A Template (or Section) member: either a reusable-artifact embedding or a
// grouping Section. Defined here (rather than in index.ts) so section.ts is
// self-contained; re-exported from the embedded barrel.
export type TemplateMember = EmbeddedArtifact | Section;

export interface Section {
  readonly kind: 'Section';
  readonly label: MultilingualString;
  readonly description?: MultilingualString;
  readonly collapsibility?: Collapsibility;
  readonly members: readonly TemplateMember[];
}

export interface SectionInit {
  readonly label: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly collapsibility?: Collapsibility;
  readonly members?: readonly TemplateMember[];
}

export function section(init: SectionInit): Section {
  const out: {
    kind: 'Section';
    label: MultilingualString;
    description?: MultilingualString;
    collapsibility?: Collapsibility;
    members: readonly TemplateMember[];
  } = {
    kind: 'Section',
    label: multilingualString(init.label),
    members: init.members ?? [],
  };
  if (init.description !== undefined)
    out.description = multilingualString(init.description);
  if (init.collapsibility !== undefined) out.collapsibility = init.collapsibility;
  return out;
}

export function isSection(x: unknown): x is Section {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'Section'
  );
}
