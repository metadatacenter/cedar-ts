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
  type LabelOverride,
  type LabelOverrideInit,
  labelOverride,
} from './label-override.js';

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
