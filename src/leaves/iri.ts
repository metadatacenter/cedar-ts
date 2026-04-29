import { CedarConstructionError } from './errors.js';

const IRI_REGEX = /^[A-Za-z][A-Za-z0-9+.\-]*:[^\s<>"{}|\\^`]*$/;

export function isIriString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && IRI_REGEX.test(value);
}

export function parseIriString(value: string): string {
  if (!isIriString(value)) {
    throw new CedarConstructionError(`Invalid IRI: ${JSON.stringify(value)}`);
  }
  return value;
}

export function tryParseIriString(value: string): string | undefined {
  return isIriString(value) ? value : undefined;
}
