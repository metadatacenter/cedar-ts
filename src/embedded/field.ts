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
  SimpleLiteral,
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
import { parseAsciiIdentifier } from '../leaves/index.js';
import type { ValueRequirement } from './requirement.js';
import type { Cardinality } from './cardinality.js';
import type { Visibility } from './visibility.js';
import type { LabelOverride } from './label-override.js';
import { type Property, type PropertyInput, property } from './property.js';

// EmbeddedField — see grammar.md §Embedded Artifacts.
// Contextualises a reusable Field within a specific Template. Each concrete
// EmbeddedXxxField interface carries a per-variant `kind` discriminant
// matching the interface name (EmbeddedTextField, EmbeddedNumericField, …);
// narrowing on `kind` is the idiomatic TypeScript pattern. The `reference`
// and (where permitted) `defaultValue` types are pinned per family for
// compile-time alignment. Writing the families out as concrete interfaces
// keeps IDE hovers fully resolved and autocomplete hints concrete at the
// call site.
//
// AttributeValueField has no default value (grammar §Embedded Artifacts),
// so EmbeddedAttributeValueField simply omits the field from the structure.

// ---- Properties shared by every EmbeddedField interface ---------------

interface EmbeddedFieldCommon {
  readonly key: string;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
}

// ---- Concrete EmbeddedField interfaces --------------------------------

export interface EmbeddedTextField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedTextField';
  readonly reference: TextFieldReference;
  readonly defaultValue?: TextDefaultValue;
}

export interface EmbeddedNumericField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedNumericField';
  readonly reference: NumericFieldReference;
  readonly defaultValue?: NumericDefaultValue;
}

export interface EmbeddedDateField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedDateField';
  readonly reference: DateFieldReference;
  readonly defaultValue?: DateDefaultValue;
}

export interface EmbeddedTimeField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedTimeField';
  readonly reference: TimeFieldReference;
  readonly defaultValue?: TimeDefaultValue;
}

export interface EmbeddedDateTimeField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedDateTimeField';
  readonly reference: DateTimeFieldReference;
  readonly defaultValue?: DateTimeDefaultValue;
}

export interface EmbeddedControlledTermField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedControlledTermField';
  readonly reference: ControlledTermFieldReference;
  readonly defaultValue?: ControlledTermDefaultValue;
}

export interface EmbeddedSingleChoiceField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedSingleChoiceField';
  readonly reference: SingleChoiceFieldReference;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedMultipleChoiceField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedMultipleChoiceField';
  readonly reference: MultipleChoiceFieldReference;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedLinkField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedLinkField';
  readonly reference: LinkFieldReference;
  readonly defaultValue?: LinkDefaultValue;
}

export interface EmbeddedEmailField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedEmailField';
  readonly reference: EmailFieldReference;
  readonly defaultValue?: EmailDefaultValue;
}

export interface EmbeddedPhoneNumberField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedPhoneNumberField';
  readonly reference: PhoneNumberFieldReference;
  readonly defaultValue?: PhoneNumberDefaultValue;
}

export interface EmbeddedOrcidField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedOrcidField';
  readonly reference: OrcidFieldReference;
  readonly defaultValue?: OrcidDefaultValue;
}

export interface EmbeddedRorField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedRorField';
  readonly reference: RorFieldReference;
  readonly defaultValue?: RorDefaultValue;
}

export interface EmbeddedDoiField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedDoiField';
  readonly reference: DoiFieldReference;
  readonly defaultValue?: DoiDefaultValue;
}

export interface EmbeddedPubMedIdField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedPubMedIdField';
  readonly reference: PubMedIdFieldReference;
  readonly defaultValue?: PubMedIdDefaultValue;
}

export interface EmbeddedRridField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedRridField';
  readonly reference: RridFieldReference;
  readonly defaultValue?: RridDefaultValue;
}

export interface EmbeddedNihGrantIdField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedNihGrantIdField';
  readonly reference: NihGrantIdFieldReference;
  readonly defaultValue?: NihGrantIdDefaultValue;
}

export interface EmbeddedAttributeValueField extends EmbeddedFieldCommon {
  readonly kind: 'EmbeddedAttributeValueField';
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
  readonly key: string;
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
  readonly defaultValue?: EmailDefaultValue | EmailValue | SimpleLiteral | string;
}

export interface EmbeddedPhoneNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: PhoneNumberFieldReference | PhoneNumberField;
  readonly defaultValue?:
    | PhoneNumberDefaultValue
    | PhoneNumberValue
    | SimpleLiteral
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
  key: string;
  valueRequirement?: ValueRequirement;
  cardinality?: Cardinality;
  visibility?: Visibility;
  labelOverride?: LabelOverride;
  property?: Property;
};

function assembleCommon(init: EmbeddedFieldInitCommon): AssembledCommon {
  const out: AssembledCommon = {
    key: parseAsciiIdentifier(init.key),
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.cardinality !== undefined) out.cardinality = init.cardinality;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  if (init.property !== undefined) out.property = property(init.property);
  return out;
}

// Set of every Field-family `kind` discriminant. Used by `fieldRef` to
// decide whether `input` is a reusable Field artifact (in which case its
// `.id` is extracted) or already a FieldReference (in which case it is
// returned as-is).
const FIELD_VARIANT_KINDS: ReadonlySet<string> = new Set([
  'TextField',
  'NumericField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleChoiceField',
  'MultipleChoiceField',
  'LinkField',
  'EmailField',
  'PhoneNumberField',
  'OrcidField',
  'RorField',
  'DoiField',
  'PubMedIdField',
  'RridField',
  'NihGrantIdField',
  'AttributeValueField',
]);

// Extracts the .id from a Field artifact, or passes through if input is
// already a FieldReference. Used by the per-family constructors so callers
// can write `reference: fullName` instead of `reference: fullName.id`. The
// conditional return type carries the per-family precision through to the
// caller (e.g. fieldRef(TextField | TextFieldReference) → TextFieldReference).
//
// A reusable Field artifact is recognized by a `kind` matching the
// `${Name}Field` pattern excluding the `Embedded${Name}Field` family — but
// EmbeddedField shapes never reach this helper (input is always a Field
// artifact or a FieldId), so the simpler `${string}Field` test is enough.
type FieldRefOf<T> = T extends { kind: infer K; id: infer R }
  ? K extends `${string}Field`
    ? R
    : T
  : T;

function fieldRef<T extends { readonly kind: string }>(input: T): FieldRefOf<T> {
  if (FIELD_VARIANT_KINDS.has(input.kind)) {
    return (input as unknown as { id: unknown }).id as FieldRefOf<T>;
  }
  return input as unknown as FieldRefOf<T>;
}

// ---- Per-family constructors -------------------------------------------

export function embeddedTextField(init: EmbeddedTextFieldInit): EmbeddedTextField {
  const out: EmbeddedTextField = {
    ...assembleCommon(init),
    kind: 'EmbeddedTextField',
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
    kind: 'EmbeddedNumericField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedDateField(init: EmbeddedDateFieldInit): EmbeddedDateField {
  const out: EmbeddedDateField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDateField',
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
    kind: 'EmbeddedTimeField',
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
    kind: 'EmbeddedDateTimeField',
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
    kind: 'EmbeddedControlledTermField',
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
    kind: 'EmbeddedSingleChoiceField',
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
    kind: 'EmbeddedMultipleChoiceField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedLinkField(init: EmbeddedLinkFieldInit): EmbeddedLinkField {
  const out: EmbeddedLinkField = {
    ...assembleCommon(init),
    kind: 'EmbeddedLinkField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}

export function embeddedEmailField(init: EmbeddedEmailFieldInit): EmbeddedEmailField {
  const out: EmbeddedEmailField = {
    ...assembleCommon(init),
    kind: 'EmbeddedEmailField',
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
    kind: 'EmbeddedPhoneNumberField',
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
    kind: 'EmbeddedOrcidField',
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
    kind: 'EmbeddedRorField',
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
    kind: 'EmbeddedDoiField',
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
    kind: 'EmbeddedPubMedIdField',
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
    kind: 'EmbeddedRridField',
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
    kind: 'EmbeddedNihGrantIdField',
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
    kind: 'EmbeddedAttributeValueField',
    reference: fieldRef(init.reference),
  };
}

// ---- Type guards -------------------------------------------------------

// Set of every EmbeddedField-family `kind` discriminant. Used by
// `isEmbeddedField` for a constant-time membership check across the 18
// variants.
const EMBEDDED_FIELD_KINDS: ReadonlySet<string> = new Set([
  'EmbeddedTextField',
  'EmbeddedNumericField',
  'EmbeddedDateField',
  'EmbeddedTimeField',
  'EmbeddedDateTimeField',
  'EmbeddedControlledTermField',
  'EmbeddedSingleChoiceField',
  'EmbeddedMultipleChoiceField',
  'EmbeddedLinkField',
  'EmbeddedEmailField',
  'EmbeddedPhoneNumberField',
  'EmbeddedOrcidField',
  'EmbeddedRorField',
  'EmbeddedDoiField',
  'EmbeddedPubMedIdField',
  'EmbeddedRridField',
  'EmbeddedNihGrantIdField',
  'EmbeddedAttributeValueField',
]);

export function isEmbeddedField(x: unknown): x is EmbeddedField {
  return (
    typeof x === 'object' && x !== null &&
    EMBEDDED_FIELD_KINDS.has((x as { kind?: unknown }).kind as string)
  );
}
