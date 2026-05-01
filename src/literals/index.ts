// =====================================================================
// Literals — public surface for RDF literal types
// =====================================================================
//
// Re-exports:
//
//   - the three base RDF literal forms          (literals.ts):
//       SimpleLiteral, LangTaggedLiteral, TypedLiteral
//   - the Literal and TextLiteral unions
//   - constructors and predicates for each form
//   - simpleLiteralToTypedLiteral and literalsTermEqual
//   - LANG_STRING_DATATYPE_IRI (the rdf:langString IRI)
//   - NumericLiteral and helpers                (numeric-literals.ts)
//   - FullDateLiteral / TimeLiteral / DateTimeLiteral and the
//     TemporalLiteral union                     (temporal-literals.ts)
//   - FULL_DATE_DATATYPE_IRI / TIME_DATATYPE_IRI / DATE_TIME_DATATYPE_IRI
//
// NumericLiteral and the temporal-literal types are TypedLiteral type
// aliases with constraint that the datatype IRI matches the family;
// constructors set the right datatype, and predicates check it on a
// TypedLiteral.

export {
  type TypedLiteral,
  type LangTaggedLiteral,
  type SimpleLiteral,
  type TextLiteral,
  type Literal,
  typedLiteral,
  langTaggedLiteral,
  simpleLiteral,
  simpleLiteralToTypedLiteral,
  literalsTermEqual,
  isTypedLiteral,
  isLangTaggedLiteral,
  isSimpleLiteral,
  isTextLiteral,
  isLiteral,
  LANG_STRING_DATATYPE_IRI,
} from './literals.js';
export {
  type NumericLiteral,
  numericLiteral,
  numericLiteralDatatypeIri,
  numericLiteralToNumber,
  isNumericLiteral,
} from './numeric-literals.js';
export {
  type FullDateLiteral,
  type TimeLiteral,
  type DateTimeLiteral,
  type TemporalLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  isFullDateLiteral,
  isTimeLiteral,
  isDateTimeLiteral,
  isTemporalLiteral,
  FULL_DATE_DATATYPE_IRI,
  TIME_DATATYPE_IRI,
  DATE_TIME_DATATYPE_IRI,
} from './temporal-literals.js';
