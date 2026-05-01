import { parseAsciiIdentifier } from '../leaves/index.js';
import type { TemplateReference } from '../identifiers.js';
import type { Template } from '../template.js';
import type { ValueRequirement } from './requirement.js';
import type { Cardinality } from './cardinality.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';
import { type Property, type PropertyInput, property } from './property.js';

// EmbeddedTemplate — see grammar.md §Embedded Artifacts.
// Nests a reusable Template within the containing Template. Carries no typed
// default value (templates have no DefaultValue construct in the grammar) but
// otherwise mirrors EmbeddedField's embedding properties.

export interface EmbeddedTemplate {
  readonly kind: 'EmbeddedTemplate';
  readonly key: string;
  readonly reference: TemplateReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
}

// `reference` accepts either the typed TemplateReference or the reusable
// Template artifact itself; the constructor extracts `.id` from the latter.
export interface EmbeddedTemplateInit {
  readonly key: string;
  readonly reference: TemplateReference | Template;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: PropertyInput;
}

export function embeddedTemplate(init: EmbeddedTemplateInit): EmbeddedTemplate {
  const out: {
    kind: 'EmbeddedTemplate';
    key: string;
    reference: TemplateReference;
    valueRequirement?: ValueRequirement;
    cardinality?: Cardinality;
    visibility?: Visibility;
    labelOverride?: LabelOverride;
    property?: Property;
  } = {
    kind: 'EmbeddedTemplate',
    key: parseAsciiIdentifier(init.key),
    reference: init.reference.kind === 'Template' ? init.reference.id : init.reference,
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.cardinality !== undefined) out.cardinality = init.cardinality;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  if (init.property !== undefined) out.property = property(init.property);
  return out;
}

export const isEmbeddedTemplate = (x: unknown): x is EmbeddedTemplate =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmbeddedTemplate';
