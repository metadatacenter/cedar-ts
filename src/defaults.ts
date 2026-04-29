import {
  type TextValue,
  type NumericValue,
  type DateValue,
  type TimeValue,
  type DateTimeValue,
  type ControlledTermValue,
  type ChoiceValue,
  type LinkValue,
  type EmailValue,
  type PhoneNumberValue,
  type OrcidValue,
  type RorValue,
  type DoiValue,
  type PubMedIdValue,
  type RridValue,
  type NihGrantIdValue,
  type OrcidIri,
  type RorIri,
  type DoiIri,
  type PubMedIri,
  type RridIri,
  type NihGrantIri,
  textValue,
  timeValue,
  dateTimeValue,
  dateValue,
  isDateValue,
  emailValue,
  phoneNumberValue,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  isTextValue,
  isTimeValue,
  isDateTimeValue,
  isEmailValue,
  isPhoneNumberValue,
  isOrcidValue,
  isRorValue,
  isDoiValue,
  isPubMedIdValue,
  isRridValue,
  isNihGrantIdValue,
} from './values/index.js';
import type {
  TextLiteral,
  TimeLiteral,
  DateTimeLiteral,
  StringLiteral,
  FullDateLiteral,
} from './literals/index.js';
import type { Iri } from './leaves/index.js';
import type { FieldKind } from './identity.js';

// Permissive input type for each external-authority default-value constructor:
// matches the corresponding xxxValue() input plus the value type itself, so
// callers can pass a bare string IRI, a tagged Iri / typed-iri, an init object,
// or a fully-built value.
type AuthorityDefaultValueInput<I extends object, V> =
  | V
  | I
  | Iri
  | string
  | { readonly iri: I | Iri | string; readonly label?: string };

// DefaultValue variants. Each wraps the Value form of its corresponding field
// family. TextDefaultValue is shared by TextFieldSpec (field-level default)
// and EmbeddedTextField (embedding-specific override) — see grammar §Defaults.
// AttributeValueField has no default.

export interface TextDefaultValue {
  readonly kind: 'text_default_value';
  readonly value: TextValue;
}

// Accepts any of:
//   - a fully-built TextValue (passes through)
//   - a TextLiteral (wrapped via textValue)
//   - a plain string (wrapped via textValue → stringLiteral; xsd:string)
// The widened input avoids three-layer call sites like
//   textDefaultValue(textValue(stringLiteral('Hello')))
// for the common case where xsd:string is what's intended.
export function textDefaultValue(
  input: TextValue | TextLiteral | string,
): TextDefaultValue {
  return {
    kind: 'text_default_value',
    value: isTextValue(input) ? input : textValue(input),
  };
}

export interface NumericDefaultValue {
  readonly kind: 'numeric_default_value';
  readonly value: NumericValue;
}
export const numericDefaultValue = (value: NumericValue): NumericDefaultValue =>
  ({ kind: 'numeric_default_value', value });

export interface DateDefaultValue {
  readonly kind: 'date_default_value';
  readonly value: DateValue;
}

// Accepts a DateValue, a FullDateLiteral, or a plain string discriminated by
// lexical shape ('YYYY', 'YYYY-MM', 'YYYY-MM-DD…'). See dateValue for details.
export function dateDefaultValue(
  input: DateValue | FullDateLiteral | string,
): DateDefaultValue {
  return {
    kind: 'date_default_value',
    value: isDateValue(input) ? input : dateValue(input),
  };
}

export interface TimeDefaultValue {
  readonly kind: 'time_default_value';
  readonly value: TimeValue;
}

// Accepts a TimeValue, a TimeLiteral, or a plain xsd:time lexical form. See
// textDefaultValue for the rationale.
export function timeDefaultValue(
  input: TimeValue | TimeLiteral | string,
): TimeDefaultValue {
  return {
    kind: 'time_default_value',
    value: isTimeValue(input) ? input : timeValue(input),
  };
}

export interface DateTimeDefaultValue {
  readonly kind: 'date_time_default_value';
  readonly value: DateTimeValue;
}

// Accepts a DateTimeValue, a DateTimeLiteral, or a plain xsd:dateTime lexical
// form. See textDefaultValue for the rationale.
export function dateTimeDefaultValue(
  input: DateTimeValue | DateTimeLiteral | string,
): DateTimeDefaultValue {
  return {
    kind: 'date_time_default_value',
    value: isDateTimeValue(input) ? input : dateTimeValue(input),
  };
}

export interface ControlledTermDefaultValue {
  readonly kind: 'controlled_term_default_value';
  readonly value: ControlledTermValue;
}
export const controlledTermDefaultValue = (
  value: ControlledTermValue,
): ControlledTermDefaultValue =>
  ({ kind: 'controlled_term_default_value', value });

// ChoiceDefaultValue is shared by single- and multiple-choice embeddings.
// Grammar uses `ChoiceValue+`; we model with a NonEmptyArray invariant
// enforced at construction.
export interface ChoiceDefaultValue {
  readonly kind: 'choice_default_value';
  readonly values: readonly [ChoiceValue, ...ChoiceValue[]];
}
export function choiceDefaultValue(
  ...values: [ChoiceValue, ...ChoiceValue[]]
): ChoiceDefaultValue {
  return { kind: 'choice_default_value', values };
}

export interface LinkDefaultValue {
  readonly kind: 'link_default_value';
  readonly value: LinkValue;
}
export const linkDefaultValue = (value: LinkValue): LinkDefaultValue =>
  ({ kind: 'link_default_value', value });

export interface EmailDefaultValue {
  readonly kind: 'email_default_value';
  readonly value: EmailValue;
}
// Accepts an EmailValue, a StringLiteral, or a plain string (the email lexical form).
export function emailDefaultValue(
  input: EmailValue | StringLiteral | string,
): EmailDefaultValue {
  return {
    kind: 'email_default_value',
    value: isEmailValue(input) ? input : emailValue(input),
  };
}

export interface PhoneNumberDefaultValue {
  readonly kind: 'phone_number_default_value';
  readonly value: PhoneNumberValue;
}
export function phoneNumberDefaultValue(
  input: PhoneNumberValue | StringLiteral | string,
): PhoneNumberDefaultValue {
  return {
    kind: 'phone_number_default_value',
    value: isPhoneNumberValue(input) ? input : phoneNumberValue(input),
  };
}

export interface OrcidDefaultValue {
  readonly kind: 'orcid_default_value';
  readonly value: OrcidValue;
}
export function orcidDefaultValue(
  input: AuthorityDefaultValueInput<OrcidIri, OrcidValue>,
): OrcidDefaultValue {
  return {
    kind: 'orcid_default_value',
    value: isOrcidValue(input) ? input : orcidValue(input),
  };
}

export interface RorDefaultValue {
  readonly kind: 'ror_default_value';
  readonly value: RorValue;
}
export function rorDefaultValue(
  input: AuthorityDefaultValueInput<RorIri, RorValue>,
): RorDefaultValue {
  return {
    kind: 'ror_default_value',
    value: isRorValue(input) ? input : rorValue(input),
  };
}

export interface DoiDefaultValue {
  readonly kind: 'doi_default_value';
  readonly value: DoiValue;
}
export function doiDefaultValue(
  input: AuthorityDefaultValueInput<DoiIri, DoiValue>,
): DoiDefaultValue {
  return {
    kind: 'doi_default_value',
    value: isDoiValue(input) ? input : doiValue(input),
  };
}

export interface PubMedIdDefaultValue {
  readonly kind: 'pub_med_id_default_value';
  readonly value: PubMedIdValue;
}
export function pubMedIdDefaultValue(
  input: AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>,
): PubMedIdDefaultValue {
  return {
    kind: 'pub_med_id_default_value',
    value: isPubMedIdValue(input) ? input : pubMedIdValue(input),
  };
}

export interface RridDefaultValue {
  readonly kind: 'rrid_default_value';
  readonly value: RridValue;
}
export function rridDefaultValue(
  input: AuthorityDefaultValueInput<RridIri, RridValue>,
): RridDefaultValue {
  return {
    kind: 'rrid_default_value',
    value: isRridValue(input) ? input : rridValue(input),
  };
}

export interface NihGrantIdDefaultValue {
  readonly kind: 'nih_grant_id_default_value';
  readonly value: NihGrantIdValue;
}
export function nihGrantIdDefaultValue(
  input: AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>,
): NihGrantIdDefaultValue {
  return {
    kind: 'nih_grant_id_default_value',
    value: isNihGrantIdValue(input) ? input : nihGrantIdValue(input),
  };
}

export type DefaultValue =
  | TextDefaultValue
  | NumericDefaultValue
  | DateDefaultValue
  | TimeDefaultValue
  | DateTimeDefaultValue
  | ControlledTermDefaultValue
  | ChoiceDefaultValue
  | LinkDefaultValue
  | EmailDefaultValue
  | PhoneNumberDefaultValue
  | OrcidDefaultValue
  | RorDefaultValue
  | DoiDefaultValue
  | PubMedIdDefaultValue
  | RridDefaultValue
  | NihGrantIdDefaultValue;

// Mapped type: which DefaultValue family corresponds to a given FieldKind.
// 'attribute_value' has no default — modeled as `never` so an EmbeddedField
// of that kind cannot carry a default at the type level.
export type DefaultValueFor<K extends FieldKind> = {
  text: TextDefaultValue;
  numeric: NumericDefaultValue;
  date: DateDefaultValue;
  time: TimeDefaultValue;
  date_time: DateTimeDefaultValue;
  controlled_term: ControlledTermDefaultValue;
  single_choice: ChoiceDefaultValue;
  multiple_choice: ChoiceDefaultValue;
  link: LinkDefaultValue;
  email: EmailDefaultValue;
  phone_number: PhoneNumberDefaultValue;
  orcid: OrcidDefaultValue;
  ror: RorDefaultValue;
  doi: DoiDefaultValue;
  pub_med_id: PubMedIdDefaultValue;
  rrid: RridDefaultValue;
  nih_grant_id: NihGrantIdDefaultValue;
  attribute_value: never;
}[K];

export function isDefaultValue(x: unknown): x is DefaultValue {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return (
    k === 'text_default_value' ||
    k === 'numeric_default_value' ||
    k === 'date_default_value' ||
    k === 'time_default_value' ||
    k === 'date_time_default_value' ||
    k === 'controlled_term_default_value' ||
    k === 'choice_default_value' ||
    k === 'link_default_value' ||
    k === 'email_default_value' ||
    k === 'phone_number_default_value' ||
    k === 'orcid_default_value' ||
    k === 'ror_default_value' ||
    k === 'doi_default_value' ||
    k === 'pub_med_id_default_value' ||
    k === 'rrid_default_value' ||
    k === 'nih_grant_id_default_value'
  );
}

// Mapped type: the *input* shape accepted for each field family's default
// value at the embedding-init layer. This is the input of the corresponding
// xxxDefaultValue() constructor, minus the DefaultValue type itself (which is
// added back as `DefaultValueFor<K>` when constructing an EmbeddedField, so
// callers can pass either a fully-built default or a permissive primitive).
//
// Families whose input requires more than a primitive (numeric: which datatype?
// date: which DateValue variant? choice: which Literal kind? controlled_term:
// term IRI plus optional label/notation; link: structured) are `never` here —
// the caller must construct the DefaultValue explicitly.
export type DefaultValueInputFor<K extends FieldKind> = {
  text: string | TextValue | TextLiteral;
  numeric: never;
  date: string | DateValue | FullDateLiteral;
  time: string | TimeValue | TimeLiteral;
  date_time: string | DateTimeValue | DateTimeLiteral;
  controlled_term: never;
  single_choice: never;
  multiple_choice: never;
  link: never;
  email: string | StringLiteral | EmailValue;
  phone_number: string | StringLiteral | PhoneNumberValue;
  orcid: AuthorityDefaultValueInput<OrcidIri, OrcidValue>;
  ror: AuthorityDefaultValueInput<RorIri, RorValue>;
  doi: AuthorityDefaultValueInput<DoiIri, DoiValue>;
  pub_med_id: AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>;
  rrid: AuthorityDefaultValueInput<RridIri, RridValue>;
  nih_grant_id: AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>;
  attribute_value: never;
}[K];

// Coerce a (possibly raw) default-value input into a fully-built DefaultValue
// for the given field kind. Used by the EmbeddedField constructor so that
// callers can write `defaultValue: 'Stanford University'` directly instead of
// `defaultValue: textDefaultValue('Stanford University')`. If the input is
// already a DefaultValue, it passes through unchanged.
export function coerceDefaultValueFor<K extends FieldKind>(
  fieldKind: K,
  input: DefaultValueFor<K> | DefaultValueInputFor<K>,
): DefaultValueFor<K> {
  if (isDefaultValue(input)) return input as DefaultValueFor<K>;
  switch (fieldKind) {
    case 'text':
      return textDefaultValue(input as never) as DefaultValueFor<K>;
    case 'time':
      return timeDefaultValue(input as never) as DefaultValueFor<K>;
    case 'date':
      return dateDefaultValue(input as never) as DefaultValueFor<K>;
    case 'date_time':
      return dateTimeDefaultValue(input as never) as DefaultValueFor<K>;
    case 'email':
      return emailDefaultValue(input as never) as DefaultValueFor<K>;
    case 'phone_number':
      return phoneNumberDefaultValue(input as never) as DefaultValueFor<K>;
    case 'orcid':
      return orcidDefaultValue(input as never) as DefaultValueFor<K>;
    case 'ror':
      return rorDefaultValue(input as never) as DefaultValueFor<K>;
    case 'doi':
      return doiDefaultValue(input as never) as DefaultValueFor<K>;
    case 'pub_med_id':
      return pubMedIdDefaultValue(input as never) as DefaultValueFor<K>;
    case 'rrid':
      return rridDefaultValue(input as never) as DefaultValueFor<K>;
    case 'nih_grant_id':
      return nihGrantIdDefaultValue(input as never) as DefaultValueFor<K>;
    default:
      // Families with no widening: input is already DefaultValueFor<K>.
      return input as DefaultValueFor<K>;
  }
}
