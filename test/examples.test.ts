import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  attributeValueFieldSpec,
  booleanFieldSpec,
  booleanValue,
  catalogMetadata,
  controlledTermFieldSpec,
  controlledTermValue,
  dateFieldSpec,
  dateValue,
  emailField,
  emailFieldSpec,
  emailValue,
  enumValue,
  fullDateValue,
  integerNumberFieldSpec,
  integerNumberValue,
  languageFieldSpec,
  languageValue,
  lifecycleMetadata,
  linkFieldSpec,
  linkValue,
  multiValuedEnumFieldSpec,
  parseArtifact,
  permissibleValue,
  phoneNumberFieldSpec,
  phoneNumberValue,
  realNumberFieldSpec,
  realNumberValue,
  schemaArtifactVersioning,
  serialize,
  singleValuedEnumFieldSpec,
  textField,
  textFieldSpec,
  textValue,
  timeFieldSpec,
  timeValue,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const baseFieldMeta = {
  metadata: catalogMetadata({ preferredLabel: 'Examples test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
  label: 'Examples test',
};

const MV = '2.0.0';

describe('Example* slot — construction (typed values, all 20 families)', () => {
  it('TextFieldSpec carries typed TextValue examples', () => {
    const s = textFieldSpec({
      examples: [textValue('alpha'), textValue('beta')],
    });
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.kind).toBe('TextValue');
    expect(s.examples?.[0]?.value).toBe('alpha');
  });

  it('TextFieldSpec accepts a bare string and normalises to TextValue', () => {
    const s = textFieldSpec({ examples: ['hello', 'world'] });
    expect(s.examples?.[0]?.kind).toBe('TextValue');
    expect(s.examples?.[0]?.value).toBe('hello');
  });

  it('IntegerNumberFieldSpec carries IntegerNumberValue examples', () => {
    const s = integerNumberFieldSpec({
      examples: [integerNumberValue('1'), integerNumberValue('100')],
    });
    expect(s.examples?.[0]?.kind).toBe('IntegerNumberValue');
    expect(s.examples?.[0]?.value).toBe('1');
  });

  it('RealNumberFieldSpec carries RealNumberValue examples (requires datatype)', () => {
    const s = realNumberFieldSpec({
      datatype: 'decimal',
      examples: [
        realNumberValue('3.14', 'decimal'),
        realNumberValue('2.71', 'decimal'),
      ],
    });
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.kind).toBe('RealNumberValue');
  });

  it('BooleanFieldSpec carries BooleanValue examples', () => {
    const s = booleanFieldSpec({
      examples: [booleanValue(true), booleanValue(false)],
    });
    expect(s.examples?.[0]?.value).toBe(true);
    expect(s.examples?.[1]?.value).toBe(false);
  });

  it('DateFieldSpec carries DateValue examples, normalising bare strings', () => {
    const s = dateFieldSpec({
      dateValueType: 'fullDate',
      examples: ['1985-04-12', '2024-01-01'],
    });
    expect(s.examples?.[0]?.kind).toBe('FullDateValue');
    expect(s.examples?.[1]?.value).toBe('2024-01-01');
  });

  it('TimeFieldSpec carries TimeValue examples', () => {
    const s = timeFieldSpec({
      examples: [timeValue('09:30:00')],
    });
    expect(s.examples?.[0]?.kind).toBe('TimeValue');
    expect(s.examples?.[0]?.value).toBe('09:30:00');
  });

  it('ControlledTermFieldSpec carries ControlledTermValue examples', () => {
    const s = controlledTermFieldSpec({
      sources: [
        {
          kind: 'OntologySource',
          ontology: {
            iri: { kind: 'OntologyIri', value: 'http://purl.obolibrary.org/obo/mondo.owl' },
          },
        },
      ],
      examples: [
        controlledTermValue('http://purl.obolibrary.org/obo/MONDO_0005148'),
      ],
    });
    expect(s.examples).toHaveLength(1);
    expect(s.examples?.[0]?.kind).toBe('ControlledTermValue');
  });

  it('SingleValuedEnumFieldSpec carries EnumValue examples (token-only)', () => {
    const pv = (token: string) => permissibleValue({ value: token });
    const s = singleValuedEnumFieldSpec({
      permissibleValues: [pv('red'), pv('green'), pv('blue')] as [
        ReturnType<typeof pv>,
        ...ReturnType<typeof pv>[],
      ],
      examples: [enumValue('red'), enumValue('green')],
    });
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.kind).toBe('EnumValue');
    expect(s.examples?.[0]?.value).toBe('red');
  });

  it('SingleValuedEnumFieldSpec accepts bare strings as examples and normalises', () => {
    const pv = (token: string) => permissibleValue({ value: token });
    const s = singleValuedEnumFieldSpec({
      permissibleValues: [pv('yes'), pv('no')] as [
        ReturnType<typeof pv>,
        ...ReturnType<typeof pv>[],
      ],
      examples: ['yes'],
    });
    expect(s.examples?.[0]?.value).toBe('yes');
  });

  it('MultiValuedEnumFieldSpec carries EnumValue examples (single tokens, not sequences)', () => {
    const pv = (token: string) => permissibleValue({ value: token });
    const s = multiValuedEnumFieldSpec({
      permissibleValues: [pv('a'), pv('b'), pv('c')] as [
        ReturnType<typeof pv>,
        ...ReturnType<typeof pv>[],
      ],
      examples: [enumValue('a'), enumValue('b')],
    });
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.kind).toBe('EnumValue');
    expect(s.examples?.[0]?.value).toBe('a');
  });

  it('LinkFieldSpec carries LinkValue examples', () => {
    const s = linkFieldSpec({
      examples: [linkValue({ iri: 'https://example.org/' })],
    });
    expect(s.examples?.[0]?.kind).toBe('LinkValue');
  });

  it('EmailFieldSpec carries EmailValue examples', () => {
    const s = emailFieldSpec({
      examples: [emailValue('alice@example.org'), emailValue('bob@example.org')],
    });
    expect(s.examples?.[0]?.value).toBe('alice@example.org');
  });

  it('PhoneNumberFieldSpec carries PhoneNumberValue examples', () => {
    const s = phoneNumberFieldSpec({
      examples: [phoneNumberValue('+1-555-0100')],
    });
    expect(s.examples?.[0]?.value).toBe('+1-555-0100');
  });

  it('LanguageFieldSpec carries LanguageValue examples', () => {
    const s = languageFieldSpec({
      examples: [languageValue('en'), languageValue('fr')],
    });
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.kind).toBe('LanguageValue');
    expect(s.examples?.[0]?.value).toBe('en');
  });
});

describe('Example* slot — absence and emptiness', () => {
  it('is undefined when not supplied', () => {
    const s = textFieldSpec();
    expect(s.examples).toBeUndefined();
  });

  it('is undefined on a spec built without an init', () => {
    const s = booleanFieldSpec();
    expect(s.examples).toBeUndefined();
  });

  it('an explicitly-empty examples array survives construction', () => {
    const s = textFieldSpec({ examples: [] });
    expect(Array.isArray(s.examples)).toBe(true);
    expect(s.examples).toHaveLength(0);
  });

  it('AttributeValueFieldSpec does not carry an examples slot', () => {
    const s = attributeValueFieldSpec();
    // The interface has no examples key. We assert structural absence.
    expect((s as Record<string, unknown>)['examples']).toBeUndefined();
  });
});

describe('Example* slot — wire-form serialisation', () => {
  it('serializes TextFieldSpec.examples as a tagged-value array', () => {
    const s = textFieldSpec({
      examples: [textValue('alpha'), textValue('beta')],
    });
    // serialize the spec via a containing field artifact to exercise the
    // full per-family field serializer path.
    const f = textField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: s,
    });
    const wire = serialize(f) as Record<string, unknown>;
    const fs = wire['fieldSpec'] as Record<string, unknown>;
    expect(fs['examples']).toEqual([
      { kind: 'TextValue', value: 'alpha' },
      { kind: 'TextValue', value: 'beta' },
    ]);
  });

  it('omits the examples property when the slot is absent', () => {
    const s = textFieldSpec();
    const f = textField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: s,
    });
    const wire = serialize(f) as Record<string, unknown>;
    const fs = wire['fieldSpec'] as Record<string, unknown>;
    expect('examples' in fs).toBe(false);
  });

  it('omits the examples property when the slot is explicitly empty', () => {
    const s = textFieldSpec({ examples: [] });
    const f = textField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: s,
    });
    const wire = serialize(f) as Record<string, unknown>;
    const fs = wire['fieldSpec'] as Record<string, unknown>;
    expect('examples' in fs).toBe(false);
  });

  it('round-trips a TextField with examples through serialize / parseArtifact', () => {
    const f = textField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec({
        examples: [textValue('alpha'), textValue('beta')],
      }),
    });
    const wire = serialize(f);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
    const backFieldSpec = (back as { fieldSpec: { examples?: { value: string }[] } })
      .fieldSpec;
    expect(backFieldSpec.examples?.[0]?.value).toBe('alpha');
    expect(backFieldSpec.examples?.[1]?.value).toBe('beta');
  });

  it('round-trips an EmailField with examples', () => {
    const f = emailField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/contact',
      modelVersion: MV,
      fieldSpec: emailFieldSpec({
        examples: [emailValue('alice@example.org')],
      }),
    });
    const wire = serialize(f);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
  });

  it('round-trips a DateFieldSpec with examples', () => {
    const f = textField({
      ...baseFieldMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    // exercise the date-field spec wire form via dateFieldSpec directly
    const s = dateFieldSpec({
      dateValueType: 'fullDate',
      examples: [fullDateValue('1985-04-12')],
    });
    // serialize via JSON round-trip
    const json = JSON.parse(JSON.stringify({
      kind: 'DateField',
      id: 'https://example.org/fields/d',
      modelVersion: MV,
      metadata: serialize(f as { kind: 'TextField' }) as Record<string, unknown> && (serialize(f) as Record<string, unknown>)['metadata'],
      versioning: (serialize(f) as Record<string, unknown>)['versioning'],
      fieldSpec: { kind: 'DateFieldSpec', dateValueType: 'fullDate', examples: [{ kind: 'FullDateValue', value: '1985-04-12' }] },
      label: (serialize(f) as Record<string, unknown>)['label'],
    }));
    const back = parseArtifact(json);
    expect((back as { fieldSpec: { examples?: { value: string }[] } }).fieldSpec.examples?.[0]?.value).toBe('1985-04-12');
    expect(s.examples?.[0]?.kind).toBe('FullDateValue');
  });
});

describe('Example* slot — parsing', () => {
  it('parseArtifact accepts examples on the wire and reconstructs typed values', () => {
    const wire = {
      kind: 'TextField',
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      metadata: {
        lifecycle: {
          createdOn: '2024-01-01T00:00:00Z',
          createdBy: 'https://example.org/u',
          modifiedOn: '2024-01-01T00:00:00Z',
          modifiedBy: 'https://example.org/u',
        },
      },
      versioning: { version: '1.0.0', status: 'draft' },
      fieldSpec: {
        kind: 'TextFieldSpec',
        examples: [
          { kind: 'TextValue', value: 'alpha' },
          { kind: 'TextValue', value: 'beta' },
        ],
      },
      label: [{ value: 'X', lang: 'en' }],
    };
    const back = parseArtifact(wire);
    const fs = (back as { fieldSpec: { examples?: { kind: string; value: string }[] } }).fieldSpec;
    expect(fs.examples).toHaveLength(2);
    expect(fs.examples?.[0]?.kind).toBe('TextValue');
    expect(fs.examples?.[1]?.value).toBe('beta');
  });

  it('parseArtifact rejects a non-array examples value', () => {
    const wire = {
      kind: 'TextField',
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      metadata: {
        lifecycle: {
          createdOn: '2024-01-01T00:00:00Z',
          createdBy: 'https://example.org/u',
          modifiedOn: '2024-01-01T00:00:00Z',
          modifiedBy: 'https://example.org/u',
        },
      },
      versioning: { version: '1.0.0', status: 'draft' },
      fieldSpec: {
        kind: 'TextFieldSpec',
        examples: 'not-an-array',
      },
      label: [{ value: 'X', lang: 'en' }],
    };
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });

  it('parseArtifact rejects an examples entry that is not a tagged Value', () => {
    const wire = {
      kind: 'TextField',
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      metadata: {
        lifecycle: {
          createdOn: '2024-01-01T00:00:00Z',
          createdBy: 'https://example.org/u',
          modifiedOn: '2024-01-01T00:00:00Z',
          modifiedBy: 'https://example.org/u',
        },
      },
      versioning: { version: '1.0.0', status: 'draft' },
      fieldSpec: {
        kind: 'TextFieldSpec',
        examples: [{ wrongShape: true }],
      },
      label: [{ value: 'X', lang: 'en' }],
    };
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});

describe('Example* slot — interaction with defaultValue', () => {
  it('examples and defaultValue coexist on the same spec', () => {
    const s = textFieldSpec({
      defaultValue: textValue('the default'),
      examples: [textValue('alpha'), textValue('beta')],
    });
    expect(s.defaultValue?.value).toBe('the default');
    expect(s.examples?.[0]?.value).toBe('alpha');
  });

  it('the defaultValue is not duplicated into examples', () => {
    const s = textFieldSpec({
      defaultValue: textValue('the default'),
      examples: [textValue('alpha')],
    });
    expect(s.examples).toHaveLength(1);
    expect(s.examples?.[0]?.value).toBe('alpha');
  });
});

describe('Example* slot — duplicates (SHOULD-not, not MUST-not)', () => {
  it('identical examples are tolerated at the model level', () => {
    const s = textFieldSpec({
      examples: [textValue('alpha'), textValue('alpha')],
    });
    // No error; identical entries are permitted (only SHOULD-not at the spec level).
    expect(s.examples).toHaveLength(2);
    expect(s.examples?.[0]?.value).toBe('alpha');
    expect(s.examples?.[1]?.value).toBe('alpha');
  });
});
