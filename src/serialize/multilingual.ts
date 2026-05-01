// =====================================================================
// multilingual — wire-form serialize/parse for MultilingualString and
// LangString.
// =====================================================================
//
// Wire form: a non-empty JSON array of `{value, lang}` objects. Already
// matches the in-memory representation; the parser only validates and
// canonicalises through the constructor (which enforces non-empty,
// BCP 47-tag, uniqueness invariants).

import {
  type LangString,
  type MultilingualString,
  multilingualString,
} from '../multilingual.js';
import {
  expectObject,
  expectArray,
  expectString,
  expectKnownProperties,
} from './parse-utils.js';

export function serializeLangString(x: LangString): { value: string; lang: string } {
  return { value: x.value, lang: x.lang };
}

export function serializeMultilingualString(
  x: MultilingualString,
): { value: string; lang: string }[] {
  return x.map(serializeLangString);
}

export function parseLangString(x: unknown, where = 'LangString'): LangString {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'lang']);
  return {
    value: expectString(o['value'], `${where}.value`),
    lang: expectString(o['lang'], `${where}.lang`),
  };
}

export function parseMultilingualString(
  x: unknown,
  where = 'MultilingualString',
): MultilingualString {
  const a = expectArray(x, where);
  const entries = a.map((e, i) => parseLangString(e, `${where}[${i}]`));
  // multilingualString() validates non-emptiness, BCP 47, and uniqueness.
  return multilingualString(entries);
}
