import { parseAsciiIdentifier } from '../leaves/index.js';
import type { PresentationComponentId } from '../identifiers.js';
import type { PresentationComponent } from '../presentation/index.js';
import type { Visibility } from './visibility.js';

// EmbeddedPresentationComponent — see grammar.md §Embedded Artifacts.
// Contributes presentational structure within a Template without producing
// instance data. Carries no value requirement, cardinality, default value,
// label override, or property — it bears no data and exists purely to
// contribute presentational structure. The only embedding-level property
// it carries is Visibility.

export interface EmbeddedPresentationComponent {
  readonly kind: 'EmbeddedPresentationComponent';
  readonly key: string;
  readonly artifactRef: PresentationComponentId;
  readonly visibility?: Visibility;
}

// `artifactRef` accepts either the typed PresentationComponentId or the
// reusable PresentationComponent artifact itself; the constructor extracts
// `.id` from the latter.
export interface EmbeddedPresentationComponentInit {
  readonly key: string;
  readonly artifactRef: PresentationComponentId | PresentationComponent;
  readonly visibility?: Visibility;
}

export function embeddedPresentationComponent(
  init: EmbeddedPresentationComponentInit,
): EmbeddedPresentationComponent {
  const out: {
    kind: 'EmbeddedPresentationComponent';
    key: string;
    artifactRef: PresentationComponentId;
    visibility?: Visibility;
  } = {
    kind: 'EmbeddedPresentationComponent',
    key: parseAsciiIdentifier(init.key),
    artifactRef:
      init.artifactRef.kind === 'PresentationComponentId'
        ? init.artifactRef
        : init.artifactRef.id,
  };
  if (init.visibility !== undefined) out.visibility = init.visibility;
  return out;
}

export const isEmbeddedPresentationComponent = (
  x: unknown,
): x is EmbeddedPresentationComponent =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmbeddedPresentationComponent';
