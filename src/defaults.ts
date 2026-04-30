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
  readonly kind: 'TextDefaultValue';
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
  if (typeof input === 'object' && 'kind' in input && input.kind === 'TextDefaultValue') {
    return input;
  }
  return {
    kind: 'TextDefaultValue',
    value: isTextValue(input) ? input : textValue(input),
  };
}

export interface NumericDefaultValue {
  readonly kind: 'NumericDefaultValue';
  readonly value: NumericValue;
}
export const numericDefaultValue = (value: NumericValue): NumericDefaultValue =>
  ({ kind: 'NumericDefaultValue', value });

export interface DateDefaultValue {
  readonly kind: 'DateDefaultValue';
  readonly value: DateValue;
}

// Idempotent. Accepts a DateDefaultValue (pass-through), a DateValue, a
// FullDateLiteral, or a plain string discriminated by lexical shape ('YYYY',
// 'YYYY-MM', 'YYYY-MM-DD…'). See dateValue for details.
export function dateDefaultValue(
  input: DateDefaultValue | DateValue | FullDateLiteral | string,
): DateDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'DateDefaultValue') {
    return input;
  }
  return {
    kind: 'DateDefaultValue',
    value: isDateValue(input) ? input : dateValue(input),
  };
}

export interface TimeDefaultValue {
  readonly kind: 'TimeDefaultValue';
  readonly value: TimeValue;
}

// Idempotent. Accepts a TimeDefaultValue, a TimeValue, a TimeLiteral, or a
// plain xsd:time lexical form. See textDefaultValue for the rationale.
export function timeDefaultValue(
  input: TimeDefaultValue | TimeValue | TimeLiteral | string,
): TimeDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'TimeDefaultValue') {
    return input;
  }
  return {
    kind: 'TimeDefaultValue',
    value: isTimeValue(input) ? input : timeValue(input),
  };
}

export interface DateTimeDefaultValue {
  readonly kind: 'DateTimeDefaultValue';
  readonly value: DateTimeValue;
}

// Idempotent. Accepts a DateTimeDefaultValue, a DateTimeValue, a
// DateTimeLiteral, or a plain xsd:dateTime lexical form.
export function dateTimeDefaultValue(
  input: DateTimeDefaultValue | DateTimeValue | DateTimeLiteral | string,
): DateTimeDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'DateTimeDefaultValue') {
    return input;
  }
  return {
    kind: 'DateTimeDefaultValue',
    value: isDateTimeValue(input) ? input : dateTimeValue(input),
  };
}

export interface ControlledTermDefaultValue {
  readonly kind: 'ControlledTermDefaultValue';
  readonly value: ControlledTermValue;
}
export const controlledTermDefaultValue = (
  value: ControlledTermValue,
): ControlledTermDefaultValue =>
  ({ kind: 'ControlledTermDefaultValue', value });

// ChoiceDefaultValue is shared by single- and multiple-choice embeddings.
// Grammar uses `ChoiceValue+`; we model with a NonEmptyArray invariant
// enforced at construction.
export interface ChoiceDefaultValue {
  readonly kind: 'ChoiceDefaultValue';
  readonly values: readonly [ChoiceValue, ...ChoiceValue[]];
}
export function choiceDefaultValue(
  ...values: [ChoiceValue, ...ChoiceValue[]]
): ChoiceDefaultValue {
  return { kind: 'ChoiceDefaultValue', values };
}

export interface LinkDefaultValue {
  readonly kind: 'LinkDefaultValue';
  readonly value: LinkValue;
}
export const linkDefaultValue = (value: LinkValue): LinkDefaultValue =>
  ({ kind: 'LinkDefaultValue', value });

export interface EmailDefaultValue {
  readonly kind: 'EmailDefaultValue';
  readonly value: EmailValue;
}
// Idempotent. Accepts an EmailDefaultValue, an EmailValue, a StringLiteral,
// or a plain string (the email lexical form).
export function emailDefaultValue(
  input: EmailDefaultValue | EmailValue | StringLiteral | string,
): EmailDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'EmailDefaultValue') {
    return input;
  }
  return {
    kind: 'EmailDefaultValue',
    value: isEmailValue(input) ? input : emailValue(input),
  };
}

export interface PhoneNumberDefaultValue {
  readonly kind: 'PhoneNumberDefaultValue';
  readonly value: PhoneNumberValue;
}
export function phoneNumberDefaultValue(
  input: PhoneNumberDefaultValue | PhoneNumberValue | StringLiteral | string,
): PhoneNumberDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'PhoneNumberDefaultValue') {
    return input;
  }
  return {
    kind: 'PhoneNumberDefaultValue',
    value: isPhoneNumberValue(input) ? input : phoneNumberValue(input),
  };
}

export interface OrcidDefaultValue {
  readonly kind: 'OrcidDefaultValue';
  readonly value: OrcidValue;
}
export function orcidDefaultValue(
  input: OrcidDefaultValue | AuthorityDefaultValueInput<OrcidIri, OrcidValue>,
): OrcidDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'OrcidDefaultValue') {
    return input;
  }
  return {
    kind: 'OrcidDefaultValue',
    value: isOrcidValue(input) ? input : orcidValue(input),
  };
}

export interface RorDefaultValue {
  readonly kind: 'RorDefaultValue';
  readonly value: RorValue;
}
export function rorDefaultValue(
  input: RorDefaultValue | AuthorityDefaultValueInput<RorIri, RorValue>,
): RorDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'RorDefaultValue') {
    return input;
  }
  return {
    kind: 'RorDefaultValue',
    value: isRorValue(input) ? input : rorValue(input),
  };
}

export interface DoiDefaultValue {
  readonly kind: 'DoiDefaultValue';
  readonly value: DoiValue;
}
export function doiDefaultValue(
  input: DoiDefaultValue | AuthorityDefaultValueInput<DoiIri, DoiValue>,
): DoiDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'DoiDefaultValue') {
    return input;
  }
  return {
    kind: 'DoiDefaultValue',
    value: isDoiValue(input) ? input : doiValue(input),
  };
}

export interface PubMedIdDefaultValue {
  readonly kind: 'PubMedIdDefaultValue';
  readonly value: PubMedIdValue;
}
export function pubMedIdDefaultValue(
  input: PubMedIdDefaultValue | AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>,
): PubMedIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'PubMedIdDefaultValue') {
    return input;
  }
  return {
    kind: 'PubMedIdDefaultValue',
    value: isPubMedIdValue(input) ? input : pubMedIdValue(input),
  };
}

export interface RridDefaultValue {
  readonly kind: 'RridDefaultValue';
  readonly value: RridValue;
}
export function rridDefaultValue(
  input: RridDefaultValue | AuthorityDefaultValueInput<RridIri, RridValue>,
): RridDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'RridDefaultValue') {
    return input;
  }
  return {
    kind: 'RridDefaultValue',
    value: isRridValue(input) ? input : rridValue(input),
  };
}

export interface NihGrantIdDefaultValue {
  readonly kind: 'NihGrantIdDefaultValue';
  readonly value: NihGrantIdValue;
}
export function nihGrantIdDefaultValue(
  input: NihGrantIdDefaultValue | AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>,
): NihGrantIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'NihGrantIdDefaultValue') {
    return input;
  }
  return {
    kind: 'NihGrantIdDefaultValue',
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
    k === 'TextDefaultValue' ||
    k === 'NumericDefaultValue' ||
    k === 'DateDefaultValue' ||
    k === 'TimeDefaultValue' ||
    k === 'DateTimeDefaultValue' ||
    k === 'ControlledTermDefaultValue' ||
    k === 'ChoiceDefaultValue' ||
    k === 'LinkDefaultValue' ||
    k === 'EmailDefaultValue' ||
    k === 'PhoneNumberDefaultValue' ||
    k === 'OrcidDefaultValue' ||
    k === 'RorDefaultValue' ||
    k === 'DoiDefaultValue' ||
    k === 'PubMedIdDefaultValue' ||
    k === 'RridDefaultValue' ||
    k === 'NihGrantIdDefaultValue'
  );
}

