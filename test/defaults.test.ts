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
  booleanValue,
  controlledTermValue,
  enumValue,
  linkValue,
  emailValue,
  phoneNumberValue,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  timeValue,
  dateTimeValue,
  yearValue,
  yearMonthValue,
  fullDateValue,
  integerNumberFieldSpec,
  realNumberFieldSpec,
  booleanFieldSpec,
  dateFieldSpec,
  timeFieldSpec,
  dateTimeFieldSpec,
  controlledTermFieldSpec,
  ontologySource,
  ontologyReference,
  permissibleValue,
  singleValuedEnumFieldSpec,
  multiValuedEnumFieldSpec,
  linkFieldSpec,
  emailFieldSpec,
  phoneNumberFieldSpec,
  orcidFieldSpec,
  rorFieldSpec,
  doiFieldSpec,
  pubMedIdFieldSpec,
  rridFieldSpec,
  nihGrantIdFieldSpec,
  CedarConstructionError,
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

// =====================================================================
// Universal field-level defaults — every concrete XxxFieldSpec except
// AttributeValueFieldSpec carries an optional defaultValue slot whose
// type matches the family's Value.
// =====================================================================

describe('XxxFieldSpec.defaultValue (universal field-level defaults)', () => {
  it('IntegerNumberFieldSpec accepts an IntegerNumberValue (or bare numeric string)', () => {
    const a = integerNumberFieldSpec({ defaultValue: '42' });
    expect(a.defaultValue?.kind).toBe('IntegerNumberValue');
    expect(a.defaultValue?.value).toBe('42');

    const b = integerNumberFieldSpec({ defaultValue: integerNumberValue('7') });
    expect(b.defaultValue?.value).toBe('7');
  });

  it('RealNumberFieldSpec accepts a RealNumberValue', () => {
    const fs = realNumberFieldSpec({
      datatype: 'decimal',
      defaultValue: realNumberValue('3.14', 'decimal'),
    });
    expect(fs.defaultValue?.kind).toBe('RealNumberValue');
    expect(fs.defaultValue?.datatype).toBe('decimal');
  });

  it('BooleanFieldSpec accepts a BooleanValue (or bare boolean)', () => {
    const a = booleanFieldSpec({ defaultValue: true });
    expect(a.defaultValue?.kind).toBe('BooleanValue');
    expect(a.defaultValue?.value).toBe(true);

    const b = booleanFieldSpec({ defaultValue: booleanValue(false) });
    expect(b.defaultValue?.value).toBe(false);
  });

  it('DateFieldSpec.defaultValue arm must agree with dateValueType', () => {
    // year admits only YearValue
    const a = dateFieldSpec({
      dateValueType: 'year',
      defaultValue: yearValue('1990'),
    });
    expect(a.defaultValue?.kind).toBe('YearValue');

    // yearMonth admits only YearMonthValue
    const b = dateFieldSpec({
      dateValueType: 'yearMonth',
      defaultValue: yearMonthValue('1990-06'),
    });
    expect(b.defaultValue?.kind).toBe('YearMonthValue');

    // fullDate admits only FullDateValue
    const c = dateFieldSpec({
      dateValueType: 'fullDate',
      defaultValue: fullDateValue('1990-06-15'),
    });
    expect(c.defaultValue?.kind).toBe('FullDateValue');

    // Mismatch: year + FullDateValue is rejected
    expect(() =>
      dateFieldSpec({
        dateValueType: 'year',
        defaultValue: fullDateValue('1990-06-15'),
      }),
    ).toThrow(CedarConstructionError);

    // Mismatch: fullDate + YearValue is rejected
    expect(() =>
      dateFieldSpec({
        dateValueType: 'fullDate',
        defaultValue: yearValue('1990'),
      }),
    ).toThrow(CedarConstructionError);

    // Mismatch: yearMonth + FullDateValue is rejected
    expect(() =>
      dateFieldSpec({
        dateValueType: 'yearMonth',
        defaultValue: fullDateValue('1990-06-15'),
      }),
    ).toThrow(CedarConstructionError);
  });

  it('TimeFieldSpec accepts a TimeValue (or bare lexical string)', () => {
    const a = timeFieldSpec({ defaultValue: '09:00:00' });
    expect(a.defaultValue?.kind).toBe('TimeValue');

    const b = timeFieldSpec({ defaultValue: timeValue('10:30:00') });
    expect(b.defaultValue?.value).toBe('10:30:00');
  });

  it('DateTimeFieldSpec accepts a DateTimeValue', () => {
    const fs = dateTimeFieldSpec({
      dateTimeValueType: 'dateHourMinute',
      defaultValue: dateTimeValue('2024-06-15T10:30:00'),
    });
    expect(fs.defaultValue?.kind).toBe('DateTimeValue');
  });

  it('ControlledTermFieldSpec accepts a ControlledTermValue (init-object form)', () => {
    const fs = controlledTermFieldSpec({
      sources: [ontologySource(ontologyReference({ iri: 'http://example.org/o' }))],
      defaultValue: controlledTermValue({ term: 'http://example.org/term/1' }),
    });
    expect(fs.defaultValue?.kind).toBe('ControlledTermValue');
  });

  it('ControlledTermFieldSpec rest-args form still works (no defaultValue)', () => {
    const fs = controlledTermFieldSpec(
      ontologySource(ontologyReference({ iri: 'http://example.org/o' })),
    );
    expect(fs.kind).toBe('ControlledTermFieldSpec');
    expect(fs.defaultValue).toBeUndefined();
  });

  it('SingleValuedEnumFieldSpec carries an EnumValue (replacing bare Token)', () => {
    const fs = singleValuedEnumFieldSpec({
      permissibleValues: [permissibleValue({ value: 'a' })],
      defaultValue: enumValue('a'),
    });
    expect(fs.defaultValue?.kind).toBe('EnumValue');
    expect(fs.defaultValue?.value).toBe('a');
  });

  it('MultiValuedEnumFieldSpec carries EnumValue[] (replacing bare Token[])', () => {
    const fs = multiValuedEnumFieldSpec({
      permissibleValues: [
        permissibleValue({ value: 'a' }),
        permissibleValue({ value: 'b' }),
      ],
      defaultValues: [enumValue('a'), enumValue('b')],
    });
    expect(fs.defaultValues.length).toBe(2);
    expect(fs.defaultValues[0]?.kind).toBe('EnumValue');
  });

  it('LinkFieldSpec accepts a LinkValue', () => {
    const fs = linkFieldSpec({
      defaultValue: linkValue({ iri: 'https://example.org' }),
    });
    expect(fs.defaultValue?.kind).toBe('LinkValue');
  });

  it('Email / Phone field specs accept a value (bare string widens)', () => {
    const e = emailFieldSpec({ defaultValue: 'me@example.org' });
    expect(e.defaultValue?.kind).toBe('EmailValue');
    expect(e.defaultValue?.value).toBe('me@example.org');

    const ev = emailFieldSpec({ defaultValue: emailValue('alice@example.org') });
    expect(ev.defaultValue?.value).toBe('alice@example.org');

    const p = phoneNumberFieldSpec({ defaultValue: '+1-415-555-0100' });
    expect(p.defaultValue?.kind).toBe('PhoneNumberValue');

    const pv = phoneNumberFieldSpec({
      defaultValue: phoneNumberValue('+44-20-0000-0000'),
    });
    expect(pv.defaultValue?.value).toBe('+44-20-0000-0000');
  });

  it('External-authority FieldSpecs accept a value (bare string IRI widens)', () => {
    const o = orcidFieldSpec({
      defaultValue: 'https://orcid.org/0000-0002-1825-0097',
    });
    expect(o.defaultValue?.kind).toBe('OrcidValue');

    const ov = orcidFieldSpec({
      defaultValue: orcidValue({ iri: 'https://orcid.org/0000-0001-2345-6789' }),
    });
    expect(ov.defaultValue?.kind).toBe('OrcidValue');

    const r = rorFieldSpec({
      defaultValue: rorValue({ iri: 'https://ror.org/05dxps055' }),
    });
    expect(r.defaultValue?.kind).toBe('RorValue');

    const d = doiFieldSpec({
      defaultValue: doiValue({ iri: 'https://doi.org/10.1000/xyz' }),
    });
    expect(d.defaultValue?.kind).toBe('DoiValue');

    const pm = pubMedIdFieldSpec({
      defaultValue: pubMedIdValue({
        iri: 'https://pubmed.ncbi.nlm.nih.gov/12345',
      }),
    });
    expect(pm.defaultValue?.kind).toBe('PubMedIdValue');

    const rr = rridFieldSpec({
      defaultValue: rridValue({ iri: 'https://identifiers.org/RRID:AB_12345' }),
    });
    expect(rr.defaultValue?.kind).toBe('RridValue');

    const ng = nihGrantIdFieldSpec({
      defaultValue: nihGrantIdValue({ iri: 'https://example.org/nih/grant/1' }),
    });
    expect(ng.defaultValue?.kind).toBe('NihGrantIdValue');
  });
});
