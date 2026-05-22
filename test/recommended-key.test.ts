import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  catalogMetadata,
  emailField,
  emailFieldSpec,
  lifecycleMetadata,
  schemaArtifactVersioning,
  serialize,
  parseArtifact,
  textField,
  textFieldSpec,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const baseMeta = {
  metadata: catalogMetadata({ preferredLabel: 'RecommendedKey test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
  label: 'Patient date of birth',
};

const MV = '2.0.0';

describe('RecommendedKey construction', () => {
  it('is absent by default', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    expect('recommendedKey' in f).toBe(false);
  });

  it('is carried verbatim when valid', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedKey: 'patient_dob',
    });
    expect(f.recommendedKey).toBe('patient_dob');
  });

  it('rejects a recommendedKey containing whitespace', () => {
    expect(() =>
      textField({
        ...baseMeta,
        id: 'https://example.org/fields/x',
        modelVersion: MV,
        fieldSpec: textFieldSpec(),
        recommendedKey: 'patient dob',
      }),
    ).toThrow(CedarConstructionError);
  });

  it('rejects a recommendedKey that is the empty string', () => {
    expect(() =>
      textField({
        ...baseMeta,
        id: 'https://example.org/fields/x',
        modelVersion: MV,
        fieldSpec: textFieldSpec(),
        recommendedKey: '',
      }),
    ).toThrow(CedarConstructionError);
  });

  it('applies on non-text families too', () => {
    const f = emailField({
      ...baseMeta,
      id: 'https://example.org/fields/contact',
      modelVersion: MV,
      fieldSpec: emailFieldSpec(),
      recommendedKey: 'primary_email',
    });
    expect(f.recommendedKey).toBe('primary_email');
  });
});

describe('RecommendedKey wire form', () => {
  it('serializes when present', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedKey: 'patient_dob',
    });
    const wire = serialize(f) as Record<string, unknown>;
    expect(wire['recommendedKey']).toBe('patient_dob');
  });

  it('omits the property when absent', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    const wire = serialize(f) as Record<string, unknown>;
    expect('recommendedKey' in wire).toBe(false);
  });

  it('round-trips through serialize / parseArtifact', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedKey: 'patient_dob',
    });
    const wire = serialize(f);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
    expect((back as { recommendedKey?: string }).recommendedKey).toBe('patient_dob');
  });

  it('parseArtifact rejects an invalid recommendedKey on the wire', () => {
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
      fieldSpec: { kind: 'TextFieldSpec' },
      label: [{ value: 'X', lang: 'en' }],
      recommendedKey: 'patient dob with spaces',
    };
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});
