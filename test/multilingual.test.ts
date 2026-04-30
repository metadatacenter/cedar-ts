import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  multilingualString,
  pickLang,
  pickLangValue,
  UNDETERMINED_LANG,
} from '../src/index.js';

describe('multilingualString constructor', () => {
  it('wraps a bare string with lang="und"', () => {
    const ms = multilingualString('Hello');
    expect(ms).toEqual([{ value: 'Hello', lang: UNDETERMINED_LANG }]);
  });

  it('accepts a two-arg (value, lang) form', () => {
    const ms = multilingualString('Hello', 'en');
    expect(ms).toEqual([{ value: 'Hello', lang: 'en' }]);
  });

  it('accepts an explicit {value, lang} object', () => {
    const ms = multilingualString({ value: 'Bonjour', lang: 'fr' });
    expect(ms).toEqual([{ value: 'Bonjour', lang: 'fr' }]);
  });

  it('accepts a {[lang]: value} map', () => {
    const ms = multilingualString({ en: 'Hello', fr: 'Bonjour' });
    expect(ms).toEqual([
      { value: 'Hello', lang: 'en' },
      { value: 'Bonjour', lang: 'fr' },
    ]);
  });

  it('accepts a [value, lang] tuple', () => {
    const ms = multilingualString(['Hola', 'es']);
    expect(ms).toEqual([{ value: 'Hola', lang: 'es' }]);
  });

  it('accepts an array of [value, lang] tuples', () => {
    const ms = multilingualString([
      ['Hello', 'en'],
      ['Bonjour', 'fr'],
      ['Hola', 'es'],
    ]);
    expect(ms).toEqual([
      { value: 'Hello', lang: 'en' },
      { value: 'Bonjour', lang: 'fr' },
      { value: 'Hola', lang: 'es' },
    ]);
  });

  it('accepts an array of {value, lang} entries', () => {
    const ms = multilingualString([
      { value: 'Hello', lang: 'en' },
      { value: 'Bonjour', lang: 'fr' },
    ]);
    expect(ms).toEqual([
      { value: 'Hello', lang: 'en' },
      { value: 'Bonjour', lang: 'fr' },
    ]);
  });

  it('throws on an empty array', () => {
    expect(() => multilingualString([])).toThrow(CedarConstructionError);
  });

  it('throws on an empty map', () => {
    expect(() => multilingualString({})).toThrow(CedarConstructionError);
  });

  it('throws on a duplicate lang tag', () => {
    expect(() =>
      multilingualString([
        { value: 'Hello', lang: 'en' },
        { value: 'Hi', lang: 'en' },
      ]),
    ).toThrow(CedarConstructionError);
  });

  it('throws on a duplicate lang tag (case-folded)', () => {
    expect(() =>
      multilingualString([
        { value: 'Hello', lang: 'en' },
        { value: 'HELLO', lang: 'EN' },
      ]),
    ).toThrow(CedarConstructionError);
  });

  it('throws on a malformed BCP 47 lang tag', () => {
    expect(() => multilingualString('Hello', 'not a tag!')).toThrow(
      CedarConstructionError,
    );
  });
});

describe('pickLang', () => {
  it('returns an exact match', () => {
    const ms = multilingualString({ en: 'Hello', fr: 'Bonjour' });
    expect(pickLang(ms, 'fr')).toEqual({ value: 'Bonjour', lang: 'fr' });
  });

  it('falls back to a truncated BCP 47 tag', () => {
    const ms = multilingualString({ en: 'Hello', fr: 'Bonjour' });
    expect(pickLang(ms, 'en-GB')).toEqual({ value: 'Hello', lang: 'en' });
  });

  it('falls back to "und" if no truncation matches', () => {
    const ms = multilingualString([
      { value: 'Hello', lang: 'en' },
      { value: 'fallback', lang: 'und' },
    ]);
    expect(pickLang(ms, 'de')).toEqual({ value: 'fallback', lang: 'und' });
  });

  it('falls back to the first entry if neither truncation nor "und" matches', () => {
    const ms = multilingualString({ en: 'Hello', fr: 'Bonjour' });
    expect(pickLang(ms, 'de')).toEqual({ value: 'Hello', lang: 'en' });
  });
});

describe('pickLangValue', () => {
  it('returns the value of the picked LangString', () => {
    const ms = multilingualString({ en: 'Hello', fr: 'Bonjour' });
    expect(pickLangValue(ms, 'fr')).toBe('Bonjour');
  });
});
