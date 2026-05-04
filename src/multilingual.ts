import { CedarConstructionError, parseBcp47Tag } from './leaves/index.js';

// =====================================================================
// MultilingualString — language-tagged strings for human-facing schema
// metadata (template headers/footers, descriptive labels, etc.).
// =====================================================================
//
// A `MultilingualString` is a non-empty array of `LangString` entries,
// each pairing a textual value with a BCP 47 language tag. Within a
// single MultilingualString, language tags are unique: the type
// represents a set of localizations of one conceptual string, not
// multiple phrasings within the same language.
//
// Distinct from `LangTaggedLiteral` (RDF-style language-tagged literal,
// member of the `Literal` union): `MultilingualString` is an
// unweighted localization set carried at singleton schema-metadata
// positions (`Template.header`, `ArtifactMetadata.name`, etc.) and
// therefore has no `kind` discriminator. They serialize differently
// (`MultilingualString` is an array of `{value, lang}` entries; a
// LangTaggedLiteral is a single such entry).
//
// Wire form: an array of property-set objects.
//
//   [{ "value": "Hello", "lang": "en" }, { "value": "Bonjour", "lang": "fr" }]
//
// The constructor `multilingualString()` accepts several input shapes
// for ergonomics; see below. All shapes are normalised to the array
// form above.

// ---- Types ------------------------------------------------------------

export interface LangString {
  readonly value: string;
  readonly lang: string;
}

export type MultilingualString = readonly LangString[];

// BCP 47 "undetermined" subtag. Used as the default language when a
// caller supplies a bare string with no language information.
export const UNDETERMINED_LANG = 'und';

// ---- Input shapes accepted by multilingualString() --------------------
//
// String                     — single label with `lang` defaulted to 'und'.
// LangString                 — single explicit (value, lang) pair.
// [string, string]           — tuple shorthand for (value, lang).
// { [lang]: string }         — map from BCP 47 lang tag to value.
// LangString[]               — explicit array; idempotent passthrough.
// [string, string][]         — array of tuples.
//
// The map shorthand is the most common at call sites:
//   multilingualString({ en: 'Hello', fr: 'Bonjour' })

export type MultilingualStringInput =
  | string
  | LangString
  | LangStringTuple
  | MultilingualMap
  | readonly LangString[]
  | readonly LangStringTuple[];

// Helper aliases used in MultilingualStringInput.
export type LangStringTuple = readonly [value: string, lang: string];
export type MultilingualMap = { readonly [lang: string]: string };

// ---- Constructor -----------------------------------------------------

// Builds a non-empty, dedup-checked `MultilingualString` from any of
// the accepted input shapes. Each `lang` is BCP 47-validated. Throws on:
//   - an empty input collection
//   - an input shape that cannot be discriminated unambiguously
//   - any malformed `lang` tag
//   - any duplicate `lang` tag (case-folded comparison; tags MUST be
//     unique within one MultilingualString — see module header).
//
// Two convenience overloads admit a bare value/lang pair:
//   multilingualString('Hello')          // lang = 'und'
//   multilingualString('Hello', 'en')    // explicit lang
export function multilingualString(value: string): MultilingualString;
export function multilingualString(value: string, lang: string): MultilingualString;
export function multilingualString(input: MultilingualStringInput): MultilingualString;
export function multilingualString(
  arg1: MultilingualStringInput,
  arg2?: string,
): MultilingualString {
  // Two-argument form: (value, lang).
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    return finalize([{ value: arg1, lang: arg2 }]);
  }
  // Bare string: defaults to UNDETERMINED_LANG.
  if (typeof arg1 === 'string') {
    return finalize([{ value: arg1, lang: UNDETERMINED_LANG }]);
  }
  if (Array.isArray(arg1)) {
    if (arg1.length === 0) {
      throw new CedarConstructionError('MultilingualString must be non-empty');
    }
    // Tuple form `[value, lang]` (length-2 array of strings) vs an
    // entry array `[entry, ...]`.
    if (
      arg1.length === 2 &&
      typeof arg1[0] === 'string' &&
      typeof arg1[1] === 'string'
    ) {
      return finalize([{ value: arg1[0], lang: arg1[1] }]);
    }
    return finalize(arg1.map(toLangString));
  }
  // Object — either a single LangString or a {lang: value} map.
  if (typeof arg1 === 'object' && arg1 !== null) {
    if (isLangStringShape(arg1)) {
      return finalize([{ value: arg1.value, lang: arg1.lang }]);
    }
    const entries: LangString[] = [];
    for (const [lang, value] of Object.entries(arg1)) {
      if (typeof value !== 'string') {
        throw new CedarConstructionError(
          `MultilingualString map values must be strings; got ${typeof value} at key ${JSON.stringify(lang)}`,
        );
      }
      entries.push({ value, lang });
    }
    if (entries.length === 0) {
      throw new CedarConstructionError('MultilingualString must be non-empty');
    }
    return finalize(entries);
  }
  throw new CedarConstructionError(
    `Unrecognised input shape for multilingualString(): ${typeof arg1}`,
  );
}

// Normalises and validates a list of LangString entries. Validates each
// `lang` against BCP 47 and asserts uniqueness (case-folded).
function finalize(entries: readonly LangString[]): MultilingualString {
  const out: LangString[] = [];
  const seen = new Set<string>();
  for (const e of entries) {
    if (typeof e.value !== 'string') {
      throw new CedarConstructionError(
        `LangString.value must be a string; got ${typeof e.value}`,
      );
    }
    const lang = parseBcp47Tag(e.lang);
    const key = lang.toLowerCase();
    if (seen.has(key)) {
      throw new CedarConstructionError(
        `Duplicate lang tag in MultilingualString: ${JSON.stringify(lang)}`,
      );
    }
    seen.add(key);
    out.push({ value: e.value, lang });
  }
  return Object.freeze(out);
}

function toLangString(x: unknown): LangString {
  if (Array.isArray(x) && x.length === 2 && typeof x[0] === 'string' && typeof x[1] === 'string') {
    return { value: x[0], lang: x[1] };
  }
  if (isLangStringShape(x)) {
    return { value: x.value, lang: x.lang };
  }
  throw new CedarConstructionError(
    'MultilingualString entry must be a {value, lang} object or a [value, lang] tuple',
  );
}

function isLangStringShape(x: unknown): x is LangString {
  return (
    typeof x === 'object' && x !== null &&
    typeof (x as { value?: unknown }).value === 'string' &&
    typeof (x as { lang?: unknown }).lang === 'string'
  );
}

// ---- Selection -------------------------------------------------------

// Picks the best LangString entry from `ms` for the requested language
// using the RFC 4647 "lookup" fallback strategy:
//   1. exact match on `lang`
//   2. progressively-truncated BCP 47 fallbacks (e.g. 'en-GB' → 'en')
//   3. a `'und'` (undetermined) entry, if present
//   4. the first entry of `ms`
//
// Always returns a `LangString` because `MultilingualString` is
// guaranteed non-empty.
export function pickLang(ms: MultilingualString, lang: string): LangString {
  const target = lang.toLowerCase();
  for (const e of ms) {
    if (e.lang.toLowerCase() === target) return e;
  }
  // Truncate progressively at hyphens.
  let cursor = target;
  while (cursor.includes('-')) {
    cursor = cursor.substring(0, cursor.lastIndexOf('-'));
    for (const e of ms) {
      if (e.lang.toLowerCase() === cursor) return e;
    }
  }
  for (const e of ms) {
    if (e.lang.toLowerCase() === UNDETERMINED_LANG) return e;
  }
  return ms[0]!;
}

// ---- Convenience -----------------------------------------------------

// Returns the `value` of `pickLang(ms, lang)` — the common case at
// rendering time.
export function pickLangValue(ms: MultilingualString, lang: string): string {
  return pickLang(ms, lang).value;
}
