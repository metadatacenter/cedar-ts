import { XsdTemporalDatatypeIri } from '../leaves/index.js';
import { type TypedLiteral, typedLiteral, isTypedLiteral } from './base.js';

// FullDateLiteral / TimeLiteral / DateTimeLiteral are TypedLiterals whose
// `datatype` IRI is fixed to xsd:date, xsd:time, or xsd:dateTime
// respectively. They are type aliases rather than separate runtime types:
// each has the same shape and same `kind: 'TypedLiteral'` discriminator as
// any other TypedLiteral. The fixed-datatype constraint is enforced at
// construction (via the per-family constructors below) and queried at
// runtime (via the per-family predicates).
//
// At singleton positions like `FullDateValue.literal`, the wire form may
// elide `datatype` per the position-discrimination rule (see
// wire-grammar.md §4 and serialization.md §4.4).

export const FULL_DATE_DATATYPE_IRI = XsdTemporalDatatypeIri.date;
export const TIME_DATATYPE_IRI = XsdTemporalDatatypeIri.time;
export const DATE_TIME_DATATYPE_IRI = XsdTemporalDatatypeIri.dateTime;

export type FullDateLiteral = TypedLiteral;
export type TimeLiteral = TypedLiteral;
export type DateTimeLiteral = TypedLiteral;
export type TemporalLiteral = TypedLiteral;

export function fullDateLiteral(lexicalForm: string): FullDateLiteral {
  return typedLiteral(lexicalForm, FULL_DATE_DATATYPE_IRI);
}

export function timeLiteral(lexicalForm: string): TimeLiteral {
  return typedLiteral(lexicalForm, TIME_DATATYPE_IRI);
}

export function dateTimeLiteral(lexicalForm: string): DateTimeLiteral {
  return typedLiteral(lexicalForm, DATE_TIME_DATATYPE_IRI);
}

export function isFullDateLiteral(x: unknown): x is FullDateLiteral {
  return isTypedLiteral(x) && x.datatype.value === FULL_DATE_DATATYPE_IRI;
}

export function isTimeLiteral(x: unknown): x is TimeLiteral {
  return isTypedLiteral(x) && x.datatype.value === TIME_DATATYPE_IRI;
}

export function isDateTimeLiteral(x: unknown): x is DateTimeLiteral {
  return isTypedLiteral(x) && x.datatype.value === DATE_TIME_DATATYPE_IRI;
}

export function isTemporalLiteral(x: unknown): x is TemporalLiteral {
  return isFullDateLiteral(x) || isTimeLiteral(x) || isDateTimeLiteral(x);
}
