import {
  type FullDateLiteral,
  type TimeLiteral,
  type DateTimeLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
} from '../literals/index.js';
import { CedarConstructionError } from '../leaves/index.js';

// DateValue is one of:
//   YearValue       (plain string matching YYYY)
//   YearMonthValue  (plain string matching YYYY-MM)
//   FullDateValue   (carries an xsd:date typed literal)
//
// Constructors are permissive (accept any string); pattern conformance is
// checked by validate_date_value in Phase 2.

export interface YearValue {
  readonly kind: 'year_value';
  readonly value: string;
}

export function yearValue(value: string): YearValue {
  return { kind: 'year_value', value };
}

export interface YearMonthValue {
  readonly kind: 'year_month_value';
  readonly value: string;
}

export function yearMonthValue(value: string): YearMonthValue {
  return { kind: 'year_month_value', value };
}

export interface FullDateValue {
  readonly kind: 'full_date_value';
  readonly literal: FullDateLiteral;
}

// Accepts a FullDateLiteral or its lexical form directly (wrapped via
// fullDateLiteral). Lexical conformance to xsd:date is checked at validation,
// matching the behavior of fullDateLiteral itself.
export function fullDateValue(input: FullDateLiteral | string): FullDateValue {
  return {
    kind: 'full_date_value',
    literal: typeof input === 'string' ? fullDateLiteral(input) : input,
  };
}

export type DateValue = YearValue | YearMonthValue | FullDateValue;

// Lexical-shape discriminators for the three DateValue variants. These match
// the bare ISO 8601 forms used in everyday metadata; xsd:date's optional
// trailing time-zone designator is tolerated only on full dates (xsd:gYear and
// xsd:gYearMonth permit one too, but accepting tz suffixes there would make
// '2024' vs '2024-...' harder to discriminate cleanly — defer to validation).
const YEAR_RE = /^\d{4,}$/;
const YEAR_MONTH_RE = /^\d{4,}-\d{2}$/;
const FULL_DATE_RE = /^\d{4,}-\d{2}-\d{2}/;

// Smart DateValue constructor. Discriminates a string input by lexical shape:
//   'YYYY'         → YearValue       (xsd:gYear)
//   'YYYY-MM'      → YearMonthValue  (xsd:gYearMonth)
//   'YYYY-MM-DD…'  → FullDateValue   (xsd:date; trailing time zone tolerated)
// A pre-built DateValue passes through; a FullDateLiteral is wrapped as a
// FullDateValue. Lexical conformance to the chosen XSD datatype is checked
// at validation, matching the per-variant constructors.
export function dateValue(
  input: string | DateValue | FullDateLiteral,
): DateValue {
  if (typeof input === 'string') {
    if (FULL_DATE_RE.test(input)) return fullDateValue(input);
    if (YEAR_MONTH_RE.test(input)) return yearMonthValue(input);
    if (YEAR_RE.test(input)) return yearValue(input);
    throw new CedarConstructionError(
      `Cannot infer DateValue variant from ${JSON.stringify(input)}: ` +
        `expected 'YYYY', 'YYYY-MM', or 'YYYY-MM-DD'`,
    );
  }
  if (isDateValue(input)) return input;
  return fullDateValue(input);
}

export function isYearValue(x: unknown): x is YearValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'year_value'
  );
}
export function isYearMonthValue(x: unknown): x is YearMonthValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'year_month_value'
  );
}
export function isFullDateValue(x: unknown): x is FullDateValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'full_date_value'
  );
}
export function isDateValue(x: unknown): x is DateValue {
  return isYearValue(x) || isYearMonthValue(x) || isFullDateValue(x);
}

export interface TimeValue {
  readonly kind: 'time_value';
  readonly literal: TimeLiteral;
}

// Accepts a TimeLiteral or its lexical form directly. See fullDateValue.
export function timeValue(input: TimeLiteral | string): TimeValue {
  return {
    kind: 'time_value',
    literal: typeof input === 'string' ? timeLiteral(input) : input,
  };
}

export function isTimeValue(x: unknown): x is TimeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'time_value'
  );
}

export interface DateTimeValue {
  readonly kind: 'date_time_value';
  readonly literal: DateTimeLiteral;
}

// Accepts a DateTimeLiteral or its lexical form directly. See fullDateValue.
export function dateTimeValue(input: DateTimeLiteral | string): DateTimeValue {
  return {
    kind: 'date_time_value',
    literal: typeof input === 'string' ? dateTimeLiteral(input) : input,
  };
}

export function isDateTimeValue(x: unknown): x is DateTimeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'date_time_value'
  );
}
