import { describe, expect, it } from 'vitest';
import {
  textValue,
  numericValue,
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
  stringLiteral,
  langStringLiteral,
  numericLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  XsdNumericDatatypeIri,
  datatypeIriLiteral,
} from '../src/index.js';

describe('Scalar values', () => {
  it('TextValue wraps a TextLiteral', () => {
    const tv = textValue(stringLiteral('hello'));
    expect(tv.kind).toBe('text_value');
    expect(tv.literal.kind).toBe('string_literal');

    const lv = textValue(langStringLiteral('hello', 'en'));
    expect(lv.literal.kind).toBe('lang_string_literal');
  });

  it('NumericValue wraps a NumericLiteral', () => {
    const nv = numericValue(numericLiteral('42', 'integer'));
    expect(nv.kind).toBe('numeric_value');
    expect(nv.literal.lexicalForm).toBe('42');
  });
});

describe('DateValue refinements', () => {
  it('YearValue carries a plain string', () => {
    const y = yearValue('2024');
    expect(y.kind).toBe('year_value');
    expect(y.value).toBe('2024');
    expect(isYearValue(y)).toBe(true);
    expect(isDateValue(y)).toBe(true);
  });

  it('YearMonthValue carries a plain string', () => {
    const ym = yearMonthValue('2024-06');
    expect(ym.kind).toBe('year_month_value');
    expect(isYearMonthValue(ym)).toBe(true);
    expect(isDateValue(ym)).toBe(true);
  });

  it('FullDateValue wraps a FullDateLiteral', () => {
    const fd = fullDateValue(fullDateLiteral('2024-06-15'));
    expect(fd.kind).toBe('full_date_value');
    expect(isFullDateValue(fd)).toBe(true);
    expect(isDateValue(fd)).toBe(true);
  });

  it('does not validate lexical patterns at construction time', () => {
    expect(() => yearValue('20')).not.toThrow();
    expect(() => yearMonthValue('not-yymm')).not.toThrow();
  });
});

describe('TimeValue / DateTimeValue', () => {
  it('TimeValue wraps a TimeLiteral', () => {
    const tv = timeValue(timeLiteral('10:30:00'));
    expect(tv.kind).toBe('time_value');
  });

  it('DateTimeValue wraps a DateTimeLiteral', () => {
    const dtv = dateTimeValue(dateTimeLiteral('2024-06-15T10:30:00Z'));
    expect(dtv.kind).toBe('date_time_value');
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
    expect(v.kind).toBe('controlled_term_value');
    expect(v.term.value).toBe('http://purl.obolibrary.org/obo/UBERON_0000178');
    expect(v.label).toBe('blood');
    expect(v.notation).toBe('UBERON:0000178');
    expect(v.preferredLabel).toBe('blood');
  });

  it('accepts only a TermIri with no extra metadata', () => {
    const v = controlledTermValue({ term: 'http://example.org/term/1' });
    expect(v.label).toBeUndefined();
    expect(v.notation).toBeUndefined();
    expect(v.preferredLabel).toBeUndefined();
  });
});

describe('ChoiceValue', () => {
  it('LiteralChoiceValue wraps a Literal', () => {
    const cv = literalChoiceValue(
      datatypeIriLiteral('1', XsdNumericDatatypeIri.integer),
    );
    expect(isLiteralChoiceValue(cv)).toBe(true);
    expect(isChoiceValue(cv)).toBe(true);
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
  it('EmailValue wraps a StringLiteral', () => {
    const ev = emailValue('me@example.org');
    expect(ev.literal.kind).toBe('string_literal');
    expect(ev.literal.lexicalForm).toBe('me@example.org');
  });

  it('PhoneNumberValue wraps a StringLiteral', () => {
    const pv = phoneNumberValue('+1-415-555-0100');
    expect(pv.literal.lexicalForm).toBe('+1-415-555-0100');
  });
});

describe('External authority values', () => {
  it('typed IRI wrappers are constructable', () => {
    expect(orcidIri('https://orcid.org/0000-0002-1825-0097').kind).toBe('orcid_iri');
    expect(rorIri('https://ror.org/05dxps055').kind).toBe('ror_iri');
    expect(doiIri('https://doi.org/10.1000/xyz').kind).toBe('doi_iri');
    expect(pubMedIri('https://pubmed.ncbi.nlm.nih.gov/12345').kind).toBe('pub_med_iri');
    expect(rridIri('https://identifiers.org/RRID:AB_12345').kind).toBe('rrid_iri');
    expect(nihGrantIri('https://example.org/nih/grant/1').kind).toBe('nih_grant_iri');
  });

  it('values carry typed IRIs and optional labels', () => {
    const ov = orcidValue({
      iri: 'https://orcid.org/0000-0002-1825-0097',
      label: 'Researcher',
    });
    expect(ov.kind).toBe('orcid_value');
    expect(ov.iri.kind).toBe('orcid_iri');
    expect(ov.label).toBe('Researcher');
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
    expect(ov.iri.kind).toBe('orcid_iri');
  });
});

describe('AttributeValue (recursive)', () => {
  it('can carry a scalar value', () => {
    const av = attributeValue('color', textValue(stringLiteral('blue')));
    expect(av.kind).toBe('attribute_value');
    expect(av.name).toBe('color');
    expect(isAttributeValue(av)).toBe(true);
  });

  it('can nest another AttributeValue without bound', () => {
    const inner = attributeValue('depth', numericValue(numericLiteral('3', 'integer')));
    const middle = attributeValue('layer', inner);
    const outer = attributeValue('outer', middle);
    expect(outer.value.kind).toBe('attribute_value');
    expect((outer.value as typeof middle).value.kind).toBe('attribute_value');
  });
});

describe('Value union recognition', () => {
  it('isValue accepts every concrete Value variant', () => {
    expect(isValue(textValue(stringLiteral('x')))).toBe(true);
    expect(isValue(numericValue(numericLiteral('1', 'integer')))).toBe(true);
    expect(isValue(yearValue('2024'))).toBe(true);
    expect(isValue(yearMonthValue('2024-06'))).toBe(true);
    expect(isValue(fullDateValue(fullDateLiteral('2024-06-15')))).toBe(true);
    expect(isValue(timeValue(timeLiteral('10:30:00')))).toBe(true);
    expect(isValue(dateTimeValue(dateTimeLiteral('2024-06-15T10:30:00')))).toBe(true);
    expect(
      isValue(controlledTermValue({ term: 'http://example.org/t' })),
    ).toBe(true);
    expect(
      isValue(literalChoiceValue(datatypeIriLiteral('1', XsdNumericDatatypeIri.integer))),
    ).toBe(true);
    expect(isValue(linkValue({ iri: 'https://example.org' }))).toBe(true);
    expect(isValue(emailValue('me@example.org'))).toBe(true);
    expect(
      isValue(orcidValue({ iri: 'https://orcid.org/0000-0002-1825-0097' })),
    ).toBe(true);
    expect(
      isValue(attributeValue('k', textValue(stringLiteral('v')))),
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
  it('textValue accepts a plain string and wraps it as a StringLiteral', () => {
    const v = textValue('Hello');
    expect(v.kind).toBe('text_value');
    expect(v.literal.kind).toBe('string_literal');
    expect(v.literal.lexicalForm).toBe('Hello');
  });

  it('textValue still accepts a langStringLiteral and passes it through', () => {
    const v = textValue(langStringLiteral('Bonjour', 'fr'));
    expect(v.literal.kind).toBe('lang_string_literal');
  });

  it('textValue still accepts a stringLiteral and passes it through', () => {
    const lit = stringLiteral('Hi');
    const v = textValue(lit);
    expect(v.literal).toBe(lit);
  });

  it('fullDateValue accepts a lexical-form string', () => {
    const v = fullDateValue('2024-06-15');
    expect(v.kind).toBe('full_date_value');
    expect(v.literal.kind).toBe('full_date_literal');
    expect(v.literal.lexicalForm).toBe('2024-06-15');
  });

  it('timeValue accepts a lexical-form string', () => {
    const v = timeValue('10:30:00');
    expect(v.literal.lexicalForm).toBe('10:30:00');
  });

  it('dateTimeValue accepts a lexical-form string', () => {
    const v = dateTimeValue('2024-06-15T10:30:00');
    expect(v.literal.lexicalForm).toBe('2024-06-15T10:30:00');
  });
});

describe('dateValue smart constructor', () => {
  it('discriminates a 4-digit year string as YearValue', () => {
    const v = dateValue('2024');
    expect(v.kind).toBe('year_value');
    if (v.kind === 'year_value') expect(v.value).toBe('2024');
  });

  it('discriminates YYYY-MM as YearMonthValue', () => {
    const v = dateValue('2024-06');
    expect(v.kind).toBe('year_month_value');
    if (v.kind === 'year_month_value') expect(v.value).toBe('2024-06');
  });

  it('discriminates YYYY-MM-DD as FullDateValue', () => {
    const v = dateValue('2024-06-15');
    expect(v.kind).toBe('full_date_value');
    if (v.kind === 'full_date_value') {
      expect(v.literal.lexicalForm).toBe('2024-06-15');
    }
  });

  it('tolerates a trailing time-zone designator on full dates', () => {
    const v = dateValue('2024-06-15Z');
    expect(v.kind).toBe('full_date_value');
    const v2 = dateValue('2024-06-15+05:00');
    expect(v2.kind).toBe('full_date_value');
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
    expect(v.kind).toBe('orcid_value');
    expect(v.iri.kind).toBe('orcid_iri');
    expect(v.iri.value.value).toBe('https://orcid.org/0000-0002-1825-0097');
    expect(v.label).toBeUndefined();
  });

  it('accepts an Iri (no label)', () => {
    const v = rorValue({ kind: 'iri', value: 'https://ror.org/05dxps055' });
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
    expect(v.iri.kind).toBe('doi_iri');
    expect(v.label).toBe('Sample DOI');
  });

  it('all six families accept a bare string IRI', () => {
    expect(orcidValue('https://orcid.org/0000-0002-1825-0097').kind).toBe('orcid_value');
    expect(rorValue('https://ror.org/05dxps055').kind).toBe('ror_value');
    expect(doiValue('https://doi.org/10.1000/xyz').kind).toBe('doi_value');
    expect(pubMedIdValue('https://pubmed.ncbi.nlm.nih.gov/12345').kind).toBe('pub_med_id_value');
    expect(rridValue('https://identifiers.org/RRID:AB_12345').kind).toBe('rrid_value');
    expect(nihGrantIdValue('https://example.org/nih/grant/1').kind).toBe('nih_grant_id_value');
  });
});

describe('literalChoiceValue input widening', () => {
  it('accepts (text, lang) and wraps as a langStringLiteral', () => {
    const v = literalChoiceValue('Professor', 'en');
    expect(v.kind).toBe('literal_choice_value');
    expect(v.literal.kind).toBe('lang_string_literal');
    expect(v.literal.lexicalForm).toBe('Professor');
    if (v.literal.kind === 'lang_string_literal') {
      expect(v.literal.lang.value).toBe('en');
    }
  });

  it('still accepts a fully-built Literal', () => {
    const lit = langStringLiteral('Professor', 'en');
    const v = literalChoiceValue(lit);
    expect(v.literal).toBe(lit);
  });
});
