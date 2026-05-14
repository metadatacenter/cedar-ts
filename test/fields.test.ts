import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  controlledTermField,
  controlledTermFieldId,
  controlledTermFieldSpec,
  dateField,
  dateFieldId,
  dateFieldSpec,
  dateTimeField,
  dateTimeFieldId,
  dateTimeFieldSpec,
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
  permissibleValue,
  singleValuedEnumField,
  singleValuedEnumFieldId,
  singleValuedEnumFieldSpec,
  multiValuedEnumField,
  multiValuedEnumFieldId,
  multiValuedEnumFieldSpec,
  nihGrantIdField,
  nihGrantIdFieldId,
  nihGrantIdFieldSpec,
  integerNumberField,
  integerNumberFieldId,
  integerNumberFieldSpec,
  realNumberField,
  realNumberFieldId,
  realNumberFieldSpec,
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
  schemaArtifactVersioning,
  lifecycleMetadata,
  textField,
  textFieldId,
  textFieldSpec,
  timeField,
  timeFieldId,
  timeFieldSpec,
  type Field,
  type TextField,
  type DateField,
  type IntegerNumberFieldSpec,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({ preferredLabel: 'X', lifecycle: tp }),
  versioning: schemaArtifactVersioning({
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
    integerNumberField({
      id: integerNumberFieldId('https://example.org/fields/x'),
      modelVersion: MV,
      metadata: meta,
      // @ts-expect-error TextFieldSpec is not an IntegerNumberFieldSpec
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
      integerNumberField({
        id: integerNumberFieldId('https://example.org/n'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: integerNumberFieldSpec(),
      }),
      realNumberField({
        id: realNumberFieldId('https://example.org/r'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: realNumberFieldSpec({ datatype: 'decimal' }),
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
      singleValuedEnumField({
        id: singleValuedEnumFieldId('https://example.org/sc'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: singleValuedEnumFieldSpec({
          permissibleValues: [permissibleValue({ value: 'a' })],
        }),
      }),
      multiValuedEnumField({
        id: multiValuedEnumFieldId('https://example.org/mc'),
        modelVersion: MV,
        metadata: meta,
        fieldSpec: multiValuedEnumFieldSpec({
          permissibleValues: [permissibleValue({ value: 'a' })],
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
    expect(all.length).toBe(19);
    for (const f of all) expect(isField(f)).toBe(true);
  });

  it('single-valued enum field carries permissible values', () => {
    const f = singleValuedEnumField({
      id: singleValuedEnumFieldId('https://example.org/sc'),
      modelVersion: MV,
      metadata: meta,
      fieldSpec: singleValuedEnumFieldSpec({
        permissibleValues: [
          permissibleValue({ value: 'one', label: 'One' }),
        ],
        renderingHint: 'dropdown',
      }),
    });
    expect(f.fieldSpec.kind).toBe('SingleValuedEnumFieldSpec');
  });
});

describe('Field kind narrowing', () => {
  it('narrows the FieldSpec type via the per-variant `kind` discriminant', () => {
    const f: Field = integerNumberField({
      id: integerNumberFieldId('https://example.org/n'),
      modelVersion: MV,
      metadata: meta,
      fieldSpec: integerNumberFieldSpec(),
    });
    if (f.kind === 'IntegerNumberField') {
      const spec: IntegerNumberFieldSpec = f.fieldSpec;
      expect(spec.kind).toBe('IntegerNumberFieldSpec');
    } else {
      throw new Error('expected integer-number field');
    }
  });

  it('table check that every family kind discriminant is unique and complete', () => {
    const kinds: Field['kind'][] = [
      'TextField', 'IntegerNumberField', 'RealNumberField', 'BooleanField',
      'DateField', 'TimeField', 'DateTimeField',
      'ControlledTermField', 'SingleValuedEnumField', 'MultiValuedEnumField',
      'LinkField', 'EmailField', 'PhoneNumberField',
      'OrcidField', 'RorField', 'DoiField', 'PubMedIdField', 'RridField', 'NihGrantIdField',
      'AttributeValueField',
    ];
    expect(kinds.length).toBe(20);
    expect(new Set(kinds).size).toBe(20);
  });
});
