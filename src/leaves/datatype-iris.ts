const XSD = 'http://www.w3.org/2001/XMLSchema#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

// Numeric XSD datatype IRIs — see grammar.md §Numeric Datatype IRIs.
//
// The IntegerNumber side is fixed at xsd:integer (the family carries no
// datatype enum). The RealNumber side has three alternatives.
export const XsdNumericDatatypeIri = {
  integer: `${XSD}integer`,
  decimal: `${XSD}decimal`,
  float: `${XSD}float`,
  double: `${XSD}double`,
} as const;

// `RealNumberDatatypeKind` — the kinds carried by `RealNumberFieldSpec`.
// Excludes integer (which is its own family).
export type RealNumberDatatypeKind = 'decimal' | 'float' | 'double';

export const REAL_NUMBER_DATATYPE_KINDS: readonly RealNumberDatatypeKind[] =
  Object.freeze(['decimal', 'float', 'double']);

// Temporal XSD datatype IRIs — see grammar.md §Temporal Datatype IRIs.
export const XsdTemporalDatatypeIri = {
  date: `${XSD}date`,
  time: `${XSD}time`,
  dateTime: `${XSD}dateTime`,
} as const;

// Other commonly referenced datatype IRIs.
export const XsdStringDatatypeIri = `${XSD}string`;
export const XsdBooleanDatatypeIri = `${XSD}boolean`;
export const RdfLangStringDatatypeIri = `${RDF}langString`;
