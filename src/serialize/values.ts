// =====================================================================
// values — wire-form serialize/parse for every Value variant + the Value
// union dispatcher.
// =====================================================================
//
// All Value variants are tagged on the wire (per the polymorphic-only
// kind rule); each carries a `kind` property whose value matches the
// in-memory discriminant. Internal singleton-position productions (e.g.
// ControlledTermValue inside ControlledTermChoiceValue) are encoded
// untagged.

import { CedarConstructionError, REAL_NUMBER_DATATYPE_KINDS, type RealNumberDatatypeKind } from '../leaves/index.js';
import {
  type TextValue,
  type IntegerNumberValue,
  type RealNumberValue,
  type BooleanValue,
  type DateValue,
  type YearValue,
  type YearMonthValue,
  type FullDateValue,
  type TimeValue,
  type DateTimeValue,
  type ControlledTermValue,
  type LinkValue,
  type EmailValue,
  type PhoneNumberValue,
  type OrcidValue,
  type RorValue,
  type DoiValue,
  type PubMedIdValue,
  type RridValue,
  type NihGrantIdValue,
  type AttributeValue,
  type LiteralChoiceValue,
  type ControlledTermChoiceValue,
  type ChoiceValue,
  type Value,
  textValue,
  integerNumberValue,
  realNumberValue,
  booleanValue,
  yearValue,
  yearMonthValue,
  fullDateValue,
  timeValue,
  dateTimeValue,
  controlledTermValue,
  linkValue,
  emailValue,
  phoneNumberValue,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  attributeValue,
  literalChoiceValue,
  controlledTermChoiceValue,
} from '../field-families/index.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  expectObject,
  expectString,
  expectBoolean,
  expectKnownProperties,
  expectKindOneOf,
  rejectNullProperty,
} from './parse-utils.js';

// ---- TextValue -------------------------------------------------------

export function serializeTextValue(x: TextValue): unknown {
  const out: Record<string, unknown> = { kind: 'TextValue', value: x.value };
  if (x.lang !== undefined) out['lang'] = x.lang.value;
  return out;
}

// Serializes the body of a TextValue at a singleton position (no
// `kind`). Used for `EmbeddedTextField.defaultValue` and
// `TextFieldSpec.defaultValue`.
export function serializeTextValueUntagged(x: TextValue): unknown {
  const out: Record<string, unknown> = { value: x.value };
  if (x.lang !== undefined) out['lang'] = x.lang.value;
  return out;
}

function readTextValueBody(
  o: { readonly [k: string]: unknown },
  where: string,
): TextValue {
  rejectNullProperty(o, 'lang');
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  const value = expectString(o['value'], `${where}.value`);
  if ('lang' in o) {
    return textValue(value, expectString(o['lang'], `${where}.lang`));
  }
  return textValue(value);
}

export function parseTextValue(x: unknown, where = 'TextValue'): TextValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value', 'lang']);
  if (o['kind'] !== 'TextValue') {
    throw new CedarConstructionError(`${where}: expected kind "TextValue"`);
  }
  return readTextValueBody(o, where);
}

export function parseTextValueUntagged(x: unknown, where = 'TextValue'): TextValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'lang']);
  return readTextValueBody(o, where);
}

// ---- IntegerNumberValue ----------------------------------------------

export function serializeIntegerNumberValue(x: IntegerNumberValue): unknown {
  return { kind: 'IntegerNumberValue', value: x.value };
}

export function serializeIntegerNumberValueUntagged(x: IntegerNumberValue): unknown {
  return { value: x.value };
}

export function parseIntegerNumberValue(
  x: unknown,
  where = 'IntegerNumberValue',
): IntegerNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'IntegerNumberValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "IntegerNumberValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return integerNumberValue(expectString(o['value'], `${where}.value`));
}

export function parseIntegerNumberValueUntagged(
  x: unknown,
  where = 'IntegerNumberValue',
): IntegerNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return integerNumberValue(expectString(o['value'], `${where}.value`));
}

// ---- RealNumberValue -------------------------------------------------

function parseRealNumberDatatypeAtPos(
  raw: unknown,
  where: string,
): RealNumberDatatypeKind {
  const s = expectString(raw, where);
  if (!(REAL_NUMBER_DATATYPE_KINDS as readonly string[]).includes(s)) {
    throw new CedarConstructionError(
      `${where}: unknown real-number datatype ${JSON.stringify(s)}; expected one of {${REAL_NUMBER_DATATYPE_KINDS.map((k) => JSON.stringify(k)).join(', ')}}`,
    );
  }
  return s as RealNumberDatatypeKind;
}

export function serializeRealNumberValue(x: RealNumberValue): unknown {
  return {
    kind: 'RealNumberValue',
    value: x.value,
    datatype: x.datatype,
  };
}

export function serializeRealNumberValueUntagged(x: RealNumberValue): unknown {
  return { value: x.value, datatype: x.datatype };
}

export function parseRealNumberValue(
  x: unknown,
  where = 'RealNumberValue',
): RealNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value', 'datatype']);
  if (o['kind'] !== 'RealNumberValue') {
    throw new CedarConstructionError(`${where}: expected kind "RealNumberValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  if (!('datatype' in o)) {
    throw new CedarConstructionError(`${where}: missing required "datatype"`);
  }
  return realNumberValue(
    expectString(o['value'], `${where}.value`),
    parseRealNumberDatatypeAtPos(o['datatype'], `${where}.datatype`),
  );
}

export function parseRealNumberValueUntagged(
  x: unknown,
  where = 'RealNumberValue',
): RealNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'datatype']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  if (!('datatype' in o)) {
    throw new CedarConstructionError(`${where}: missing required "datatype"`);
  }
  return realNumberValue(
    expectString(o['value'], `${where}.value`),
    parseRealNumberDatatypeAtPos(o['datatype'], `${where}.datatype`),
  );
}

// ---- BooleanValue ----------------------------------------------------

export function serializeBooleanValue(x: BooleanValue): unknown {
  return { kind: 'BooleanValue', value: x.value };
}

export function serializeBooleanValueUntagged(x: BooleanValue): unknown {
  return { value: x.value };
}

export function parseBooleanValue(x: unknown, where = 'BooleanValue'): BooleanValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'BooleanValue') {
    throw new CedarConstructionError(`${where}: expected kind "BooleanValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return booleanValue(expectBoolean(o['value'], `${where}.value`));
}

export function parseBooleanValueUntagged(
  x: unknown,
  where = 'BooleanValue',
): BooleanValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return booleanValue(expectBoolean(o['value'], `${where}.value`));
}

// ---- DateValue (Year / YearMonth / FullDate) -------------------------

export function serializeYearValue(x: YearValue): unknown {
  return { kind: 'YearValue', value: x.value };
}

export function serializeYearMonthValue(x: YearMonthValue): unknown {
  return { kind: 'YearMonthValue', value: x.value };
}

export function serializeFullDateValue(x: FullDateValue): unknown {
  return { kind: 'FullDateValue', value: x.value };
}

export function serializeDateValue(x: DateValue): unknown {
  switch (x.kind) {
    case 'YearValue':
      return serializeYearValue(x);
    case 'YearMonthValue':
      return serializeYearMonthValue(x);
    case 'FullDateValue':
      return serializeFullDateValue(x);
  }
}

export function parseYearValue(x: unknown, where = 'YearValue'): YearValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'YearValue') {
    throw new CedarConstructionError(`${where}: expected kind "YearValue"`);
  }
  return yearValue(expectString(o['value'], `${where}.value`));
}

export function parseYearMonthValue(
  x: unknown,
  where = 'YearMonthValue',
): YearMonthValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'YearMonthValue') {
    throw new CedarConstructionError(`${where}: expected kind "YearMonthValue"`);
  }
  return yearMonthValue(expectString(o['value'], `${where}.value`));
}

export function parseFullDateValue(
  x: unknown,
  where = 'FullDateValue',
): FullDateValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'FullDateValue') {
    throw new CedarConstructionError(`${where}: expected kind "FullDateValue"`);
  }
  return fullDateValue(expectString(o['value'], `${where}.value`));
}

export function parseDateValue(x: unknown, where = 'DateValue'): DateValue {
  const o = expectObject(x, where);
  const k = expectKindOneOf(
    o,
    ['YearValue', 'YearMonthValue', 'FullDateValue'] as const,
    where,
  );
  switch (k) {
    case 'YearValue':
      return parseYearValue(x, where);
    case 'YearMonthValue':
      return parseYearMonthValue(x, where);
    case 'FullDateValue':
      return parseFullDateValue(x, where);
  }
}

// ---- TimeValue / DateTimeValue ---------------------------------------

export function serializeTimeValue(x: TimeValue): unknown {
  return { kind: 'TimeValue', value: x.value };
}

export function serializeTimeValueUntagged(x: TimeValue): unknown {
  return { value: x.value };
}

export function parseTimeValue(x: unknown, where = 'TimeValue'): TimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'TimeValue') {
    throw new CedarConstructionError(`${where}: expected kind "TimeValue"`);
  }
  return timeValue(expectString(o['value'], `${where}.value`));
}

export function parseTimeValueUntagged(
  x: unknown,
  where = 'TimeValue',
): TimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return timeValue(expectString(o['value'], `${where}.value`));
}

export function serializeDateTimeValue(x: DateTimeValue): unknown {
  return { kind: 'DateTimeValue', value: x.value };
}

export function serializeDateTimeValueUntagged(x: DateTimeValue): unknown {
  return { value: x.value };
}

export function parseDateTimeValue(
  x: unknown,
  where = 'DateTimeValue',
): DateTimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'DateTimeValue') {
    throw new CedarConstructionError(`${where}: expected kind "DateTimeValue"`);
  }
  return dateTimeValue(expectString(o['value'], `${where}.value`));
}

export function parseDateTimeValueUntagged(
  x: unknown,
  where = 'DateTimeValue',
): DateTimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return dateTimeValue(expectString(o['value'], `${where}.value`));
}

// ---- ControlledTermValue ---------------------------------------------

export function serializeControlledTermValue(x: ControlledTermValue): unknown {
  const out: Record<string, unknown> = {
    kind: 'ControlledTermValue',
    term: x.term.value,
  };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  if (x.notation !== undefined) out['notation'] = x.notation;
  if (x.preferredLabel !== undefined)
    out['preferredLabel'] = serializeMultilingualString(x.preferredLabel);
  return out;
}

export function serializeControlledTermValueUntagged(x: ControlledTermValue): unknown {
  const out: Record<string, unknown> = { term: x.term.value };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  if (x.notation !== undefined) out['notation'] = x.notation;
  if (x.preferredLabel !== undefined)
    out['preferredLabel'] = serializeMultilingualString(x.preferredLabel);
  return out;
}

function parseControlledTermValueBody(
  o: { readonly [k: string]: unknown },
  where: string,
  expectedTagged: boolean,
): ControlledTermValue {
  const allowed = expectedTagged
    ? ['kind', 'term', 'label', 'notation', 'preferredLabel']
    : ['term', 'label', 'notation', 'preferredLabel'];
  expectKnownProperties(o, allowed);
  rejectNullProperty(o, 'label');
  rejectNullProperty(o, 'notation');
  rejectNullProperty(o, 'preferredLabel');
  if (!('term' in o)) {
    throw new CedarConstructionError(`${where}: missing required "term"`);
  }
  const init: {
    term: string;
    label?: ReturnType<typeof parseMultilingualString>;
    notation?: string;
    preferredLabel?: ReturnType<typeof parseMultilingualString>;
  } = { term: expectString(o['term'], `${where}.term`) };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  if ('notation' in o)
    init.notation = expectString(o['notation'], `${where}.notation`);
  if ('preferredLabel' in o)
    init.preferredLabel = parseMultilingualString(
      o['preferredLabel'],
      `${where}.preferredLabel`,
    );
  return controlledTermValue(init);
}

export function parseControlledTermValue(
  x: unknown,
  where = 'ControlledTermValue',
): ControlledTermValue {
  const o = expectObject(x, where);
  if (o['kind'] !== 'ControlledTermValue') {
    throw new CedarConstructionError(`${where}: expected kind "ControlledTermValue"`);
  }
  return parseControlledTermValueBody(o, where, true);
}

export function parseControlledTermValueUntagged(
  x: unknown,
  where = 'ControlledTermValue',
): ControlledTermValue {
  const o = expectObject(x, where);
  return parseControlledTermValueBody(o, where, false);
}

// ---- LiteralChoiceValue / ControlledTermChoiceValue / ChoiceValue ----

export function serializeLiteralChoiceValue(x: LiteralChoiceValue): unknown {
  const out: Record<string, unknown> = {
    kind: 'LiteralChoiceValue',
    value: x.value,
  };
  if (x.lang !== undefined) out['lang'] = x.lang.value;
  if (x.datatype !== undefined) out['datatype'] = x.datatype.value;
  return out;
}

export function parseLiteralChoiceValue(
  x: unknown,
  where = 'LiteralChoiceValue',
): LiteralChoiceValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value', 'lang', 'datatype']);
  if (o['kind'] !== 'LiteralChoiceValue') {
    throw new CedarConstructionError(`${where}: expected kind "LiteralChoiceValue"`);
  }
  rejectNullProperty(o, 'lang');
  rejectNullProperty(o, 'datatype');
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  const init: {
    value: string;
    lang?: string;
    datatype?: string;
  } = { value: expectString(o['value'], `${where}.value`) };
  if ('lang' in o) init.lang = expectString(o['lang'], `${where}.lang`);
  if ('datatype' in o)
    init.datatype = expectString(o['datatype'], `${where}.datatype`);
  return literalChoiceValue(init);
}

export function serializeControlledTermChoiceValue(
  x: ControlledTermChoiceValue,
): unknown {
  return {
    kind: 'ControlledTermChoiceValue',
    value: serializeControlledTermValueUntagged(x.value),
  };
}

export function parseControlledTermChoiceValue(
  x: unknown,
  where = 'ControlledTermChoiceValue',
): ControlledTermChoiceValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'ControlledTermChoiceValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "ControlledTermChoiceValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return controlledTermChoiceValue(
    parseControlledTermValueUntagged(o['value'], `${where}.value`),
  );
}

export function serializeChoiceValue(x: ChoiceValue): unknown {
  if (x.kind === 'LiteralChoiceValue') return serializeLiteralChoiceValue(x);
  return serializeControlledTermChoiceValue(x);
}

export function parseChoiceValue(x: unknown, where = 'ChoiceValue'): ChoiceValue {
  const o = expectObject(x, where);
  const k = expectKindOneOf(
    o,
    ['LiteralChoiceValue', 'ControlledTermChoiceValue'] as const,
    where,
  );
  return k === 'LiteralChoiceValue'
    ? parseLiteralChoiceValue(x, where)
    : parseControlledTermChoiceValue(x, where);
}

// ---- LinkValue -------------------------------------------------------

export function serializeLinkValue(x: LinkValue): unknown {
  const out: Record<string, unknown> = { kind: 'LinkValue', iri: x.iri.value };
  if (x.label !== undefined) out['label'] = x.label;
  return out;
}

export function serializeLinkValueUntagged(x: LinkValue): unknown {
  const out: Record<string, unknown> = { iri: x.iri.value };
  if (x.label !== undefined) out['label'] = x.label;
  return out;
}

export function parseLinkValue(x: unknown, where = 'LinkValue'): LinkValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'iri', 'label']);
  if (o['kind'] !== 'LinkValue') {
    throw new CedarConstructionError(`${where}: expected kind "LinkValue"`);
  }
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: { iri: string; label?: string } = {
    iri: expectString(o['iri'], `${where}.iri`),
  };
  if ('label' in o) init.label = expectString(o['label'], `${where}.label`);
  return linkValue(init);
}

export function parseLinkValueUntagged(
  x: unknown,
  where = 'LinkValue',
): LinkValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['iri', 'label']);
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: { iri: string; label?: string } = {
    iri: expectString(o['iri'], `${where}.iri`),
  };
  if ('label' in o) init.label = expectString(o['label'], `${where}.label`);
  return linkValue(init);
}

// ---- EmailValue / PhoneNumberValue ----------------------------------

export function serializeEmailValue(x: EmailValue): unknown {
  return { kind: 'EmailValue', value: x.value };
}

export function serializeEmailValueUntagged(x: EmailValue): unknown {
  return { value: x.value };
}

export function parseEmailValue(x: unknown, where = 'EmailValue'): EmailValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'EmailValue') {
    throw new CedarConstructionError(`${where}: expected kind "EmailValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return emailValue(expectString(o['value'], `${where}.value`));
}

export function parseEmailValueUntagged(
  x: unknown,
  where = 'EmailValue',
): EmailValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return emailValue(expectString(o['value'], `${where}.value`));
}

export function serializePhoneNumberValue(x: PhoneNumberValue): unknown {
  return { kind: 'PhoneNumberValue', value: x.value };
}

export function serializePhoneNumberValueUntagged(x: PhoneNumberValue): unknown {
  return { value: x.value };
}

export function parsePhoneNumberValue(
  x: unknown,
  where = 'PhoneNumberValue',
): PhoneNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'PhoneNumberValue') {
    throw new CedarConstructionError(`${where}: expected kind "PhoneNumberValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return phoneNumberValue(expectString(o['value'], `${where}.value`));
}

export function parsePhoneNumberValueUntagged(
  x: unknown,
  where = 'PhoneNumberValue',
): PhoneNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value']);
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return phoneNumberValue(expectString(o['value'], `${where}.value`));
}

// ---- External-authority values ---------------------------------------
//
// In-memory shape: typed-IRI wrapper (e.g. OrcidIri) and plain string
// `label`. Wire shape: `{ kind, iri: string, label?: MultilingualString }`
// per wire-grammar.md §3.7. To round-trip a plain string through
// MultilingualString we encode it as a single-entry array with lang
// 'und' and decode by reading the first entry's value.

import { UNDETERMINED_LANG } from '../multilingual.js';

function authorityLabelToWire(label: string): unknown {
  return [{ value: label, lang: UNDETERMINED_LANG }];
}

function wireLabelToString(x: unknown, where: string): string {
  const ms = parseMultilingualString(x, where);
  return ms[0]!.value;
}

function serializeAuthorityValue(
  kind: string,
  v: { readonly iri: { readonly value: { value: string } | string }; readonly label?: string },
): unknown {
  const inner = (v.iri as unknown as { value: { value: string } }).value;
  const iriString = typeof inner === 'string' ? inner : inner.value;
  const out: Record<string, unknown> = { kind, iri: iriString };
  if (v.label !== undefined) out['label'] = authorityLabelToWire(v.label);
  return out;
}

function serializeAuthorityValueUntagged(
  v: { readonly iri: { readonly value: { value: string } | string }; readonly label?: string },
): unknown {
  const inner = (v.iri as unknown as { value: { value: string } }).value;
  const iriString = typeof inner === 'string' ? inner : inner.value;
  const out: Record<string, unknown> = { iri: iriString };
  if (v.label !== undefined) out['label'] = authorityLabelToWire(v.label);
  return out;
}

function parseAuthorityFields(
  o: { readonly [k: string]: unknown },
  where: string,
  expectKind: boolean,
): { iri: string; label?: string } {
  expectKnownProperties(o, expectKind ? ['kind', 'iri', 'label'] : ['iri', 'label']);
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const out: { iri: string; label?: string } = {
    iri: expectString(o['iri'], `${where}.iri`),
  };
  if ('label' in o) out.label = wireLabelToString(o['label'], `${where}.label`);
  return out;
}

export const serializeOrcidValue = (x: OrcidValue): unknown =>
  serializeAuthorityValue('OrcidValue', x);
export const serializeRorValue = (x: RorValue): unknown =>
  serializeAuthorityValue('RorValue', x);
export const serializeDoiValue = (x: DoiValue): unknown =>
  serializeAuthorityValue('DoiValue', x);
export const serializePubMedIdValue = (x: PubMedIdValue): unknown =>
  serializeAuthorityValue('PubMedIdValue', x);
export const serializeRridValue = (x: RridValue): unknown =>
  serializeAuthorityValue('RridValue', x);
export const serializeNihGrantIdValue = (x: NihGrantIdValue): unknown =>
  serializeAuthorityValue('NihGrantIdValue', x);

export const serializeOrcidValueUntagged = (x: OrcidValue): unknown =>
  serializeAuthorityValueUntagged(x);
export const serializeRorValueUntagged = (x: RorValue): unknown =>
  serializeAuthorityValueUntagged(x);
export const serializeDoiValueUntagged = (x: DoiValue): unknown =>
  serializeAuthorityValueUntagged(x);
export const serializePubMedIdValueUntagged = (x: PubMedIdValue): unknown =>
  serializeAuthorityValueUntagged(x);
export const serializeRridValueUntagged = (x: RridValue): unknown =>
  serializeAuthorityValueUntagged(x);
export const serializeNihGrantIdValueUntagged = (x: NihGrantIdValue): unknown =>
  serializeAuthorityValueUntagged(x);

function parseAuthority<V>(
  x: unknown,
  expectedKind: string,
  cons: (init: { iri: string; label?: string }) => V,
  where: string,
): V {
  const o = expectObject(x, where);
  if (o['kind'] !== expectedKind) {
    throw new CedarConstructionError(
      `${where}: expected kind ${JSON.stringify(expectedKind)}`,
    );
  }
  return cons(parseAuthorityFields(o, where, true));
}

function parseAuthorityUntagged<V>(
  x: unknown,
  cons: (init: { iri: string; label?: string }) => V,
  where: string,
): V {
  const o = expectObject(x, where);
  return cons(parseAuthorityFields(o, where, false));
}

export const parseOrcidValue = (x: unknown, w = 'OrcidValue'): OrcidValue =>
  parseAuthority(x, 'OrcidValue', orcidValue, w);
export const parseRorValue = (x: unknown, w = 'RorValue'): RorValue =>
  parseAuthority(x, 'RorValue', rorValue, w);
export const parseDoiValue = (x: unknown, w = 'DoiValue'): DoiValue =>
  parseAuthority(x, 'DoiValue', doiValue, w);
export const parsePubMedIdValue = (x: unknown, w = 'PubMedIdValue'): PubMedIdValue =>
  parseAuthority(x, 'PubMedIdValue', pubMedIdValue, w);
export const parseRridValue = (x: unknown, w = 'RridValue'): RridValue =>
  parseAuthority(x, 'RridValue', rridValue, w);
export const parseNihGrantIdValue = (
  x: unknown,
  w = 'NihGrantIdValue',
): NihGrantIdValue => parseAuthority(x, 'NihGrantIdValue', nihGrantIdValue, w);

export const parseOrcidValueUntagged = (x: unknown, w = 'OrcidValue'): OrcidValue =>
  parseAuthorityUntagged(x, orcidValue, w);
export const parseRorValueUntagged = (x: unknown, w = 'RorValue'): RorValue =>
  parseAuthorityUntagged(x, rorValue, w);
export const parseDoiValueUntagged = (x: unknown, w = 'DoiValue'): DoiValue =>
  parseAuthorityUntagged(x, doiValue, w);
export const parsePubMedIdValueUntagged = (
  x: unknown,
  w = 'PubMedIdValue',
): PubMedIdValue => parseAuthorityUntagged(x, pubMedIdValue, w);
export const parseRridValueUntagged = (x: unknown, w = 'RridValue'): RridValue =>
  parseAuthorityUntagged(x, rridValue, w);
export const parseNihGrantIdValueUntagged = (
  x: unknown,
  w = 'NihGrantIdValue',
): NihGrantIdValue => parseAuthorityUntagged(x, nihGrantIdValue, w);

// ---- AttributeValue --------------------------------------------------

export function serializeAttributeValue(x: AttributeValue): unknown {
  return {
    kind: 'AttributeValue',
    name: x.name,
    value: serializeValue(x.value),
  };
}

export function parseAttributeValue(
  x: unknown,
  where = 'AttributeValue',
): AttributeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'name', 'value']);
  if (o['kind'] !== 'AttributeValue') {
    throw new CedarConstructionError(`${where}: expected kind "AttributeValue"`);
  }
  if (!('name' in o)) {
    throw new CedarConstructionError(`${where}: missing required "name"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return attributeValue(
    expectString(o['name'], `${where}.name`),
    parseValue(o['value'], `${where}.value`),
  );
}

// ---- Value union -----------------------------------------------------

const VALUE_KINDS = [
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
  'LiteralChoiceValue',
  'ControlledTermChoiceValue',
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
] as const;

export function serializeValue(x: Value): unknown {
  switch (x.kind) {
    case 'TextValue':
      return serializeTextValue(x);
    case 'IntegerNumberValue':
      return serializeIntegerNumberValue(x);
    case 'RealNumberValue':
      return serializeRealNumberValue(x);
    case 'BooleanValue':
      return serializeBooleanValue(x);
    case 'YearValue':
      return serializeYearValue(x);
    case 'YearMonthValue':
      return serializeYearMonthValue(x);
    case 'FullDateValue':
      return serializeFullDateValue(x);
    case 'TimeValue':
      return serializeTimeValue(x);
    case 'DateTimeValue':
      return serializeDateTimeValue(x);
    case 'ControlledTermValue':
      return serializeControlledTermValue(x);
    case 'LiteralChoiceValue':
      return serializeLiteralChoiceValue(x);
    case 'ControlledTermChoiceValue':
      return serializeControlledTermChoiceValue(x);
    case 'LinkValue':
      return serializeLinkValue(x);
    case 'EmailValue':
      return serializeEmailValue(x);
    case 'PhoneNumberValue':
      return serializePhoneNumberValue(x);
    case 'OrcidValue':
      return serializeOrcidValue(x);
    case 'RorValue':
      return serializeRorValue(x);
    case 'DoiValue':
      return serializeDoiValue(x);
    case 'PubMedIdValue':
      return serializePubMedIdValue(x);
    case 'RridValue':
      return serializeRridValue(x);
    case 'NihGrantIdValue':
      return serializeNihGrantIdValue(x);
    case 'AttributeValue':
      return serializeAttributeValue(x);
  }
}

export function parseValue(x: unknown, where = 'Value'): Value {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, VALUE_KINDS, where);
  switch (k) {
    case 'TextValue':
      return parseTextValue(x, where);
    case 'IntegerNumberValue':
      return parseIntegerNumberValue(x, where);
    case 'RealNumberValue':
      return parseRealNumberValue(x, where);
    case 'BooleanValue':
      return parseBooleanValue(x, where);
    case 'YearValue':
      return parseYearValue(x, where);
    case 'YearMonthValue':
      return parseYearMonthValue(x, where);
    case 'FullDateValue':
      return parseFullDateValue(x, where);
    case 'TimeValue':
      return parseTimeValue(x, where);
    case 'DateTimeValue':
      return parseDateTimeValue(x, where);
    case 'ControlledTermValue':
      return parseControlledTermValue(x, where);
    case 'LiteralChoiceValue':
      return parseLiteralChoiceValue(x, where);
    case 'ControlledTermChoiceValue':
      return parseControlledTermChoiceValue(x, where);
    case 'LinkValue':
      return parseLinkValue(x, where);
    case 'EmailValue':
      return parseEmailValue(x, where);
    case 'PhoneNumberValue':
      return parsePhoneNumberValue(x, where);
    case 'OrcidValue':
      return parseOrcidValue(x, where);
    case 'RorValue':
      return parseRorValue(x, where);
    case 'DoiValue':
      return parseDoiValue(x, where);
    case 'PubMedIdValue':
      return parsePubMedIdValue(x, where);
    case 'RridValue':
      return parseRridValue(x, where);
    case 'NihGrantIdValue':
      return parseNihGrantIdValue(x, where);
    case 'AttributeValue':
      return parseAttributeValue(x, where);
  }
}

export { VALUE_KINDS };
