import { describe, expect, it } from 'vitest';
import {
  textValue,
  integerNumberValue,
  realNumberValue,
  booleanValue,
  yearValue,
  yearMonthValue,
  fullDateValue,
  timeValue,
  dateTimeValue,
  dateValue,
  isDateValue,
  isYearValue,
  isYearMonthValue,
  isFullDateValue,
  controlledTermValue,
  literalChoiceValue,
  controlledTermChoiceValue,
  isLiteralChoiceValue,
  isControlledTermChoiceValue,
  isChoiceValue,
  linkValue,
  emailValue,
  phoneNumberValue,
  orcidIri,
  rorIri,
  doiIri,
  pubMedIri,
  rridIri,
  nihGrantIri,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  isExternalAuthorityValue,
  attributeValue,
  isAttributeValue,
  isValue,
} from '../src/index.js';

describe('Scalar values', () => {
  it('TextValue carries value (and optional lang) directly', () => {
    const tv = textValue('hello');
    expect(tv.kind).toBe('TextValue');
    expect(tv.value).toBe('hello');
    expect(tv.lang).toBeUndefined();

    const lv = textValue('hello', 'en');
    expect(lv.kind).toBe('TextValue');
    expect(lv.lang?.value).toBe('en');
  });

  it('IntegerNumberValue carries a base-10 lexical form', () => {
    const nv = integerNumberValue('42');
    expect(nv.kind).toBe('IntegerNumberValue');
    expect(nv.value).toBe('42');
  });

  it('RealNumberValue carries a lexical form plus a datatype enum', () => {
    const nv = realNumberValue('3.14', 'decimal');
    expect(nv.kind).toBe('RealNumberValue');
    expect(nv.value).toBe('3.14');
    expect(nv.datatype).toBe('decimal');
  });

  it('BooleanValue carries a JSON boolean directly', () => {
    const v = booleanValue(true);
    expect(v.kind).toBe('BooleanValue');
    expect(v.value).toBe(true);
  });
});

describe('DateValue refinements', () => {
  it('YearValue carries a plain string', () => {
    const y = yearValue('2024');
    expect(y.kind).toBe('YearValue');
    expect(y.value).toBe('2024');
    expect(isYearValue(y)).toBe(true);
    expect(isDateValue(y)).toBe(true);
  });

  it('YearMonthValue carries a plain string', () => {
    const ym = yearMonthValue('2024-06');
    expect(ym.kind).toBe('YearMonthValue');
    expect(isYearMonthValue(ym)).toBe(true);
    expect(isDateValue(ym)).toBe(true);
  });

  it('FullDateValue carries a plain string', () => {
    const fd = fullDateValue('2024-06-15');
    expect(fd.kind).toBe('FullDateValue');
    expect(fd.value).toBe('2024-06-15');
    expect(isFullDateValue(fd)).toBe(true);
    expect(isDateValue(fd)).toBe(true);
  });

  it('does not validate lexical patterns at construction time', () => {
    expect(() => yearValue('20')).not.toThrow();
    expect(() => yearMonthValue('not-yymm')).not.toThrow();
  });
});

describe('TimeValue / DateTimeValue', () => {
  it('TimeValue carries a plain string', () => {
    const tv = timeValue('10:30:00');
    expect(tv.kind).toBe('TimeValue');
    expect(tv.value).toBe('10:30:00');
  });

  it('DateTimeValue carries a plain string', () => {
    const dtv = dateTimeValue('2024-06-15T10:30:00Z');
    expect(dtv.kind).toBe('DateTimeValue');
    expect(dtv.value).toBe('2024-06-15T10:30:00Z');
  });
});

describe('ControlledTermValue', () => {
  it('requires a TermIri and accepts optional textual metadata', () => {
    const v = controlledTermValue({
      term: 'http://purl.obolibrary.org/obo/UBERON_0000178',
      label: 'blood',
      notation: 'UBERON:0000178',
      preferredLabel: 'blood',
    });
    expect(v.kind).toBe('ControlledTermValue');
    expect(v.term.value).toBe('http://purl.obolibrary.org/obo/UBERON_0000178');
    expect(v.label).toEqual([{ value: 'blood', lang: 'und' }]);
    expect(v.notation).toBe('UBERON:0000178');
    expect(v.preferredLabel).toEqual([{ value: 'blood', lang: 'und' }]);
  });

  it('accepts only a TermIri with no extra metadata', () => {
    const v = controlledTermValue({ term: 'http://example.org/term/1' });
    expect(v.label).toBeUndefined();
    expect(v.notation).toBeUndefined();
    expect(v.preferredLabel).toBeUndefined();
  });
});

describe('ChoiceValue', () => {
  it('LiteralChoiceValue (typed) carries a datatype IRI', () => {
    const cv = literalChoiceValue({
      value: '1',
      datatype: 'http://www.w3.org/2001/XMLSchema#integer',
    });
    expect(isLiteralChoiceValue(cv)).toBe(true);
    expect(isChoiceValue(cv)).toBe(true);
    expect(cv.datatype?.value).toBe(
      'http://www.w3.org/2001/XMLSchema#integer',
    );
  });

  it('LiteralChoiceValue (lang-tagged) carries a lang', () => {
    const cv = literalChoiceValue('Professor', 'en');
    expect(cv.lang?.value).toBe('en');
  });

  it('LiteralChoiceValue (plain) carries neither lang nor datatype', () => {
    const cv = literalChoiceValue('Plain');
    expect(cv.lang).toBeUndefined();
    expect(cv.datatype).toBeUndefined();
  });

  it('LiteralChoiceValue rejects both lang and datatype together', () => {
    expect(() =>
      literalChoiceValue({ value: 'x', lang: 'en', datatype: 'http://example.org/d' }),
    ).toThrow();
  });

  it('ControlledTermChoiceValue wraps a ControlledTermValue', () => {
    const ctv = controlledTermValue({ term: 'http://example.org/t' });
    const cv = controlledTermChoiceValue(ctv);
    expect(isControlledTermChoiceValue(cv)).toBe(true);
    expect(isChoiceValue(cv)).toBe(true);
  });
});

describe('LinkValue', () => {
  it('carries an Iri and optional label', () => {
    const lv = linkValue({ iri: 'https://example.org', label: 'Example' });
    expect(lv.iri.value).toBe('https://example.org');
    expect(lv.label).toBe('Example');
  });

  it('omits label when not provided (exactOptionalPropertyTypes)', () => {
    const lv = linkValue({ iri: 'https://example.org' });
    expect('label' in lv).toBe(false);
  });
});

describe('Contact values', () => {
  it('EmailValue carries value: string directly', () => {
    const ev = emailValue('me@example.org');
    expect(ev.kind).toBe('EmailValue');
    expect(ev.value).toBe('me@example.org');
  });

  it('PhoneNumberValue carries value: string directly', () => {
    const pv = phoneNumberValue('+1-415-555-0100');
    expect(pv.value).toBe('+1-415-555-0100');
  });
});

describe('External authority values', () => {
  it('typed IRI wrappers are constructable', () => {
    expect(orcidIri('https://orcid.org/0000-0002-1825-0097').kind).toBe('OrcidIri');
    expect(rorIri('https://ror.org/05dxps055').kind).toBe('RorIri');
    expect(doiIri('https://doi.org/10.1000/xyz').kind).toBe('DoiIri');
    expect(pubMedIri('https://pubmed.ncbi.nlm.nih.gov/12345').kind).toBe('PubMedIri');
    expect(rridIri('https://identifiers.org/RRID:AB_12345').kind).toBe('RridIri');
    expect(nihGrantIri('https://example.org/nih/grant/1').kind).toBe('NihGrantIri');
  });

  it('values carry typed IRIs and optional labels', () => {
    const ov = orcidValue({
      iri: 'https://orcid.org/0000-0002-1825-0097',
      label: 'Researcher',
    });
    expect(ov.kind).toBe('OrcidValue');
    expect(ov.iri.kind).toBe('OrcidIri');
    expect(ov.label).toEqual([{ value: 'Researcher', lang: 'und' }]);
    expect(isExternalAuthorityValue(ov)).toBe(true);

    const rv = rorValue({ iri: 'https://ror.org/05dxps055' });
    const dv = doiValue({ iri: 'https://doi.org/10.1000/xyz' });
    const pv = pubMedIdValue({ iri: 'https://pubmed.ncbi.nlm.nih.gov/12345' });
    const rrv = rridValue({ iri: 'https://identifiers.org/RRID:AB_12345' });
    const nv = nihGrantIdValue({ iri: 'https://example.org/nih/grant/1' });
    expect(isExternalAuthorityValue(rv)).toBe(true);
    expect(isExternalAuthorityValue(dv)).toBe(true);
    expect(isExternalAuthorityValue(pv)).toBe(true);
    expect(isExternalAuthorityValue(rrv)).toBe(true);
    expect(isExternalAuthorityValue(nv)).toBe(true);
  });

  it('accepts a pre-wrapped typed IRI', () => {
    const ov = orcidValue({ iri: orcidIri('https://orcid.org/0000-0002-1825-0097') });
    expect(ov.iri.kind).toBe('OrcidIri');
  });
});

describe('AttributeValue (recursive)', () => {
  it('can carry a scalar value', () => {
    const av = attributeValue('color', textValue('blue'));
    expect(av.kind).toBe('AttributeValue');
    expect(av.name).toBe('color');
    expect(isAttributeValue(av)).toBe(true);
  });

  it('can nest another AttributeValue without bound', () => {
    const inner = attributeValue('depth', integerNumberValue('3'));
    const middle = attributeValue('layer', inner);
    const outer = attributeValue('outer', middle);
    expect(outer.value.kind).toBe('AttributeValue');
    expect((outer.value as typeof middle).value.kind).toBe('AttributeValue');
  });
});

describe('Value union recognition', () => {
  it('isValue accepts every concrete Value variant', () => {
    expect(isValue(textValue('x'))).toBe(true);
    expect(isValue(integerNumberValue('1'))).toBe(true);
    expect(isValue(realNumberValue('1.0', 'decimal'))).toBe(true);
    expect(isValue(booleanValue(true))).toBe(true);
    expect(isValue(yearValue('2024'))).toBe(true);
    expect(isValue(yearMonthValue('2024-06'))).toBe(true);
    expect(isValue(fullDateValue('2024-06-15'))).toBe(true);
    expect(isValue(timeValue('10:30:00'))).toBe(true);
    expect(isValue(dateTimeValue('2024-06-15T10:30:00'))).toBe(true);
    expect(
      isValue(controlledTermValue({ term: 'http://example.org/t' })),
    ).toBe(true);
    expect(
      isValue(literalChoiceValue({ value: '1', datatype: 'http://www.w3.org/2001/XMLSchema#integer' })),
    ).toBe(true);
    expect(isValue(linkValue({ iri: 'https://example.org' }))).toBe(true);
    expect(isValue(emailValue('me@example.org'))).toBe(true);
    expect(
      isValue(orcidValue({ iri: 'https://orcid.org/0000-0002-1825-0097' })),
    ).toBe(true);
    expect(
      isValue(attributeValue('k', textValue('v'))),
    ).toBe(true);
  });

  it('rejects non-Value objects', () => {
    expect(isValue({})).toBe(false);
    expect(isValue({ kind: 'not_a_value' })).toBe(false);
    expect(isValue('hello')).toBe(false);
    expect(isValue(null)).toBe(false);
  });
});

describe('Value-constructor input widening', () => {
  it('textValue accepts a plain string with no lang', () => {
    const v = textValue('Hello');
    expect(v.kind).toBe('TextValue');
    expect(v.value).toBe('Hello');
    expect(v.lang).toBeUndefined();
  });

  it('textValue with (text, lang) attaches a language tag', () => {
    const v = textValue('Bonjour', 'fr');
    expect(v.lang?.value).toBe('fr');
  });

  it('textValue is idempotent on a pre-built TextValue', () => {
    const a = textValue('Hi');
    expect(textValue(a)).toBe(a);
  });

  it('fullDateValue accepts a lexical-form string', () => {
    const v = fullDateValue('2024-06-15');
    expect(v.kind).toBe('FullDateValue');
    expect(v.value).toBe('2024-06-15');
  });

  it('timeValue accepts a lexical-form string', () => {
    const v = timeValue('10:30:00');
    expect(v.value).toBe('10:30:00');
  });

  it('dateTimeValue accepts a lexical-form string', () => {
    const v = dateTimeValue('2024-06-15T10:30:00');
    expect(v.value).toBe('2024-06-15T10:30:00');
  });
});

describe('dateValue smart constructor', () => {
  it('discriminates a 4-digit year string as YearValue', () => {
    const v = dateValue('2024');
    expect(v.kind).toBe('YearValue');
    if (v.kind === 'YearValue') expect(v.value).toBe('2024');
  });

  it('discriminates YYYY-MM as YearMonthValue', () => {
    const v = dateValue('2024-06');
    expect(v.kind).toBe('YearMonthValue');
    if (v.kind === 'YearMonthValue') expect(v.value).toBe('2024-06');
  });

  it('discriminates YYYY-MM-DD as FullDateValue', () => {
    const v = dateValue('2024-06-15');
    expect(v.kind).toBe('FullDateValue');
    if (v.kind === 'FullDateValue') {
      expect(v.value).toBe('2024-06-15');
    }
  });

  it('tolerates a trailing time-zone designator on full dates', () => {
    const v = dateValue('2024-06-15Z');
    expect(v.kind).toBe('FullDateValue');
    const v2 = dateValue('2024-06-15+05:00');
    expect(v2.kind).toBe('FullDateValue');
  });

  it('passes through an existing DateValue', () => {
    const yv = yearValue('2024');
    expect(dateValue(yv)).toBe(yv);

    const fdv = fullDateValue('2024-06-15');
    expect(dateValue(fdv)).toBe(fdv);
  });

  it('throws on a string with no recognizable date shape', () => {
    expect(() => dateValue('not-a-date')).toThrow(/Cannot infer DateValue/);
    expect(() => dateValue('24-06-15')).toThrow(/Cannot infer DateValue/);
    expect(() => dateValue('2024-6-15')).toThrow(/Cannot infer DateValue/);
    expect(() => dateValue('')).toThrow(/Cannot infer DateValue/);
  });
});

describe('External-authority value input widening', () => {
  it('accepts a bare string IRI (no label)', () => {
    const v = orcidValue('https://orcid.org/0000-0002-1825-0097');
    expect(v.kind).toBe('OrcidValue');
    expect(v.iri.kind).toBe('OrcidIri');
    expect(v.iri.value.value).toBe('https://orcid.org/0000-0002-1825-0097');
    expect(v.label).toBeUndefined();
  });

  it('accepts an Iri (no label)', () => {
    const v = rorValue({ kind: 'Iri', value: 'https://ror.org/05dxps055' });
    expect(v.iri.value.value).toBe('https://ror.org/05dxps055');
    expect(v.label).toBeUndefined();
  });

  it('accepts a typed authority IRI (no label)', () => {
    const oi = orcidIri('https://orcid.org/0000-0002-1825-0097');
    const v = orcidValue(oi);
    expect(v.iri).toBe(oi);
  });

  it('still accepts the init-object form with an optional label', () => {
    const v = doiValue({ iri: 'https://doi.org/10.1000/xyz', label: 'Sample DOI' });
    expect(v.iri.kind).toBe('DoiIri');
    expect(v.label).toEqual([{ value: 'Sample DOI', lang: 'und' }]);
  });

  it('all six families accept a bare string IRI', () => {
    expect(orcidValue('https://orcid.org/0000-0002-1825-0097').kind).toBe('OrcidValue');
    expect(rorValue('https://ror.org/05dxps055').kind).toBe('RorValue');
    expect(doiValue('https://doi.org/10.1000/xyz').kind).toBe('DoiValue');
    expect(pubMedIdValue('https://pubmed.ncbi.nlm.nih.gov/12345').kind).toBe('PubMedIdValue');
    expect(rridValue('https://identifiers.org/RRID:AB_12345').kind).toBe('RridValue');
    expect(nihGrantIdValue('https://example.org/nih/grant/1').kind).toBe('NihGrantIdValue');
  });
});
