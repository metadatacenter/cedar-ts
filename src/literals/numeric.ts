import {
  type NumericDatatypeKind,
  XsdNumericDatatypeIri,
} from '../leaves/index.js';

// NumericLiteral pairs a lexical form with an XSD numeric datatype.
// We carry the datatype as a kind name (e.g. 'integer'); the full IRI is
// looked up via XsdNumericDatatypeIri[kind].
export interface NumericLiteral {
  readonly kind: 'NumericLiteral';
  readonly lexicalForm: string;
  readonly datatype: NumericDatatypeKind;
}

export function numericLiteral(
  lexicalForm: string,
  datatype: NumericDatatypeKind,
): NumericLiteral {
  return { kind: 'NumericLiteral', lexicalForm, datatype };
}

export function numericLiteralDatatypeIri(lit: NumericLiteral): string {
  return XsdNumericDatatypeIri[lit.datatype];
}

export function isNumericLiteral(x: unknown): x is NumericLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'NumericLiteral'
  );
}

// Best-effort numeric value of a NumericLiteral. Returns NaN for ill-typed
// lexical forms; use validateNumericValue for normative checks.
export function numericLiteralToNumber(lit: NumericLiteral): number {
  return Number(lit.lexicalForm);
}
