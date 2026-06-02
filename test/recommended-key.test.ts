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
  prompt: 'Patient date of birth',
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

  it('coexists with recommendedProperty on the same field', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedKey: 'patient_dob',
      recommendedProperty: 'http://purl.obolibrary.org/obo/NCIT_C68615',
    });
    const wire = serialize(f) as Record<string, unknown>;
    expect(wire['recommendedKey']).toBe('patient_dob');
    expect((wire['recommendedProperty'] as Record<string, unknown>)['iri']).toBe(
      'http://purl.obolibrary.org/obo/NCIT_C68615',
    );
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });

  it('round-trips snake_case keys mirroring common embedding conventions', () => {
    for (const key of ['full_name', 'email', 'orcid', 'institution_ror']) {
      const f = textField({
        ...baseMeta,
        id: 'https://example.org/fields/x',
        modelVersion: MV,
        fieldSpec: textFieldSpec(),
        recommendedKey: key,
      });
      const back = parseArtifact(serialize(f));
      expect((back as { recommendedKey?: string }).recommendedKey).toBe(key);
    }
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
      prompt: [{ value: 'X', lang: 'en' }],
      recommendedKey: 'patient dob with spaces',
    };
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});
