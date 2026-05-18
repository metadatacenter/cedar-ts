import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  textFieldSpec,
  integerNumberFieldSpec,
  realNumberFieldSpec,
  numericRenderingHint,
  unit,
  dateFieldSpec,
  timeFieldSpec,
  dateTimeFieldSpec,
  controlledTermFieldSpec,
  ontologySource,
  ontologyReference,
  ontologyDisplayHint,
  branchSource,
  classSource,
  controlledTermClass,
  valueSetSource,
  permissibleValue,
  meaning,
  singleValuedEnumFieldSpec,
  multiValuedEnumFieldSpec,
  isSingleValuedEnumFieldSpec,
  isMultiValuedEnumFieldSpec,
  isEnumFieldSpec,
  linkFieldSpec,
  emailFieldSpec,
  phoneNumberFieldSpec,
  orcidFieldSpec,
  rorFieldSpec,
  doiFieldSpec,
  pubMedIdFieldSpec,
  rridFieldSpec,
  nihGrantIdFieldSpec,
  isExternalAuthorityFieldSpec,
  attributeValueFieldSpec,
  isFieldSpec,
  dateRenderingHint,
  timeRenderingHint,
  dateTimeRenderingHint,
  integerNumberValue,
  realNumberValue,
  isTextFieldSpec,
  isIntegerNumberFieldSpec,
  isRealNumberFieldSpec,
  isDateFieldSpec,
  isTimeFieldSpec,
  isDateTimeFieldSpec,
  isControlledTermFieldSpec,
  isLinkFieldSpec,
  isEmailFieldSpec,
  isPhoneNumberFieldSpec,
  isAttributeValueFieldSpec,
  type FieldSpec,
} from '../src/index.js';

describe('TextFieldSpec', () => {
  it('builds an empty spec when no constraints are supplied', () => {
    const fs = textFieldSpec();
    expect(fs.kind).toBe('TextFieldSpec');
    expect('minLength' in fs).toBe(false);
    expect('maxLength' in fs).toBe(false);
    expect('renderingHint' in fs).toBe(false);
  });

  it('preserves all supplied constraints', () => {
    const fs = textFieldSpec({
      minLength: 1,
      maxLength: 255,
      validationRegex: '^[A-Z].*$',
      renderingHint: { lineMode: 'multiLine' },
    });
    expect(fs.minLength).toBe(1);
    expect(fs.maxLength).toBe(255);
    expect(fs.validationRegex).toBe('^[A-Z].*$');
    expect(fs.renderingHint?.lineMode).toBe('multiLine');
    expect(isTextFieldSpec(fs)).toBe(true);
  });

  it('TextRenderingHint accepts both lineMode and placeholder', () => {
    const fs = textFieldSpec({
      renderingHint: {
        lineMode: 'singleLine',
        placeholder: [{ value: 'e.g. Jane Doe', lang: 'en' }],
      },
    });
    expect(fs.renderingHint?.lineMode).toBe('singleLine');
    expect(fs.renderingHint?.placeholder).toEqual([
      { value: 'e.g. Jane Doe', lang: 'en' },
    ]);
  });

  it('carries an optional langTagRequirement', () => {
    const required = textFieldSpec({ langTagRequirement: 'langTagRequired' });
    expect(required.langTagRequirement).toBe('langTagRequired');

    const forbidden = textFieldSpec({ langTagRequirement: 'langTagForbidden' });
    expect(forbidden.langTagRequirement).toBe('langTagForbidden');

    const optional = textFieldSpec({ langTagRequirement: 'langTagOptional' });
    expect(optional.langTagRequirement).toBe('langTagOptional');

    const absent = textFieldSpec();
    expect('langTagRequirement' in absent).toBe(false);
  });
});

describe('IntegerNumberFieldSpec', () => {
  it('builds an empty spec when no constraints are supplied', () => {
    const fs = integerNumberFieldSpec();
    expect(fs.kind).toBe('IntegerNumberFieldSpec');
    expect(isIntegerNumberFieldSpec(fs)).toBe(true);
  });

  it('Unit pairs an Iri with an optional label', () => {
    const u = unit({ iri: 'http://qudt.org/vocab/unit/M', label: 'metre' });
    expect(u.iri.value).toBe('http://qudt.org/vocab/unit/M');
    expect(u.label).toEqual([{ value: 'metre', lang: 'und' }]);

    const fs = integerNumberFieldSpec({
      unit: u,
      minValue: integerNumberValue('0'),
      maxValue: integerNumberValue('100'),
      renderingHint: numericRenderingHint(),
    });
    expect(fs.unit).toBe(u);
    expect(fs.minValue?.value).toBe('0');
  });
});

describe('RealNumberFieldSpec', () => {
  it('requires a datatype kind', () => {
    const fs = realNumberFieldSpec({ datatype: 'decimal' });
    expect(fs.datatype).toBe('decimal');
    expect(isRealNumberFieldSpec(fs)).toBe(true);
  });

  it('carries decimalPlaces on the rendering hint', () => {
    const fs = realNumberFieldSpec({
      datatype: 'decimal',
      minValue: realNumberValue('0', 'decimal'),
      maxValue: realNumberValue('100', 'decimal'),
      renderingHint: numericRenderingHint(3),
    });
    expect(fs.renderingHint?.decimalPlaces).toBe(3);
  });
});

describe('Temporal field specs', () => {
  it('DateFieldSpec carries a DateValueType and optional rendering hint', () => {
    const fs = dateFieldSpec({
      dateValueType: 'fullDate',
      renderingHint: dateRenderingHint('dayMonthYear'),
    });
    expect(fs.dateValueType).toBe('fullDate');
    expect(fs.renderingHint?.componentOrder).toBe('dayMonthYear');
    expect(isDateFieldSpec(fs)).toBe(true);
  });

  it('TimeFieldSpec carries optional precision, timezone requirement, and rendering hint', () => {
    const fs = timeFieldSpec({
      timePrecision: 'hourMinuteSecond',
      timezoneRequirement: 'timezoneRequired',
      renderingHint: timeRenderingHint('twentyFourHour'),
    });
    expect(fs.timePrecision).toBe('hourMinuteSecond');
    expect(fs.timezoneRequirement).toBe('timezoneRequired');
    expect(fs.renderingHint?.timeFormat).toBe('twentyFourHour');
    expect(isTimeFieldSpec(fs)).toBe(true);
  });

  it('DateTimeFieldSpec carries a value type and optional timezone requirement', () => {
    const fs = dateTimeFieldSpec({
      dateTimeValueType: 'dateHourMinuteSecondFraction',
      timezoneRequirement: 'timezoneNotRequired',
      renderingHint: dateTimeRenderingHint('twelveHour'),
    });
    expect(fs.dateTimeValueType).toBe('dateHourMinuteSecondFraction');
    expect(fs.timezoneRequirement).toBe('timezoneNotRequired');
    expect(isDateTimeFieldSpec(fs)).toBe(true);
  });
});

describe('Controlled-term field spec and sources', () => {
  it('OntologyDisplayHint requires at least one of acronym or name', () => {
    expect(ontologyDisplayHint({ acronym: 'OBI' }).acronym).toBe('OBI');
    expect(ontologyDisplayHint({ name: 'Ontology for Biomedical Investigations' }).name)
      .toEqual([{ value: 'Ontology for Biomedical Investigations', lang: 'und' }]);
    expect(() => ontologyDisplayHint({})).toThrow(CedarConstructionError);
  });

  it('OntologySource wraps an OntologyReference', () => {
    const ref = ontologyReference({
      iri: 'http://purl.obolibrary.org/obo/obi.owl',
      displayHint: ontologyDisplayHint({ acronym: 'OBI' }),
    });
    const src = ontologySource(ref);
    expect(src.kind).toBe('OntologySource');
    expect(src.ontology.iri.value).toBe('http://purl.obolibrary.org/obo/obi.owl');
  });

  it('BranchSource carries root term metadata and optional max depth', () => {
    const ref = ontologyReference({ iri: 'http://example.org/onto' });
    const bs = branchSource({
      ontology: ref,
      rootTermIri: 'http://example.org/term/root',
      rootTermLabel: 'Root',
      maxTraversalDepth: 3,
    });
    expect(bs.kind).toBe('BranchSource');
    expect(bs.rootTermLabel).toEqual([{ value: 'Root', lang: 'und' }]);
    expect(bs.maxTraversalDepth).toBe(3);
  });

  it('ClassSource collects one or more controlled-term classes', () => {
    const ref = ontologyReference({ iri: 'http://example.org/onto' });
    const c1 = controlledTermClass({
      term: 'http://example.org/term/1',
      label: 'One',
      ontology: ref,
    });
    const c2 = controlledTermClass({
      term: 'http://example.org/term/2',
      label: 'Two',
      ontology: ref,
    });
    const cs = classSource(c1, c2);
    expect(cs.kind).toBe('ClassSource');
    expect(cs.classes.length).toBe(2);
  });

  it('ValueSetSource carries an identifier and optional name/iri', () => {
    const vs = valueSetSource({
      identifier: 'vs-001',
      name: 'Demographics',
      iri: 'http://example.org/valuesets/demographics',
    });
    expect(vs.identifier).toBe('vs-001');
    expect(vs.iri?.value).toBe('http://example.org/valuesets/demographics');
  });

  it('ControlledTermFieldSpec requires at least one source', () => {
    const ref = ontologyReference({ iri: 'http://example.org/onto' });
    const fs = controlledTermFieldSpec(ontologySource(ref));
    expect(fs.kind).toBe('ControlledTermFieldSpec');
    expect(fs.sources.length).toBe(1);
    expect(isControlledTermFieldSpec(fs)).toBe(true);

    // @ts-expect-error must supply at least one source
    expect(() => controlledTermFieldSpec()).toBeDefined();
  });
});

describe('EnumFieldSpec', () => {
  it('SingleValuedEnumFieldSpec carries one or more PermissibleValue', () => {
    const pv1 = permissibleValue({ value: 'a', label: 'Alpha' });
    const pv2 = permissibleValue({ value: 'b', label: 'Beta' });
    const fs = singleValuedEnumFieldSpec({
      permissibleValues: [pv1, pv2],
      defaultValue: 'a',
      renderingHint: 'radio',
    });
    expect(fs.kind).toBe('SingleValuedEnumFieldSpec');
    expect(fs.permissibleValues.length).toBe(2);
    expect(fs.defaultValue).toEqual({ kind: 'EnumValue', value: 'a' });
    expect(fs.renderingHint).toBe('radio');
    expect(isSingleValuedEnumFieldSpec(fs)).toBe(true);
    expect(isEnumFieldSpec(fs)).toBe(true);
  });

  it('PermissibleValue carries optional Meaning entries', () => {
    const m = meaning({ iri: 'http://example.org/m/1', label: 'Meaning One' });
    const pv = permissibleValue({ value: 'x', meanings: [m] });
    expect(pv.meanings.length).toBe(1);
    expect(pv.meanings[0]?.iri.value).toBe('http://example.org/m/1');
  });

  it('MultiValuedEnumFieldSpec uses MultiValuedEnumRenderingHint', () => {
    const pv = permissibleValue({ value: 'a' });
    const fs = multiValuedEnumFieldSpec({
      permissibleValues: [pv],
      renderingHint: 'checkbox',
    });
    expect(fs.kind).toBe('MultiValuedEnumFieldSpec');
    expect(fs.renderingHint).toBe('checkbox');
    expect(isMultiValuedEnumFieldSpec(fs)).toBe(true);
  });

  it('MultiValuedEnumFieldSpec carries optional defaultValues as EnumValue entries', () => {
    const pv1 = permissibleValue({ value: 'a' });
    const pv2 = permissibleValue({ value: 'b' });
    const fs = multiValuedEnumFieldSpec({
      permissibleValues: [pv1, pv2],
      defaultValues: ['a', 'b'],
    });
    expect(fs.defaultValues).toEqual([
      { kind: 'EnumValue', value: 'a' },
      { kind: 'EnumValue', value: 'b' },
    ]);
  });
});

describe('Body-less field specs', () => {
  it('Link / Email / PhoneNumber / external authority / attribute-value specs', () => {
    expect(linkFieldSpec().kind).toBe('LinkFieldSpec');
    expect(isLinkFieldSpec(linkFieldSpec())).toBe(true);

    expect(emailFieldSpec().kind).toBe('EmailFieldSpec');
    expect(isEmailFieldSpec(emailFieldSpec())).toBe(true);

    expect(phoneNumberFieldSpec().kind).toBe('PhoneNumberFieldSpec');
    expect(isPhoneNumberFieldSpec(phoneNumberFieldSpec())).toBe(true);

    const ea = [
      orcidFieldSpec(), rorFieldSpec(), doiFieldSpec(),
      pubMedIdFieldSpec(), rridFieldSpec(), nihGrantIdFieldSpec(),
    ];
    for (const fs of ea) {
      expect(isExternalAuthorityFieldSpec(fs)).toBe(true);
    }

    expect(attributeValueFieldSpec().kind).toBe('AttributeValueFieldSpec');
    expect(isAttributeValueFieldSpec(attributeValueFieldSpec())).toBe(true);
  });

  it('carry an optional placeholder via their new rendering hints', () => {
    const placeholder = [{ value: 'name@example.com', lang: 'en' }];
    const fs = emailFieldSpec({ renderingHint: { placeholder } });
    expect(fs.renderingHint?.placeholder).toEqual(placeholder);

    const orcidPh = [{ value: 'https://orcid.org/0000-0000-0000-0000', lang: 'en' }];
    const orcid = orcidFieldSpec({ renderingHint: { placeholder: orcidPh } });
    expect(orcid.renderingHint?.placeholder).toEqual(orcidPh);
  });
});

describe('FieldSpec union', () => {
  it('isFieldSpec recognises every concrete field spec kind', () => {
    const all: FieldSpec[] = [
      textFieldSpec(),
      integerNumberFieldSpec(),
      realNumberFieldSpec({ datatype: 'decimal' }),
      dateFieldSpec({ dateValueType: 'fullDate' }),
      timeFieldSpec(),
      dateTimeFieldSpec({ dateTimeValueType: 'dateHourMinute' }),
      controlledTermFieldSpec(
        ontologySource(ontologyReference({ iri: 'http://example.org/o' })),
      ),
      singleValuedEnumFieldSpec({
        permissibleValues: [permissibleValue({ value: 'a' })],
      }),
      multiValuedEnumFieldSpec({
        permissibleValues: [permissibleValue({ value: 'a' })],
      }),
      linkFieldSpec(),
      emailFieldSpec(),
      phoneNumberFieldSpec(),
      orcidFieldSpec(),
      attributeValueFieldSpec(),
    ];
    for (const fs of all) {
      expect(isFieldSpec(fs)).toBe(true);
    }
  });

  it('rejects non-spec values', () => {
    expect(isFieldSpec({})).toBe(false);
    expect(isFieldSpec({ kind: 'not_a_spec' })).toBe(false);
  });
});

