import { CedarConstructionError } from './errors.js';

// Semantic Versioning 2.0.0 — https://semver.org
// MAJOR.MINOR.PATCH with optional pre-release and build metadata.
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function isSemanticVersion(value: unknown): value is string {
  return typeof value === 'string' && SEMVER_REGEX.test(value);
}

export function parseSemanticVersion(value: string): string {
  if (!isSemanticVersion(value)) {
    throw new CedarConstructionError(
      `Invalid Semantic Version 2.0.0 string: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

export function tryParseSemanticVersion(value: string): string | undefined {
  return isSemanticVersion(value) ? value : undefined;
}
