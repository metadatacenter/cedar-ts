// =====================================================================
// values — wire-form serialize/parse for every Value variant + the Value
// union dispatcher.
// =====================================================================
//
// All Value variants are tagged on the wire (per the polymorphic-only
// kind rule); each carries a `kind` property whose value matches the
// in-memory discriminant. Internal singleton-position productions
// (literals, ControlledTermValue inside ControlledTermChoiceValue) are
// untagged on the wire.

import { CedarConstructionError, iri } from '../leaves/index.js';
import {
  type TextValue,
  type NumericValue,
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
  numericValue,
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
  serializeLiteral,
  serializeTextLiteral,
  serializeTypedLiteralAtPosition,
  parseTextLiteral,
  parseFullDateLiteral,
  parseTimeLiteral,
  parseDateTimeLiteral,
  parseLiteral,
} from './literals.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
  rejectNullProperty,
} from './parse-utils.js';

// ---- TextValue -------------------------------------------------------

export function serializeTextValue(x: TextValue): unknown {
  return { kind: 'TextValue', literal: serializeTextLiteral(x.literal) };
}

export function parseTextValue(x: unknown, where = 'TextValue'): TextValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'TextValue') {
    throw new CedarConstructionError(`${where}: expected kind "TextValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  return textValue(parseTextLiteral(o['literal'], `${where}.literal`));
}

// ---- NumericValue ----------------------------------------------------
//
// On the wire NumericValue.literal is a TypedLiteral whose datatype is one
// of the XSD numeric IRIs. We always emit the datatype (the in-memory
// shape carries it explicitly); on parse we accept either form. We
// tolerate the elided form by inferring from any present datatype, or
// otherwise defaulting to xsd:integer if neither is present (per the spec
// the datatype-less form requires the surrounding context to supply
// it — for round-trip we always emit the datatype, so this branch is
// only exercised by hand-authored inputs).

export function serializeNumericValue(x: NumericValue): unknown {
  return { kind: 'NumericValue', literal: serializeLiteral(x.literal) };
}

export function parseNumericValue(x: unknown, where = 'NumericValue'): NumericValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'NumericValue') {
    throw new CedarConstructionError(`${where}: expected kind "NumericValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  // The literal must be a TypedLiteral with a numeric datatype IRI.
  const lit = parseLiteral(o['literal'], `${where}.literal`);
  if (lit.kind !== 'TypedLiteral') {
    throw new CedarConstructionError(
      `${where}.literal must be a typed literal carrying a numeric datatype`,
    );
  }
  return numericValue(lit);
}

// ---- DateValue (Year / YearMonth / FullDate) -------------------------

export function serializeYearValue(x: YearValue): unknown {
  return { kind: 'YearValue', value: x.value };
}

export function serializeYearMonthValue(x: YearMonthValue): unknown {
  return { kind: 'YearMonthValue', value: x.value };
}

export function serializeFullDateValue(x: FullDateValue): unknown {
  return {
    kind: 'FullDateValue',
    literal: serializeTypedLiteralAtPosition(x.literal),
  };
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
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'FullDateValue') {
    throw new CedarConstructionError(`${where}: expected kind "FullDateValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  return fullDateValue(parseFullDateLiteral(o['literal'], `${where}.literal`));
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
  return {
    kind: 'TimeValue',
    literal: serializeTypedLiteralAtPosition(x.literal),
  };
}

export function parseTimeValue(x: unknown, where = 'TimeValue'): TimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'TimeValue') {
    throw new CedarConstructionError(`${where}: expected kind "TimeValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  return timeValue(parseTimeLiteral(o['literal'], `${where}.literal`));
}

export function serializeDateTimeValue(x: DateTimeValue): unknown {
  return {
    kind: 'DateTimeValue',
    literal: serializeTypedLiteralAtPosition(x.literal),
  };
}

export function parseDateTimeValue(
  x: unknown,
  where = 'DateTimeValue',
): DateTimeValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'DateTimeValue') {
    throw new CedarConstructionError(`${where}: expected kind "DateTimeValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  return dateTimeValue(parseDateTimeLiteral(o['literal'], `${where}.literal`));
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

// Untagged variant — used at the singleton position inside
// ControlledTermChoiceValue / ControlledTermChoiceOption (the wire form
// elides the kind property at those positions per the polymorphic-only
// rule).
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
  return { kind: 'LiteralChoiceValue', literal: serializeLiteral(x.literal) };
}

export function parseLiteralChoiceValue(
  x: unknown,
  where = 'LiteralChoiceValue',
): LiteralChoiceValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'LiteralChoiceValue') {
    throw new CedarConstructionError(`${where}: expected kind "LiteralChoiceValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  return literalChoiceValue(parseLiteral(o['literal'], `${where}.literal`));
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

// Untagged variant — used at singleton positions where the enclosing
// production fixes the kind (e.g. EmbeddedLinkField.defaultValue).
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
  return { kind: 'EmailValue', literal: { value: x.literal.lexicalForm } };
}

export function parseEmailValue(x: unknown, where = 'EmailValue'): EmailValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'EmailValue') {
    throw new CedarConstructionError(`${where}: expected kind "EmailValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  // EmailValue.literal is always a SimpleLiteral.
  const lit = parseTextLiteral(o['literal'], `${where}.literal`);
  if (lit.kind !== 'SimpleLiteral') {
    throw new CedarConstructionError(
      `${where}.literal must be a SimpleLiteral (no lang)`,
    );
  }
  return emailValue(lit);
}

export function serializePhoneNumberValue(x: PhoneNumberValue): unknown {
  return { kind: 'PhoneNumberValue', literal: { value: x.literal.lexicalForm } };
}

export function parsePhoneNumberValue(
  x: unknown,
  where = 'PhoneNumberValue',
): PhoneNumberValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'literal']);
  if (o['kind'] !== 'PhoneNumberValue') {
    throw new CedarConstructionError(`${where}: expected kind "PhoneNumberValue"`);
  }
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  const lit = parseTextLiteral(o['literal'], `${where}.literal`);
  if (lit.kind !== 'SimpleLiteral') {
    throw new CedarConstructionError(
      `${where}.literal must be a SimpleLiteral (no lang)`,
    );
  }
  return phoneNumberValue(lit);
}

// ---- External-authority values ---------------------------------------
//
// The in-memory shape uses a typed-IRI wrapper (e.g. OrcidIri) and a plain
// string `label`. The wire shape is `{ kind, iri: string, label?:
// MultilingualString }` per wire-grammar.md §4.7. To round-trip a plain
// string through MultilingualString we encode it as a single-entry array
// with lang `'und'` and decode by reading the first entry's value.

import { UNDETERMINED_LANG } from '../multilingual.js';

function authorityLabelToWire(label: string): unknown {
  return [{ value: label, lang: UNDETERMINED_LANG }];
}

function wireLabelToString(x: unknown, where: string): string {
  // Validate the structure even though we project to a single string.
  const ms = parseMultilingualString(x, where);
  return ms[0]!.value;
}

function serializeAuthorityValue(
  kind: string,
  v: { readonly iri: { readonly value: { value: string } | string }; readonly label?: string },
): unknown {
  // The in-memory `iri` is a typed-IRI wrapper carrying { kind, value: Iri };
  // grab the inner Iri's string value.
  const inner = (v.iri as unknown as { value: { value: string } }).value;
  const iriString =
    typeof inner === 'string' ? inner : inner.value;
  const out: Record<string, unknown> = { kind, iri: iriString };
  if (v.label !== undefined) out['label'] = authorityLabelToWire(v.label);
  return out;
}

// Untagged authority-value serializer — used at singleton positions
// (EmbeddedXxxField.defaultValue) where the kind discriminator drops on
// the wire per the polymorphic-only-kind rule.
function serializeAuthorityValueUntagged(
  v: { readonly iri: { readonly value: { value: string } | string }; readonly label?: string },
): unknown {
  const inner = (v.iri as unknown as { value: { value: string } }).value;
  const iriString =
    typeof inner === 'string' ? inner : inner.value;
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

// Untagged variants — used at singleton positions where the kind drops
// on the wire (EmbeddedXxxField.defaultValue).
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
  'NumericValue',
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
    case 'NumericValue':
      return serializeNumericValue(x);
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
    case 'NumericValue':
      return parseNumericValue(x, where);
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

// Used as a stable reference in CedarConstructionError messages without
// importing the whole list at call sites.
export { VALUE_KINDS };

// Suppress unused-import warning — `iri` is exposed for consistency with
// other wrapper-importing modules but is not directly used here.
void iri;
