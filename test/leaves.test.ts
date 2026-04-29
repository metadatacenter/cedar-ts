import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  isAsciiIdentifier,
  isBcp47Tag,
  isIntegerLexicalForm,
  isIriString,
  isIso8601DateTimeLexicalForm,
  isSemanticVersion,
  isXsdDateLexicalForm,
  isXsdTimeLexicalForm,
  iri,
  isoDateTimeStamp,
  keyIdentifier,
  languageTag,
  nonNegativeInteger,
  nonNegativeIntegerToNumber,
  parseAsciiIdentifier,
  parseIriString,
  parseSemanticVersion,
  XsdNumericDatatypeIri,
  XsdStringDatatypeIri,
  XsdTemporalDatatypeIri,
  RdfLangStringDatatypeIri,
} from '../src/index.js';

describe('IriString', () => {
  it('accepts well-formed IRIs', () => {
    expect(isIriString('https://example.org/foo')).toBe(true);
    expect(isIriString('urn:uuid:1234')).toBe(true);
    expect(isIriString('http://www.w3.org/2001/XMLSchema#integer')).toBe(true);
  });

  it('rejects malformed values', () => {
    expect(isIriString('')).toBe(false);
    expect(isIriString('not an iri')).toBe(false);
    expect(isIriString('http://exa mple.org')).toBe(false);
    expect(isIriString(123)).toBe(false);
  });

  it('parseIriString throws on invalid input', () => {
    expect(() => parseIriString('not-an-iri')).toThrow(CedarConstructionError);
  });
});

describe('Bcp47Tag', () => {
  it('accepts common language tags', () => {
    expect(isBcp47Tag('en')).toBe(true);
    expect(isBcp47Tag('en-US')).toBe(true);
    expect(isBcp47Tag('zh-Hant-TW')).toBe(true);
    expect(isBcp47Tag('de-CH-1996')).toBe(true);
  });

  it('rejects malformed tags', () => {
    expect(isBcp47Tag('')).toBe(false);
    expect(isBcp47Tag('1')).toBe(false);
    expect(isBcp47Tag('en_US')).toBe(false);
  });
});

describe('AsciiIdentifier', () => {
  it('matches the EmbeddedArtifactKey pattern', () => {
    expect(isAsciiIdentifier('title')).toBe(true);
    expect(isAsciiIdentifier('study_arm-1')).toBe(true);
    expect(isAsciiIdentifier('A0_-')).toBe(true);
  });

  it('rejects identifiers that do not start with a letter or contain whitespace', () => {
    expect(isAsciiIdentifier('1abc')).toBe(false);
    expect(isAsciiIdentifier('_abc')).toBe(false);
    expect(isAsciiIdentifier('with space')).toBe(false);
    expect(isAsciiIdentifier('')).toBe(false);
  });

  it('parseAsciiIdentifier throws on invalid input', () => {
    expect(() => parseAsciiIdentifier('1abc')).toThrow(CedarConstructionError);
  });
});

describe('SemanticVersion', () => {
  it('accepts valid semver', () => {
    expect(isSemanticVersion('0.1.0')).toBe(true);
    expect(isSemanticVersion('1.2.3-alpha.1')).toBe(true);
    expect(isSemanticVersion('1.0.0+build.5')).toBe(true);
    expect(isSemanticVersion('1.0.0-rc.1+build.7')).toBe(true);
  });

  it('rejects malformed versions', () => {
    expect(isSemanticVersion('1.0')).toBe(false);
    expect(isSemanticVersion('01.0.0')).toBe(false);
    expect(isSemanticVersion('1.0.0.0')).toBe(false);
    expect(isSemanticVersion('v1.0.0')).toBe(false);
  });

  it('parseSemanticVersion brands valid input', () => {
    const v = parseSemanticVersion('2.0.0');
    expect(v).toBe('2.0.0');
  });
});

describe('Iso8601DateTimeLexicalForm', () => {
  it('accepts xsd:dateTime forms', () => {
    expect(isIso8601DateTimeLexicalForm('2024-06-15T10:30:00')).toBe(true);
    expect(isIso8601DateTimeLexicalForm('2024-06-15T10:30:00Z')).toBe(true);
    expect(isIso8601DateTimeLexicalForm('2024-06-15T10:30:00.123+02:00')).toBe(true);
  });

  it('rejects malformed forms', () => {
    expect(isIso8601DateTimeLexicalForm('2024-06-15')).toBe(false);
    expect(isIso8601DateTimeLexicalForm('10:30:00')).toBe(false);
    expect(isIso8601DateTimeLexicalForm('2024-13-01T00:00:00')).toBe(false);
  });
});

describe('xsd:date and xsd:time lexical forms', () => {
  it('isXsdDateLexicalForm', () => {
    expect(isXsdDateLexicalForm('2024-06-15')).toBe(true);
    expect(isXsdDateLexicalForm('2024-06-15Z')).toBe(true);
    expect(isXsdDateLexicalForm('2024-06-15+02:00')).toBe(true);
    expect(isXsdDateLexicalForm('2024-13-01')).toBe(false);
    expect(isXsdDateLexicalForm('not a date')).toBe(false);
  });

  it('isXsdTimeLexicalForm', () => {
    expect(isXsdTimeLexicalForm('10:30:00')).toBe(true);
    expect(isXsdTimeLexicalForm('10:30:00.123')).toBe(true);
    expect(isXsdTimeLexicalForm('23:59:59Z')).toBe(true);
    expect(isXsdTimeLexicalForm('25:00:00')).toBe(false);
    expect(isXsdTimeLexicalForm('not a time')).toBe(false);
  });
});

describe('IntegerLexicalForm', () => {
  it('accepts canonical integer forms', () => {
    expect(isIntegerLexicalForm('0')).toBe(true);
    expect(isIntegerLexicalForm('42')).toBe(true);
    expect(isIntegerLexicalForm('-7')).toBe(true);
  });

  it('rejects non-canonical or malformed forms', () => {
    expect(isIntegerLexicalForm('00')).toBe(false);
    expect(isIntegerLexicalForm('+1')).toBe(false);
    expect(isIntegerLexicalForm('1.0')).toBe(false);
    expect(isIntegerLexicalForm('')).toBe(false);
  });
});

describe('Iri wrapper', () => {
  it('constructs from a valid string', () => {
    const x = iri('https://example.org/foo');
    expect(x.kind).toBe('iri');
    expect(x.value).toBe('https://example.org/foo');
  });

  it('throws on a malformed string', () => {
    expect(() => iri('nope')).toThrow(CedarConstructionError);
  });
});

describe('LanguageTag wrapper', () => {
  it('constructs from a valid tag', () => {
    const t = languageTag('en-US');
    expect(t.kind).toBe('language_tag');
    expect(t.value).toBe('en-US');
  });
});

describe('IsoDateTimeStamp wrapper', () => {
  it('constructs from a valid xsd:dateTime', () => {
    const ts = isoDateTimeStamp('2024-06-15T10:30:00Z');
    expect(ts.kind).toBe('iso_date_time_stamp');
    expect(ts.value).toBe('2024-06-15T10:30:00Z');
  });
});

describe('NonNegativeInteger wrapper', () => {
  it('accepts non-negative numbers', () => {
    const n = nonNegativeInteger(0);
    expect(n.value).toBe('0');
    expect(nonNegativeIntegerToNumber(n)).toBe(0);

    const m = nonNegativeInteger(42);
    expect(m.value).toBe('42');
  });

  it('accepts non-negative bigints', () => {
    const n = nonNegativeInteger(123456789012345678901234567890n);
    expect(n.value).toBe('123456789012345678901234567890');
  });

  it('accepts well-formed lexical strings', () => {
    expect(nonNegativeInteger('7').value).toBe('7');
  });

  it('rejects negative or malformed input', () => {
    expect(() => nonNegativeInteger(-1)).toThrow(CedarConstructionError);
    expect(() => nonNegativeInteger(1.5)).toThrow(CedarConstructionError);
    expect(() => nonNegativeInteger(-1n)).toThrow(CedarConstructionError);
    expect(() => nonNegativeInteger('-3')).toThrow(CedarConstructionError);
    expect(() => nonNegativeInteger('07')).toThrow(CedarConstructionError);
  });
});

describe('KeyIdentifier wrapper', () => {
  it('constructs from a valid identifier', () => {
    const k = keyIdentifier('study_arm');
    expect(k.kind).toBe('key_identifier');
    expect(k.value).toBe('study_arm');
  });

  it('rejects invalid identifiers', () => {
    expect(() => keyIdentifier('1bad')).toThrow(CedarConstructionError);
  });
});

describe('XSD datatype IRI constants', () => {
  it('numeric IRIs use the canonical XSD prefix', () => {
    expect(XsdNumericDatatypeIri.integer).toBe(
      'http://www.w3.org/2001/XMLSchema#integer',
    );
    expect(XsdNumericDatatypeIri.decimal).toBe(
      'http://www.w3.org/2001/XMLSchema#decimal',
    );
  });

  it('temporal IRIs use the canonical XSD prefix', () => {
    expect(XsdTemporalDatatypeIri.date).toBe('http://www.w3.org/2001/XMLSchema#date');
    expect(XsdTemporalDatatypeIri.time).toBe('http://www.w3.org/2001/XMLSchema#time');
    expect(XsdTemporalDatatypeIri.dateTime).toBe(
      'http://www.w3.org/2001/XMLSchema#dateTime',
    );
  });

  it('string and langString IRIs are exposed', () => {
    expect(XsdStringDatatypeIri).toBe('http://www.w3.org/2001/XMLSchema#string');
    expect(RdfLangStringDatatypeIri).toBe(
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString',
    );
  });
});
