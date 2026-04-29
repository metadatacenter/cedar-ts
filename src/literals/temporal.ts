import { XsdTemporalDatatypeIri } from '../leaves/index.js';

// Each temporal literal carries an implicit XSD datatype IRI fixed by its kind:
//   FullDateLiteral  -> xsd:date
//   TimeLiteral      -> xsd:time
//   DateTimeLiteral  -> xsd:dateTime
// The grammar permits ill-typed literals; constructors do not validate the
// lexical form against the datatype's lexical space. Validation is deferred
// to the canonical validation algorithm (Phase 2).

export interface FullDateLiteral {
  readonly kind: 'full_date_literal';
  readonly lexicalForm: string;
}

export function fullDateLiteral(lexicalForm: string): FullDateLiteral {
  return { kind: 'full_date_literal', lexicalForm };
}

export interface TimeLiteral {
  readonly kind: 'time_literal';
  readonly lexicalForm: string;
}

export function timeLiteral(lexicalForm: string): TimeLiteral {
  return { kind: 'time_literal', lexicalForm };
}

export interface DateTimeLiteral {
  readonly kind: 'date_time_literal';
  readonly lexicalForm: string;
}

export function dateTimeLiteral(lexicalForm: string): DateTimeLiteral {
  return { kind: 'date_time_literal', lexicalForm };
}

export type TemporalLiteral = FullDateLiteral | TimeLiteral | DateTimeLiteral;

export const FULL_DATE_DATATYPE_IRI = XsdTemporalDatatypeIri.date;
export const TIME_DATATYPE_IRI = XsdTemporalDatatypeIri.time;
export const DATE_TIME_DATATYPE_IRI = XsdTemporalDatatypeIri.dateTime;

export function isFullDateLiteral(x: unknown): x is FullDateLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'full_date_literal'
  );
}
export function isTimeLiteral(x: unknown): x is TimeLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'time_literal'
  );
}
export function isDateTimeLiteral(x: unknown): x is DateTimeLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'date_time_literal'
  );
}
export function isTemporalLiteral(x: unknown): x is TemporalLiteral {
  return isFullDateLiteral(x) || isTimeLiteral(x) || isDateTimeLiteral(x);
}
