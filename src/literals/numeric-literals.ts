import {
  type RealNumberDatatypeKind,
  XsdNumericDatatypeIri,
} from '../leaves/index.js';
import { type TypedLiteral, typedLiteral, isTypedLiteral } from './literals.js';

// IntegerNumberLiteral and RealNumberLiteral are both `TypedLiteral` type
// aliases rather than separate runtime types. They share the same shape
// and the same `kind: 'TypedLiteral'` discriminator as any other
// `TypedLiteral`; the family-specific datatype constraint is enforced at
// construction (via the family constructors below) and queried at runtime
// (via the family predicates below).
//
// At polymorphic positions, each encodes as a `TypedLiteral`
// (`{value, datatype}`); at singleton positions such as
// `IntegerNumberValue.literal` and `RealNumberValue.literal`, the wire
// form may elide `datatype` per the position-discrimination rule (see
// wire-grammar.md §4 and serialization.md §4.4). On the wire,
// `IntegerNumberLiteral` carries no `datatype` slot at all (its
// datatype is fixed by category); `RealNumberLiteral`'s `datatype` slot
// is optional at singleton positions.

export type IntegerNumberLiteral = TypedLiteral;
export type RealNumberLiteral = TypedLiteral;

const REAL_NUMBER_DATATYPE_IRIS: ReadonlySet<string> = new Set([
  XsdNumericDatatypeIri.decimal,
  XsdNumericDatatypeIri.float,
  XsdNumericDatatypeIri.double,
]);

export function integerNumberLiteral(lexicalForm: string): IntegerNumberLiteral {
  return typedLiteral(lexicalForm, XsdNumericDatatypeIri.integer);
}

export function realNumberLiteral(
  lexicalForm: string,
  datatype: RealNumberDatatypeKind,
): RealNumberLiteral {
  return typedLiteral(lexicalForm, XsdNumericDatatypeIri[datatype]);
}

// Returns the IRI string for the literal's datatype. Equivalent to
// `lit.datatype.value`.
export function integerNumberLiteralDatatypeIri(
  lit: IntegerNumberLiteral,
): string {
  return lit.datatype.value;
}

export function realNumberLiteralDatatypeIri(lit: RealNumberLiteral): string {
  return lit.datatype.value;
}

export function isIntegerNumberLiteral(x: unknown): x is IntegerNumberLiteral {
  return isTypedLiteral(x) && x.datatype.value === XsdNumericDatatypeIri.integer;
}

export function isRealNumberLiteral(x: unknown): x is RealNumberLiteral {
  return isTypedLiteral(x) && REAL_NUMBER_DATATYPE_IRIS.has(x.datatype.value);
}

// Best-effort numeric value of an integer or real-number literal. Returns
// `NaN` for ill-typed lexical forms; use validation helpers for normative
// checks.
export function integerNumberLiteralToNumber(lit: IntegerNumberLiteral): number {
  return Number(lit.lexicalForm);
}

export function realNumberLiteralToNumber(lit: RealNumberLiteral): number {
  return Number(lit.lexicalForm);
}
