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
  literalChoiceOption,
  controlledTermChoiceOption,
  literalSingleChoiceFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  literalMultipleChoiceFieldSpec,
  controlledTermMultipleChoiceFieldSpec,
  isSingleChoiceFieldSpec,
  isMultipleChoiceFieldSpec,
  isChoiceFieldSpec,
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
  controlledTermValue,
  integerNumberValue,
  integerNumberLiteral,
  realNumberValue,
  realNumberLiteral,
  typedLiteral,
  XsdNumericDatatypeIri,
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
  type FieldSpecFor,
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
      renderingHint: 'multiLine',
    });
    expect(fs.minLength).toBe(1);
    expect(fs.maxLength).toBe(255);
    expect(fs.validationRegex).toBe('^[A-Z].*$');
    expect(fs.renderingHint).toBe('multiLine');
    expect(isTextFieldSpec(fs)).toBe(true);
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
      minValue: integerNumberValue(integerNumberLiteral('0')),
      maxValue: integerNumberValue(integerNumberLiteral('100')),
      renderingHint: numericRenderingHint(),
    });
    expect(fs.unit).toBe(u);
    expect(fs.minValue?.literal.lexicalForm).toBe('0');
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
      minValue: realNumberValue(realNumberLiteral('0', 'decimal')),
      maxValue: realNumberValue(realNumberLiteral('100', 'decimal')),
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
      timezoneRequirement: 'required',
      renderingHint: timeRenderingHint('twentyFourHour'),
    });
    expect(fs.timePrecision).toBe('hourMinuteSecond');
    expect(fs.timezoneRequirement).toBe('required');
    expect(fs.renderingHint?.timeFormat).toBe('twentyFourHour');
    expect(isTimeFieldSpec(fs)).toBe(true);
  });

  it('DateTimeFieldSpec carries a value type and optional timezone requirement', () => {
    const fs = dateTimeFieldSpec({
      dateTimeValueType: 'dateHourMinuteSecondFraction',
      timezoneRequirement: 'notRequired',
      renderingHint: dateTimeRenderingHint('twelveHour'),
    });
    expect(fs.dateTimeValueType).toBe('dateHourMinuteSecondFraction');
    expect(fs.timezoneRequirement).toBe('notRequired');
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

describe('ChoiceFieldSpec', () => {
  it('LiteralSingleChoiceFieldSpec carries one or more LiteralChoiceOption', () => {
    const o1 = literalChoiceOption(
      typedLiteral('a', XsdNumericDatatypeIri.integer),
      { default: true },
    );
    const o2 = literalChoiceOption(typedLiteral('b', XsdNumericDatatypeIri.integer));
    const fs = literalSingleChoiceFieldSpec({
      options: [o1, o2],
      renderingHint: 'radio',
    });
    expect(fs.kind).toBe('LiteralSingleChoiceFieldSpec');
    expect(fs.options.length).toBe(2);
    expect(fs.options[0]?.default).toBe(true);
    expect(fs.options[1]?.default).toBeUndefined();
    expect(fs.renderingHint).toBe('radio');
    expect(isSingleChoiceFieldSpec(fs)).toBe(true);
    expect(isChoiceFieldSpec(fs)).toBe(true);
  });

  it('ControlledTermSingleChoiceFieldSpec carries controlled-term options', () => {
    const ctv = controlledTermValue({ term: 'http://example.org/t/1', label: 'One' });
    const opt = controlledTermChoiceOption(ctv, { default: true });
    const fs = controlledTermSingleChoiceFieldSpec({
      options: [opt],
      renderingHint: 'singleSelectDropdown',
    });
    expect(fs.kind).toBe('ControlledTermSingleChoiceFieldSpec');
    expect(fs.options[0]?.default).toBe(true);
  });

  it('LiteralMultipleChoiceFieldSpec uses MultipleChoiceRenderingHint', () => {
    const o1 = literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer));
    const fs = literalMultipleChoiceFieldSpec({ options: [o1], renderingHint: 'checkbox' });
    expect(fs.kind).toBe('LiteralMultipleChoiceFieldSpec');
    expect(fs.renderingHint).toBe('checkbox');
    expect(isMultipleChoiceFieldSpec(fs)).toBe(true);
  });

  it('ControlledTermMultipleChoiceFieldSpec', () => {
    const ctv = controlledTermValue({ term: 'http://example.org/t/1' });
    const fs = controlledTermMultipleChoiceFieldSpec({
      options: [controlledTermChoiceOption(ctv)],
      renderingHint: 'multiSelectDropdown',
    });
    expect(fs.kind).toBe('ControlledTermMultipleChoiceFieldSpec');
  });

  it('literalChoiceOption accepts (text, lang) and (text, lang, options)', () => {
    const plain = literalChoiceOption('Professor', 'en');
    expect(plain.literal.kind).toBe('LangTaggedLiteral');
    expect(plain.literal.lexicalForm).toBe('Professor');
    expect(plain.default).toBeUndefined();

    const def = literalChoiceOption('Associate Professor', 'en', { default: true });
    expect(def.default).toBe(true);

    // Existing one-arg Literal form still works.
    const lit = literalChoiceOption(
      typedLiteral('a', XsdNumericDatatypeIri.integer),
      { default: true },
    );
    expect(lit.literal.kind).toBe('TypedLiteral');
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
      literalSingleChoiceFieldSpec({
        options: [literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer))],
      }),
      literalMultipleChoiceFieldSpec({
        options: [literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer))],
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

describe('FieldSpecFor<K> mapped type (compile-time)', () => {
  it('resolves to the right spec interface per kind', () => {
    const t: FieldSpecFor<'text'> = textFieldSpec();
    const n: FieldSpecFor<'integer_number'> = integerNumberFieldSpec();
    const d: FieldSpecFor<'date'> = dateFieldSpec({ dateValueType: 'fullDate' });
    const sc: FieldSpecFor<'single_choice'> = literalSingleChoiceFieldSpec({
      options: [literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer))],
    });
    expect(t.kind).toBe('TextFieldSpec');
    expect(n.kind).toBe('IntegerNumberFieldSpec');
    expect(d.kind).toBe('DateFieldSpec');
    expect(sc.kind).toBe('LiteralSingleChoiceFieldSpec');
    // @ts-expect-error an IntegerNumberFieldSpec is not assignable to FieldSpecFor<'text'>
    const wrong: FieldSpecFor<'text'> = integerNumberFieldSpec();
    void wrong;
  });
});
