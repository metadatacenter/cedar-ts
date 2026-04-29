const XSD = 'http://www.w3.org/2001/XMLSchema#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';

// Numeric XSD datatype IRIs — see grammar.md §Numeric Datatype IRIs.
export const XsdNumericDatatypeIri = {
  integer: `${XSD}integer`,
  decimal: `${XSD}decimal`,
  float: `${XSD}float`,
  double: `${XSD}double`,
  long: `${XSD}long`,
  int: `${XSD}int`,
  short: `${XSD}short`,
  byte: `${XSD}byte`,
  nonNegativeInteger: `${XSD}nonNegativeInteger`,
  positiveInteger: `${XSD}positiveInteger`,
  nonPositiveInteger: `${XSD}nonPositiveInteger`,
  negativeInteger: `${XSD}negativeInteger`,
  unsignedLong: `${XSD}unsignedLong`,
  unsignedInt: `${XSD}unsignedInt`,
  unsignedShort: `${XSD}unsignedShort`,
  unsignedByte: `${XSD}unsignedByte`,
} as const;

export type NumericDatatypeKind = keyof typeof XsdNumericDatatypeIri;

export const NUMERIC_DATATYPE_KINDS: readonly NumericDatatypeKind[] = Object.freeze([
  'integer',
  'decimal',
  'float',
  'double',
  'long',
  'int',
  'short',
  'byte',
  'nonNegativeInteger',
  'positiveInteger',
  'nonPositiveInteger',
  'negativeInteger',
  'unsignedLong',
  'unsignedInt',
  'unsignedShort',
  'unsignedByte',
]);

// Temporal XSD datatype IRIs — see grammar.md §Temporal Datatype IRIs.
export const XsdTemporalDatatypeIri = {
  date: `${XSD}date`,
  time: `${XSD}time`,
  dateTime: `${XSD}dateTime`,
} as const;

// Other commonly referenced datatype IRIs.
export const XsdStringDatatypeIri = `${XSD}string`;
export const RdfLangStringDatatypeIri = `${RDF}langString`;
