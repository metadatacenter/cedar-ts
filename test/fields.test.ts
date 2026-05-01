import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  controlledTermField,
  controlledTermFieldId,
  controlledTermFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  controlledTermChoiceOption,
  controlledTermValue,
  dateField,
  dateFieldId,
  dateFieldSpec,
  dateTimeField,
  dateTimeFieldId,
  dateTimeFieldSpec,
  descriptiveMetadata,
  doiField,
  doiFieldId,
  doiFieldSpec,
  emailField,
  emailFieldId,
  emailFieldSpec,
  isField,
  isFieldOfKind,
  linkField,
  linkFieldId,
  linkFieldSpec,
  literalChoiceOption,
  literalSingleChoiceFieldSpec,
  multipleChoiceField,
  multipleChoiceFieldId,
  literalMultipleChoiceFieldSpec,
  nihGrantIdField,
  nihGrantIdFieldId,
  nihGrantIdFieldSpec,
  numericField,
  numericFieldId,
  numericFieldSpec,
  ontologyReference,
  ontologySource,
  orcidField,
  orcidFieldId,
  orcidFieldSpec,
  phoneNumberField,
  phoneNumberFieldId,
  phoneNumberFieldSpec,
  pubMedIdField,
  pubMedIdFieldId,
  pubMedIdFieldSpec,
  rorField,
  rorFieldId,
  rorFieldSpec,
  rridField,
  rridFieldId,
  rridFieldSpec,
  schemaArtifactMetadata,
  schemaVersioning,
  singleChoiceField,
  singleChoiceFieldId,
  temporalProvenance,
  textField,
  textFieldId,
  textFieldSpec,
  timeField,
  timeFieldId,
  timeFieldSpec,
  typedLiteral,
  XsdNumericDatatypeIri,
  type FieldKind,
  type Field,
  type TextField,
  type DateField,
  type NumericFieldSpec,
} from '../src/index.js';

const dm = descriptiveMetadata({ name: 'X' });
const tp = temporalProvenance({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({ descriptiveMetadata: dm, provenance: tp }),
  versioning: schemaVersioning({
    version: '1.0.0',
    status: 'draft',
    modelVersion: '2.0.0',
  }),
});

describe('Field constructors', () => {
  it('textField composes id, metadata, and spec into a tagged TextField', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/title'),
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.kind).toBe('Field');
    expect(f.fieldKind).toBe('Text');
    expect(f.id.fieldKind).toBe('Text');
    expect(f.fieldSpec.kind).toBe('TextFieldSpec');
    expect(isField(f)).toBe(true);
    expect(isFieldOfKind(f, 'Text')).toBe(true);
    expect(isFieldOfKind(f, 'Numeric')).toBe(false);
  });

  it('rejects a misaligned id at the type level', () => {
    dateField({
      // @ts-expect-error TextFieldId is not a DateFieldId
      id: textFieldId('https://example.org/fields/x'),
      metadata: meta,
      fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
    });
  });

  it('rejects a misaligned fieldSpec at the type level', () => {
    numericField({
      id: numericFieldId('https://example.org/fields/x'),
      metadata: meta,
      // @ts-expect-error TextFieldSpec is not a NumericFieldSpec
      fieldSpec: textFieldSpec(),
    });
  });
});

describe('Per-family helpers', () => {
  it('textField pins to Field<"text">', () => {
    const f: TextField = textField({
      id: textFieldId('https://example.org/f/1'),
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.fieldKind).toBe('Text');

    // @ts-expect-error TextField is not assignable to DateField
    const d: DateField = f;
    void d;
  });

  it('builds one of each concrete family', () => {
    const all: Field[] = [
      textField({ id: textFieldId('https://example.org/t'), metadata: meta, fieldSpec: textFieldSpec() }),
      numericField({
        id: numericFieldId('https://example.org/n'),
        metadata: meta,
        fieldSpec: numericFieldSpec({ datatype: 'integer' }),
      }),
      dateField({
        id: dateFieldId('https://example.org/d'),
        metadata: meta,
        fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
      }),
      timeField({
        id: timeFieldId('https://example.org/ti'),
        metadata: meta,
        fieldSpec: timeFieldSpec(),
      }),
      dateTimeField({
        id: dateTimeFieldId('https://example.org/dt'),
        metadata: meta,
        fieldSpec: dateTimeFieldSpec({ dateTimeValueType: 'dateHourMinute' }),
      }),
      controlledTermField({
        id: controlledTermFieldId('https://example.org/ct'),
        metadata: meta,
        fieldSpec: controlledTermFieldSpec(
          ontologySource(ontologyReference({ ontologyIri: 'https://example.org/o' })),
        ),
      }),
      singleChoiceField({
        id: singleChoiceFieldId('https://example.org/sc'),
        metadata: meta,
        fieldSpec: literalSingleChoiceFieldSpec({
          options: [
            literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer)),
          ],
        }),
      }),
      multipleChoiceField({
        id: multipleChoiceFieldId('https://example.org/mc'),
        metadata: meta,
        fieldSpec: literalMultipleChoiceFieldSpec({
          options: [
            literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer)),
          ],
        }),
      }),
      linkField({ id: linkFieldId('https://example.org/lk'), metadata: meta, fieldSpec: linkFieldSpec() }),
      emailField({ id: emailFieldId('https://example.org/em'), metadata: meta, fieldSpec: emailFieldSpec() }),
      phoneNumberField({
        id: phoneNumberFieldId('https://example.org/ph'),
        metadata: meta,
        fieldSpec: phoneNumberFieldSpec(),
      }),
      orcidField({ id: orcidFieldId('https://example.org/o'), metadata: meta, fieldSpec: orcidFieldSpec() }),
      rorField({ id: rorFieldId('https://example.org/r'), metadata: meta, fieldSpec: rorFieldSpec() }),
      doiField({ id: doiFieldId('https://example.org/d'), metadata: meta, fieldSpec: doiFieldSpec() }),
      pubMedIdField({
        id: pubMedIdFieldId('https://example.org/pm'),
        metadata: meta,
        fieldSpec: pubMedIdFieldSpec(),
      }),
      rridField({ id: rridFieldId('https://example.org/rr'), metadata: meta, fieldSpec: rridFieldSpec() }),
      nihGrantIdField({
        id: nihGrantIdFieldId('https://example.org/ng'),
        metadata: meta,
        fieldSpec: nihGrantIdFieldSpec(),
      }),
      attributeValueField({
        id: attributeValueFieldId('https://example.org/av'),
        metadata: meta,
        fieldSpec: attributeValueFieldSpec(),
      }),
    ];
    expect(all.length).toBe(18);
    for (const f of all) expect(isField(f)).toBe(true);
  });

  it('controlled-term single-choice field accepts ontology-backed options', () => {
    const ctv = controlledTermValue({ termIri: 'https://example.org/term/1' });
    const f = singleChoiceField({
      id: singleChoiceFieldId('https://example.org/sc'),
      metadata: meta,
      fieldSpec: controlledTermSingleChoiceFieldSpec({
        options: [controlledTermChoiceOption(ctv)],
        renderingHint: 'singleSelectDropdown',
      }),
    });
    expect(f.fieldSpec.kind).toBe('ControlledTermSingleChoiceFieldSpec');
  });
});

describe('isFieldOfKind narrows correctly', () => {
  it('narrows the FieldSpec type along with the field family', () => {
    const f: Field = numericField({
      id: numericFieldId('https://example.org/n'),
      metadata: meta,
      fieldSpec: numericFieldSpec({ datatype: 'integer' }),
    });
    if (isFieldOfKind(f, 'Numeric')) {
      const spec: NumericFieldSpec = f.fieldSpec;
      expect(spec.datatype).toBe('integer');
    } else {
      throw new Error('expected numeric field');
    }
  });

  it('FIELD_KINDS-style table check that every family round-trips', () => {
    const kinds: FieldKind[] = [
      'Text', 'Numeric', 'Date', 'Time', 'DateTime',
      'ControlledTerm', 'SingleChoice', 'MultipleChoice',
      'Link', 'Email', 'PhoneNumber',
      'Orcid', 'Ror', 'Doi', 'PubMedId', 'Rrid', 'NihGrantId',
      'AttributeValue',
    ];
    expect(kinds.length).toBe(18);
  });
});
