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

// Idempotent. Accepts any of:
//   - a fully-built TextDefaultValue (passes through)
//   - a TextValue (wrapped)
//   - a TextLiteral (wrapped via textValue)
//   - a plain string (wrapped via textValue → stringLiteral; xsd:string)
// The widened input avoids three-layer call sites like
//   textDefaultValue(textValue(stringLiteral('Hello')))
// for the common case where xsd:string is what's intended.
export function textDefaultValue(
  input: TextDefaultValue | TextValue | TextLiteral | string,
): TextDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'text_default_value') {
    return input;
  }
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

// Idempotent. Accepts a DateDefaultValue (pass-through), a DateValue, a
// FullDateLiteral, or a plain string discriminated by lexical shape ('YYYY',
// 'YYYY-MM', 'YYYY-MM-DD…'). See dateValue for details.
export function dateDefaultValue(
  input: DateDefaultValue | DateValue | FullDateLiteral | string,
): DateDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'date_default_value') {
    return input;
  }
  return {
    kind: 'date_default_value',
    value: isDateValue(input) ? input : dateValue(input),
  };
}

export interface TimeDefaultValue {
  readonly kind: 'time_default_value';
  readonly value: TimeValue;
}

// Idempotent. Accepts a TimeDefaultValue, a TimeValue, a TimeLiteral, or a
// plain xsd:time lexical form. See textDefaultValue for the rationale.
export function timeDefaultValue(
  input: TimeDefaultValue | TimeValue | TimeLiteral | string,
): TimeDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'time_default_value') {
    return input;
  }
  return {
    kind: 'time_default_value',
    value: isTimeValue(input) ? input : timeValue(input),
  };
}

export interface DateTimeDefaultValue {
  readonly kind: 'date_time_default_value';
  readonly value: DateTimeValue;
}

// Idempotent. Accepts a DateTimeDefaultValue, a DateTimeValue, a
// DateTimeLiteral, or a plain xsd:dateTime lexical form.
export function dateTimeDefaultValue(
  input: DateTimeDefaultValue | DateTimeValue | DateTimeLiteral | string,
): DateTimeDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'date_time_default_value') {
    return input;
  }
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
// Idempotent. Accepts an EmailDefaultValue, an EmailValue, a StringLiteral,
// or a plain string (the email lexical form).
export function emailDefaultValue(
  input: EmailDefaultValue | EmailValue | StringLiteral | string,
): EmailDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'email_default_value') {
    return input;
  }
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
  input: PhoneNumberDefaultValue | PhoneNumberValue | StringLiteral | string,
): PhoneNumberDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'phone_number_default_value') {
    return input;
  }
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
  input: OrcidDefaultValue | AuthorityDefaultValueInput<OrcidIri, OrcidValue>,
): OrcidDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'orcid_default_value') {
    return input;
  }
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
  input: RorDefaultValue | AuthorityDefaultValueInput<RorIri, RorValue>,
): RorDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'ror_default_value') {
    return input;
  }
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
  input: DoiDefaultValue | AuthorityDefaultValueInput<DoiIri, DoiValue>,
): DoiDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'doi_default_value') {
    return input;
  }
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
  input: PubMedIdDefaultValue | AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>,
): PubMedIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'pub_med_id_default_value') {
    return input;
  }
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
  input: RridDefaultValue | AuthorityDefaultValueInput<RridIri, RridValue>,
): RridDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'rrid_default_value') {
    return input;
  }
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
  input: NihGrantIdDefaultValue | AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>,
): NihGrantIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'nih_grant_id_default_value') {
    return input;
  }
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

