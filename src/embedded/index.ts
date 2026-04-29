export {
  type EmbeddedArtifactKey,
  embeddedArtifactKey,
  isEmbeddedArtifactKey,
} from './key.js';

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
  type CardinalityUpperBound,
  type UnboundedCardinality,
  cardinality,
  unboundedCardinality,
  isCardinality,
  isUnboundedCardinality,
} from './cardinality.js';

export {
  type LabelOverride,
  type LabelOverrideInit,
  labelOverride,
  isLabelOverride,
} from './label-override.js';

export {
  type Property,
  type PropertyInit,
  type PropertyInput,
  property,
  isProperty,
} from './property.js';

export {
  type EmbeddedField,
  type EmbeddedFieldInit,
  embeddedField,
  isEmbeddedField,
  isEmbeddedFieldOfKind,
  type EmbeddedTextField,
  type EmbeddedNumericField,
  type EmbeddedDateField,
  type EmbeddedTimeField,
  type EmbeddedDateTimeField,
  type EmbeddedControlledTermField,
  type EmbeddedSingleChoiceField,
  type EmbeddedMultipleChoiceField,
  type EmbeddedLinkField,
  type EmbeddedEmailField,
  type EmbeddedPhoneNumberField,
  type EmbeddedOrcidField,
  type EmbeddedRorField,
  type EmbeddedDoiField,
  type EmbeddedPubMedIdField,
  type EmbeddedRridField,
  type EmbeddedNihGrantIdField,
  type EmbeddedAttributeValueField,
  embeddedTextField,
  embeddedNumericField,
  embeddedDateField,
  embeddedTimeField,
  embeddedDateTimeField,
  embeddedControlledTermField,
  embeddedSingleChoiceField,
  embeddedMultipleChoiceField,
  embeddedLinkField,
  embeddedEmailField,
  embeddedPhoneNumberField,
  embeddedOrcidField,
  embeddedRorField,
  embeddedDoiField,
  embeddedPubMedIdField,
  embeddedRridField,
  embeddedNihGrantIdField,
  embeddedAttributeValueField,
} from './field.js';

export {
  type EmbeddedTemplate,
  type EmbeddedTemplateInit,
  embeddedTemplate,
  isEmbeddedTemplate,
} from './template.js';

export {
  type EmbeddedPresentationComponent,
  type EmbeddedPresentationComponentInit,
  embeddedPresentationComponent,
  isEmbeddedPresentationComponent,
} from './presentation.js';

import type { EmbeddedField } from './field.js';
import type { EmbeddedTemplate } from './template.js';
import type { EmbeddedPresentationComponent } from './presentation.js';
import { isEmbeddedField } from './field.js';
import { isEmbeddedTemplate } from './template.js';
import { isEmbeddedPresentationComponent } from './presentation.js';

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
