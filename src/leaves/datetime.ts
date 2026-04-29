import { CedarConstructionError } from './errors.js';

// xsd:dateTime lexical form (subset of ISO 8601):
//   YYYY-MM-DDThh:mm:ss(.fraction)?(Z | [+-]HH:MM)?
const ISO_DATETIME_REGEX =
  /^-?\d{4,}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

export function isIso8601DateTimeLexicalForm(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATETIME_REGEX.test(value);
}

export function parseIso8601DateTimeLexicalForm(value: string): string {
  if (!isIso8601DateTimeLexicalForm(value)) {
    throw new CedarConstructionError(
      `Invalid ISO 8601 date-time lexical form: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

export function tryParseIso8601DateTimeLexicalForm(value: string): string | undefined {
  return isIso8601DateTimeLexicalForm(value) ? value : undefined;
}

// xsd:date lexical form: YYYY-MM-DD with optional timezone designator.
const ISO_DATE_REGEX =
  /^-?\d{4,}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

export function isXsdDateLexicalForm(value: string): boolean {
  return ISO_DATE_REGEX.test(value);
}

// xsd:time lexical form: hh:mm:ss(.fraction)? with optional timezone designator.
const ISO_TIME_REGEX =
  /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

export function isXsdTimeLexicalForm(value: string): boolean {
  return ISO_TIME_REGEX.test(value);
}
