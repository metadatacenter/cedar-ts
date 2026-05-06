import { describe, expect, it } from 'vitest';
import {
  embeddedTextField,
  embeddedIntegerNumberField,
  embeddedRealNumberField,
  embeddedDateField,
  embeddedTimeField,
  embeddedDateTimeField,
  embeddedControlledTermField,
  embeddedSingleChoiceField,
  embeddedMultipleChoiceField,
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
  singleChoiceFieldId,
  multipleChoiceFieldId,
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
  controlledTermValue,
  literalChoiceValue,
  linkValue,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  integerNumberLiteral,
  realNumberLiteral,
  fullDateLiteral,
  timeLiteral,
  dateTimeLiteral,
  yearValue,
  fullDateValue,
  simpleLiteral,
  typedLiteral,
  XsdNumericDatatypeIri,
} from '../src/index.js';

// =====================================================================
// Defaults — the 17 XxxDefaultValue wrappers were removed (spec 868ef1c).
// Each EmbeddedXxxField.defaultValue slot now uses the family-specific
// underlying type directly. These tests pin that behavior at the
// constructor layer for each family.
// =====================================================================

describe('EmbeddedXxxField.defaultValue (flat, no XxxDefaultValue wrapper)', () => {
  it('Text — TextLiteral; bare string widens to SimpleLiteral', () => {
    const ef = embeddedTextField({
      key: 't',
      artifactRef: textFieldId('https://example.org/x'),
      defaultValue: 'Stanford University',
    });
    expect(ef.defaultValue?.kind).toBe('SimpleLiteral');
    if (ef.defaultValue && ef.defaultValue.kind === 'SimpleLiteral') {
      expect(ef.defaultValue.lexicalForm).toBe('Stanford University');
    }
    // Pre-built TextLiteral passes through.
    const ef2 = embeddedTextField({
      key: 't',
      artifactRef: textFieldId('https://example.org/x'),
      defaultValue: simpleLiteral('Hello'),
    });
    expect(ef2.defaultValue?.kind).toBe('SimpleLiteral');
  });

  it('IntegerNumber — IntegerNumberLiteral (datatype fixed at xsd:integer)', () => {
    const ef = embeddedIntegerNumberField({
      key: 'n',
      artifactRef: integerNumberFieldId('https://example.org/x'),
      defaultValue: integerNumberLiteral('42'),
    });
    expect(ef.defaultValue?.kind).toBe('TypedLiteral');
    expect(ef.defaultValue?.lexicalForm).toBe('42');
  });

  it('RealNumber — RealNumberLiteral (explicit datatype required at construction)', () => {
    const ef = embeddedRealNumberField({
      key: 'r',
      artifactRef: realNumberFieldId('https://example.org/x'),
      defaultValue: realNumberLiteral('3.14', 'decimal'),
    });
    expect(ef.defaultValue?.kind).toBe('TypedLiteral');
    expect(ef.defaultValue?.lexicalForm).toBe('3.14');
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
      defaultValue: fullDateValue(fullDateLiteral('2024-06-15')),
    });
    expect(efPre.defaultValue?.kind).toBe('FullDateValue');

    const efYr = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: yearValue('2024'),
    });
    expect(efYr.defaultValue?.kind).toBe('YearValue');
  });

  it('Time / DateTime — TimeLiteral / DateTimeLiteral; bare string widens', () => {
    const efT = embeddedTimeField({
      key: 't',
      artifactRef: timeFieldId('https://example.org/x'),
      defaultValue: '10:30:00',
    });
    expect(efT.defaultValue?.kind).toBe('TypedLiteral');
    expect(efT.defaultValue?.lexicalForm).toBe('10:30:00');

    const efDT = embeddedDateTimeField({
      key: 'dt',
      artifactRef: dateTimeFieldId('https://example.org/x'),
      defaultValue: '2024-06-15T10:30:00',
    });
    expect(efDT.defaultValue?.kind).toBe('TypedLiteral');

    const efT2 = embeddedTimeField({
      key: 't',
      artifactRef: timeFieldId('https://example.org/x'),
      defaultValue: timeLiteral('11:00:00'),
    });
    expect(efT2.defaultValue?.lexicalForm).toBe('11:00:00');

    const efDT2 = embeddedDateTimeField({
      key: 'dt',
      artifactRef: dateTimeFieldId('https://example.org/x'),
      defaultValue: dateTimeLiteral('2024-12-31T23:59:59'),
    });
    expect(efDT2.defaultValue?.lexicalForm).toBe('2024-12-31T23:59:59');
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

  it('SingleChoice / MultipleChoice — ChoiceValue (polymorphic union; kind retained)', () => {
    const choice = literalChoiceValue(typedLiteral('1', XsdNumericDatatypeIri.integer));
    const efS = embeddedSingleChoiceField({
      key: 'sc',
      artifactRef: singleChoiceFieldId('https://example.org/x'),
      defaultValue: choice,
    });
    expect(efS.defaultValue?.kind).toBe('LiteralChoiceValue');

    const efM = embeddedMultipleChoiceField({
      key: 'mc',
      artifactRef: multipleChoiceFieldId('https://example.org/x'),
      defaultValue: choice,
    });
    expect(efM.defaultValue?.kind).toBe('LiteralChoiceValue');
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

  it('Email / PhoneNumber — SimpleLiteral; bare string widens', () => {
    const ef = embeddedEmailField({
      key: 'em',
      artifactRef: emailFieldId('https://example.org/x'),
      defaultValue: 'me@example.org',
    });
    expect(ef.defaultValue?.kind).toBe('SimpleLiteral');
    expect(ef.defaultValue?.lexicalForm).toBe('me@example.org');

    const ef2 = embeddedPhoneNumberField({
      key: 'ph',
      artifactRef: phoneNumberFieldId('https://example.org/x'),
      defaultValue: '+1-415-555-0100',
    });
    expect(ef2.defaultValue?.kind).toBe('SimpleLiteral');
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

describe('TextFieldSpec.defaultValue is now TextLiteral (no wrapper)', () => {
  it('accepts a bare string and stores a SimpleLiteral', () => {
    const spec = textFieldSpec({ defaultValue: 'Hello' });
    expect(spec.defaultValue?.kind).toBe('SimpleLiteral');
    expect(spec.defaultValue?.lexicalForm).toBe('Hello');
  });

  it('accepts a pre-built TextLiteral', () => {
    const spec = textFieldSpec({ defaultValue: simpleLiteral('Hi') });
    expect(spec.defaultValue?.kind).toBe('SimpleLiteral');
  });
});
