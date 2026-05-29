// =====================================================================
// Conformance — round-trip every valid fixture from the structural spec
// (cedar-structural-spec/spec/normative-tests/valid/).
//
// For each fixture file:
//   1. Read the JSON.
//   2. Parse with the generic `parseArtifact` (dispatches by kind).
//   3. Serialize back to JSON.
//   4. Assert the output equals the input under §7 round-trip equivalence
//      (object property order and whitespace not significant — JSON
//      structural equality via Vitest's `toEqual`).
// =====================================================================

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArtifact, serialize } from '../src/index.js';

const FIXTURE_DIR = join(
  __dirname,
  '..',
  '..',
  'cedar-structural-spec',
  'spec',
  'normative-tests',
  'valid',
);

function readFixtures(): { name: string; path: string }[] {
  let entries: string[];
  try {
    entries = readdirSync(FIXTURE_DIR);
  } catch {
    // The spec sibling repo is not present — skip.
    return [];
  }
  // Fixtures that exercise spec slots cedar-ts has not yet implemented.
  // Each entry should be removed when its blocking issue is implemented
  // here.
  const SKIP: ReadonlySet<string> = new Set([
    // issue #13 — RecommendedProperty slot on Field (cedar-ts pending).
    '100-text-field-with-recommended-property.json',
  ]);
  return entries
    .filter((e) => e.endsWith('.json'))
    .filter((e) => !SKIP.has(e))
    .sort()
    .map((e) => ({ name: e, path: join(FIXTURE_DIR, e) }));
}

const fixtures = readFixtures();

describe('Conformance — valid fixture round-trip', () => {
  if (fixtures.length === 0) {
    it.skip('cedar-structural-spec/normative-tests/valid not present — skipping', () => {});
    return;
  }

  it.each(fixtures)('$name', ({ path }) => {
    const raw = readFileSync(path, 'utf8');
    const input = JSON.parse(raw);
    const decoded = parseArtifact(input);
    const reEncoded = serialize(decoded);
    expect(reEncoded).toEqual(input);
  });
});
