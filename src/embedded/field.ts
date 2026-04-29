import type { FieldKind, FieldReference } from '../identity.js';
import {
  type DefaultValueFor,
  type DefaultValueInputFor,
  coerceDefaultValueFor,
} from '../defaults.js';
import { type EmbeddedArtifactKey, embeddedArtifactKey } from './key.js';
import type { ValueRequirement } from './requirement.js';
import type { Cardinality } from './cardinality.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';
import { type Property, type PropertyInput, property } from './property.js';

// EmbeddedField<K> — see grammar.md §Embedded Artifacts.
// Contextualises a reusable Field<K> within a specific Template.
//
// Parameterized by FieldKind so the typed reference and (where applicable)
// typed default align with the family of the referenced field. For
// 'attribute_value', DefaultValueFor<K> resolves to never (the grammar
// permits no default for attribute-value fields) — combined with
// exactOptionalPropertyTypes, this prevents a default from being supplied at
// the type level for that family.
//
// `kind: 'embedded_field'` is the discriminant against the EmbeddedArtifact
// union; `fieldKind` is the inner family discriminant for narrowing across
// the 18 variants (mirrors Field<K>).

export interface EmbeddedField<K extends FieldKind = FieldKind> {
  readonly kind: 'embedded_field';
  readonly fieldKind: K;
  readonly key: EmbeddedArtifactKey;
  readonly reference: FieldReference<K>;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly defaultValue?: DefaultValueFor<K>;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
}

// `key` accepts a fully-built EmbeddedArtifactKey or a bare string (validated
// against the ASCII-identifier pattern via embeddedArtifactKey).
//
// `defaultValue` accepts either a fully-built DefaultValue or a permissive
// per-family input (string for text/temporal/contact/external-authority; richer
// shapes for authorities). The constructor coerces by fieldKind. See
// DefaultValueInputFor in src/defaults.ts.
export interface EmbeddedFieldInit<K extends FieldKind> {
  readonly fieldKind: K;
  readonly key: EmbeddedArtifactKey | string;
  readonly reference: FieldReference<K>;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly defaultValue?: DefaultValueFor<K> | DefaultValueInputFor<K>;
  readonly labelOverride?: LabelOverride;
  readonly property?: PropertyInput;
}

export function embeddedField<K extends FieldKind>(
  init: EmbeddedFieldInit<K>,
): EmbeddedField<K> {
  const out: {
    kind: 'embedded_field';
    fieldKind: K;
    key: EmbeddedArtifactKey;
    reference: FieldReference<K>;
    valueRequirement?: ValueRequirement;
    cardinality?: Cardinality;
    visibility?: Visibility;
    defaultValue?: DefaultValueFor<K>;
    labelOverride?: LabelOverride;
    property?: Property;
  } = {
    kind: 'embedded_field',
    fieldKind: init.fieldKind,
    key: embeddedArtifactKey(init.key),
    reference: init.reference,
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.cardinality !== undefined) out.cardinality = init.cardinality;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.defaultValue !== undefined) {
    out.defaultValue = coerceDefaultValueFor(init.fieldKind, init.defaultValue);
  }
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  if (init.property !== undefined) out.property = property(init.property);
  return out;
}

// ----- Per-family aliases and helpers -----
//
// Each helper takes the init shape sans the redundant `fieldKind` and pins it
// to the corresponding family at the type level. Ergonomic wrappers; calling
// embeddedField({...}) directly works identically.

export type EmbeddedTextField            = EmbeddedField<'text'>;
export type EmbeddedNumericField         = EmbeddedField<'numeric'>;
export type EmbeddedDateField            = EmbeddedField<'date'>;
export type EmbeddedTimeField            = EmbeddedField<'time'>;
export type EmbeddedDateTimeField        = EmbeddedField<'date_time'>;
export type EmbeddedControlledTermField  = EmbeddedField<'controlled_term'>;
export type EmbeddedSingleChoiceField    = EmbeddedField<'single_choice'>;
export type EmbeddedMultipleChoiceField  = EmbeddedField<'multiple_choice'>;
export type EmbeddedLinkField            = EmbeddedField<'link'>;
export type EmbeddedEmailField           = EmbeddedField<'email'>;
export type EmbeddedPhoneNumberField     = EmbeddedField<'phone_number'>;
export type EmbeddedOrcidField           = EmbeddedField<'orcid'>;
export type EmbeddedRorField             = EmbeddedField<'ror'>;
export type EmbeddedDoiField             = EmbeddedField<'doi'>;
export type EmbeddedPubMedIdField        = EmbeddedField<'pub_med_id'>;
export type EmbeddedRridField            = EmbeddedField<'rrid'>;
export type EmbeddedNihGrantIdField      = EmbeddedField<'nih_grant_id'>;
export type EmbeddedAttributeValueField  = EmbeddedField<'attribute_value'>;

type FamilyInit<K extends FieldKind> = Omit<EmbeddedFieldInit<K>, 'fieldKind'>;

const embeddedFieldOf =
  <K extends FieldKind>(fieldKind: K) =>
  (init: FamilyInit<K>): EmbeddedField<K> =>
    embeddedField({ fieldKind, ...init });

export const embeddedTextField            = embeddedFieldOf('text');
export const embeddedNumericField         = embeddedFieldOf('numeric');
export const embeddedDateField            = embeddedFieldOf('date');
export const embeddedTimeField            = embeddedFieldOf('time');
export const embeddedDateTimeField        = embeddedFieldOf('date_time');
export const embeddedControlledTermField  = embeddedFieldOf('controlled_term');
export const embeddedSingleChoiceField    = embeddedFieldOf('single_choice');
export const embeddedMultipleChoiceField  = embeddedFieldOf('multiple_choice');
export const embeddedLinkField            = embeddedFieldOf('link');
export const embeddedEmailField           = embeddedFieldOf('email');
export const embeddedPhoneNumberField     = embeddedFieldOf('phone_number');
export const embeddedOrcidField           = embeddedFieldOf('orcid');
export const embeddedRorField             = embeddedFieldOf('ror');
export const embeddedDoiField             = embeddedFieldOf('doi');
export const embeddedPubMedIdField        = embeddedFieldOf('pub_med_id');
export const embeddedRridField            = embeddedFieldOf('rrid');
export const embeddedNihGrantIdField      = embeddedFieldOf('nih_grant_id');
export const embeddedAttributeValueField  = embeddedFieldOf('attribute_value');

export function isEmbeddedField(x: unknown): x is EmbeddedField {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'embedded_field'
  );
}

export function isEmbeddedFieldOfKind<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is EmbeddedField<K> {
  return isEmbeddedField(x) && x.fieldKind === fieldKind;
}
