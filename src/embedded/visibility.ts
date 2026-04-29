// Visibility — see grammar.md §Visibility.
// Controls whether an embedded artifact is shown in rendered interfaces.
// Modeled as an embedding property rather than a rendering hint because it
// applies to any kind of embedded artifact, not only fields.
export type Visibility = 'visible' | 'hidden';

export const VISIBILITIES: readonly Visibility[] = Object.freeze([
  'visible',
  'hidden',
]);

// Default applied when Visibility is absent on an EmbeddedArtifact
// (grammar §Visibility).
export const DEFAULT_VISIBILITY: Visibility = 'visible';

export const isVisibility = (x: unknown): x is Visibility =>
  typeof x === 'string' && (VISIBILITIES as readonly string[]).includes(x);
