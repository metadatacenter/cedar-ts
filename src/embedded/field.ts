import type { FieldKind } from '../identity.js';
import type {
  TextFieldReference,
  NumericFieldReference,
  DateFieldReference,
  TimeFieldReference,
  DateTimeFieldReference,
  ControlledTermFieldReference,
  SingleChoiceFieldReference,
  MultipleChoiceFieldReference,
  LinkFieldReference,
  EmailFieldReference,
  PhoneNumberFieldReference,
  OrcidFieldReference,
  RorFieldReference,
  DoiFieldReference,
  PubMedIdFieldReference,
  RridFieldReference,
  NihGrantIdFieldReference,
  AttributeValueFieldReference,
} from '../identity.js';
import type {
  TextField,
  NumericField,
  DateField,
  TimeField,
  DateTimeField,
  ControlledTermField,
  SingleChoiceField,
  MultipleChoiceField,
  LinkField,
  EmailField,
  PhoneNumberField,
  OrcidField,
  RorField,
  DoiField,
  PubMedIdField,
  RridField,
  NihGrantIdField,
  AttributeValueField,
} from '../fields.js';
import type {
  TextLiteral,
  TimeLiteral,
  DateTimeLiteral,
  FullDateLiteral,
  StringLiteral,
} from '../literals/index.js';
import type { Iri } from '../leaves/index.js';
import type {
  TextValue,
  NumericValue,
  DateValue,
  TimeValue,
  DateTimeValue,
  ControlledTermValue,
  ChoiceValue,
  LinkValue,
  EmailValue,
  PhoneNumberValue,
  OrcidValue,
  RorValue,
  DoiValue,
  PubMedIdValue,
  RridValue,
  NihGrantIdValue,
  OrcidIri,
  RorIri,
  DoiIri,
  PubMedIri,
  RridIri,
  NihGrantIri,
} from '../values/index.js';
import {
  type TextDefaultValue,
  type NumericDefaultValue,
  type DateDefaultValue,
  type TimeDefaultValue,
  type DateTimeDefaultValue,
  type ControlledTermDefaultValue,
  type ChoiceDefaultValue,
  type LinkDefaultValue,
  type EmailDefaultValue,
  type PhoneNumberDefaultValue,
  type OrcidDefaultValue,
  type RorDefaultValue,
  type DoiDefaultValue,
  type PubMedIdDefaultValue,
  type RridDefaultValue,
  type NihGrantIdDefaultValue,
  textDefaultValue,
  timeDefaultValue,
  dateDefaultValue,
  dateTimeDefaultValue,
  emailDefaultValue,
  phoneNumberDefaultValue,
  orcidDefaultValue,
  rorDefaultValue,
  doiDefaultValue,
  pubMedIdDefaultValue,
  rridDefaultValue,
  nihGrantIdDefaultValue,
} from '../defaults.js';
import { type EmbeddedArtifactKey, embeddedArtifactKey } from './key.js';
import type { ValueRequirement } from './requirement.js';
import type { Cardinality } from './cardinality.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';
import { type Property, type PropertyInput, property } from './property.js';

// EmbeddedField — see grammar.md §Embedded Artifacts.
// Contextualises a reusable Field within a specific Template. Each concrete
// EmbeddedXxxField interface shares the same outer `kind: 'embedded_field'`
// discriminant; the inner `fieldKind` discriminant keeps the eighteen
// families distinct, and the `reference` and (where permitted) `defaultValue`
// types are pinned per family for compile-time alignment. Writing the
// families out as concrete interfaces keeps IDE hovers fully resolved and
// autocomplete hints concrete at the call site.
//
// AttributeValueField has no default value (grammar §Embedded Artifacts),
// so EmbeddedAttributeValueField simply omits the field from the structure.

// ---- Properties shared by every EmbeddedField interface ---------------

interface EmbeddedFieldCommon {
  readonly kind: 'embedded_field';
  readonly key: EmbeddedArtifactKey;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
}

// ---- Concrete EmbeddedField interfaces --------------------------------

export interface EmbeddedTextField extends EmbeddedFieldCommon {
  readonly fieldKind: 'text';
  readonly reference: TextFieldReference;
  readonly defaultValue?: TextDefaultValue;
}

export interface EmbeddedNumericField extends EmbeddedFieldCommon {
  readonly fieldKind: 'numeric';
  readonly reference: NumericFieldReference;
  readonly defaultValue?: NumericDefaultValue;
}

export interface EmbeddedDateField extends EmbeddedFieldCommon {
  readonly fieldKind: 'date';
  readonly reference: DateFieldReference;
  readonly defaultValue?: DateDefaultValue;
}

export interface EmbeddedTimeField extends EmbeddedFieldCommon {
  readonly fieldKind: 'time';
  readonly reference: TimeFieldReference;
  readonly defaultValue?: TimeDefaultValue;
}

export interface EmbeddedDateTimeField extends EmbeddedFieldCommon {
  readonly fieldKind: 'date_time';
  readonly reference: DateTimeFieldReference;
  readonly defaultValue?: DateTimeDefaultValue;
}

export interface EmbeddedControlledTermField extends EmbeddedFieldCommon {
  readonly fieldKind: 'controlled_term';
  readonly reference: ControlledTermFieldReference;
  readonly defaultValue?: ControlledTermDefaultValue;
}

export interface EmbeddedSingleChoiceField extends EmbeddedFieldCommon {
  readonly fieldKind: 'single_choice';
  readonly reference: SingleChoiceFieldReference;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedMultipleChoiceField extends EmbeddedFieldCommon {
  readonly fieldKind: 'multiple_choice';
  readonly reference: MultipleChoiceFieldReference;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedLinkField extends EmbeddedFieldCommon {
  readonly fieldKind: 'link';
  readonly reference: LinkFieldReference;
  readonly defaultValue?: LinkDefaultValue;
}

export interface EmbeddedEmailField extends EmbeddedFieldCommon {
  readonly fieldKind: 'email';
  readonly reference: EmailFieldReference;
  readonly defaultValue?: EmailDefaultValue;
}

export interface EmbeddedPhoneNumberField extends EmbeddedFieldCommon {
  readonly fieldKind: 'phone_number';
  readonly reference: PhoneNumberFieldReference;
  readonly defaultValue?: PhoneNumberDefaultValue;
}

export interface EmbeddedOrcidField extends EmbeddedFieldCommon {
  readonly fieldKind: 'orcid';
  readonly reference: OrcidFieldReference;
  readonly defaultValue?: OrcidDefaultValue;
}

export interface EmbeddedRorField extends EmbeddedFieldCommon {
  readonly fieldKind: 'ror';
  readonly reference: RorFieldReference;
  readonly defaultValue?: RorDefaultValue;
}

export interface EmbeddedDoiField extends EmbeddedFieldCommon {
  readonly fieldKind: 'doi';
  readonly reference: DoiFieldReference;
  readonly defaultValue?: DoiDefaultValue;
}

export interface EmbeddedPubMedIdField extends EmbeddedFieldCommon {
  readonly fieldKind: 'pub_med_id';
  readonly reference: PubMedIdFieldReference;
  readonly defaultValue?: PubMedIdDefaultValue;
}

export interface EmbeddedRridField extends EmbeddedFieldCommon {
  readonly fieldKind: 'rrid';
  readonly reference: RridFieldReference;
  readonly defaultValue?: RridDefaultValue;
}

export interface EmbeddedNihGrantIdField extends EmbeddedFieldCommon {
  readonly fieldKind: 'nih_grant_id';
  readonly reference: NihGrantIdFieldReference;
  readonly defaultValue?: NihGrantIdDefaultValue;
}

export interface EmbeddedAttributeValueField extends EmbeddedFieldCommon {
  readonly fieldKind: 'attribute_value';
  readonly reference: AttributeValueFieldReference;
  // Grammar prohibits a default value here.
}

// ---- Discriminated union ----------------------------------------------

export type EmbeddedField =
  | EmbeddedTextField
  | EmbeddedNumericField
  | EmbeddedDateField
  | EmbeddedTimeField
  | EmbeddedDateTimeField
  | EmbeddedControlledTermField
  | EmbeddedSingleChoiceField
  | EmbeddedMultipleChoiceField
  | EmbeddedLinkField
  | EmbeddedEmailField
  | EmbeddedPhoneNumberField
  | EmbeddedOrcidField
  | EmbeddedRorField
  | EmbeddedDoiField
  | EmbeddedPubMedIdField
  | EmbeddedRridField
  | EmbeddedNihGrantIdField
  | EmbeddedAttributeValueField;

// ---- Init types -------------------------------------------------------
//
// Each Init carries the same common embedding properties plus a per-family
// `reference` and a `defaultValue?` whose type widens to a permissive
// per-family input. The constructor coerces strings / Iris / partial init
// objects into a fully-built DefaultValue.

interface EmbeddedFieldInitCommon {
  readonly key: EmbeddedArtifactKey | string;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: PropertyInput;
}

// Permissive input shapes for the families with default-value widening.

type AuthorityDefaultInput<I extends object, V> =
  | V
  | I
  | Iri
  | string
  | { readonly iri: I | Iri | string; readonly label?: string };

// `reference` accepts either the typed FieldReference or the reusable Field
// artifact itself; the constructor extracts `.id` from the latter. This lets
// callers write `reference: fullName` instead of `reference: fullName.id`
// once they have a Field artifact in scope.

export interface EmbeddedTextFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: TextFieldReference | TextField;
  readonly defaultValue?: TextDefaultValue | TextValue | TextLiteral | string;
}

export interface EmbeddedNumericFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: NumericFieldReference | NumericField;
  // Numeric defaults require explicit construction (datatype ambiguity).
  readonly defaultValue?: NumericDefaultValue;
}

export interface EmbeddedDateFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DateFieldReference | DateField;
  readonly defaultValue?: DateDefaultValue | DateValue | FullDateLiteral | string;
}

export interface EmbeddedTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: TimeFieldReference | TimeField;
  readonly defaultValue?: TimeDefaultValue | TimeValue | TimeLiteral | string;
}

export interface EmbeddedDateTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DateTimeFieldReference | DateTimeField;
  readonly defaultValue?:
    | DateTimeDefaultValue
    | DateTimeValue
    | DateTimeLiteral
    | string;
}

export interface EmbeddedControlledTermFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: ControlledTermFieldReference | ControlledTermField;
  readonly defaultValue?: ControlledTermDefaultValue;
}

export interface EmbeddedSingleChoiceFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: SingleChoiceFieldReference | SingleChoiceField;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedMultipleChoiceFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: MultipleChoiceFieldReference | MultipleChoiceField;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedLinkFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: LinkFieldReference | LinkField;
  readonly defaultValue?: LinkDefaultValue;
}

export interface EmbeddedEmailFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: EmailFieldReference | EmailField;
  readonly defaultValue?: EmailDefaultValue | EmailValue | StringLiteral | string;
}

export interface EmbeddedPhoneNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: PhoneNumberFieldReference | PhoneNumberField;
  readonly defaultValue?:
    | PhoneNumberDefaultValue
    | PhoneNumberValue
    | StringLiteral
    | string;
}

export interface EmbeddedOrcidFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: OrcidFieldReference | OrcidField;
  readonly defaultValue?:
    | OrcidDefaultValue
    | AuthorityDefaultInput<OrcidIri, OrcidValue>;
}

export interface EmbeddedRorFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: RorFieldReference | RorField;
  readonly defaultValue?:
    | RorDefaultValue
    | AuthorityDefaultInput<RorIri, RorValue>;
}

export interface EmbeddedDoiFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DoiFieldReference | DoiField;
  readonly defaultValue?:
    | DoiDefaultValue
    | AuthorityDefaultInput<DoiIri, DoiValue>;
}

export interface EmbeddedPubMedIdFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: PubMedIdFieldReference | PubMedIdField;
  readonly defaultValue?:
    | PubMedIdDefaultValue
    | AuthorityDefaultInput<PubMedIri, PubMedIdValue>;
}

export interface EmbeddedRridFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: RridFieldReference | RridField;
  readonly defaultValue?:
    | RridDefaultValue
    | AuthorityDefaultInput<RridIri, RridValue>;
}

export interface EmbeddedNihGrantIdFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: NihGrantIdFieldReference | NihGrantIdField;
  readonly defaultValue?:
    | NihGrantIdDefaultValue
    | AuthorityDefaultInput<NihGrantIri, NihGrantIdValue>;
}

export interface EmbeddedAttributeValueFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: AttributeValueFieldReference | AttributeValueField;
  // Grammar prohibits a default value for attribute-value fields.
}

// ---- Constructor common-property assembly ------------------------------

type AssembledCommon = {
  kind: 'embedded_field';
  key: EmbeddedArtifactKey;
  valueRequirement?: ValueRequirement;
  cardinality?: Cardinality;
  visibility?: Visibility;
  labelOverride?: LabelOverride;
  property?: Property;
};

function assembleCommon(init: EmbeddedFieldInitCommon): AssembledCommon {
  const out: AssembledCommon = {
    kind: 'embedded_field',
    key: embeddedArtifactKey(init.key),
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.cardinality !== undefined) out.cardinality = init.cardinality;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  if (init.property !== undefined) out.property = property(init.property);
  return out;
}

// Extracts the .id from a Field artifact, or passes through if input is
// already a FieldReference. Used by the per-family constructors so callers
// can write `reference: fullName` instead of `reference: fullName.id`. The
// conditional return type carries the per-family precision through to the
// caller (e.g. fieldRef(TextField | TextFieldReference) → TextFieldReference).
type FieldRefOf<T> = T extends { kind: 'field'; id: infer R } ? R : T;

function fieldRef<T extends { kind: 'field' | 'field_id' }>(input: T): FieldRefOf<T> {
  return (input.kind === 'field'
    ? (input as unknown as { id: unknown }).id
    : input) as FieldRefOf<T>;
}

// ---- Per-family constructors -------------------------------------------

export function embeddedTextField(init: EmbeddedTextFieldInit): EmbeddedTextField {
  const out: EmbeddedTextField = {
    ...assembleCommon(init),
    fieldKind: 'text',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: textDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedNumericField(
  init: EmbeddedNumericFieldInit,
): EmbeddedNumericField {
  const out: EmbeddedNumericField = {
    ...assembleCommon(init),
    fieldKind: 'numeric',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedDateField(init: EmbeddedDateFieldInit): EmbeddedDateField {
  const out: EmbeddedDateField = {
    ...assembleCommon(init),
    fieldKind: 'date',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: dateDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedTimeField(init: EmbeddedTimeFieldInit): EmbeddedTimeField {
  const out: EmbeddedTimeField = {
    ...assembleCommon(init),
    fieldKind: 'time',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: timeDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedDateTimeField(
  init: EmbeddedDateTimeFieldInit,
): EmbeddedDateTimeField {
  const out: EmbeddedDateTimeField = {
    ...assembleCommon(init),
    fieldKind: 'date_time',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: dateTimeDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedControlledTermField(
  init: EmbeddedControlledTermFieldInit,
): EmbeddedControlledTermField {
  const out: EmbeddedControlledTermField = {
    ...assembleCommon(init),
    fieldKind: 'controlled_term',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedSingleChoiceField(
  init: EmbeddedSingleChoiceFieldInit,
): EmbeddedSingleChoiceField {
  const out: EmbeddedSingleChoiceField = {
    ...assembleCommon(init),
    fieldKind: 'single_choice',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedMultipleChoiceField(
  init: EmbeddedMultipleChoiceFieldInit,
): EmbeddedMultipleChoiceField {
  const out: EmbeddedMultipleChoiceField = {
    ...assembleCommon(init),
    fieldKind: 'multiple_choice',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedLinkField(init: EmbeddedLinkFieldInit): EmbeddedLinkField {
  const out: EmbeddedLinkField = {
    ...assembleCommon(init),
    fieldKind: 'link',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedEmailField(init: EmbeddedEmailFieldInit): EmbeddedEmailField {
  const out: EmbeddedEmailField = {
    ...assembleCommon(init),
    fieldKind: 'email',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: emailDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedPhoneNumberField(
  init: EmbeddedPhoneNumberFieldInit,
): EmbeddedPhoneNumberField {
  const out: EmbeddedPhoneNumberField = {
    ...assembleCommon(init),
    fieldKind: 'phone_number',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: phoneNumberDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedOrcidField(init: EmbeddedOrcidFieldInit): EmbeddedOrcidField {
  const out: EmbeddedOrcidField = {
    ...assembleCommon(init),
    fieldKind: 'orcid',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: orcidDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedRorField(init: EmbeddedRorFieldInit): EmbeddedRorField {
  const out: EmbeddedRorField = {
    ...assembleCommon(init),
    fieldKind: 'ror',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: rorDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedDoiField(init: EmbeddedDoiFieldInit): EmbeddedDoiField {
  const out: EmbeddedDoiField = {
    ...assembleCommon(init),
    fieldKind: 'doi',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: doiDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedPubMedIdField(
  init: EmbeddedPubMedIdFieldInit,
): EmbeddedPubMedIdField {
  const out: EmbeddedPubMedIdField = {
    ...assembleCommon(init),
    fieldKind: 'pub_med_id',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: pubMedIdDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedRridField(init: EmbeddedRridFieldInit): EmbeddedRridField {
  const out: EmbeddedRridField = {
    ...assembleCommon(init),
    fieldKind: 'rrid',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: rridDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedNihGrantIdField(
  init: EmbeddedNihGrantIdFieldInit,
): EmbeddedNihGrantIdField {
  const out: EmbeddedNihGrantIdField = {
    ...assembleCommon(init),
    fieldKind: 'nih_grant_id',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: nihGrantIdDefaultValue(init.defaultValue),
    }),
  };
  return out;
}

export function embeddedAttributeValueField(
  init: EmbeddedAttributeValueFieldInit,
): EmbeddedAttributeValueField {
  return {
    ...assembleCommon(init),
    fieldKind: 'attribute_value',
    reference: fieldRef(init.reference),
  };
}

// ---- Type guards -------------------------------------------------------

export function isEmbeddedField(x: unknown): x is EmbeddedField {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'embedded_field'
  );
}

// Narrows an EmbeddedField to the concrete family identified by `fieldKind`.
export function isEmbeddedFieldOfKind<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is Extract<EmbeddedField, { fieldKind: K }> {
  return isEmbeddedField(x) && x.fieldKind === fieldKind;
}
