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
  controlledTermField,
  controlledTermFieldSpec,
  controlledTermValue,
  dateField,
  dateFieldSpec,
  dateTimeFieldSpec,
  dateTimeValue,
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
  embeddedMultiValuedEnumField,
  embeddedNihGrantIdField,
  embeddedIntegerNumberField,
  embeddedRealNumberField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedPubMedIdField,
  embeddedRorField,
  embeddedRridField,
  embeddedSingleValuedEnumField,
  embeddedTemplate,
  embeddedTextField,
  embeddedTimeField,
  emailField,
  emailFieldSpec,
  emailValue,
  fieldValue,
  fullDateValue,
  imageComponent,
  labelOverride,
  linkField,
  linkFieldSpec,
  linkValue,
  permissibleValue,
  enumValue,
  singleValuedEnumFieldSpec,
  multiValuedEnumFieldSpec,
  multiValuedEnumField,
  singleValuedEnumField,
  nestedTemplateInstance,
  nihGrantIdField,
  nihGrantIdFieldSpec,
  nihGrantIdValue,
  integerNumberField,
  integerNumberFieldSpec,
  integerNumberValue,
  numericRenderingHint,
  realNumberField,
  realNumberFieldSpec,
  realNumberValue,
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
  schemaArtifactVersioning,
  sectionBreakComponent,
  template,
  templateId,
  templateInstance,
  templateInstanceId,
  lifecycleMetadata,
  textField,
  textFieldSpec,
  textValue,
  timeFieldSpec,
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
  serializeEmbeddedField,
  parseEmbeddedField,
  serializeEmbeddedArtifact,
  parseEmbeddedArtifact,
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
  annotationStringValue,
  annotationIriValue,
  property,
  attributeValueFieldId,
  controlledTermFieldId,
  dateFieldId,
  dateTimeFieldId,
  doiFieldId,
  emailFieldId,
  linkFieldId,
  multiValuedEnumFieldId,
  nihGrantIdFieldId,
  integerNumberFieldId,
  realNumberFieldId,
  orcidFieldId,
  phoneNumberFieldId,
  pubMedIdFieldId,
  rorFieldId,
  rridFieldId,
  singleValuedEnumFieldId,
  textFieldId,
  timeFieldId,
  presentationComponentId,
} from '../src/index.js';

// ---- Shared metadata fixtures ----------------------------------------

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-02T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const am = artifactMetadata({ name: 'Demo', lifecycle: tp });
const sam = schemaArtifactMetadata({
  artifact: am,
  versioning: schemaArtifactVersioning({
    version: '1.0.0',
    status: 'draft',
  }),
});

const MV = '0.1.0';

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

// ---- Value round-trips -----------------------------------------------

const valueSamples = [
  ['TextValue (no lang)', textValue('hello')],
  ['TextValue (lang)', textValue('hello', 'en')],
  ['IntegerNumberValue', integerNumberValue('42')],
  ['RealNumberValue', realNumberValue('3.14', 'decimal')],
  ['BooleanValue', { kind: 'BooleanValue' as const, value: true }],
  ['YearValue', yearValue('2024')],
  ['YearMonthValue', yearMonthValue('2024-06')],
  ['FullDateValue', fullDateValue('2024-01-01')],
  ['TimeValue', timeValue('14:00:00')],
  ['DateTimeValue', dateTimeValue('2024-01-01T12:00:00Z')],
  [
    'ControlledTermValue',
    controlledTermValue({ term: 'http://example.org/term/1', label: 'Term One' }),
  ],
  ['EnumValue', enumValue('option-a')],
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

  it('TextValue wire shape carries value (and lang when present)', () => {
    expect(serializeValue(textValue('Hi'))).toEqual({
      kind: 'TextValue',
      value: 'Hi',
    });
    expect(serializeValue(textValue('Hi', 'en'))).toEqual({
      kind: 'TextValue',
      value: 'Hi',
      lang: 'en',
    });
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

// ---- AnnotationValue (kind-discriminated) ----------------------------

describe('AnnotationValue round-trip', () => {
  it('AnnotationIriValue arm carries kind+iri', () => {
    const a = annotationIriValue('https://example.org/x');
    expect(serializeAnnotationValue(a)).toEqual({
      kind: 'AnnotationIriValue',
      iri: 'https://example.org/x',
    });
    const back = parseAnnotationValue({
      kind: 'AnnotationIriValue',
      iri: 'https://example.org/x',
    });
    expect((back as { kind: string }).kind).toBe('AnnotationIriValue');
  });

  it('AnnotationStringValue arm carries kind+value', () => {
    const sv = annotationStringValue('foo');
    expect(serializeAnnotationValue(sv)).toEqual({
      kind: 'AnnotationStringValue',
      value: 'foo',
    });
    const back = parseAnnotationValue({
      kind: 'AnnotationStringValue',
      value: 'foo',
    });
    expect((back as { kind: string }).kind).toBe('AnnotationStringValue');
  });

  it('AnnotationStringValue with lang', () => {
    const sv = annotationStringValue('foo', 'en');
    expect(serializeAnnotationValue(sv)).toEqual({
      kind: 'AnnotationStringValue',
      value: 'foo',
      lang: 'en',
    });
    const back = parseAnnotationValue({
      kind: 'AnnotationStringValue',
      value: 'foo',
      lang: 'en',
    });
    expect((back as { kind: string }).kind).toBe('AnnotationStringValue');
  });

  it('rejects unknown kind', () => {
    expect(() => parseAnnotationValue({ kind: 'oops' })).toThrow(/AnnotationStringValue/);
  });
});

// ---- Annotation round-trip ------------------------------------------

describe('Annotation round-trip', () => {
  it('with string body', () => {
    const a = annotation('https://example.org/p', annotationStringValue('foo'));
    const wire = serializeAnnotation(a);
    expect(wire).toEqual({
      property: 'https://example.org/p',
      body: { kind: 'AnnotationStringValue', value: 'foo' },
    });
    expect(parseAnnotation(wire)).toEqual(a);
  });

  it('with iri body', () => {
    const a = annotation(
      'https://example.org/p',
      annotationIriValue('https://example.org/o'),
    );
    const wire = serializeAnnotation(a);
    expect(wire).toEqual({
      property: 'https://example.org/p',
      body: { kind: 'AnnotationIriValue', iri: 'https://example.org/o' },
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
  ['IntegerNumberFieldSpec', integerNumberFieldSpec()],
  [
    'RealNumberFieldSpec',
    realNumberFieldSpec({
      datatype: 'decimal',
      renderingHint: numericRenderingHint(2),
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
    'SingleValuedEnumFieldSpec',
    singleValuedEnumFieldSpec({
      permissibleValues: [
        permissibleValue({ value: 'a', label: 'A' }),
        permissibleValue({ value: 'b', label: 'B' }),
      ],
    }),
  ],
  [
    'MultiValuedEnumFieldSpec',
    multiValuedEnumFieldSpec({
      permissibleValues: [
        permissibleValue({ value: 'a', label: 'A' }),
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

// ---- EmbeddedField defaultValue wire-form round-trips ----------------

describe('EmbeddedXxxField.defaultValue wire-form', () => {
  it('Text — emits { kind, value [, lang] }', () => {
    const e = embeddedTextField({
      key: 't',
      artifactRef: textFieldId('https://example.org/x'),
      defaultValue: 'Stanford University',
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: unknown };
    expect(wire.defaultValue).toEqual({
      kind: 'TextValue',
      value: 'Stanford University',
    });
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('IntegerNumber — emits { kind, value }', () => {
    const e = embeddedIntegerNumberField({
      key: 'n',
      artifactRef: integerNumberFieldId('https://example.org/x'),
      defaultValue: '42',
    });
    const wire = serializeEmbeddedField(e) as {
      defaultValue: { kind: string; value: string };
    };
    expect(wire.defaultValue.kind).toBe('IntegerNumberValue');
    expect(wire.defaultValue.value).toBe('42');
    expect((wire.defaultValue as { datatype?: string }).datatype).toBeUndefined();
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('RealNumber — emits { kind, value, datatype }', () => {
    const e = embeddedRealNumberField({
      key: 'r',
      artifactRef: realNumberFieldId('https://example.org/x'),
      defaultValue: realNumberValue('3.14', 'decimal'),
    });
    const wire = serializeEmbeddedField(e) as {
      defaultValue: { kind: string; value: string; datatype: string };
    };
    expect(wire.defaultValue.kind).toBe('RealNumberValue');
    expect(wire.defaultValue.value).toBe('3.14');
    expect(wire.defaultValue.datatype).toBe('decimal');
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('Date — emits DateValue with kind retained', () => {
    const e = embeddedDateField({
      key: 'd',
      artifactRef: dateFieldId('https://example.org/x'),
      defaultValue: '2024-06-15',
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: { kind: string } };
    expect(wire.defaultValue.kind).toBe('FullDateValue');
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('ControlledTerm — emits ControlledTermValue with kind retained', () => {
    const e = embeddedControlledTermField({
      key: 'ct',
      artifactRef: controlledTermFieldId('https://example.org/x'),
      defaultValue: controlledTermValue({ term: 'http://example.org/term/1' }),
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: Record<string, unknown> };
    expect(wire.defaultValue['kind']).toBe('ControlledTermValue');
    expect(wire.defaultValue['term']).toBe('http://example.org/term/1');
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('SingleValuedEnum — emits EnumValue with kind retained', () => {
    const e = embeddedSingleValuedEnumField({
      key: 'sc',
      artifactRef: singleValuedEnumFieldId('https://example.org/x'),
      defaultValue: enumValue('yes'),
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: Record<string, unknown> };
    expect(wire.defaultValue['kind']).toBe('EnumValue');
    expect(wire.defaultValue['value']).toBe('yes');
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('MultiValuedEnum — emits an array of EnumValue with kind retained', () => {
    const e = embeddedMultiValuedEnumField({
      key: 'mc',
      artifactRef: multiValuedEnumFieldId('https://example.org/x'),
      defaultValue: [enumValue('a'), enumValue('b')],
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: unknown };
    expect(wire.defaultValue).toEqual([
      { kind: 'EnumValue', value: 'a' },
      { kind: 'EnumValue', value: 'b' },
    ]);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('Link — emits LinkValue with kind retained', () => {
    const e = embeddedLinkField({
      key: 'l',
      artifactRef: linkFieldId('https://example.org/x'),
      defaultValue: linkValue({ iri: 'https://example.org', label: 'Example' }),
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: Record<string, unknown> };
    expect(wire.defaultValue['kind']).toBe('LinkValue');
    expect(wire.defaultValue['iri']).toBe('https://example.org');
    expect(wire.defaultValue['label']).toEqual([{ value: 'Example', lang: 'und' }]);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('Email — emits { kind, value }', () => {
    const e = embeddedEmailField({
      key: 'em',
      artifactRef: emailFieldId('https://example.org/x'),
      defaultValue: 'jane@example.org',
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: unknown };
    expect(wire.defaultValue).toEqual({
      kind: 'EmailValue',
      value: 'jane@example.org',
    });
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('Orcid — emits OrcidValue with kind retained', () => {
    const e = embeddedOrcidField({
      key: 'or',
      artifactRef: orcidFieldId('https://example.org/x'),
      defaultValue: 'https://orcid.org/0000-0002-1825-0097',
    });
    const wire = serializeEmbeddedField(e) as { defaultValue: Record<string, unknown> };
    expect(wire.defaultValue['kind']).toBe('OrcidValue');
    expect(wire.defaultValue['iri']).toBe('https://orcid.org/0000-0002-1825-0097');
    expect(parseEmbeddedField(wire)).toEqual(e);
  });
});

// ---- Field round-trip ------------------------------------------------

const fieldSamples = [
  [
    'TextField',
    textField({
      id: 'https://example.org/fields/text',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: textFieldSpec(),
    }),
  ],
  [
    'IntegerNumberField',
    integerNumberField({
      id: 'https://example.org/fields/int',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: integerNumberFieldSpec(),
    }),
  ],
  [
    'RealNumberField',
    realNumberField({
      id: 'https://example.org/fields/real',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: realNumberFieldSpec({ datatype: 'decimal' }),
    }),
  ],
  [
    'DateField',
    dateField({
      id: 'https://example.org/fields/date',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
    }),
  ],
  [
    'EmailField',
    emailField({
      id: 'https://example.org/fields/email',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: emailFieldSpec(),
    }),
  ],
  [
    'OrcidField',
    orcidField({
      id: 'https://example.org/fields/orcid',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: orcidFieldSpec(),
    }),
  ],
  [
    'LinkField',
    linkField({
      id: 'https://example.org/fields/link',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: linkFieldSpec(),
    }),
  ],
  [
    'AttributeValueField',
    attributeValueField({
      id: 'https://example.org/fields/attr',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: attributeValueFieldSpec(),
    }),
  ],
  [
    'PhoneNumberField',
    phoneNumberField({
      id: 'https://example.org/fields/phone',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: phoneNumberFieldSpec(),
    }),
  ],
  [
    'RorField',
    rorField({
      id: 'https://example.org/fields/ror',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: rorFieldSpec(),
    }),
  ],
  [
    'DoiField',
    doiField({
      id: 'https://example.org/fields/doi',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: doiFieldSpec(),
    }),
  ],
  [
    'PubMedIdField',
    pubMedIdField({
      id: 'https://example.org/fields/pmid',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: pubMedIdFieldSpec(),
    }),
  ],
  [
    'RridField',
    rridField({
      id: 'https://example.org/fields/rrid',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: rridFieldSpec(),
    }),
  ],
  [
    'NihGrantIdField',
    nihGrantIdField({
      id: 'https://example.org/fields/grant',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: nihGrantIdFieldSpec(),
    }),
  ],
  [
    'ControlledTermField',
    controlledTermField({
      id: 'https://example.org/fields/ct',
      modelVersion: MV,
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
    'SingleValuedEnumField',
    singleValuedEnumField({
      id: 'https://example.org/fields/single-enum',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: singleValuedEnumFieldSpec({
        permissibleValues: [permissibleValue({ value: 'a', label: 'A' })],
      }),
    }),
  ],
  [
    'MultiValuedEnumField',
    multiValuedEnumField({
      id: 'https://example.org/fields/multi-enum',
      modelVersion: MV,
      metadata: sam,
      fieldSpec: multiValuedEnumFieldSpec({
        permissibleValues: [
          permissibleValue({ value: 'a', label: 'A' }),
          permissibleValue({ value: 'b', label: 'B' }),
        ],
      }),
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
      modelVersion: MV,
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
        modelVersion: MV,
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
        modelVersion: MV,
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
        modelVersion: MV,
        metadata: sam,
        fieldSpec: textFieldSpec(),
      }),
    ) as Record<string, unknown>;
    wire['_extra'] = 'ok';
    const back = parseField(wire);
    expect(back.kind).toBe('TextField');
  });
});

// ---- EmbeddedField round-trip ---------------------------------------

describe('EmbeddedField round-trip', () => {
  it('EmbeddedTextField with all common props', () => {
    const e = embeddedTextField({
      key: 'name',
      artifactRef: textFieldId('https://example.org/fields/text'),
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
      artifactRef: attributeValueFieldId('https://example.org/fields/attr'),
    });
    const wire = serializeEmbeddedField(e);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it.each([
    [
      'EmbeddedIntegerNumberField',
      embeddedIntegerNumberField({
        key: 'n',
        artifactRef: integerNumberFieldId('https://example.org/fields/int'),
      }),
    ],
    [
      'EmbeddedRealNumberField',
      embeddedRealNumberField({
        key: 'r',
        artifactRef: realNumberFieldId('https://example.org/fields/real'),
      }),
    ],
    [
      'EmbeddedDateField',
      embeddedDateField({
        key: 'd',
        artifactRef: dateFieldId('https://example.org/fields/date'),
      }),
    ],
    [
      'EmbeddedTimeField',
      embeddedTimeField({
        key: 't',
        artifactRef: timeFieldId('https://example.org/fields/time'),
      }),
    ],
    [
      'EmbeddedDateTimeField',
      embeddedDateTimeField({
        key: 'dt',
        artifactRef: dateTimeFieldId('https://example.org/fields/dt'),
      }),
    ],
    [
      'EmbeddedControlledTermField',
      embeddedControlledTermField({
        key: 'ct',
        artifactRef: controlledTermFieldId('https://example.org/fields/ct'),
      }),
    ],
    [
      'EmbeddedSingleValuedEnumField',
      embeddedSingleValuedEnumField({
        key: 'sc',
        artifactRef: singleValuedEnumFieldId('https://example.org/fields/sc'),
      }),
    ],
    [
      'EmbeddedMultiValuedEnumField',
      embeddedMultiValuedEnumField({
        key: 'mc',
        artifactRef: multiValuedEnumFieldId('https://example.org/fields/mc'),
      }),
    ],
    [
      'EmbeddedLinkField',
      embeddedLinkField({
        key: 'lnk',
        artifactRef: linkFieldId('https://example.org/fields/lnk'),
      }),
    ],
    [
      'EmbeddedEmailField',
      embeddedEmailField({
        key: 'em',
        artifactRef: emailFieldId('https://example.org/fields/em'),
      }),
    ],
    [
      'EmbeddedPhoneNumberField',
      embeddedPhoneNumberField({
        key: 'ph',
        artifactRef: phoneNumberFieldId('https://example.org/fields/ph'),
      }),
    ],
    [
      'EmbeddedOrcidField',
      embeddedOrcidField({
        key: 'or',
        artifactRef: orcidFieldId('https://example.org/fields/or'),
      }),
    ],
    [
      'EmbeddedRorField',
      embeddedRorField({
        key: 'ro',
        artifactRef: rorFieldId('https://example.org/fields/ro'),
      }),
    ],
    [
      'EmbeddedDoiField',
      embeddedDoiField({
        key: 'do',
        artifactRef: doiFieldId('https://example.org/fields/do'),
      }),
    ],
    [
      'EmbeddedPubMedIdField',
      embeddedPubMedIdField({
        key: 'pm',
        artifactRef: pubMedIdFieldId('https://example.org/fields/pm'),
      }),
    ],
    [
      'EmbeddedRridField',
      embeddedRridField({
        key: 'rr',
        artifactRef: rridFieldId('https://example.org/fields/rr'),
      }),
    ],
    [
      'EmbeddedNihGrantIdField',
      embeddedNihGrantIdField({
        key: 'gr',
        artifactRef: nihGrantIdFieldId('https://example.org/fields/gr'),
      }),
    ],
  ])('round-trips %s', (_name, e) => {
    const wire = serializeEmbeddedField(e);
    expect(parseEmbeddedField(wire)).toEqual(e);
  });

  it('EmbeddedTemplate round-trip', () => {
    const e = embeddedTemplate({
      key: 'sub',
      artifactRef: templateId('https://example.org/templates/sub'),
      cardinality: cardinality({ min: 0 }),
    });
    const wire = serializeEmbeddedArtifact(e);
    expect(parseEmbeddedArtifact(wire)).toEqual(e);
  });

  it('EmbeddedPresentationComponent round-trip', () => {
    const e = embeddedPresentationComponent({
      key: 'intro',
      artifactRef: presentationComponentId('https://example.org/pc/intro'),
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
      modelVersion: MV,
      metadata: am,
      html: '<p>hi</p>',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('ImageComponent', () => {
    const c = imageComponent({
      id: 'https://example.org/pc/img',
      modelVersion: MV,
      metadata: am,
      image: 'https://example.org/img.png',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('YoutubeVideoComponent', () => {
    const c = youtubeVideoComponent({
      id: 'https://example.org/pc/vid',
      modelVersion: MV,
      metadata: am,
      video: 'https://www.youtube.com/watch?v=abc',
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('SectionBreakComponent', () => {
    const c = sectionBreakComponent({
      id: 'https://example.org/pc/sec',
      modelVersion: MV,
      metadata: am,
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('PageBreakComponent', () => {
    const c = pageBreakComponent({
      id: 'https://example.org/pc/page',
      modelVersion: MV,
      metadata: am,
    });
    const wire = serializePresentationComponent(c);
    expect(parsePresentationComponent(wire)).toEqual(c);
  });

  it('id collapses to bare string', () => {
    const c = richTextComponent({
      id: 'https://example.org/pc/rt',
      modelVersion: MV,
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
  modelVersion: MV,
  metadata: sam,
  header: 'Hello',
  footer: 'Bye',
  members: [
    embeddedTextField({
      key: 'title',
      artifactRef: textFieldId('https://example.org/fields/title'),
      valueRequirement: 'required',
    }),
    embeddedPresentationComponent({
      key: 'intro',
      artifactRef: presentationComponentId('https://example.org/pc/intro'),
    }),
    embeddedTemplate({
      key: 'sub',
      artifactRef: templateId('https://example.org/templates/sub'),
    }),
  ],
});

describe('Template round-trip', () => {
  it('round-trips with header/footer/members', () => {
    const wire = serializeTemplate(sampleTemplate);
    const back = parseTemplate(wire);
    expect(serializeTemplate(back)).toEqual(wire);
  });

  it('id collapses to bare string', () => {
    const wire = serializeTemplate(sampleTemplate) as { id: unknown };
    expect(wire.id).toBe('https://example.org/templates/demo');
  });

  it('preserves order of members on round-trip', () => {
    const wire = serializeTemplate(sampleTemplate) as { members: { key: string }[] };
    expect(wire.members.map((e) => e.key)).toEqual(['title', 'intro', 'sub']);
    const back = parseTemplate(wire);
    expect(back.members.map((e) => e.key)).toEqual(['title', 'intro', 'sub']);
  });

  it('rejects wrong kind', () => {
    expect(() =>
      parseTemplate({ kind: 'NotATemplate', id: 'x', metadata: {} as never }),
    ).toThrow(/expected kind "Template"/);
  });

  it('rejects missing required property', () => {
    const wire = serializeTemplate(sampleTemplate) as Record<string, unknown>;
    delete wire['members'];
    expect(() => parseTemplate(wire)).toThrow(/missing required/);
  });
});

// ---- TemplateInstance round-trip ------------------------------------

const sampleInstance = templateInstance({
  id: templateInstanceId('https://example.org/instances/i1'),
  modelVersion: MV,
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
      modelVersion: MV,
      metadata: sam,
      fieldSpec: textFieldSpec(),
    });
    const wire = serialize(f);
    expect((wire as { kind: string }).kind).toBe('TextField');
  });

  it('serialize() dispatches by kind for PresentationComponent', () => {
    const c = sectionBreakComponent({
      id: 'https://example.org/pc/x',
      modelVersion: MV,
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
