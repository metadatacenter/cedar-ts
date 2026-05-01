// =====================================================================
// serialize / parse — round-trip + strict-parse rejection tests.
// =====================================================================

import { describe, expect, it } from 'vitest';
import {
  // construction
  artifactMetadata,
  attributeValue,
  attributeValueField,
  attributeValueFieldSpec,
  cardinality,
  controlledTermChoiceOption,
  controlledTermChoiceValue,
  controlledTermDefaultValue,
  controlledTermField,
  controlledTermFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  controlledTermValue,
  dateField,
  dateFieldSpec,
  dateTimeFieldSpec,
  dateTimeLiteral,
  dateTimeValue,
  descriptiveMetadata,
  doiField,
  doiFieldSpec,
  doiValue,
  embeddedAttributeValueField,
  embeddedControlledTermField,
  embeddedDateField,
  embeddedDateTimeField,
  embeddedDoiField,
  embeddedEmailField,
  embeddedLinkField,
  embeddedMultipleChoiceField,
  embeddedNihGrantIdField,
  embeddedNumericField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedPubMedIdField,
  embeddedRorField,
  embeddedRridField,
  embeddedSingleChoiceField,
  embeddedTemplate,
  embeddedTextField,
  embeddedTimeField,
  emailField,
  emailFieldSpec,
  emailValue,
  fieldValue,
  fullDateLiteral,
  fullDateValue,
  imageComponent,
  langTaggedLiteral,
  labelOverride,
  linkField,
  linkFieldSpec,
  linkValue,
  literalChoiceOption,
  literalChoiceValue,
  literalSingleChoiceFieldSpec,
  multipleChoiceField,
  nestedTemplateInstance,
  nihGrantIdField,
  nihGrantIdFieldSpec,
  nihGrantIdValue,
  numericDefaultValue,
  numericField,
  numericFieldSpec,
  numericLiteral,
  numericValue,
  ontologyDisplayHint,
  ontologyReference,
  ontologySource,
  orcidField,
  orcidFieldSpec,
  orcidValue,
  pageBreakComponent,
  phoneNumberField,
  phoneNumberFieldSpec,
  phoneNumberValue,
  pubMedIdField,
  pubMedIdFieldSpec,
  pubMedIdValue,
  richTextComponent,
  rorField,
  rorFieldSpec,
  rorValue,
  rridField,
  rridFieldSpec,
  rridValue,
  schemaArtifactMetadata,
  schemaVersioning,
  sectionBreakComponent,
  simpleLiteral,
  singleChoiceField,
  template,
  templateId,
  templateInstance,
  templateInstanceId,
  temporalProvenance,
  textDefaultValue,
  textField,
  textFieldSpec,
  textValue,
  timeFieldSpec,
  timeLiteral,
  timeValue,
  yearMonthValue,
  yearValue,
  youtubeVideoComponent,
  // serialize/parse
  serialize,
  parse,
  serializeTemplate,
  parseTemplate,
  serializeTemplateInstance,
  parseTemplateInstance,
  serializeField,
  parseField,
  serializePresentationComponent,
  parsePresentationComponent,
  serializeValue,
  parseValue,
  serializeFieldSpec,
  parseFieldSpec,
  serializeDefaultValue,
  parseDefaultValue,
  serializeEmbeddedField,
  parseEmbeddedField,
  serializeEmbeddedArtifact,
  parseEmbeddedArtifact,
  serializeLiteral,
  parseLiteral,
  parseTextLiteral,
  serializeMultilingualString,
  parseMultilingualString,
  serializeFieldValue,
  parseFieldValue,
  serializeNestedTemplateInstance,
  parseNestedTemplateInstance,
  parseInstanceValue,
  serializeAnnotation,
  parseAnnotation,
  serializeArtifactMetadata,
  parseArtifactMetadata,
  serializeSchemaArtifactMetadata,
  parseSchemaArtifactMetadata,
  serializeCardinality,
  parseCardinality,
  serializeProperty,
  parseProperty,
  serializeLabelOverride,
  parseLabelOverride,
  serializeAnnotationValue,
  parseAnnotationValue,
  parseLinkFieldSpec,
  serializeLinkFieldSpec,
  CedarConstructionError,
  iri,
  annotation,
  property,
  attributeValueFieldId,
  controlledTermFieldId,
  dateFieldId,
  dateTimeFieldId,
  doiFieldId,
  emailFieldId,
  linkFieldId,
  multipleChoiceFieldId,
  nihGrantIdFieldId,
  numericFieldId,
  orcidFieldId,
  phoneNumberFieldId,
  pubMedIdFieldId,
  rorFieldId,
  rridFieldId,
  singleChoiceFieldId,
  textFieldId,
  timeFieldId,
  presentationComponentId,
} from '../src/index.js';

// ---- Shared metadata fixtures ----------------------------------------

const dm = descriptiveMetadata({ name: 'Demo' });
const tp = temporalProvenance({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-02T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const am = artifactMetadata({ descriptiveMetadata: dm, provenance: tp });
const sam = schemaArtifactMetadata({
  artifact: am,
  versioning: schemaVersioning({
    version: '1.0.0',
    status: 'draft',
    modelVersion: '0.1.0',
  }),
});

// ---- MultilingualString round-trip -----------------------------------

describe('MultilingualString round-trip', () => {
  it('round-trips a single bare-string entry', () => {
    const ms = parseMultilingualString([{ value: 'hi', lang: 'en' }]);
    const wire = serializeMultilingualString(ms);
    expect(wire).toEqual([{ value: 'hi', lang: 'en' }]);
    const ms2 = parseMultilingualString(wire);
    expect(serializeMultilingualString(ms2)).toEqual(wire);
  });

  it('rejects non-array input', () => {
    expect(() => parseMultilingualString({ value: 'x', lang: 'en' })).toThrow(
      CedarConstructionError,
    );
  });
});

// ---- Literal round-trip ----------------------------------------------

describe('Literal round-trip', () => {
  it('SimpleLiteral: { value }', () => {
    const lit = simpleLiteral('hello');
    expect(serializeLiteral(lit)).toEqual({ value: 'hello' });
    expect(parseLiteral({ value: 'hello' })).toEqual(lit);
  });

  it('LangTaggedLiteral: { value, lang }', () => {
    const lit = langTaggedLiteral('hello', 'en');
    expect(serializeLiteral(lit)).toEqual({ value: 'hello', lang: 'en' });
    expect(parseLiteral({ value: 'hello', lang: 'en' })).toEqual(lit);
  });

  it('TypedLiteral: { value, datatype }', () => {
    const lit = numericLiteral('42', 'integer');
    expect(serializeLiteral(lit)).toMatchObject({
      value: '42',
      datatype: expect.any(String),
    });
    const round = parseLiteral(serializeLiteral(lit));
    expect(round).toEqual(lit);
  });

  it('rejects multi-match { value, lang, datatype }', () => {
    expect(() =>
      parseLiteral({
        value: 'x',
        lang: 'en',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
      }),
    ).toThrow(/MUST NOT carry both/);
  });

  it('rejects no-match (no value)', () => {
    expect(() => parseLiteral({ lang: 'en' })).toThrow(/missing required/);
  });

  it('TextLiteral position rejects datatype', () => {
    expect(() =>
      parseTextLiteral({
        value: 'x',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
      }),
    ).toThrow(/datatype/);
  });

  it('rejects null property where omission is required', () => {
    expect(() => parseLiteral({ value: 'x', lang: null })).toThrow(
      /MUST be omitted/,
    );
  });
});

// ---- Value round-trips -----------------------------------------------

const valueSamples = [
  ['TextValue (simple)', textValue('hello')],
  ['TextValue (lang)', textValue(langTaggedLiteral('hello', 'en'))],
  ['NumericValue', numericValue(numericLiteral('42', 'integer'))],
  ['YearValue', yearValue('2024')],
  ['YearMonthValue', yearMonthValue('2024-06')],
  ['FullDateValue', fullDateValue(fullDateLiteral('2024-01-01'))],
  ['TimeValue', timeValue(timeLiteral('14:00:00'))],
  ['DateTimeValue', dateTimeValue(dateTimeLiteral('2024-01-01T12:00:00Z'))],
  [
    'ControlledTermValue',
    controlledTermValue({ term: 'http://example.org/term/1', label: 'Term One' }),
  ],
  ['LiteralChoiceValue', literalChoiceValue('Yes', 'en')],
  [
    'ControlledTermChoiceValue',
    controlledTermChoiceValue(
      controlledTermValue({ term: 'http://example.org/c/1', label: 'C1' }),
    ),
  ],
  ['LinkValue', linkValue({ iri: 'https://example.org/' })],
  ['LinkValue (with label)', linkValue({ iri: 'https://example.org/', label: 'Home' })],
  ['EmailValue', emailValue('user@example.org')],
  ['PhoneNumberValue', phoneNumberValue('+1-555-555-5555')],
  ['OrcidValue', orcidValue('https://orcid.org/0000-0002-1825-0097')],
  ['RorValue', rorValue('https://ror.org/00f54p054')],
  ['DoiValue', doiValue('https://doi.org/10.1234/abcd')],
  ['PubMedIdValue', pubMedIdValue('https://www.ncbi.nlm.nih.gov/pubmed/12345')],
  ['RridValue', rridValue('https://identifiers.org/rrid/RRID:AB_2336178')],
  [
    'NihGrantIdValue',
    nihGrantIdValue('https://reporter.nih.gov/award/grant/R01EB019999'),
  ],
] as const;

describe('Value round-trip', () => {
  for (const [name, v] of valueSamples) {
    it(name, () => {
      const wire = serializeValue(v);
      const back = parseValue(wire);
      expect(serializeValue(back)).toEqual(wire);
    });
  }

  it('AttributeValue (recursive)', () => {
    const av = attributeValue('weight', textValue('heavy'));
    const wire = serializeValue(av);
    const back = parseValue(wire);
    expect(serializeValue(back)).toEqual(wire);
  });
});

// ---- Cardinality / Property / LabelOverride --------------------------

describe('Cardinality round-trip', () => {
  it('with min/max', () => {
    const c = cardinality({ min: 1, max: 5 });
    expect(serializeCardinality(c)).toEqual({ min: 1, max: 5 });
    expect(parseCardinality({ min: 1, max: 5 })).toEqual(c);
  });

  it('with min only (unbounded max)', () => {
    const c = cardinality({ min: 0 });
    expect(serializeCardinality(c)).toEqual({ min: 0 });
    expect(parseCardinality({ min: 0 })).toEqual(c);
  });

  it('rejects null max', () => {
    expect(() => parseCardinality({ min: 0, max: null })).toThrow(
      /MUST be omitted/,
    );
  });
});

describe('Property round-trip', () => {
  it('iri-only', () => {
    const p = property('https://schema.org/name');
    expect(serializeProperty(p)).toEqual({ iri: 'https://schema.org/name' });
    expect(parseProperty({ iri: 'https://schema.org/name' })).toEqual(p);
  });

  it('with label', () => {
    const p = property({ iri: 'https://schema.org/name', label: 'name' });
    const wire = serializeProperty(p);
    expect(parseProperty(wire)).toEqual(p);
  });
});

describe('LabelOverride round-trip', () => {
  it('with label only', () => {
    const lo = labelOverride({ label: 'Name' });
    const wire = serializeLabelOverride(lo);
    expect(parseLabelOverride(wire)).toEqual(lo);
  });
});

// ---- AnnotationValue (property-set discrimination) -------------------

describe('AnnotationValue round-trip', () => {
  it('Iri arm wraps as { iri }', () => {
    const a = iri('https://example.org/x');
    expect(serializeAnnotationValue(a)).toEqual({
      iri: 'https://example.org/x',
    });
    const back = parseAnnotationValue({ iri: 'https://example.org/x' });
    expect((back as { value: string }).value).toBe('https://example.org/x');
  });

  it('SimpleLiteral arm wraps as { value }', () => {
    const lit = simpleLiteral('foo');
    expect(serializeAnnotationValue(lit)).toEqual({ value: 'foo' });
    const back = parseAnnotationValue({ value: 'foo' });
    expect((back as { kind: string }).kind).toBe('SimpleLiteral');
  });

  it('rejects multi-match { iri, value }', () => {
    expect(() =>
      parseAnnotationValue({ iri: 'https://example.org/x', value: 'oops' }),
    ).toThrow(/MUST NOT carry both/);
  });

  it('rejects no-match {}', () => {
    expect(() => parseAnnotationValue({})).toThrow(/MUST carry/);
  });
});

// ---- Annotation round-trip ------------------------------------------

describe('Annotation round-trip', () => {
  it('with literal body', () => {
    const a = annotation('https://example.org/p', simpleLiteral('foo'));
    const wire = serializeAnnotation(a);
    expect(wire).toEqual({
      property: 'https://example.org/p',
      body: { value: 'foo' },
    });
    expect(parseAnnotation(wire)).toEqual(a);
  });

  it('with iri body', () => {
    const a = annotation('https://example.org/p', iri('https://example.org/o'));
    const wire = serializeAnnotation(a);
    expect(wire).toEqual({
      property: 'https://example.org/p',
      body: { iri: 'https://example.org/o' },
    });
    expect(parseAnnotation(wire)).toEqual(a);
  });
});

// ---- ArtifactMetadata / SchemaArtifactMetadata round-trip ------------

describe('Metadata round-trip', () => {
  it('ArtifactMetadata', () => {
    const wire = serializeArtifactMetadata(am);
    const back = parseArtifactMetadata(wire);
    expect(serializeArtifactMetadata(back)).toEqual(wire);
  });

  it('SchemaArtifactMetadata', () => {
    const wire = serializeSchemaArtifactMetadata(sam);
    const back = parseSchemaArtifactMetadata(wire);
    expect(serializeSchemaArtifactMetadata(back)).toEqual(wire);
  });
});

// ---- FieldSpec round-trips ------------------------------------------

const fieldSpecSamples = [
  ['TextFieldSpec', textFieldSpec({ minLength: 1, maxLength: 100 })],
  [
    'NumericFieldSpec',
    numericFieldSpec({
      datatype: 'integer',
      numericPrecision: 0,
    }),
  ],
  ['DateFieldSpec', dateFieldSpec({ dateValueType: 'fullDate' })],
  ['TimeFieldSpec', timeFieldSpec()],
  [
    'DateTimeFieldSpec',
    dateTimeFieldSpec({ dateTimeValueType: 'dateHourMinuteSecond' }),
  ],
  [
    'ControlledTermFieldSpec',
    controlledTermFieldSpec(
      ontologySource(
        ontologyReference({
          iri: 'http://example.org/ont/',
          displayHint: ontologyDisplayHint({ acronym: 'EX' }),
        }),
      ),
    ),
  ],
  [
    'LiteralSingleChoiceFieldSpec',
    literalSingleChoiceFieldSpec({
      options: [literalChoiceOption('A', 'en'), literalChoiceOption('B', 'en')],
    }),
  ],
  [
    'ControlledTermSingleChoiceFieldSpec',
    controlledTermSingleChoiceFieldSpec({
      options: [
        controlledTermChoiceOption(
          controlledTermValue({ term: 'http://example.org/c/1', label: 'C1' }),
        ),
      ],
    }),
  ],
  ['LinkFieldSpec', linkFieldSpec()],
  ['EmailFieldSpec', emailFieldSpec()],
  ['PhoneNumberFieldSpec', phoneNumberFieldSpec()],
  ['OrcidFieldSpec', orcidFieldSpec()],
  ['RorFieldSpec', rorFieldSpec()],
  ['DoiFieldSpec', doiFieldSpec()],
  ['PubMedIdFieldSpec', pubMedIdFieldSpec()],
  ['RridFieldSpec', rridFieldSpec()],
  ['NihGrantIdFieldSpec', nihGrantIdFieldSpec()],
  ['AttributeValueFieldSpec', attributeValueFieldSpec()],
] as const;

describe('FieldSpec round-trip', () => {
  for (const [name, spec] of fieldSpecSamples) {
    it(name, () => {
      const wire = serializeFieldSpec(spec);
      const back = parseFieldSpec(wire);
      expect(serializeFieldSpec(back)).toEqual(wire);
    });
  }

  it('LinkFieldSpec is a kind-only object on the wire', () => {
    expect(serializeLinkFieldSpec(linkFieldSpec())).toEqual({
      kind: 'LinkFieldSpec',
    });
    expect(parseLinkFieldSpec({ kind: 'LinkFieldSpec' })).toEqual(
      linkFieldSpec(),
    );
  });

  it('FieldSpec rejects unknown kind', () => {
    expect(() => parseFieldSpec({ kind: 'FrobFieldSpec' })).toThrow(
      /Expected kind/,
    );
  });
});

// ---- DefaultValue round-trip ----------------------------------------

describe('DefaultValue round-trip', () => {
  it('TextDefaultValue', () => {
    const dv = textDefaultValue(textValue('hello'));
    const wire = serializeDefaultValue(dv);
    const back = parseDefaultValue(wire);
    expect(serializeDefaultValue(back)).toEqual(wire);
  });

  it('NumericDefaultValue', () => {
    const dv = numericDefaultValue(numericValue(numericLiteral('5', 'integer')));
    const wire = serializeDefaultValue(dv);
    expect(parseDefaultValue(wire)).toEqual(dv);
  });

  it('ControlledTermDefaultValue', () => {
    const dv = controlledTermDefaultValue(
      controlledTermValue({ term: 'http://example.org/term/1' }),
    );
    const wire = serializeDefaultValue(dv);
    expect(parseDefaultValue(wire)).toEqual(dv);
  });

  it('rejects unknown kind', () => {
    expect(() =>
      parseDefaultValue({ kind: 'UnknownDefaultValue', value: {} }),
    ).toThrow(/Expected kind/);
  });
});

// ---- Field round-trip ------------------------------------------------

const fieldSamples = [
  [
    'TextField',
    textField({
      id: 'https://example.org/fields/text',
      metadata: sam,
      fieldSpec: textFieldSpec(),
    }),
  ],
  [
    'NumericField',
    numericField({
      id: 'https://example.org/fields/num',
      metadata: sam,
      fieldSpec: numericFieldSpec({ datatype: 'integer' }),
    }),
  ],
  [
    'DateField',
    dateField({
      id: 'https://example.org/fields/date',
      metadata: sam,
      fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
    }),
  ],
  [
    'EmailField',
    emailField({
      id: 'https://example.org/fields/email',
      metadata: sam,
      fieldSpec: emailFieldSpec(),
    }),
  ],
  [
    'OrcidField',
    orcidField({
      id: 'https://example.org/fields/orcid',
      metadata: sam,
      fieldSpec: orcidFieldSpec(),
    }),
  ],
  [
    'LinkField',
    linkField({
      id: 'https://example.org/fields/link',
      metadata: sam,
      fieldSpec: linkFieldSpec(),
    }),
  ],
  [
    'AttributeValueField',
    attributeValueField({
      id: 'https://example.org/fields/attr',
      metadata: sam,
      fieldSpec: attributeValueFieldSpec(),
    }),
  ],
  [
    'PhoneNumberField',
    phoneNumberField({
      id: 'https://example.org/fields/phone',
      metadata: sam,
      fieldSpec: phoneNumberFieldSpec(),
    }),
  ],
  [
    'RorField',
    rorField({
      id: 'https://example.org/fields/ror',
      metadata: sam,
      fieldSpec: rorFieldSpec(),
    }),
  ],
  [
    'DoiField',
    doiField({
      id: 'https://example.org/fields/doi',
      metadata: sam,
      fieldSpec: doiFieldSpec(),
    }),
  ],
  [
    'PubMedIdField',
    pubMedIdField({
      id: 'https://example.org/fields/pmid',
      metadata: sam,
      fieldSpec: pubMedIdFieldSpec(),
    }),
  ],
  [
    'RridField',
    rridField({
      id: 'https://example.org/fields/rrid',
      metadata: sam,
      fieldSpec: rridFieldSpec(),
    }),
  ],
  [
    'NihGrantIdField',
    nihGrantIdField({
      id: 'https://example.org/fields/grant',
      metadata: sam,
      fieldSpec: nihGrantIdFieldSpec(),
    }),
  ],
  [
    'ControlledTermField',
    controlledTermField({
      id: 'https://example.org/fields/ct',
      metadata: sam,
      fieldSpec: controlledTermFieldSpec(
        ontologySource(
          ontologyReference({
            iri: 'http://example.org/ont/',
            displayHint: ontologyDisplayHint({ acronym: 'EX' }),
          }),
        ),
      ),
    }),
  ],
  [
    'SingleChoiceField (literal)',
    singleChoiceField({
      id: 'https://example.org/fields/single-lit',
      metadata: sam,
      fieldSpec: literalSingleChoiceFieldSpec({
        options: [literalChoiceOption('A', 'en')],
      }),
    }),
  ],
  [
    'MultipleChoiceField (literal)',
    multipleChoiceField({
      id: 'https://example.org/fields/multi-lit',
      metadata: sam,
      fieldSpec: {
        kind: 'LiteralMultipleChoiceFieldSpec',
        options: [
          literalChoiceOption('A', 'en'),
          literalChoiceOption('B', 'en'),
        ],
      } as const,
    }),
  ],
] as const;

describe('Field round-trip', () => {
  for (const [name, f] of fieldSamples) {
    it(name, () => {
      const wire = serializeField(f);
      const back = parseField(wire);
      expect(serializeField(back)).toEqual(wire);
    });
  }

  it('Field id collapses to a bare string IRI on the wire', () => {
    const f = textField({
      id: 'https://example.org/fields/text',
      metadata: sam,
      fieldSpec: textFieldSpec(),
    });
    const wire = serializeField(f) as { id: unknown };
    expect(wire.id).toBe('https://example.org/fields/text');
  });

  it('parser rejects missing id', () => {
    const wire = serializeField(
      textField({
        id: 'https://example.org/fields/text',
        metadata: sam,
        fieldSpec: textFieldSpec(),
      }),
    ) as Record<string, unknown>;
    delete wire['id'];
    expect(() => parseField(wire)).toThrow(/missing required/);
  });

  it('parser rejects unknown property', () => {
    const wire = serializeField(
      textField({
        id: 'https://example.org/fields/text',
        metadata: sam,
        fieldSpec: textFieldSpec(),
      }),
    ) as Record<string, unknown>;
    wire['frob'] = 'oops';
    expect(() => parseField(wire)).toThrow(/Unknown property/);
  });

  it('parser tolerates underscore-prefixed extensions', () => {
    const wire = serializeField(
      textField({
        id: 'https://example.org/fields/text',
        metadata: sam,
        fieldSpec: textFieldSpec(),
      }),
    ) as Record<string, unknown>;
    wire['_extra'] = 'ok';
    // Should not throw.
    const back = parseField(wire);
    expect(back.kind).toBe('TextField');
  });
});

// ---- EmbeddedField round-trip ---------------------------------------

describe('EmbeddedField round-trip', () => {
  it('EmbeddedTextField with all common props', () => {
    const e = embeddedTextField({
      key: 'name',
      reference: textFieldId('https://example.org/fields/text'),
      valueRequirement: 'required',
      cardinality: cardinality({ min: 0, max: 3 }),
      labelOverride: labelOverride({ label: 'Name' }),
      property: 'https://schema.org/name',
      defaultValue: 'Anonymous',
    });
    const wire = serializeEmbeddedField(e);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('EmbeddedAttributeValueField has no defaultValue slot', () => {
    const e = embeddedAttributeValueField({
      key: 'attrs',
      reference: attributeValueFieldId('https://example.org/fields/attr'),
    });
    const wire = serializeEmbeddedField(e);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it.each([
    [
      'EmbeddedNumericField',
      embeddedNumericField({
        key: 'n',
        reference: numericFieldId('https://example.org/fields/num'),
      }),
    ],
    [
      'EmbeddedDateField',
      embeddedDateField({
        key: 'd',
        reference: dateFieldId('https://example.org/fields/date'),
      }),
    ],
    [
      'EmbeddedTimeField',
      embeddedTimeField({
        key: 't',
        reference: timeFieldId('https://example.org/fields/time'),
      }),
    ],
    [
      'EmbeddedDateTimeField',
      embeddedDateTimeField({
        key: 'dt',
        reference: dateTimeFieldId('https://example.org/fields/dt'),
      }),
    ],
    [
      'EmbeddedControlledTermField',
      embeddedControlledTermField({
        key: 'ct',
        reference: controlledTermFieldId('https://example.org/fields/ct'),
      }),
    ],
    [
      'EmbeddedSingleChoiceField',
      embeddedSingleChoiceField({
        key: 'sc',
        reference: singleChoiceFieldId('https://example.org/fields/sc'),
      }),
    ],
    [
      'EmbeddedMultipleChoiceField',
      embeddedMultipleChoiceField({
        key: 'mc',
        reference: multipleChoiceFieldId('https://example.org/fields/mc'),
      }),
    ],
    [
      'EmbeddedLinkField',
      embeddedLinkField({
        key: 'lnk',
        reference: linkFieldId('https://example.org/fields/lnk'),
      }),
    ],
    [
      'EmbeddedEmailField',
      embeddedEmailField({
        key: 'em',
        reference: emailFieldId('https://example.org/fields/em'),
      }),
    ],
    [
      'EmbeddedPhoneNumberField',
      embeddedPhoneNumberField({
        key: 'ph',
        reference: phoneNumberFieldId('https://example.org/fields/ph'),
      }),
    ],
    [
      'EmbeddedOrcidField',
      embeddedOrcidField({
        key: 'or',
        reference: orcidFieldId('https://example.org/fields/or'),
      }),
    ],
    [
      'EmbeddedRorField',
      embeddedRorField({
        key: 'ro',
        reference: rorFieldId('https://example.org/fields/ro'),
      }),
    ],
    [
      'EmbeddedDoiField',
      embeddedDoiField({
        key: 'do',
        reference: doiFieldId('https://example.org/fields/do'),
      }),
    ],
    [
      'EmbeddedPubMedIdField',
      embeddedPubMedIdField({
        key: 'pm',
        reference: pubMedIdFieldId('https://example.org/fields/pm'),
      }),
    ],
    [
      'EmbeddedRridField',
      embeddedRridField({
        key: 'rr',
        reference: rridFieldId('https://example.org/fields/rr'),
      }),
    ],
    [
      'EmbeddedNihGrantIdField',
      embeddedNihGrantIdField({
        key: 'gr',
        reference: nihGrantIdFieldId('https://example.org/fields/gr'),
      }),
    ],
  ])('round-trips %s', (_name, e) => {
    const wire = serializeEmbeddedField(e);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('EmbeddedTemplate round-trip', () => {
    const e = embeddedTemplate({
      key: 'sub',
      reference: templateId('https://example.org/templates/sub'),
      cardinality: cardinality({ min: 0 }),
    });
    const wire = serializeEmbeddedArtifact(e);
    expect(parseEmbeddedArtifact(wire)).toEqual(e);
  });

  it('EmbeddedPresentationComponent round-trip', () => {
    const e = embeddedPresentationComponent({
      key: 'intro',
      reference: presentationComponentId('https://example.org/pc/intro'),
    });
    const wire = serializeEmbeddedArtifact(e);
    expect(parseEmbeddedArtifact(wire)).toEqual(e);
  });
});

// ---- PresentationComponent round-trip --------------------------------

describe('PresentationComponent round-trip', () => {
  it('RichTextComponent', () => {
    const c = richTextComponent({
      id: 'https://example.org/pc/rt',
      metadata: am,
      html: '<p>hi</p>',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('ImageComponent', () => {
    const c = imageComponent({
      id: 'https://example.org/pc/img',
      metadata: am,
      image: 'https://example.org/img.png',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('YoutubeVideoComponent', () => {
    const c = youtubeVideoComponent({
      id: 'https://example.org/pc/vid',
      metadata: am,
      video: 'https://www.youtube.com/watch?v=abc',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('SectionBreakComponent', () => {
    const c = sectionBreakComponent({
      id: 'https://example.org/pc/sec',
      metadata: am,
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('PageBreakComponent', () => {
    const c = pageBreakComponent({
      id: 'https://example.org/pc/page',
      metadata: am,
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('id collapses to bare string', () => {
    const c = richTextComponent({
      id: 'https://example.org/pc/rt',
      metadata: am,
      html: '<p>hi</p>',
    });
    const wire = serializePresentationComponent(c) as { id: unknown };
    expect(wire.id).toBe('https://example.org/pc/rt');
  });
});

// ---- Template round-trip --------------------------------------------

const sampleTemplate = template({
  id: 'https://example.org/templates/demo',
  metadata: sam,
  header: 'Hello',
  footer: 'Bye',
  embedded: [
    embeddedTextField({
      key: 'title',
      reference: textFieldId('https://example.org/fields/title'),
      valueRequirement: 'required',
    }),
    embeddedPresentationComponent({
      key: 'intro',
      reference: presentationComponentId('https://example.org/pc/intro'),
    }),
    embeddedTemplate({
      key: 'sub',
      reference: templateId('https://example.org/templates/sub'),
    }),
  ],
});

describe('Template round-trip', () => {
  it('round-trips with header/footer/embedded', () => {
    const wire = serializeTemplate(sampleTemplate);
    const back = parseTemplate(wire);
    expect(serializeTemplate(back)).toEqual(wire);
  });

  it('id collapses to bare string', () => {
    const wire = serializeTemplate(sampleTemplate) as { id: unknown };
    expect(wire.id).toBe('https://example.org/templates/demo');
  });

  it('preserves order of embedded artifacts on round-trip', () => {
    const wire = serializeTemplate(sampleTemplate) as { embedded: { key: string }[] };
    expect(wire.embedded.map((e) => e.key)).toEqual(['title', 'intro', 'sub']);
    const back = parseTemplate(wire);
    expect(back.embedded.map((e) => e.key)).toEqual(['title', 'intro', 'sub']);
  });

  it('rejects wrong kind', () => {
    expect(() =>
      parseTemplate({ kind: 'NotATemplate', id: 'x', metadata: {} as never }),
    ).toThrow(/expected kind "Template"/);
  });

  it('rejects missing required property', () => {
    const wire = serializeTemplate(sampleTemplate) as Record<string, unknown>;
    delete wire['embedded'];
    expect(() => parseTemplate(wire)).toThrow(/missing required/);
  });
});

// ---- TemplateInstance round-trip ------------------------------------

const sampleInstance = templateInstance({
  id: templateInstanceId('https://example.org/instances/i1'),
  metadata: am,
  templateRef: 'https://example.org/templates/demo',
  values: [
    fieldValue('title', textValue('hello')),
    nestedTemplateInstance('sub', [
      fieldValue('inner', textValue('world')),
    ]),
  ],
});

describe('TemplateInstance round-trip', () => {
  it('round-trips with FieldValue and NestedTemplateInstance', () => {
    const wire = serializeTemplateInstance(sampleInstance);
    const back = parseTemplateInstance(wire);
    expect(serializeTemplateInstance(back)).toEqual(wire);
  });

  it('FieldValue rejects empty values array', () => {
    expect(() =>
      parseFieldValue({ kind: 'FieldValue', key: 'k', values: [] }),
    ).toThrow(/non-empty/);
  });

  it('NestedTemplateInstance permits empty values', () => {
    const n = nestedTemplateInstance('e');
    const wire = serializeNestedTemplateInstance(n);
    expect(parseNestedTemplateInstance(wire)).toEqual(n);
  });

  it('InstanceValue rejects unknown kind', () => {
    expect(() =>
      parseInstanceValue({ kind: 'NotAValue', key: 'x', values: [] }),
    ).toThrow(/Expected kind/);
  });

  it('FieldValue serialize / parse round-trip', () => {
    const fv = fieldValue('k', textValue('v'));
    const wire = serializeFieldValue(fv);
    expect(parseFieldValue(wire)).toEqual(fv);
  });

  it('templateRef collapses to bare string', () => {
    const wire = serializeTemplateInstance(sampleInstance) as {
      templateRef: unknown;
    };
    expect(wire.templateRef).toBe('https://example.org/templates/demo');
  });
});

// ---- Generic dispatcher (serialize / parse) -------------------------

describe('Generic serialize() / parse() dispatcher', () => {
  it('serialize() dispatches by kind for Template', () => {
    const wire = serialize(sampleTemplate);
    expect((wire as { kind: string }).kind).toBe('Template');
  });

  it('serialize() dispatches by kind for TemplateInstance', () => {
    const wire = serialize(sampleInstance);
    expect((wire as { kind: string }).kind).toBe('TemplateInstance');
  });

  it('serialize() dispatches by kind for Field', () => {
    const f = textField({
      id: 'https://example.org/fields/x',
      metadata: sam,
      fieldSpec: textFieldSpec(),
    });
    const wire = serialize(f);
    expect((wire as { kind: string }).kind).toBe('TextField');
  });

  it('serialize() dispatches by kind for PresentationComponent', () => {
    const c = sectionBreakComponent({
      id: 'https://example.org/pc/x',
      metadata: am,
    });
    const wire = serialize(c);
    expect((wire as { kind: string }).kind).toBe('SectionBreakComponent');
  });

  it('parse(json, "Template") delegates to parseTemplate', () => {
    const wire = serialize(sampleTemplate);
    const back = parse(wire, 'Template');
    expect(back).toEqual(sampleTemplate);
  });

  it('parse(json, "TemplateInstance") delegates to parseTemplateInstance', () => {
    const wire = serialize(sampleInstance);
    const back = parse(wire, 'TemplateInstance');
    expect(back).toEqual(sampleInstance);
  });

  it('parse(json, "Artifact") dispatches by kind', () => {
    const wire = serialize(sampleTemplate);
    const back = parse(wire, 'Artifact');
    expect(back.kind).toBe('Template');
  });

  it('parse(json, "Artifact") rejects missing kind', () => {
    expect(() => parse({ id: 'x' }, 'Artifact')).toThrow(/string "kind"/);
  });
});

// ---- The PI example as a smoke test ---------------------------------

describe('Smoke: full PI Template + instance round-trip', () => {
  it('Template round-trips through serialize/parse', () => {
    const wire = serialize(sampleTemplate);
    const back = parse(wire, 'Template');
    expect(serialize(back)).toEqual(wire);
  });

  it('Instance round-trips through serialize/parse', () => {
    const wire = serialize(sampleInstance);
    const back = parse(wire, 'TemplateInstance');
    expect(serialize(back)).toEqual(wire);
  });
});
