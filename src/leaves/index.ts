// =====================================================================
// Leaves — public surface for the lowest-level types and string-syntax
// validators
// =====================================================================
//
// Re-exports:
//
//   - CedarConstructionError                    (cedar-construction-error.ts)
//   - the syntax validators                     (*-syntax.ts files):
//       IRI, BCP-47, ASCII identifier, semver, ISO-8601 date-time,
//       integer lexical form, plus the assertNonNegativeInteger helper
//   - the Unicode NFC helper toNfc              (unicode-nfc.ts)
//   - the XSD / RDF datatype IRI constants       (datatype-iris.ts)
//   - the leaf types Iri, LanguageTag,
//     IsoDateTimeStamp and their constructors   (leaf-types.ts)
//
// Aliases DatatypeIri and TermIri are role-name re-exports of Iri.

export { CedarConstructionError } from './cedar-construction-error.js';
export { isIriString, parseIriString, tryParseIriString } from './iri-syntax.js';
export { isBcp47Tag, parseBcp47Tag, tryParseBcp47Tag } from './bcp47-syntax.js';
export {
  isAsciiIdentifier,
  parseAsciiIdentifier,
  tryParseAsciiIdentifier,
} from './ascii-identifier-syntax.js';
export {
  isSemanticVersion,
  parseSemanticVersion,
  tryParseSemanticVersion,
} from './semver-syntax.js';
export {
  isIso8601DateTimeLexicalForm,
  parseIso8601DateTimeLexicalForm,
  tryParseIso8601DateTimeLexicalForm,
  isXsdDateLexicalForm,
  isXsdTimeLexicalForm,
} from './datetime-syntax.js';
export {
  isIntegerLexicalForm,
  parseIntegerLexicalForm,
  tryParseIntegerLexicalForm,
  integerLexicalFormFromNumber,
  integerLexicalFormFromBigInt,
  assertNonNegativeInteger,
} from './integer-syntax.js';
export { toNfc } from './unicode-nfc.js';
export {
  XsdNumericDatatypeIri,
  XsdTemporalDatatypeIri,
  XsdStringDatatypeIri,
  XsdBooleanDatatypeIri,
  RdfLangStringDatatypeIri,
} from './datatype-iris.js';
export {
  type Iri,
  type DatatypeIri,
  type TermIri,
  iri,
  isIri,
  type LanguageTag,
  languageTag,
  type IsoDateTimeStamp,
  isoDateTimeStamp,
} from './leaf-types.js';
