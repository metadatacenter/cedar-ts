import {
  type NumericDatatypeKind,
  XsdNumericDatatypeIri,
} from '../leaves/index.js';
import { type TypedLiteral, typedLiteral, isTypedLiteral } from './base.js';

// NumericLiteral is a TypedLiteral whose `datatype` IRI is one of the XSD
// numeric datatype IRIs (xsd:integer, xsd:decimal, xsd:float, …). It is a
// type alias rather than a separate runtime type: a NumericLiteral has the
// same shape and same `kind: 'TypedLiteral'` discriminator as any other
// TypedLiteral. The numeric-datatype constraint is enforced at construction
// (via numericLiteral()) and queried at runtime (via isNumericLiteral()).
//
// At polymorphic positions, a NumericLiteral encodes as a TypedLiteral
// (`{value, datatype}`); at singleton positions like `NumericValue.literal`,
// the wire form may elide `datatype` per the position-discrimination rule
// (see wire-grammar.md §4 and serialization.md §4.4).
export type NumericLiteral = TypedLiteral;

const NUMERIC_DATATYPE_IRIS: ReadonlySet<string> = new Set(
  Object.values(XsdNumericDatatypeIri),
);

export function numericLiteral(
  lexicalForm: string,
  datatype: NumericDatatypeKind,
): NumericLiteral {
  return typedLiteral(lexicalForm, XsdNumericDatatypeIri[datatype]);
}

// Returns the IRI string for the literal's datatype. Equivalent to
// `lit.datatype.value`; provided for symmetry with the helper of the same
// name that existed prior to the type-alias refactor.
export function numericLiteralDatatypeIri(lit: NumericLiteral): string {
  return lit.datatype.value;
}

export function isNumericLiteral(x: unknown): x is NumericLiteral {
  return isTypedLiteral(x) && NUMERIC_DATATYPE_IRIS.has(x.datatype.value);
}

// Best-effort numeric value of a NumericLiteral. Returns NaN for ill-typed
// lexical forms; use validateNumericValue for normative checks.
export function numericLiteralToNumber(lit: NumericLiteral): number {
  return Number(lit.lexicalForm);
}
