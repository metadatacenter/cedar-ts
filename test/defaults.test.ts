import { describe, expect, it } from 'vitest';
import {
  textDefaultValue,
  numericDefaultValue,
  dateDefaultValue,
  timeDefaultValue,
  dateTimeDefaultValue,
  controlledTermDefaultValue,
  choiceDefaultValue,
  linkDefaultValue,
  emailDefaultValue,
  phoneNumberDefaultValue,
  orcidDefaultValue,
  rorDefaultValue,
  doiDefaultValue,
  pubMedIdDefaultValue,
  rridDefaultValue,
  nihGrantIdDefaultValue,
  isDefaultValue,
  textValue,
  numericValue,
  yearValue,
  fullDateValue,
  timeValue,
  dateTimeValue,
  controlledTermValue,
  literalChoiceValue,
  linkValue,
  emailValue,
  phoneNumberValue,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  stringLiteral,
  numericLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  datatypeIriLiteral,
  XsdNumericDatatypeIri,
} from '../src/index.js';

describe('DefaultValue family', () => {
  it('each default-value constructor produces a tagged object recognised by isDefaultValue', () => {
    const td = textDefaultValue(textValue(stringLiteral('x')));
    const nd = numericDefaultValue(numericValue(numericLiteral('1', 'integer')));
    const dd = dateDefaultValue(yearValue('2024'));
    const dd2 = dateDefaultValue(fullDateValue(fullDateLiteral('2024-06-15')));
    const td2 = timeDefaultValue(timeValue(timeLiteral('10:30:00')));
    const dt = dateTimeDefaultValue(dateTimeValue(dateTimeLiteral('2024-06-15T10:30:00')));
    const ct = controlledTermDefaultValue(
      controlledTermValue({ termIri: 'http://example.org/t' }),
    );
    const cd = choiceDefaultValue(
      literalChoiceValue(datatypeIriLiteral('1', XsdNumericDatatypeIri.integer)),
    );
    const lk = linkDefaultValue(linkValue({ iri: 'https://example.org' }));
    const em = emailDefaultValue(emailValue('me@example.org'));
    const ph = phoneNumberDefaultValue(phoneNumberValue('+1-415-555-0100'));
    const oc = orcidDefaultValue(orcidValue({ iri: 'https://orcid.org/0000-0002-1825-0097' }));
    const rr = rorDefaultValue(rorValue({ iri: 'https://ror.org/05dxps055' }));
    const di = doiDefaultValue(doiValue({ iri: 'https://doi.org/10.1000/xyz' }));
    const pm = pubMedIdDefaultValue(
      pubMedIdValue({ iri: 'https://pubmed.ncbi.nlm.nih.gov/12345' }),
    );
    const rrid = rridDefaultValue(rridValue({ iri: 'https://identifiers.org/RRID:AB_12345' }));
    const ng = nihGrantIdDefaultValue(
      nihGrantIdValue({ iri: 'https://example.org/nih/grant/1' }),
    );

    for (const dv of [td, nd, dd, dd2, td2, dt, ct, cd, lk, em, ph, oc, rr, di, pm, rrid, ng]) {
      expect(isDefaultValue(dv)).toBe(true);
    }
  });

  it('choiceDefaultValue requires at least one ChoiceValue', () => {
    const cv = literalChoiceValue(datatypeIriLiteral('1', XsdNumericDatatypeIri.integer));
    const cd = choiceDefaultValue(cv);
    expect(cd.values.length).toBe(1);

    const cd2 = choiceDefaultValue(cv, cv, cv);
    expect(cd2.values.length).toBe(3);

    // @ts-expect-error must supply at least one ChoiceValue
    expect(() => choiceDefaultValue()).toBeDefined();
  });
});

describe('Default-value-constructor input widening', () => {
  it('textDefaultValue accepts a plain string', () => {
    const dv = textDefaultValue('Stanford University');
    expect(dv.kind).toBe('text_default_value');
    expect(dv.value.kind).toBe('text_value');
    expect(dv.value.literal.kind).toBe('string_literal');
    expect(dv.value.literal.lexicalForm).toBe('Stanford University');
  });

  it('textDefaultValue still accepts a TextValue and passes it through', () => {
    const tv = textValue(stringLiteral('Hello'));
    const dv = textDefaultValue(tv);
    expect(dv.value).toBe(tv);
  });

  it('textDefaultValue accepts a TextLiteral directly', () => {
    const dv = textDefaultValue(stringLiteral('Hi'));
    expect(dv.value.literal.kind).toBe('string_literal');
    expect(dv.value.literal.lexicalForm).toBe('Hi');
  });

  it('timeDefaultValue accepts a lexical string and a TimeValue', () => {
    const dv1 = timeDefaultValue('10:30:00');
    expect(dv1.value.literal.lexicalForm).toBe('10:30:00');

    const tv = timeValue(timeLiteral('11:00:00'));
    const dv2 = timeDefaultValue(tv);
    expect(dv2.value).toBe(tv);
  });

  it('dateTimeDefaultValue accepts a lexical string and a DateTimeValue', () => {
    const dv1 = dateTimeDefaultValue('2024-06-15T10:30:00');
    expect(dv1.value.literal.lexicalForm).toBe('2024-06-15T10:30:00');

    const dtv = dateTimeValue(dateTimeLiteral('2024-12-31T23:59:59'));
    const dv2 = dateTimeDefaultValue(dtv);
    expect(dv2.value).toBe(dtv);
  });
});
