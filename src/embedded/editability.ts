// Editability — see grammar.md §Editability.
// Controls whether the value of an embedded field may be edited by the user.
// Orthogonal to Visibility (shown vs. editable) and carried only by
// EmbeddedField variants, since only embedded fields bear values.
export type Editability = 'editable' | 'readOnly';

export const EDITABILITIES: readonly Editability[] = Object.freeze([
  'editable',
  'readOnly',
]);

// Default applied when Editability is absent on an EmbeddedField
// (grammar §Editability).
export const DEFAULT_EDITABILITY: Editability = 'editable';

export const isEditability = (x: unknown): x is Editability =>
  typeof x === 'string' && (EDITABILITIES as readonly string[]).includes(x);
