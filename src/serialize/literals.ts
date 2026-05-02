// =====================================================================
// literals — wire-form serializers and parsers for the three RDF literal
// forms (SimpleLiteral / LangTaggedLiteral / TypedLiteral) plus the four
// typed-literal aliases (NumericLiteral / FullDateLiteral / TimeLiteral /
// DateTimeLiteral).
// =====================================================================
//
// Wire form: property-set discriminated objects. No `kind` discriminator,
// `value` instead of in-memory `lexicalForm`.
//
//   { value }                   → SimpleLiteral
//   { value, lang }             → LangTaggedLiteral
//   { value, datatype }         → TypedLiteral
//   { value, lang, datatype }   → REJECTED (multi-match)
//   { } / no value              → REJECTED (no-match)
//
// At singleton positions (NumericValue.literal, FullDateValue.literal,
// TimeValue.literal, DateTimeValue.literal) the wire grammar permits the
// `datatype` property to be elided; on parse the datatype is reconstructed
// from the enclosing position. See parseTypedLiteralAtPosition.

import { CedarConstructionError } from '../leaves/index.js';
import {
  type SimpleLiteral,
  type LangTaggedLiteral,
  type TypedLiteral,
  type Literal,
  type TextLiteral,
  type NumericLiteral,
  type FullDateLiteral,
  type TimeLiteral,
  type DateTimeLiteral,
  simpleLiteral,
  langTaggedLiteral,
  typedLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  numericLiteral,
  isLangTaggedLiteral,
  isSimpleLiteral,
  FULL_DATE_DATATYPE_IRI,
  TIME_DATATYPE_IRI,
  DATE_TIME_DATATYPE_IRI,
} from '../literals/index.js';
import {
  type NumericDatatypeKind,
  XsdNumericDatatypeIri,
  NUMERIC_DATATYPE_KINDS,
} from '../leaves/index.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  rejectNullProperty,
} from './parse-utils.js';

// ---- Serialize -------------------------------------------------------

export function serializeSimpleLiteral(x: SimpleLiteral): { value: string } {
  return { value: x.lexicalForm };
}

export function serializeLangTaggedLiteral(
  x: LangTaggedLiteral,
): { value: string; lang: string } {
  return { value: x.lexicalForm, lang: x.lang.value };
}

export function serializeTypedLiteral(
  x: TypedLiteral,
): { value: string; datatype: string } {
  return { value: x.lexicalForm, datatype: x.datatype.value };
}

// Generic Literal serializer — dispatches to the right per-variant
// serializer.
export function serializeLiteral(
  x: Literal,
):
  | { value: string }
  | { value: string; lang: string }
  | { value: string; datatype: string } {
  if (isLangTaggedLiteral(x)) return serializeLangTaggedLiteral(x);
  if (isSimpleLiteral(x)) return serializeSimpleLiteral(x);
  return serializeTypedLiteral(x);
}

// TextLiteral is the SimpleLiteral | LangTaggedLiteral subset; it shares
// the generic Literal serializer at runtime since the variants are
// shape-compatible.
export const serializeTextLiteral = (
  x: TextLiteral,
): { value: string } | { value: string; lang: string } =>
  isLangTaggedLiteral(x) ? serializeLangTaggedLiteral(x) : serializeSimpleLiteral(x);

// At a singleton typed-literal position the canonical wire form OMITS the
// datatype property (it is implied by the enclosing kind). A conforming
// decoder accepts either form (with or without datatype); this serializer
// emits the compact form.
export function serializeTypedLiteralAtPosition(
  x: TypedLiteral,
): { value: string } {
  return { value: x.lexicalForm };
}

// ---- Parse: property-set discrimination ------------------------------

interface LiteralProps {
  readonly value: string;
  readonly hasLang: boolean;
  readonly hasDatatype: boolean;
  readonly lang?: string;
  readonly datatype?: string;
}

// Reads the three literal-shape properties off an encoded object,
// validating each individually. Does not reject multi-match here — the
// caller decides which subset of variants is admitted at this position.
function readLiteralProps(o: Record<string, unknown>, where: string): LiteralProps {
  rejectNullProperty(o, 'value');
  rejectNullProperty(o, 'lang');
  rejectNullProperty(o, 'datatype');
  if (!('value' in o)) {
    throw new CedarConstructionError(
      `${where}: missing required property "value"`,
    );
  }
  const value = expectString(o['value'], `${where}.value`);
  const hasLang = 'lang' in o;
  const hasDatatype = 'datatype' in o;
  const out: {
    value: string;
    hasLang: boolean;
    hasDatatype: boolean;
    lang?: string;
    datatype?: string;
  } = { value, hasLang, hasDatatype };
  if (hasLang) out.lang = expectString(o['lang'], `${where}.lang`);
  if (hasDatatype) out.datatype = expectString(o['datatype'], `${where}.datatype`);
  return out;
}

// Parses the full Literal union (SimpleLiteral | LangTaggedLiteral |
// TypedLiteral) by exact property-set match.
export function parseLiteral(x: unknown, where = 'Literal'): Literal {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'lang', 'datatype']);
  const p = readLiteralProps(o as Record<string, unknown>, where);
  if (p.hasLang && p.hasDatatype) {
    throw new CedarConstructionError(
      `${where}: a Literal MUST NOT carry both "lang" and "datatype"`,
    );
  }
  if (p.hasLang) return langTaggedLiteral(p.value, p.lang!);
  if (p.hasDatatype) return typedLiteral(p.value, p.datatype!);
  return simpleLiteral(p.value);
}

// Parses the TextLiteral subset — only SimpleLiteral or LangTaggedLiteral
// are admitted. A `datatype` property at a TextLiteral position is a parse
// error.
export function parseTextLiteral(x: unknown, where = 'TextLiteral'): TextLiteral {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'lang']);
  const p = readLiteralProps(o as Record<string, unknown>, where);
  if (p.hasDatatype) {
    throw new CedarConstructionError(
      `${where}: a TextLiteral MUST NOT carry "datatype"`,
    );
  }
  if (p.hasLang) return langTaggedLiteral(p.value, p.lang!);
  return simpleLiteral(p.value);
}

// ---- Parse: typed-literal aliases at singleton positions -------------

// At each of these singleton positions the wire form is `{value}` with
// `datatype` optional; if present, the datatype IRI MUST match the
// canonical IRI for the family.

export function parseFullDateLiteral(
  x: unknown,
  where = 'FullDateLiteral',
): FullDateLiteral {
  return parseFixedDatatypeTypedLiteral(x, FULL_DATE_DATATYPE_IRI, fullDateLiteral, where);
}

export function parseTimeLiteral(x: unknown, where = 'TimeLiteral'): TimeLiteral {
  return parseFixedDatatypeTypedLiteral(x, TIME_DATATYPE_IRI, timeLiteral, where);
}

export function parseDateTimeLiteral(
  x: unknown,
  where = 'DateTimeLiteral',
): DateTimeLiteral {
  return parseFixedDatatypeTypedLiteral(x, DATE_TIME_DATATYPE_IRI, dateTimeLiteral, where);
}

function parseFixedDatatypeTypedLiteral<T extends TypedLiteral>(
  x: unknown,
  expectedDatatype: string,
  cons: (lexicalForm: string) => T,
  where: string,
): T {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'datatype']);
  const p = readLiteralProps(o as Record<string, unknown>, where);
  if (p.hasLang) {
    throw new CedarConstructionError(
      `${where}: typed literal MUST NOT carry "lang"`,
    );
  }
  if (p.hasDatatype && p.datatype !== expectedDatatype) {
    throw new CedarConstructionError(
      `${where}: datatype must be ${JSON.stringify(expectedDatatype)} when present; got ${JSON.stringify(p.datatype)}`,
    );
  }
  return cons(p.value);
}

// Parses a NumericLiteral at a position where the datatype is
// REQUIRED on the wire (e.g. EmbeddedNumericField.defaultValue, where
// the surrounding NumericFieldSpec is on a separate artifact and not
// available at parse time).
export function parseNumericLiteralStandalone(
  x: unknown,
  where = 'NumericLiteral',
): NumericLiteral {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'datatype']);
  const p = readLiteralProps(o as Record<string, unknown>, where);
  if (p.hasLang) {
    throw new CedarConstructionError(
      `${where}: typed literal MUST NOT carry "lang"`,
    );
  }
  if (!p.hasDatatype) {
    throw new CedarConstructionError(
      `${where}: standalone NumericLiteral requires a "datatype"`,
    );
  }
  // Map IRI back to kind.
  const dt = p.datatype!;
  let kind: NumericDatatypeKind | undefined;
  for (const k of NUMERIC_DATATYPE_KINDS) {
    if ((XsdNumericDatatypeIri as Record<string, string>)[k] === dt) {
      kind = k;
      break;
    }
  }
  if (kind === undefined) {
    throw new CedarConstructionError(
      `${where}: unknown numeric datatype IRI ${JSON.stringify(dt)}`,
    );
  }
  return numericLiteral(p.value, kind);
}

// Serializer for NumericLiteral at a standalone position — emits the
// datatype IRI explicitly (no surrounding context to elide it).
export function serializeNumericLiteralStandalone(
  x: NumericLiteral,
): { value: string; datatype: string } {
  return { value: x.lexicalForm, datatype: x.datatype.value };
}

// NumericLiteral parses with the surrounding NumericValue's
// NumericDatatypeKind providing the datatype when omitted on the wire. The
// datatype property, if present, MUST resolve to one of the XSD numeric
// IRIs and SHOULD match the surrounding kind.
export function parseNumericLiteral(
  x: unknown,
  surroundingDatatype: NumericDatatypeKind,
  where = 'NumericLiteral',
): NumericLiteral {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'datatype']);
  const p = readLiteralProps(o as Record<string, unknown>, where);
  if (p.hasLang) {
    throw new CedarConstructionError(
      `${where}: typed literal MUST NOT carry "lang"`,
    );
  }
  if (p.hasDatatype) {
    const expected = XsdNumericDatatypeIri[surroundingDatatype];
    if (p.datatype !== expected) {
      throw new CedarConstructionError(
        `${where}: datatype must be ${JSON.stringify(expected)} when present; got ${JSON.stringify(p.datatype)}`,
      );
    }
  }
  return numericLiteral(p.value, surroundingDatatype);
}

// Looks up the NumericDatatypeKind for an XSD numeric IRI; throws if not
// recognised. Useful for parsing NumericFieldSpec.datatype where the wire
// form is the bare keyword (e.g. "integer").
export function parseNumericDatatypeKind(
  x: unknown,
  where = 'NumericDatatype',
): NumericDatatypeKind {
  const s = expectString(x, where);
  if (!(NUMERIC_DATATYPE_KINDS as readonly string[]).includes(s)) {
    throw new CedarConstructionError(
      `${where}: unknown numeric datatype ${JSON.stringify(s)}; expected one of {${NUMERIC_DATATYPE_KINDS.map((k) => JSON.stringify(k)).join(', ')}}`,
    );
  }
  return s as NumericDatatypeKind;
}
