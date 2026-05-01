import { CedarConstructionError } from './cedar-construction-error.js';

const ASCII_IDENTIFIER_REGEX = /^[A-Za-z][A-Za-z0-9_-]*$/;

export function isAsciiIdentifier(value: unknown): value is string {
  return typeof value === 'string' && ASCII_IDENTIFIER_REGEX.test(value);
}

export function parseAsciiIdentifier(value: string): string {
  if (!isAsciiIdentifier(value)) {
    throw new CedarConstructionError(
      `Invalid ASCII identifier (must match [A-Za-z][A-Za-z0-9_-]*): ${JSON.stringify(value)}`,
    );
  }
  return value;
}

export function tryParseAsciiIdentifier(value: string): string | undefined {
  return isAsciiIdentifier(value) ? value : undefined;
}
