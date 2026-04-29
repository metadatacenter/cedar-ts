// ValueRequirement — see grammar.md §Requirements.
// Required:    a value MUST be supplied for conformance.
// Recommended: absence is conformant; implementations MAY warn.
// Optional:    absence is conformant.
// Recommended and Optional are equivalent for conformance purposes; the
// distinction is authoring guidance only.
export type ValueRequirement = 'required' | 'recommended' | 'optional';

export const VALUE_REQUIREMENTS: readonly ValueRequirement[] = Object.freeze([
  'required',
  'recommended',
  'optional',
]);

// Default applied when ValueRequirement is absent on an EmbeddedArtifact
// (grammar §Requirements).
export const DEFAULT_VALUE_REQUIREMENT: ValueRequirement = 'optional';

export const isValueRequirement = (x: unknown): x is ValueRequirement =>
  typeof x === 'string' &&
  (VALUE_REQUIREMENTS as readonly string[]).includes(x);
