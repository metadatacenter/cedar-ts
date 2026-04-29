import { CedarConstructionError } from './errors.js';

const BCP47_REGEX =
  /^(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4}|[A-Za-z]{5,8})(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|[0-9]{3}))?(?:-(?:[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(?:-[0-9A-WY-Za-wy-z](?:-[A-Za-z0-9]{2,8})+)*(?:-x(?:-[A-Za-z0-9]{1,8})+)?$|^x(?:-[A-Za-z0-9]{1,8})+$/;

export function isBcp47Tag(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && BCP47_REGEX.test(value);
}

export function parseBcp47Tag(value: string): string {
  if (!isBcp47Tag(value)) {
    throw new CedarConstructionError(`Invalid BCP 47 language tag: ${JSON.stringify(value)}`);
  }
  return value;
}

export function tryParseBcp47Tag(value: string): string | undefined {
  return isBcp47Tag(value) ? value : undefined;
}
