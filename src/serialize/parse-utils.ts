// =====================================================================
// parse-utils — small private helpers used by the per-type parsers.
// =====================================================================
//
// These keep the per-type parsers concise and ensure consistent error
// messages across the parse layer. All shape failures throw
// CedarConstructionError with a clear, position-tagged message.

import { CedarConstructionError } from '../leaves/index.js';

// JSON-compatible value alias — the type of `serialize()` return values
// and the `parse()` input.
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [k: string]: JsonValue };

// A loose object record we can index into during parse without losing the
// `unknown` element type. `expectObject` returns this shape.
export type JsonObject = { readonly [k: string]: unknown };

// Asserts `x` is a plain JSON object (not null, not an array). The `where`
// argument names the production for error reporting.
export function expectObject(x: unknown, where: string): JsonObject {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) {
    throw new CedarConstructionError(
      `Expected ${where} to be an object; got ${describe(x)}`,
    );
  }
  return x as JsonObject;
}

// Asserts the object's `kind` property equals `expected`.
export function expectKind(o: JsonObject, expected: string): void {
  const k = o['kind'];
  if (k !== expected) {
    throw new CedarConstructionError(
      `Expected kind ${JSON.stringify(expected)}; got ${describe(k)}`,
    );
  }
}

// Asserts the object's `kind` is one of the given values, returning that
// kind. Useful for parsing union members where the parser dispatches by
// kind.
export function expectKindOneOf<K extends string>(
  o: JsonObject,
  allowed: readonly K[],
  where: string,
): K {
  const k = o['kind'];
  if (typeof k !== 'string' || !(allowed as readonly string[]).includes(k)) {
    throw new CedarConstructionError(
      `Expected kind in {${allowed.map((x) => JSON.stringify(x)).join(', ')}} for ${where}; got ${describe(k)}`,
    );
  }
  return k as K;
}

// Asserts every property of `o` is in `allowed`. Properties starting with
// `_` or `$` are tolerated per serialization.md §4.7. Reports the first
// unknown property by name.
export function expectKnownProperties(
  o: JsonObject,
  allowed: readonly string[],
): void {
  const allowedSet = new Set(allowed);
  for (const k of Object.keys(o)) {
    if (k.startsWith('_') || k.startsWith('$')) continue;
    if (!allowedSet.has(k)) {
      throw new CedarConstructionError(
        `Unknown property ${JSON.stringify(k)}; allowed: {${allowed.map((x) => JSON.stringify(x)).join(', ')}}`,
      );
    }
  }
}

// Asserts `o[key]` is not present as JSON `null`. Per serialization.md
// §4.2, an absent optional MUST be omitted, never serialised as `null`.
// This is meant to be called before reading optional properties.
export function rejectNullProperty(o: JsonObject, key: string): void {
  if (key in o && o[key] === null) {
    throw new CedarConstructionError(
      `Property ${JSON.stringify(key)} MUST be omitted when absent (got null)`,
    );
  }
}

// Asserts `x` is a string, returning it. `where` names the production /
// position in the error.
export function expectString(x: unknown, where: string): string {
  if (typeof x !== 'string') {
    throw new CedarConstructionError(
      `Expected ${where} to be a string; got ${describe(x)}`,
    );
  }
  return x;
}

// Asserts `x` is a finite JSON number, returning it.
export function expectNumber(x: unknown, where: string): number {
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new CedarConstructionError(
      `Expected ${where} to be a number; got ${describe(x)}`,
    );
  }
  return x;
}

// Asserts `x` is a JSON array, returning it.
export function expectArray(x: unknown, where: string): readonly unknown[] {
  if (!Array.isArray(x)) {
    throw new CedarConstructionError(
      `Expected ${where} to be an array; got ${describe(x)}`,
    );
  }
  return x;
}

// Asserts `x` is a non-empty JSON array, returning it.
export function expectNonEmptyArray(
  x: unknown,
  where: string,
): readonly unknown[] {
  const a = expectArray(x, where);
  if (a.length === 0) {
    throw new CedarConstructionError(
      `Expected ${where} to be a non-empty array`,
    );
  }
  return a;
}

// Asserts `x` is one of the given string-literal values.
export function expectStringEnum<T extends string>(
  x: unknown,
  allowed: readonly T[],
  where: string,
): T {
  const s = expectString(x, where);
  if (!(allowed as readonly string[]).includes(s)) {
    throw new CedarConstructionError(
      `Expected ${where} to be one of {${allowed.map((v) => JSON.stringify(v)).join(', ')}}; got ${JSON.stringify(s)}`,
    );
  }
  return s as T;
}

// Asserts `x` is the literal JSON value `true` (used for the
// `default: true` choice-option marker — `false` is not a valid wire form).
export function expectTrue(x: unknown, where: string): true {
  if (x !== true) {
    throw new CedarConstructionError(
      `Expected ${where} to be JSON true; got ${describe(x)}`,
    );
  }
  return true;
}

// Pretty-printer for error messages. Avoids the noise of `Object Object`
// for objects, and surfaces null / undefined / array clearly.
function describe(x: unknown): string {
  if (x === null) return 'null';
  if (x === undefined) return 'undefined';
  if (Array.isArray(x)) return 'array';
  if (typeof x === 'object') return 'object';
  return JSON.stringify(x);
}
