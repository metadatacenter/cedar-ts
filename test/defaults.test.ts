import { describe, expect, it } from 'vitest';
import {
  embeddedTextField,
  embeddedIntegerNumberField,
  embeddedRealNumberField,
  embeddedDateField,
  embeddedTimeField,
  embeddedDateTimeField,
  embeddedControlledTermField,
  embeddedSingleValuedEnumField,
  embeddedMultiValuedEnumField,
  embeddedLinkField,
  embeddedEmailField,
  embeddedPhoneNumberField,
  embeddedOrcidField,
  embeddedRorField,
  embeddedDoiField,
  embeddedPubMedIdField,
  embeddedRridField,
  embeddedNihGrantIdField,
  textFieldId,
  integerNumberFieldId,
  realNumberFieldId,
  dateFieldId,
  timeFieldId,
  dateTimeFieldId,
  controlledTermFieldId,
  singleValuedEnumFieldId,
  multiValuedEnumFieldId,
  linkFieldId,
  emailFieldId,
  phoneNumberFieldId,
  orcidFieldId,
  rorFieldId,
  doiFieldId,
  pubMedIdFieldId,
  rridFieldId,
  nihGrantIdFieldId,
  textFieldSpec,
  textValue,
  integerNumberValue,
  realNumberValue,
  controlledTermValue,
  enumValue,
  linkValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  yearValue,
  fullDateValue,
} from '../src/index.js';

// =====================================================================
// Defaults — every EmbeddedXxxField.defaultValue slot uses the
// family-specific Value type directly (no Literal layer; no
// XxxDefaultValue wrappers). These tests pin the constructor-layer
// behaviour for each family.
// =====================================================================

describe('EmbeddedXxxField.defaultValue', () => {
  it('Text — TextValue; bare string widens', () => {
    const ef = embeddedTextField({
      key: 't',
      artifactRef: textFieldId('https://example.org/x'),
      defaultValue: 'Stanford University',
    });
    expect(ef.defaultValue?.kind).toBe('TextValue');
    expect(ef.defaultValue?.value).toBe('Stanford University');
    expect(ef.defaultValue?.lang).toBeUndefined();

    // Pre-built TextValue passes through.
    const ef2 = embeddedTextField({
      key: 't',
      artifactRef: textFieldId('https://example.org/x'),
      defaultValue: textValue('Hello'),
    });
    expect(ef2.defaultValue?.kind).toBe('TextValue');
  });

  it('IntegerNumber — IntegerNumberValue (datatype fixed at xsd:integer)', () => {
    const ef = embeddedIntegerNumberField({
      key: 'n',
      artifactRef: integerNumberFieldId('https://example.org/x'),
      defaultValue: integerNumberValue('42'),
    });
    expect(ef.defaultValue?.kind).toBe('IntegerNumberValue');
    expect(ef.defaultValue?.value).toBe('42');
  });

  it('RealNumber — RealNumberValue (carries datatype enum)', () => {
    const ef = embeddedRealNumberField({
      key: 'r',
      artifactRef: realNumberFieldId('https://example.org/x'),
      defaultValue: realNumberValue('3.14', 'decimal'),
    });
    expect(ef.defaultValue?.kind).toBe('RealNumberValue');
    expect(ef.defaultValue?.value).toBe('3.14');
    expect(ef.defaultValue?.datatype).toBe('decimal');
  });

  it('Date — DateValue (polymorphic; bare string discriminated by lexical shape)', () => {
    const efFull = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: '1990-06-15',
    });
    expect(efFull.defaultValue?.kind).toBe('FullDateValue');

    const efYear = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: '1990',
    });
    expect(efYear.defaultValue?.kind).toBe('YearValue');

    // Pre-built DateValue passes through.
    const efPre = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: fullDateValue('2024-06-15'),
    });
    expect(efPre.defaultValue?.kind).toBe('FullDateValue');

    const efYr = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: yearValue('2024'),
    });
    expect(efYr.defaultValue?.kind).toBe('YearValue');
  });

  it('Time / DateTime — TimeValue / DateTimeValue; bare string widens', () => {
    const efT = embeddedTimeField({
      key: 't',
      artifactRef: timeFieldId('https://example.org/x'),
      defaultValue: '10:30:00',
    });
    expect(efT.defaultValue?.kind).toBe('TimeValue');
    expect(efT.defaultValue?.value).toBe('10:30:00');

    const efDT = embeddedDateTimeField({
      key: 'dt',
      artifactRef: dateTimeFieldId('https://example.org/x'),
      defaultValue: '2024-06-15T10:30:00',
    });
    expect(efDT.defaultValue?.kind).toBe('DateTimeValue');
    expect(efDT.defaultValue?.value).toBe('2024-06-15T10:30:00');
  });

  it('ControlledTerm — ControlledTermValue (kind retained in memory; dropped on the wire)', () => {
    const cv = controlledTermValue({ term: 'http://example.org/t' });
    const ef = embeddedControlledTermField({
      key: 'ct',
      artifactRef: controlledTermFieldId('https://example.org/x'),
      defaultValue: cv,
    });
    expect(ef.defaultValue?.kind).toBe('ControlledTermValue');
    expect(ef.defaultValue).toBe(cv);
  });

  it('SingleValuedEnum — single EnumValue default', () => {
    const ev = enumValue('option-1');
    const efS = embeddedSingleValuedEnumField({
      key: 'sc',
      artifactRef: singleValuedEnumFieldId('https://example.org/x'),
      defaultValue: ev,
    });
    expect(efS.defaultValue?.kind).toBe('EnumValue');
    expect(efS.defaultValue?.value).toBe('option-1');
  });

  it('MultiValuedEnum — sequence of EnumValue defaults', () => {
    const a = enumValue('a');
    const b = enumValue('b');
    const efM = embeddedMultiValuedEnumField({
      key: 'mc',
      artifactRef: multiValuedEnumFieldId('https://example.org/x'),
      defaultValue: [a, b],
    });
    expect(efM.defaultValue?.length).toBe(2);
    expect(efM.defaultValue?.[0]?.kind).toBe('EnumValue');
    expect(efM.defaultValue?.[1]?.value).toBe('b');
  });

  it('Link — LinkValue (kind dropped on the wire)', () => {
    const lv = linkValue({ iri: 'https://example.org' });
    const ef = embeddedLinkField({
      key: 'l',
      artifactRef: linkFieldId('https://example.org/x'),
      defaultValue: lv,
    });
    expect(ef.defaultValue?.kind).toBe('LinkValue');
  });

  it('Email / PhoneNumber — value: string; bare string widens', () => {
    const ef = embeddedEmailField({
      key: 'em',
      artifactRef: emailFieldId('https://example.org/x'),
      defaultValue: 'me@example.org',
    });
    expect(ef.defaultValue?.kind).toBe('EmailValue');
    expect(ef.defaultValue?.value).toBe('me@example.org');

    const ef2 = embeddedPhoneNumberField({
      key: 'ph',
      artifactRef: phoneNumberFieldId('https://example.org/x'),
      defaultValue: '+1-415-555-0100',
    });
    expect(ef2.defaultValue?.kind).toBe('PhoneNumberValue');
    expect(ef2.defaultValue?.value).toBe('+1-415-555-0100');
  });

  it('External-authority — XxxValue widening (bare string IRI accepted)', () => {
    const ef = embeddedOrcidField({
      key: 'or',
      artifactRef: orcidFieldId('https://example.org/x'),
      defaultValue: 'https://orcid.org/0000-0002-1825-0097',
    });
    expect(ef.defaultValue?.kind).toBe('OrcidValue');

    // Fully-built values pass through.
    const rv = rorValue({ iri: 'https://ror.org/05dxps055' });
    const ef2 = embeddedRorField({
      key: 'ror',
      artifactRef: rorFieldId('https://example.org/x'),
      defaultValue: rv,
    });
    expect(ef2.defaultValue).toBe(rv);

    const dv = doiValue({ iri: 'https://doi.org/10.1000/xyz' });
    expect(
      embeddedDoiField({
        key: 'doi',
        artifactRef: doiFieldId('https://example.org/x'),
        defaultValue: dv,
      }).defaultValue,
    ).toBe(dv);

    const pmv = pubMedIdValue({ iri: 'https://pubmed.ncbi.nlm.nih.gov/12345' });
    expect(
      embeddedPubMedIdField({
        key: 'pm',
        artifactRef: pubMedIdFieldId('https://example.org/x'),
        defaultValue: pmv,
      }).defaultValue,
    ).toBe(pmv);

    const rrv = rridValue({ iri: 'https://identifiers.org/RRID:AB_12345' });
    expect(
      embeddedRridField({
        key: 'rr',
        artifactRef: rridFieldId('https://example.org/x'),
        defaultValue: rrv,
      }).defaultValue,
    ).toBe(rrv);

    const ngv = nihGrantIdValue({ iri: 'https://example.org/nih/grant/1' });
    expect(
      embeddedNihGrantIdField({
        key: 'ng',
        artifactRef: nihGrantIdFieldId('https://example.org/x'),
        defaultValue: ngv,
      }).defaultValue,
    ).toBe(ngv);
  });
});

describe('TextFieldSpec.defaultValue is a TextValue', () => {
  it('accepts a bare string and stores a TextValue', () => {
    const spec = textFieldSpec({ defaultValue: 'Hello' });
    expect(spec.defaultValue?.kind).toBe('TextValue');
    expect(spec.defaultValue?.value).toBe('Hello');
  });

  it('accepts a pre-built TextValue', () => {
    const spec = textFieldSpec({ defaultValue: textValue('Hi') });
    expect(spec.defaultValue?.kind).toBe('TextValue');
  });
});
