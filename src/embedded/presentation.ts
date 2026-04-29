import type { PresentationComponentReference } from '../identity.js';
import { type EmbeddedArtifactKey, embeddedArtifactKey } from './key.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';

// EmbeddedPresentationComponent — see grammar.md §Embedded Artifacts.
// Contributes presentational structure within a Template without producing
// instance data. Carries no value requirement, cardinality, default value, or
// property — it does not bear data.

export interface EmbeddedPresentationComponent {
  readonly kind: 'embedded_presentation_component';
  readonly key: EmbeddedArtifactKey;
  readonly reference: PresentationComponentReference;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
}

// `key` accepts a fully-built EmbeddedArtifactKey or a bare string.
export interface EmbeddedPresentationComponentInit {
  readonly key: EmbeddedArtifactKey | string;
  readonly reference: PresentationComponentReference;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
}

export function embeddedPresentationComponent(
  init: EmbeddedPresentationComponentInit,
): EmbeddedPresentationComponent {
  const out: {
    kind: 'embedded_presentation_component';
    key: EmbeddedArtifactKey;
    reference: PresentationComponentReference;
    visibility?: Visibility;
    labelOverride?: LabelOverride;
  } = {
    kind: 'embedded_presentation_component',
    key: embeddedArtifactKey(init.key),
    reference: init.reference,
  };
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  return out;
}

export const isEmbeddedPresentationComponent = (
  x: unknown,
): x is EmbeddedPresentationComponent =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'embedded_presentation_component';
