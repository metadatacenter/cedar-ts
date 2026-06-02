import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  catalogMetadata,
  emailField,
  emailFieldSpec,
  lifecycleMetadata,
  serialize,
  parseArtifact,
  schemaArtifactVersioning,
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
  metadata: catalogMetadata({ preferredLabel: 'RecommendedProperty test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
  prompt: 'Patient date of birth',
};

const MV = '2.0.0';
const DOB_IRI = 'http://purl.obolibrary.org/obo/NCIT_C68615';

describe('RecommendedProperty construction', () => {
  it('is absent by default', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    expect('recommendedProperty' in f).toBe(false);
  });

  it('accepts a bare IRI string (lenient input)', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedProperty: DOB_IRI,
    });
    expect(f.recommendedProperty?.iri.value).toBe(DOB_IRI);
    expect(f.recommendedProperty?.label).toBeUndefined();
  });

  it('accepts an IRI + label', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedProperty: { iri: DOB_IRI, label: 'date of birth' },
    });
    expect(f.recommendedProperty?.iri.value).toBe(DOB_IRI);
    expect(f.recommendedProperty?.label).toBeDefined();
  });

  it('rejects a malformed IRI', () => {
    expect(() =>
      textField({
        ...baseMeta,
        id: 'https://example.org/fields/x',
        modelVersion: MV,
        fieldSpec: textFieldSpec(),
        recommendedProperty: 'not a valid iri with spaces',
      }),
    ).toThrow(CedarConstructionError);
  });

  it('applies on non-text families too', () => {
    const f = emailField({
      ...baseMeta,
      id: 'https://example.org/fields/contact',
      modelVersion: MV,
      fieldSpec: emailFieldSpec(),
      recommendedProperty: DOB_IRI,
    });
    expect(f.recommendedProperty?.iri.value).toBe(DOB_IRI);
  });
});

describe('RecommendedProperty wire form', () => {
  it('serializes as an object (does NOT collapse to a string)', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedProperty: { iri: DOB_IRI, label: { value: 'date of birth', lang: 'en' } },
    });
    const wire = serialize(f) as Record<string, unknown>;
    const rp = wire['recommendedProperty'] as Record<string, unknown>;
    expect(typeof rp).toBe('object');
    expect(rp['iri']).toBe(DOB_IRI);
    expect(rp['label']).toEqual([{ value: 'date of birth', lang: 'en' }]);
  });

  it('omits the property when absent', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    const wire = serialize(f) as Record<string, unknown>;
    expect('recommendedProperty' in wire).toBe(false);
  });

  it('round-trips through serialize / parseArtifact', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/fields/x',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
      recommendedProperty: { iri: DOB_IRI, label: { value: 'date of birth', lang: 'en' } },
    });
    const wire = serialize(f);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
  });

  it('parseArtifact rejects a recommendedProperty missing its iri', () => {
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
      recommendedProperty: { label: [{ value: 'date of birth', lang: 'en' }] },
    };
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});
