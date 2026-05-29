// =====================================================================
// Embedded — public surface for per-embedding configuration plus the
// non-field embedded artifact types
// =====================================================================
//
// "Embedding" = the act of placing a reusable artifact (Field, Template,
// PresentationComponent) into a specific Template's `embedded` list.
// Each embedding pins per-context properties (requirement, cardinality,
// prompt override, semantic property IRI, default value, visibility) at
// the embedding site rather than on the reusable artifact itself.
//
// Re-exports:
//
//   - ValueRequirement enum and constants     (requirement.ts):
//       'required' | 'recommended' | 'optional'
//   - Visibility enum and constants           (visibility.ts):
//       'visible' | 'hidden'
//   - Cardinality                             (cardinality.ts):
//       per-embedding count bounds
//   - PromptOverride is a MultilingualString — see grammar.md §Prompt Override.
//       Carried directly as `promptOverride?: MultilingualString` on
//       EmbeddedField / EmbeddedTemplate variants; no dedicated module.
//   - Property                                (property.ts):
//       semantic property IRI association for an embedding
//   - EmbeddedTemplate                        (embedded-template.ts):
//       wrapper that nests a reusable Template
//   - EmbeddedPresentationComponent           (embedded-presentation-component.ts):
//       wrapper that places a PresentationComponent in a Template
//   - EmbeddedArtifact union                  (this file): the union of
//       EmbeddedField | EmbeddedTemplate | EmbeddedPresentationComponent
//
// The 18 EmbeddedField family variants live in src/field-families/ and
// are union-imported here for the EmbeddedArtifact union.

export {
  type ValueRequirement,
  VALUE_REQUIREMENTS,
  DEFAULT_VALUE_REQUIREMENT,
  isValueRequirement,
} from './requirement.js';

export {
  type Visibility,
  VISIBILITIES,
  DEFAULT_VISIBILITY,
  isVisibility,
} from './visibility.js';

export {
  type Cardinality,
  type CardinalityInit,
  cardinality,
} from './cardinality.js';

export {
  type Property,
  type PropertyInit,
  type PropertyInput,
  property,
} from './property.js';

export {
  type EmbeddedTemplate,
  type EmbeddedTemplateInit,
  embeddedTemplate,
  isEmbeddedTemplate,
} from './embedded-template.js';

export {
  type EmbeddedPresentationComponent,
  type EmbeddedPresentationComponentInit,
  embeddedPresentationComponent,
  isEmbeddedPresentationComponent,
} from './embedded-presentation-component.js';

import type { EmbeddedField } from '../field-families/index.js';
import type { EmbeddedTemplate } from './embedded-template.js';
import type { EmbeddedPresentationComponent } from './embedded-presentation-component.js';
import { isEmbeddedField } from '../field-families/index.js';
import { isEmbeddedTemplate } from './embedded-template.js';
import { isEmbeddedPresentationComponent } from './embedded-presentation-component.js';

// EmbeddedArtifact — see grammar.md §Embedded Artifacts.
// Union of the three embedding forms; discriminated on the top-level `kind`.
export type EmbeddedArtifact =
  | EmbeddedField
  | EmbeddedTemplate
  | EmbeddedPresentationComponent;

export const isEmbeddedArtifact = (x: unknown): x is EmbeddedArtifact =>
  isEmbeddedField(x) ||
  isEmbeddedTemplate(x) ||
  isEmbeddedPresentationComponent(x);
