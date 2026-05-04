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
  }),
});

const MV = '2.0.0';

describe('Field constructors', () => {
  it('textField composes id, metadata, and spec into a tagged TextField', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/title'),
      modelVersion: MV,
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.kind).toBe('TextField');
    expect(f.id.kind).toBe('TextFieldId');
    expect(f.fieldSpec.kind).toBe('TextFieldSpec');
    expect(isField(f)).toBe(true);
  });

  it('rejects a misaligned id at the type level', () => {
    dateField({
      // @ts-expect-error TextFieldId is not a DateFieldId
      id: textFieldId('https://example.org/fields/x'),
      modelVersion: MV,
      metadata: meta,
      fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
    });
  });

  it('rejects a misaligned fieldSpec at the type level', () => {
    numericField({
      id: numericFieldId('https://example.org/fields/x'),
      modelVersion: MV,
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
      modelVersion: MV,
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.kind).toBe('TextField');

    // @ts-expect-error TextField is not assignable to DateField
    const d: DateField = f;
    void d;
  });

  it('builds one of each concrete family', () => {
    const all: Field[] = [
      textField({ id: textFieldId('https://example.org/t'), modelVersion: MV, metadata: meta, fieldSpec: textFieldSpec() }),
      numericField({
        id: numericFieldId('https://example.org/n'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: numericFieldSpec({ datatype: 'integer' }),
      }),
      dateField({
        id: dateFieldId('https://example.org/d'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
      }),
      timeField({
        id: timeFieldId('https://example.org/ti'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: timeFieldSpec(),
      }),
      dateTimeField({
        id: dateTimeFieldId('https://example.org/dt'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: dateTimeFieldSpec({ dateTimeValueType: 'dateHourMinute' }),
      }),
      controlledTermField({
        id: controlledTermFieldId('https://example.org/ct'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: controlledTermFieldSpec(
          ontologySource(ontologyReference({ ontologyIri: 'https://example.org/o' })),
        ),
      }),
      singleChoiceField({
        id: singleChoiceFieldId('https://example.org/sc'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: literalSingleChoiceFieldSpec({
          options: [
            literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer)),
          ],
        }),
      }),
      multipleChoiceField({
        id: multipleChoiceFieldId('https://example.org/mc'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: literalMultipleChoiceFieldSpec({
          options: [
            literalChoiceOption(typedLiteral('a', XsdNumericDatatypeIri.integer)),
          ],
        }),
      }),
      linkField({ id: linkFieldId('https://example.org/lk'), modelVersion: MV, metadata: meta, fieldSpec: linkFieldSpec() }),
      emailField({ id: emailFieldId('https://example.org/em'), modelVersion: MV, metadata: meta, fieldSpec: emailFieldSpec() }),
      phoneNumberField({
        id: phoneNumberFieldId('https://example.org/ph'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: phoneNumberFieldSpec(),
      }),
      orcidField({ id: orcidFieldId('https://example.org/o'), modelVersion: MV, metadata: meta, fieldSpec: orcidFieldSpec() }),
      rorField({ id: rorFieldId('https://example.org/r'), modelVersion: MV, metadata: meta, fieldSpec: rorFieldSpec() }),
      doiField({ id: doiFieldId('https://example.org/d'), modelVersion: MV, metadata: meta, fieldSpec: doiFieldSpec() }),
      pubMedIdField({
        id: pubMedIdFieldId('https://example.org/pm'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: pubMedIdFieldSpec(),
      }),
      rridField({ id: rridFieldId('https://example.org/rr'), modelVersion: MV, metadata: meta, fieldSpec: rridFieldSpec() }),
      nihGrantIdField({
        id: nihGrantIdFieldId('https://example.org/ng'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: nihGrantIdFieldSpec(),
      }),
      attributeValueField({
        id: attributeValueFieldId('https://example.org/av'),
        modelVersion: MV,
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
      modelVersion: MV,
      metadata: meta,
      fieldSpec: controlledTermSingleChoiceFieldSpec({
        options: [controlledTermChoiceOption(ctv)],
        renderingHint: 'singleSelectDropdown',
      }),
    });
    expect(f.fieldSpec.kind).toBe('ControlledTermSingleChoiceFieldSpec');
  });
});

describe('Field kind narrowing', () => {
  it('narrows the FieldSpec type via the per-variant `kind` discriminant', () => {
    const f: Field = numericField({
      id: numericFieldId('https://example.org/n'),
      modelVersion: MV,
      metadata: meta,
      fieldSpec: numericFieldSpec({ datatype: 'integer' }),
    });
    if (f.kind === 'NumericField') {
      const spec: NumericFieldSpec = f.fieldSpec;
      expect(spec.datatype).toBe('integer');
    } else {
      throw new Error('expected numeric field');
    }
  });

  it('table check that every family kind discriminant is unique and complete', () => {
    const kinds: Field['kind'][] = [
      'TextField', 'NumericField', 'DateField', 'TimeField', 'DateTimeField',
      'ControlledTermField', 'SingleChoiceField', 'MultipleChoiceField',
      'LinkField', 'EmailField', 'PhoneNumberField',
      'OrcidField', 'RorField', 'DoiField', 'PubMedIdField', 'RridField', 'NihGrantIdField',
      'AttributeValueField',
    ];
    expect(kinds.length).toBe(18);
    expect(new Set(kinds).size).toBe(18);
  });
});
