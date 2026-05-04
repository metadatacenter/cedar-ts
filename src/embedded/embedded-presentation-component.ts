import { parseAsciiIdentifier } from '../leaves/index.js';
import type { PresentationComponentReference } from '../identifiers.js';
import type { PresentationComponent } from '../presentation/index.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';

// EmbeddedPresentationComponent — see grammar.md §Embedded Artifacts.
// Contributes presentational structure within a Template without producing
// instance data. Carries no value requirement, cardinality, default value, or
// property — it does not bear data.

export interface EmbeddedPresentationComponent {
  readonly kind: 'EmbeddedPresentationComponent';
  readonly key: string;
  readonly artifactRef: PresentationComponentReference;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
}

// `artifactRef` accepts either the typed PresentationComponentReference or the
// reusable PresentationComponent artifact itself; the constructor extracts
// `.id` from the latter.
export interface EmbeddedPresentationComponentInit {
  readonly key: string;
  readonly artifactRef: PresentationComponentReference | PresentationComponent;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
}

export function embeddedPresentationComponent(
  init: EmbeddedPresentationComponentInit,
): EmbeddedPresentationComponent {
  const out: {
    kind: 'EmbeddedPresentationComponent';
    key: string;
    artifactRef: PresentationComponentReference;
    visibility?: Visibility;
    labelOverride?: LabelOverride;
  } = {
    kind: 'EmbeddedPresentationComponent',
    key: parseAsciiIdentifier(init.key),
    artifactRef:
      init.artifactRef.kind === 'PresentationComponentId'
        ? init.artifactRef
        : init.artifactRef.id,
  };
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  return out;
}

export const isEmbeddedPresentationComponent = (
  x: unknown,
): x is EmbeddedPresentationComponent =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmbeddedPresentationComponent';
