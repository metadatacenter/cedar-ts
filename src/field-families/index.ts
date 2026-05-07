// =====================================================================
// Field families — public surface for the 20 per-family vertical
// slices plus the cross-family unions and predicates
// =====================================================================
//
// Every type and constructor declared in the per-family files is
// re-exported here; downstream code (and the package barrel in
// src/index.ts) imports the public surface from this module.
//
// Re-exports:
//
//   - all 20 per-family slices (text-field.ts, integer-number-field.ts,
//     real-number-field.ts, boolean-field.ts, …,
//     attribute-value-field.ts) — each contributes a FieldId, Value,
//     FieldSpec, Field, and EmbeddedField type
//   - rendering hints                 (rendering-hints.ts)
//   - enum-shared types               (enum-shared.ts):
//       Token, PermissibleValue, Meaning, EnumValue
//
// Plus this file defines:
//
//   - the cross-family unions: Field, EmbeddedField, Value, FieldSpec,
//     FieldId
//   - the union-level predicates: isField, isEmbeddedField, isValue,
//     isFieldSpec, isFieldId
//
// Internal helpers that are NOT re-exported (private to this folder):
//
//   - ./embedded-field-common.ts (assembleCommon, fieldRef): support
//     for the 18 EmbeddedField constructors
//   - ./external-authority-shared.ts (WithLabel, authorityValueFromInput,
//     isTaggedKind): shape and helper for the 6 external-authority
//     families

export * from './rendering-hints.js';
export * from './enum-shared.js';

export * from './text-field.js';
export * from './unit.js';
export * from './integer-number-field.js';
export * from './real-number-field.js';
export * from './boolean-field.js';
export * from './date-field.js';
export * from './time-field.js';
export * from './date-time-field.js';
export * from './controlled-term-field.js';
export * from './single-valued-enum-field.js';
export * from './multi-valued-enum-field.js';
export * from './link-field.js';
export * from './email-field.js';
export * from './phone-number-field.js';
export * from './orcid-field.js';
export * from './ror-field.js';
export * from './doi-field.js';
export * from './pub-med-id-field.js';
export * from './rrid-field.js';
export * from './nih-grant-id-field.js';
export * from './attribute-value-field.js';

import type { TextField, TextFieldSpec, TextValue, EmbeddedTextField } from './text-field.js';
import type {
  IntegerNumberField,
  IntegerNumberFieldSpec,
  IntegerNumberValue,
  EmbeddedIntegerNumberField,
} from './integer-number-field.js';
import type {
  RealNumberField,
  RealNumberFieldSpec,
  RealNumberValue,
  EmbeddedRealNumberField,
} from './real-number-field.js';
import type { BooleanField, BooleanFieldSpec, BooleanValue, EmbeddedBooleanField } from './boolean-field.js';
import type { DateField, DateFieldSpec, DateValue, EmbeddedDateField } from './date-field.js';
import type { TimeField, TimeFieldSpec, TimeValue, EmbeddedTimeField } from './time-field.js';
import type { DateTimeField, DateTimeFieldSpec, DateTimeValue, EmbeddedDateTimeField } from './date-time-field.js';
import type {
  ControlledTermField,
  ControlledTermFieldSpec,
  ControlledTermValue,
  EmbeddedControlledTermField,
} from './controlled-term-field.js';
import type {
  SingleValuedEnumField,
  SingleValuedEnumFieldSpec,
  EmbeddedSingleValuedEnumField,
} from './single-valued-enum-field.js';
import type {
  MultiValuedEnumField,
  MultiValuedEnumFieldSpec,
  EmbeddedMultiValuedEnumField,
} from './multi-valued-enum-field.js';
import type { EnumValue } from './enum-shared.js';
import type { LinkField, LinkFieldSpec, LinkValue, EmbeddedLinkField } from './link-field.js';
import type { EmailField, EmailFieldSpec, EmailValue, EmbeddedEmailField } from './email-field.js';
import type { PhoneNumberField, PhoneNumberFieldSpec, PhoneNumberValue, EmbeddedPhoneNumberField } from './phone-number-field.js';
import type { OrcidField, OrcidFieldSpec, OrcidValue, EmbeddedOrcidField } from './orcid-field.js';
import type { RorField, RorFieldSpec, RorValue, EmbeddedRorField } from './ror-field.js';
import type { DoiField, DoiFieldSpec, DoiValue, EmbeddedDoiField } from './doi-field.js';
import type { PubMedIdField, PubMedIdFieldSpec, PubMedIdValue, EmbeddedPubMedIdField } from './pub-med-id-field.js';
import type { RridField, RridFieldSpec, RridValue, EmbeddedRridField } from './rrid-field.js';
import type { NihGrantIdField, NihGrantIdFieldSpec, NihGrantIdValue, EmbeddedNihGrantIdField } from './nih-grant-id-field.js';
import type {
  AttributeValueField,
  AttributeValueFieldSpec,
  AttributeValue,
  EmbeddedAttributeValueField,
} from './attribute-value-field.js';

// =====================================================================
// Field union
// =====================================================================

export type NumericField = IntegerNumberField | RealNumberField;
export type EnumField = SingleValuedEnumField | MultiValuedEnumField;

export type Field =
  | TextField
  | IntegerNumberField
  | RealNumberField
  | BooleanField
  | DateField
  | TimeField
  | DateTimeField
  | ControlledTermField
  | SingleValuedEnumField
  | MultiValuedEnumField
  | LinkField
  | EmailField
  | PhoneNumberField
  | OrcidField
  | RorField
  | DoiField
  | PubMedIdField
  | RridField
  | NihGrantIdField
  | AttributeValueField;

const FIELD_KINDS: ReadonlySet<string> = new Set([
  'TextField',
  'IntegerNumberField',
  'RealNumberField',
  'BooleanField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleValuedEnumField',
  'MultiValuedEnumField',
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

export function isField(x: unknown): x is Field {
  return (
    typeof x === 'object' && x !== null &&
    FIELD_KINDS.has((x as { kind?: unknown }).kind as string)
  );
}

// =====================================================================
// EmbeddedField union
// =====================================================================

export type EmbeddedField =
  | EmbeddedTextField
  | EmbeddedIntegerNumberField
  | EmbeddedRealNumberField
  | EmbeddedBooleanField
  | EmbeddedDateField
  | EmbeddedTimeField
  | EmbeddedDateTimeField
  | EmbeddedControlledTermField
  | EmbeddedSingleValuedEnumField
  | EmbeddedMultiValuedEnumField
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

const EMBEDDED_FIELD_KINDS: ReadonlySet<string> = new Set([
  'EmbeddedTextField',
  'EmbeddedIntegerNumberField',
  'EmbeddedRealNumberField',
  'EmbeddedBooleanField',
  'EmbeddedDateField',
  'EmbeddedTimeField',
  'EmbeddedDateTimeField',
  'EmbeddedControlledTermField',
  'EmbeddedSingleValuedEnumField',
  'EmbeddedMultiValuedEnumField',
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

// =====================================================================
// FieldSpec union
// =====================================================================

export type NumericFieldSpec = IntegerNumberFieldSpec | RealNumberFieldSpec;

export type FieldSpec =
  | TextFieldSpec
  | IntegerNumberFieldSpec
  | RealNumberFieldSpec
  | BooleanFieldSpec
  | DateFieldSpec
  | TimeFieldSpec
  | DateTimeFieldSpec
  | ControlledTermFieldSpec
  | SingleValuedEnumFieldSpec
  | MultiValuedEnumFieldSpec
  | LinkFieldSpec
  | EmailFieldSpec
  | PhoneNumberFieldSpec
  | OrcidFieldSpec
  | RorFieldSpec
  | DoiFieldSpec
  | PubMedIdFieldSpec
  | RridFieldSpec
  | NihGrantIdFieldSpec
  | AttributeValueFieldSpec;

const FIELD_SPEC_KINDS: ReadonlySet<string> = new Set([
  'TextFieldSpec',
  'IntegerNumberFieldSpec',
  'RealNumberFieldSpec',
  'BooleanFieldSpec',
  'DateFieldSpec',
  'TimeFieldSpec',
  'DateTimeFieldSpec',
  'ControlledTermFieldSpec',
  'SingleValuedEnumFieldSpec',
  'MultiValuedEnumFieldSpec',
  'LinkFieldSpec',
  'EmailFieldSpec',
  'PhoneNumberFieldSpec',
  'OrcidFieldSpec',
  'RorFieldSpec',
  'DoiFieldSpec',
  'PubMedIdFieldSpec',
  'RridFieldSpec',
  'NihGrantIdFieldSpec',
  'AttributeValueFieldSpec',
]);

export function isFieldSpec(x: unknown): x is FieldSpec {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return typeof k === 'string' && FIELD_SPEC_KINDS.has(k);
}

// =====================================================================
// Value union
// =====================================================================

// External-authority value union, retained for callers that target the
// six external-authority families collectively.
export type ExternalAuthorityValue =
  | OrcidValue
  | RorValue
  | DoiValue
  | PubMedIdValue
  | RridValue
  | NihGrantIdValue;

export function isExternalAuthorityValue(x: unknown): x is ExternalAuthorityValue {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return (
    k === 'OrcidValue' ||
    k === 'RorValue' ||
    k === 'DoiValue' ||
    k === 'PubMedIdValue' ||
    k === 'RridValue' ||
    k === 'NihGrantIdValue'
  );
}

export type ExternalAuthorityFieldSpec =
  | OrcidFieldSpec
  | RorFieldSpec
  | DoiFieldSpec
  | PubMedIdFieldSpec
  | RridFieldSpec
  | NihGrantIdFieldSpec;

export function isExternalAuthorityFieldSpec(
  x: unknown,
): x is ExternalAuthorityFieldSpec {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return (
    k === 'OrcidFieldSpec' ||
    k === 'RorFieldSpec' ||
    k === 'DoiFieldSpec' ||
    k === 'PubMedIdFieldSpec' ||
    k === 'RridFieldSpec' ||
    k === 'NihGrantIdFieldSpec'
  );
}

export type ContactFieldSpec = EmailFieldSpec | PhoneNumberFieldSpec;

export type NumericValue = IntegerNumberValue | RealNumberValue;

export type Value =
  | TextValue
  | IntegerNumberValue
  | RealNumberValue
  | BooleanValue
  | DateValue
  | TimeValue
  | DateTimeValue
  | ControlledTermValue
  | EnumValue
  | LinkValue
  | EmailValue
  | PhoneNumberValue
  | ExternalAuthorityValue
  | AttributeValue;

const VALUE_KINDS: ReadonlySet<string> = new Set([
  'TextValue',
  'IntegerNumberValue',
  'RealNumberValue',
  'BooleanValue',
  'YearValue',
  'YearMonthValue',
  'FullDateValue',
  'TimeValue',
  'DateTimeValue',
  'ControlledTermValue',
  'EnumValue',
  'LinkValue',
  'EmailValue',
  'PhoneNumberValue',
  'OrcidValue',
  'RorValue',
  'DoiValue',
  'PubMedIdValue',
  'RridValue',
  'NihGrantIdValue',
  'AttributeValue',
]);

export function isValue(x: unknown): x is Value {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return typeof k === 'string' && VALUE_KINDS.has(k);
}

// =====================================================================
// FieldId union (cross-family)
// =====================================================================

import type { TextFieldId } from './text-field.js';
import type { IntegerNumberFieldId } from './integer-number-field.js';
import type { RealNumberFieldId } from './real-number-field.js';
import type { BooleanFieldId } from './boolean-field.js';
import type { DateFieldId } from './date-field.js';
import type { TimeFieldId } from './time-field.js';
import type { DateTimeFieldId } from './date-time-field.js';
import type { ControlledTermFieldId } from './controlled-term-field.js';
import type { SingleValuedEnumFieldId } from './single-valued-enum-field.js';
import type { MultiValuedEnumFieldId } from './multi-valued-enum-field.js';
import type { LinkFieldId } from './link-field.js';
import type { EmailFieldId } from './email-field.js';
import type { PhoneNumberFieldId } from './phone-number-field.js';
import type { OrcidFieldId } from './orcid-field.js';
import type { RorFieldId } from './ror-field.js';
import type { DoiFieldId } from './doi-field.js';
import type { PubMedIdFieldId } from './pub-med-id-field.js';
import type { RridFieldId } from './rrid-field.js';
import type { NihGrantIdFieldId } from './nih-grant-id-field.js';
import type { AttributeValueFieldId } from './attribute-value-field.js';

export type FieldId =
  | TextFieldId
  | IntegerNumberFieldId
  | RealNumberFieldId
  | BooleanFieldId
  | DateFieldId
  | TimeFieldId
  | DateTimeFieldId
  | ControlledTermFieldId
  | SingleValuedEnumFieldId
  | MultiValuedEnumFieldId
  | LinkFieldId
  | EmailFieldId
  | PhoneNumberFieldId
  | OrcidFieldId
  | RorFieldId
  | DoiFieldId
  | PubMedIdFieldId
  | RridFieldId
  | NihGrantIdFieldId
  | AttributeValueFieldId;

const FIELD_ID_KINDS: ReadonlySet<string> = new Set([
  'TextFieldId',
  'IntegerNumberFieldId',
  'RealNumberFieldId',
  'BooleanFieldId',
  'DateFieldId',
  'TimeFieldId',
  'DateTimeFieldId',
  'ControlledTermFieldId',
  'SingleValuedEnumFieldId',
  'MultiValuedEnumFieldId',
  'LinkFieldId',
  'EmailFieldId',
  'PhoneNumberFieldId',
  'OrcidFieldId',
  'RorFieldId',
  'DoiFieldId',
  'PubMedIdFieldId',
  'RridFieldId',
  'NihGrantIdFieldId',
  'AttributeValueFieldId',
]);

export function isFieldId(x: unknown): x is FieldId {
  return (
    typeof x === 'object' && x !== null &&
    FIELD_ID_KINDS.has((x as { kind?: unknown }).kind as string)
  );
}
