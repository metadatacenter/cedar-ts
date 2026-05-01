import { describe, expect, it } from 'vitest';
import {
  typedLiteral,
  langTaggedLiteral,
  simpleLiteral,
  simpleLiteralToTypedLiteral,
  literalsTermEqual,
  isSimpleLiteral,
  isLangTaggedLiteral,
  isTypedLiteral,
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

describe('SimpleLiteral', () => {
  it('is constructed from a plain string', () => {
    const s = simpleLiteral('hello');
    expect(s.kind).toBe('SimpleLiteral');
    expect(s.lexicalForm).toBe('hello');
    expect(isSimpleLiteral(s)).toBe(true);
    expect(isTextLiteral(s)).toBe(true);
  });

  it('converts to a TypedLiteral with xsd:string', () => {
    const s = simpleLiteral('x');
    const dt = simpleLiteralToTypedLiteral(s);
    expect(dt.kind).toBe('TypedLiteral');
    expect(dt.lexicalForm).toBe('x');
    expect(dt.datatype.value).toBe(XsdStringDatatypeIri);
  });
});

describe('LangTaggedLiteral', () => {
  it('is constructed from a lexical form and language tag', () => {
    const ls = langTaggedLiteral('hello', 'en-US');
    expect(ls.kind).toBe('LangTaggedLiteral');
    expect(ls.lexicalForm).toBe('hello');
    expect(ls.lang.value).toBe('en-US');
    expect(isLangTaggedLiteral(ls)).toBe(true);
    expect(isTextLiteral(ls)).toBe(true);
    expect(isLiteral(ls)).toBe(true);
  });
});

describe('TypedLiteral', () => {
  it('is constructed with an explicit datatype IRI', () => {
    const lit = typedLiteral('42', 'http://www.w3.org/2001/XMLSchema#integer');
    expect(lit.kind).toBe('TypedLiteral');
    expect(lit.lexicalForm).toBe('42');
    expect(lit.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#integer');
    expect(isTypedLiteral(lit)).toBe(true);
    expect(isLiteral(lit)).toBe(true);
  });
});

describe('literalsTermEqual', () => {
  it('compares two LangTaggedLiterals on lexical form and language tag', () => {
    const a = langTaggedLiteral('hi', 'en');
    const b = langTaggedLiteral('hi', 'en');
    const c = langTaggedLiteral('hi', 'fr');
    const d = langTaggedLiteral('hello', 'en');
    expect(literalsTermEqual(a, b)).toBe(true);
    expect(literalsTermEqual(a, c)).toBe(false);
    expect(literalsTermEqual(a, d)).toBe(false);
  });

  it('treats SimpleLiteral as xsd:string when comparing typed literals', () => {
    const a = simpleLiteral('x');
    const b = typedLiteral('x', XsdStringDatatypeIri);
    expect(literalsTermEqual(a, b)).toBe(true);
  });

  it('a typed literal and a lang-string literal are never term-equal', () => {
    const a = simpleLiteral('hi');
    const b = langTaggedLiteral('hi', 'en');
    expect(literalsTermEqual(a, b)).toBe(false);
  });

  it('different datatype IRIs make typed literals unequal', () => {
    const a = typedLiteral('1', XsdNumericDatatypeIri.integer);
    const b = typedLiteral('1', XsdNumericDatatypeIri.decimal);
    expect(literalsTermEqual(a, b)).toBe(false);
  });
});

describe('NumericLiteral', () => {
  it('is a TypedLiteral with a numeric XSD datatype IRI', () => {
    const lit = numericLiteral('42', 'integer');
    expect(lit.kind).toBe('TypedLiteral');
    expect(lit.lexicalForm).toBe('42');
    expect(lit.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#integer');
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
  it('are TypedLiterals with a fixed XSD temporal datatype', () => {
    const d = fullDateLiteral('2024-06-15');
    const t = timeLiteral('10:30:00');
    const dt = dateTimeLiteral('2024-06-15T10:30:00');
    expect(d.kind).toBe('TypedLiteral');
    expect(t.kind).toBe('TypedLiteral');
    expect(dt.kind).toBe('TypedLiteral');
    expect(d.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#date');
    expect(t.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#time');
    expect(dt.datatype.value).toBe('http://www.w3.org/2001/XMLSchema#dateTime');
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
