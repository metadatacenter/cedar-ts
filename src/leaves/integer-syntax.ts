import { CedarConstructionError } from './cedar-construction-error.js';

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

// Validates that `n` is a finite, non-negative JavaScript integer and returns
// it unchanged. Used at construction sites where the grammar requires a
// NonNegativeInteger (cardinality bounds, length bounds, traversal depth).
export function assertNonNegativeInteger(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new CedarConstructionError(
      `Expected a non-negative integer; got ${n}`,
    );
  }
  return n;
}
