// =====================================================================
// collapsed-wrappers — serialize / parse rules for branded singleton
// wrappers that flatten on the wire (wire-grammar.md §1.6).
// =====================================================================
//
// On the wire:
//   - Iri                    → string (except at AnnotationValue, see metadata.ts)
//   - IsoDateTimeStamp       → string
//   - Every XxxFieldId       → string (a plain IRI)
//   - TemplateId             → string
//   - TemplateInstanceId     → string
//   - PresentationComponentId→ string
//
// Round-trip: each parser reconstructs the in-memory wrapper via the
// type-specific constructor.

import { type Iri, type IsoDateTimeStamp, iri, isoDateTimeStamp } from '../leaves/index.js';
import {
  type TemplateId,
  type TemplateInstanceId,
  type PresentationComponentId,
  templateId,
  templateInstanceId,
  presentationComponentId,
} from '../identifiers.js';
import {
  type TextFieldId,
  type IntegerNumberFieldId,
  type RealNumberFieldId,
  type BooleanFieldId,
  type DateFieldId,
  type TimeFieldId,
  type DateTimeFieldId,
  type ControlledTermFieldId,
  type SingleChoiceFieldId,
  type MultipleChoiceFieldId,
  type LinkFieldId,
  type EmailFieldId,
  type PhoneNumberFieldId,
  type OrcidFieldId,
  type RorFieldId,
  type DoiFieldId,
  type PubMedIdFieldId,
  type RridFieldId,
  type NihGrantIdFieldId,
  type AttributeValueFieldId,
  textFieldId,
  integerNumberFieldId,
  realNumberFieldId,
  booleanFieldId,
  dateFieldId,
  timeFieldId,
  dateTimeFieldId,
  controlledTermFieldId,
  singleChoiceFieldId,
  multipleChoiceFieldId,
  linkFieldId,
  emailFieldId,
  phoneNumberFieldId,
  orcidFieldId,
  rorFieldId,
  doiFieldId,
  pubMedIdFieldId,
  rridFieldId,
  nihGrantIdFieldId,
  attributeValueFieldId,
} from '../field-families/index.js';
import { expectString } from './parse-utils.js';

// ---- Iri -------------------------------------------------------------

// Iri at every position other than AnnotationValue serializes to its inner
// string. The AnnotationValue case is handled in metadata.ts where the
// property-set discrimination requires `{iri: string}` wrapping.
export function serializeIri(x: Iri): string {
  return x.value;
}

export function parseIri(x: unknown, where = 'Iri'): Iri {
  return iri(expectString(x, where));
}

// ---- IsoDateTimeStamp ------------------------------------------------

export function serializeIsoDateTimeStamp(x: IsoDateTimeStamp): string {
  return x.value;
}

export function parseIsoDateTimeStamp(
  x: unknown,
  where = 'IsoDateTimeStamp',
): IsoDateTimeStamp {
  return isoDateTimeStamp(expectString(x, where));
}

// ---- Per-family field identifiers ------------------------------------
//
// Twenty FieldId types + TemplateId / TemplateInstanceId /
// PresentationComponentId. All collapse to a plain string IRI on the wire.
// Round-trip uses the type-specific constructor at the appropriate
// position so the in-memory tag is correct.

export const serializeTextFieldId = (x: TextFieldId): string => x.iri.value;
export const serializeIntegerNumberFieldId = (x: IntegerNumberFieldId): string => x.iri.value;
export const serializeRealNumberFieldId = (x: RealNumberFieldId): string => x.iri.value;
export const serializeBooleanFieldId = (x: BooleanFieldId): string => x.iri.value;
export const serializeDateFieldId = (x: DateFieldId): string => x.iri.value;
export const serializeTimeFieldId = (x: TimeFieldId): string => x.iri.value;
export const serializeDateTimeFieldId = (x: DateTimeFieldId): string => x.iri.value;
export const serializeControlledTermFieldId = (x: ControlledTermFieldId): string => x.iri.value;
export const serializeSingleChoiceFieldId = (x: SingleChoiceFieldId): string => x.iri.value;
export const serializeMultipleChoiceFieldId = (x: MultipleChoiceFieldId): string => x.iri.value;
export const serializeLinkFieldId = (x: LinkFieldId): string => x.iri.value;
export const serializeEmailFieldId = (x: EmailFieldId): string => x.iri.value;
export const serializePhoneNumberFieldId = (x: PhoneNumberFieldId): string => x.iri.value;
export const serializeOrcidFieldId = (x: OrcidFieldId): string => x.iri.value;
export const serializeRorFieldId = (x: RorFieldId): string => x.iri.value;
export const serializeDoiFieldId = (x: DoiFieldId): string => x.iri.value;
export const serializePubMedIdFieldId = (x: PubMedIdFieldId): string => x.iri.value;
export const serializeRridFieldId = (x: RridFieldId): string => x.iri.value;
export const serializeNihGrantIdFieldId = (x: NihGrantIdFieldId): string => x.iri.value;
export const serializeAttributeValueFieldId = (x: AttributeValueFieldId): string => x.iri.value;

export const parseTextFieldId = (x: unknown, w = 'TextFieldId'): TextFieldId =>
  textFieldId(expectString(x, w));
export const parseIntegerNumberFieldId = (x: unknown, w = 'IntegerNumberFieldId'): IntegerNumberFieldId =>
  integerNumberFieldId(expectString(x, w));
export const parseRealNumberFieldId = (x: unknown, w = 'RealNumberFieldId'): RealNumberFieldId =>
  realNumberFieldId(expectString(x, w));
export const parseBooleanFieldId = (x: unknown, w = 'BooleanFieldId'): BooleanFieldId =>
  booleanFieldId(expectString(x, w));
export const parseDateFieldId = (x: unknown, w = 'DateFieldId'): DateFieldId =>
  dateFieldId(expectString(x, w));
export const parseTimeFieldId = (x: unknown, w = 'TimeFieldId'): TimeFieldId =>
  timeFieldId(expectString(x, w));
export const parseDateTimeFieldId = (x: unknown, w = 'DateTimeFieldId'): DateTimeFieldId =>
  dateTimeFieldId(expectString(x, w));
export const parseControlledTermFieldId = (x: unknown, w = 'ControlledTermFieldId'): ControlledTermFieldId =>
  controlledTermFieldId(expectString(x, w));
export const parseSingleChoiceFieldId = (x: unknown, w = 'SingleChoiceFieldId'): SingleChoiceFieldId =>
  singleChoiceFieldId(expectString(x, w));
export const parseMultipleChoiceFieldId = (x: unknown, w = 'MultipleChoiceFieldId'): MultipleChoiceFieldId =>
  multipleChoiceFieldId(expectString(x, w));
export const parseLinkFieldId = (x: unknown, w = 'LinkFieldId'): LinkFieldId =>
  linkFieldId(expectString(x, w));
export const parseEmailFieldId = (x: unknown, w = 'EmailFieldId'): EmailFieldId =>
  emailFieldId(expectString(x, w));
export const parsePhoneNumberFieldId = (x: unknown, w = 'PhoneNumberFieldId'): PhoneNumberFieldId =>
  phoneNumberFieldId(expectString(x, w));
export const parseOrcidFieldId = (x: unknown, w = 'OrcidFieldId'): OrcidFieldId =>
  orcidFieldId(expectString(x, w));
export const parseRorFieldId = (x: unknown, w = 'RorFieldId'): RorFieldId =>
  rorFieldId(expectString(x, w));
export const parseDoiFieldId = (x: unknown, w = 'DoiFieldId'): DoiFieldId =>
  doiFieldId(expectString(x, w));
export const parsePubMedIdFieldId = (x: unknown, w = 'PubMedIdFieldId'): PubMedIdFieldId =>
  pubMedIdFieldId(expectString(x, w));
export const parseRridFieldId = (x: unknown, w = 'RridFieldId'): RridFieldId =>
  rridFieldId(expectString(x, w));
export const parseNihGrantIdFieldId = (x: unknown, w = 'NihGrantIdFieldId'): NihGrantIdFieldId =>
  nihGrantIdFieldId(expectString(x, w));
export const parseAttributeValueFieldId = (x: unknown, w = 'AttributeValueFieldId'): AttributeValueFieldId =>
  attributeValueFieldId(expectString(x, w));

// ---- Non-field artifact identifiers ----------------------------------

export const serializeTemplateId = (x: TemplateId): string => x.iri.value;
export const serializeTemplateInstanceId = (x: TemplateInstanceId): string => x.iri.value;
export const serializePresentationComponentId = (
  x: PresentationComponentId,
): string => x.iri.value;

export const parseTemplateId = (x: unknown, w = 'TemplateId'): TemplateId =>
  templateId(expectString(x, w));
export const parseTemplateInstanceId = (x: unknown, w = 'TemplateInstanceId'): TemplateInstanceId =>
  templateInstanceId(expectString(x, w));
export const parsePresentationComponentId = (
  x: unknown,
  w = 'PresentationComponentId',
): PresentationComponentId => presentationComponentId(expectString(x, w));
