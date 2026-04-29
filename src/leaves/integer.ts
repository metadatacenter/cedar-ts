import { CedarConstructionError } from './errors.js';

const INTEGER_REGEX = /^-?(?:0|[1-9]\d*)$/;

export function isIntegerLexicalForm(value: unknown): value is string {
  return typeof value === 'string' && INTEGER_REGEX.test(value);
}

export function parseIntegerLexicalForm(value: string): string {
  if (!isIntegerLexicalForm(value)) {
    throw new CedarConstructionError(
      `Invalid integer lexical form: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

export function tryParseIntegerLexicalForm(value: string): string | undefined {
  return isIntegerLexicalForm(value) ? value : undefined;
}

export function integerLexicalFormFromNumber(n: number): string {
  if (!Number.isInteger(n)) {
    throw new CedarConstructionError(
      `Cannot construct integer lexical form from non-integer number: ${n}`,
    );
  }
  return n.toString(10);
}

export function integerLexicalFormFromBigInt(n: bigint): string {
  return n.toString(10);
}
