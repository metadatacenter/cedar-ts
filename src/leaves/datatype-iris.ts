const XSD = 'http://www.w3.org/2001/XMLSchema#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

// Numeric XSD datatype IRIs — see grammar.md §Numeric Datatypes.
//
// Each of the four numeric families fixes its datatype: the family (and
// its value type) determines the IRI; no datatype enum is carried.
export const XsdNumericDatatypeIri = {
  integer: `${XSD}integer`,
  decimal: `${XSD}decimal`,
  float: `${XSD}float`,
  double: `${XSD}double`,
} as const;

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
