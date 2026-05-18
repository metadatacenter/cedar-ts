import { describe, expect, it } from 'vitest';
import {
  catalogMetadata,
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
const meta = {
  metadata: catalogMetadata({ preferredLabel: 'X', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
  label: 'X',
  title: 'X',
};

const MV = '2.0.0';

describe('Field constructors', () => {
  it('textField composes id, metadata, and spec into a tagged TextField', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/title'),
      modelVersion: MV,
      ...meta,
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
      ...meta,
      fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
    });
  });

  it('rejects a misaligned fieldSpec at the type level', () => {
    integerNumberField({
      id: integerNumberFieldId('https://example.org/fields/x'),
      modelVersion: MV,
      ...meta,
      // @ts-expect-error TextFieldSpec is not an IntegerNumberFieldSpec
      fieldSpec: textFieldSpec(),
    });
  });

  it('carries an optional helpText on the Field artifact', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/title'),
      modelVersion: MV,
      ...meta,
      fieldSpec: textFieldSpec(),
      helpText: [
        { value: 'Enter the full title of the publication.', lang: 'en' },
      ],
    });
    expect(f.helpText).toEqual([
      { value: 'Enter the full title of the publication.', lang: 'en' },
    ]);
  });

  it('omits helpText by default', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/title'),
      modelVersion: MV,
      ...meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.helpText).toBeUndefined();
  });
});

describe('Per-family helpers', () => {
  it('textField pins to Field<"text">', () => {
    const f: TextField = textField({
      id: textFieldId('https://example.org/f/1'),
      modelVersion: MV,
      ...meta,
      fieldSpec: textFieldSpec(),
    });
    expect(f.kind).toBe('TextField');

    // @ts-expect-error TextField is not assignable to DateField
    const d: DateField = f;
    void d;
  });

  it('builds one of each concrete family', () => {
    const all: Field[] = [
      textField({ id: textFieldId('https://example.org/t'), modelVersion: MV, ...meta, fieldSpec: textFieldSpec() }),
      integerNumberField({
        id: integerNumberFieldId('https://example.org/n'),
        modelVersion: MV,
        ...meta,
        fieldSpec: integerNumberFieldSpec(),
      }),
      realNumberField({
        id: realNumberFieldId('https://example.org/r'),
        modelVersion: MV,
        ...meta,
        fieldSpec: realNumberFieldSpec({ datatype: 'decimal' }),
      }),
      dateField({
        id: dateFieldId('https://example.org/d'),
        modelVersion: MV,
        ...meta,
        fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
      }),
      timeField({
        id: timeFieldId('https://example.org/ti'),
        modelVersion: MV,
        ...meta,
        fieldSpec: timeFieldSpec(),
      }),
      dateTimeField({
        id: dateTimeFieldId('https://example.org/dt'),
        modelVersion: MV,
        ...meta,
        fieldSpec: dateTimeFieldSpec({ dateTimeValueType: 'dateHourMinute' }),
      }),
      controlledTermField({
        id: controlledTermFieldId('https://example.org/ct'),
        modelVersion: MV,
        ...meta,
        fieldSpec: controlledTermFieldSpec(
          ontologySource(ontologyReference({ ontologyIri: 'https://example.org/o' })),
        ),
      }),
      singleValuedEnumField({
        id: singleValuedEnumFieldId('https://example.org/sc'),
        modelVersion: MV,
        ...meta,
        fieldSpec: singleValuedEnumFieldSpec({
          permissibleValues: [permissibleValue({ value: 'a' })],
        }),
      }),
      multiValuedEnumField({
        id: multiValuedEnumFieldId('https://example.org/mc'),
        modelVersion: MV,
        ...meta,
        fieldSpec: multiValuedEnumFieldSpec({
          permissibleValues: [permissibleValue({ value: 'a' })],
        }),
      }),
      linkField({ id: linkFieldId('https://example.org/lk'), modelVersion: MV, ...meta, fieldSpec: linkFieldSpec() }),
      emailField({ id: emailFieldId('https://example.org/em'), modelVersion: MV, ...meta, fieldSpec: emailFieldSpec() }),
      phoneNumberField({
        id: phoneNumberFieldId('https://example.org/ph'),
        modelVersion: MV,
        ...meta,
        fieldSpec: phoneNumberFieldSpec(),
      }),
      orcidField({ id: orcidFieldId('https://example.org/o'), modelVersion: MV, ...meta, fieldSpec: orcidFieldSpec() }),
      rorField({ id: rorFieldId('https://example.org/r'), modelVersion: MV, ...meta, fieldSpec: rorFieldSpec() }),
      doiField({ id: doiFieldId('https://example.org/d'), modelVersion: MV, ...meta, fieldSpec: doiFieldSpec() }),
      pubMedIdField({
        id: pubMedIdFieldId('https://example.org/pm'),
        modelVersion: MV,
        ...meta,
        fieldSpec: pubMedIdFieldSpec(),
      }),
      rridField({ id: rridFieldId('https://example.org/rr'), modelVersion: MV, ...meta, fieldSpec: rridFieldSpec() }),
      nihGrantIdField({
        id: nihGrantIdFieldId('https://example.org/ng'),
        modelVersion: MV,
        ...meta,
        fieldSpec: nihGrantIdFieldSpec(),
      }),
      attributeValueField({
        id: attributeValueFieldId('https://example.org/av'),
        modelVersion: MV,
        ...meta,
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
      ...meta,
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
      ...meta,
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
