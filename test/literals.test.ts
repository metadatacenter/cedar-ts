import { describe, expect, it } from 'vitest';
import {
  datatypeIriLiteral,
  langStringLiteral,
  stringLiteral,
  stringLiteralToDatatypeIriLiteral,
  literalsTermEqual,
  isStringLiteral,
  isLangStringLiteral,
  isDatatypeIriLiteral,
  isTextLiteral,
  isLiteral,
  numericLiteral,
  numericLiteralDatatypeIri,
  numericLiteralToNumber,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  isFullDateLiteral,
  isTimeLiteral,
  isDateTimeLiteral,
  isTemporalLiteral,
  XsdStringDatatypeIri,
  XsdNumericDatatypeIri,
  XsdTemporalDatatypeIri,
} from '../src/index.js';

describe('StringLiteral', () => {
  it('is constructed from a plain string', () => {
    const s = stringLiteral('hello');
    expect(s.kind).toBe('StringLiteral');
    expect(s.lexicalForm).toBe('hello');
    expect(isStringLiteral(s)).toBe(true);
    expect(isTextLiteral(s)).toBe(true);
  });

  it('converts to a DatatypeIriLiteral with xsd:string', () => {
    const s = stringLiteral('x');
    const dt = stringLiteralToDatatypeIriLiteral(s);
    expect(dt.kind).toBe('DatatypeIriLiteral');
    expect(dt.lexicalForm).toBe('x');
    expect(dt.datatype.value).toBe(XsdStringDatatypeIri);
  });
});

describe('LangStringLiteral', () => {
  it('is constructed from a lexical form and language tag', () => {
    const ls = langStringLiteral('hello', 'en-US');
    expect(ls.kind).toBe('LangStringLiteral');
    expect(ls.lexicalForm).toBe('hello');
    expect(ls.lang.value).toBe('en-US');
    expect(isLangStringLiteral(ls)).toBe(true);
    expect(isTextLiteral(ls)).toBe(true);
    expect(isLiteral(ls)).toBe(true);
  });
});

describe('DatatypeIriLiteral', () => {
  it('is constructed with an explicit datatype IRI', () => {
    const lit = datatypeIriLiteral('42', 'http://www.w3.org/2001/XMLSchema#integer');
    expect(lit.kind).toBe('DatatypeIriLiteral');
    expect(lit.lexicalForm).toBe('42');
    expect(lit.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#integer');
    expect(isDatatypeIriLiteral(lit)).toBe(true);
    expect(isLiteral(lit)).toBe(true);
  });
});

describe('literalsTermEqual', () => {
  it('compares two LangStringLiterals on lexical form and language tag', () => {
    const a = langStringLiteral('hi', 'en');
    const b = langStringLiteral('hi', 'en');
    const c = langStringLiteral('hi', 'fr');
    const d = langStringLiteral('hello', 'en');
    expect(literalsTermEqual(a, b)).toBe(true);
    expect(literalsTermEqual(a, c)).toBe(false);
    expect(literalsTermEqual(a, d)).toBe(false);
  });

  it('treats StringLiteral as xsd:string when comparing typed literals', () => {
    const a = stringLiteral('x');
    const b = datatypeIriLiteral('x', XsdStringDatatypeIri);
    expect(literalsTermEqual(a, b)).toBe(true);
  });

  it('a typed literal and a lang-string literal are never term-equal', () => {
    const a = stringLiteral('hi');
    const b = langStringLiteral('hi', 'en');
    expect(literalsTermEqual(a, b)).toBe(false);
  });

  it('different datatype IRIs make typed literals unequal', () => {
    const a = datatypeIriLiteral('1', XsdNumericDatatypeIri.integer);
    const b = datatypeIriLiteral('1', XsdNumericDatatypeIri.decimal);
    expect(literalsTermEqual(a, b)).toBe(false);
  });
});

describe('NumericLiteral', () => {
  it('carries a kind name resolving to the canonical XSD IRI', () => {
    const lit = numericLiteral('42', 'integer');
    expect(lit.kind).toBe('NumericLiteral');
    expect(lit.lexicalForm).toBe('42');
    expect(lit.datatype).toBe('integer');
    expect(numericLiteralDatatypeIri(lit)).toBe(
      'http://www.w3.org/2001/XMLSchema#integer',
    );
  });

  it('exposes numeric value via best-effort coercion', () => {
    expect(numericLiteralToNumber(numericLiteral('3.14', 'decimal'))).toBeCloseTo(3.14);
    expect(numericLiteralToNumber(numericLiteral('not-a-number', 'integer'))).toBeNaN();
  });
});

describe('Temporal literals', () => {
  it('are tagged objects with a fixed implicit datatype', () => {
    const d = fullDateLiteral('2024-06-15');
    const t = timeLiteral('10:30:00');
    const dt = dateTimeLiteral('2024-06-15T10:30:00');
    expect(isFullDateLiteral(d)).toBe(true);
    expect(isTimeLiteral(t)).toBe(true);
    expect(isDateTimeLiteral(dt)).toBe(true);
    expect(isTemporalLiteral(d) && isTemporalLiteral(t) && isTemporalLiteral(dt)).toBe(true);
  });

  it('do not validate the lexical form at construction (per ill-typed-literal rule)', () => {
    expect(() => fullDateLiteral('not-a-date')).not.toThrow();
    expect(() => timeLiteral('25:99:99')).not.toThrow();
    expect(() => dateTimeLiteral('nope')).not.toThrow();
  });

  it('temporal datatype IRIs are exposed', () => {
    expect(XsdTemporalDatatypeIri.date).toBe('http://www.w3.org/2001/XMLSchema#date');
    expect(XsdTemporalDatatypeIri.time).toBe('http://www.w3.org/2001/XMLSchema#time');
    expect(XsdTemporalDatatypeIri.dateTime).toBe('http://www.w3.org/2001/XMLSchema#dateTime');
  });
});
