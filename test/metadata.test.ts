import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  descriptiveMetadata,
  temporalProvenance,
  schemaVersioning,
  STATUSES,
  isStatus,
  annotation,
  isAnnotationValue,
  artifactMetadata,
  schemaArtifactMetadata,
  iri,
  langTaggedLiteral,
} from '../src/index.js';

describe('DescriptiveMetadata', () => {
  it('requires only a name and defaults altLabels to empty', () => {
    const dm = descriptiveMetadata({ name: 'Title' });
    expect(dm.name).toEqual([{ value: 'Title', lang: 'und' }]);
    expect(dm.altLabels).toEqual([]);
    expect('description' in dm).toBe(false);
    expect('identifier' in dm).toBe(false);
    expect('preferredLabel' in dm).toBe(false);
  });

  it('passes through optional fields when provided', () => {
    const dm = descriptiveMetadata({
      name: 'Title',
      description: 'The study title',
      identifier: 'study-001',
      preferredLabel: 'Study title',
      altLabels: ['Title', 'Name of study'],
    });
    expect(dm.description).toEqual([{ value: 'The study title', lang: 'und' }]);
    expect(dm.identifier).toBe('study-001');
    expect(dm.preferredLabel).toEqual([{ value: 'Study title', lang: 'und' }]);
    expect(dm.altLabels).toEqual([
      [{ value: 'Title', lang: 'und' }],
      [{ value: 'Name of study', lang: 'und' }],
    ]);
  });
});

describe('TemporalProvenance', () => {
  it('parses string inputs into typed leaves', () => {
    const tp = temporalProvenance({
      createdOn: '2024-01-01T00:00:00Z',
      createdBy: 'https://example.org/users/alice',
      modifiedOn: '2024-06-01T12:00:00Z',
      modifiedBy: 'https://example.org/users/bob',
    });
    expect(tp.createdOn.value).toBe('2024-01-01T00:00:00Z');
    expect(tp.createdBy.value).toBe('https://example.org/users/alice');
    expect(tp.modifiedOn.value).toBe('2024-06-01T12:00:00Z');
    expect(tp.modifiedBy.value).toBe('https://example.org/users/bob');
  });

  it('rejects malformed timestamps and IRIs', () => {
    expect(() =>
      temporalProvenance({
        createdOn: 'not-a-timestamp',
        createdBy: 'https://example.org/u',
        modifiedOn: '2024-01-01T00:00:00Z',
        modifiedBy: 'https://example.org/u',
      }),
    ).toThrow(CedarConstructionError);

    expect(() =>
      temporalProvenance({
        createdOn: '2024-01-01T00:00:00Z',
        createdBy: 'not-an-iri',
        modifiedOn: '2024-01-01T00:00:00Z',
        modifiedBy: 'https://example.org/u',
      }),
    ).toThrow(CedarConstructionError);
  });
});

describe('Status and SchemaVersioning', () => {
  it('Status admits exactly draft and published', () => {
    expect(STATUSES).toEqual(['draft', 'published']);
    expect(isStatus('draft')).toBe(true);
    expect(isStatus('published')).toBe(true);
    expect(isStatus('retracted')).toBe(false);
  });

  it('SchemaVersioning parses semver strings and accepts optional lineage', () => {
    const sv = schemaVersioning({
      version: '1.2.3',
      status: 'published',
      modelVersion: '2.0.0',
      previousVersion: 'https://example.org/templates/t/1.2.2',
      derivedFrom: 'https://example.org/templates/source/1.0.0',
    });
    expect(sv.version).toBe('1.2.3');
    expect(sv.modelVersion).toBe('2.0.0');
    expect(sv.previousVersion?.value).toBe(
      'https://example.org/templates/t/1.2.2',
    );
    expect(sv.derivedFrom?.value).toBe('https://example.org/templates/source/1.0.0');
  });

  it('rejects malformed semver', () => {
    expect(() =>
      schemaVersioning({ version: '1.0', status: 'draft', modelVersion: '2.0.0' }),
    ).toThrow(CedarConstructionError);
  });

  it('omits optional lineage fields when absent', () => {
    const sv = schemaVersioning({
      version: '1.0.0',
      status: 'draft',
      modelVersion: '2.0.0',
    });
    expect('previousVersion' in sv).toBe(false);
    expect('derivedFrom' in sv).toBe(false);
  });
});

describe('Annotation', () => {
  it('literal-valued annotation', () => {
    const a = annotation(
      'http://purl.org/dc/terms/title',
      langTaggedLiteral('A study', 'en'),
    );
    expect(a.property.kind).toBe('Iri');
    expect(a.property.value).toBe('http://purl.org/dc/terms/title');
    expect(a.body.kind).toBe('LangTaggedLiteral');
    expect(isAnnotationValue(a.body)).toBe(true);
  });

  it('iri-valued annotation', () => {
    const a = annotation(
      'http://purl.org/dc/terms/source',
      iri('https://example.org/source/1'),
    );
    expect(a.body.kind).toBe('Iri');
  });
});

describe('ArtifactMetadata and SchemaArtifactMetadata', () => {
  const dm = descriptiveMetadata({ name: 'Test' });
  const tp = temporalProvenance({
    createdOn: '2024-01-01T00:00:00Z',
    createdBy: 'https://example.org/u',
    modifiedOn: '2024-01-01T00:00:00Z',
    modifiedBy: 'https://example.org/u',
  });
  const sv = schemaVersioning({
    version: '0.1.0',
    status: 'draft',
    modelVersion: '2.0.0',
  });

  it('ArtifactMetadata bundles descriptive + provenance + annotations', () => {
    const m = artifactMetadata({ descriptiveMetadata: dm, provenance: tp });
    expect(m.annotations).toEqual([]);
    const m2 = artifactMetadata({
      descriptiveMetadata: dm,
      provenance: tp,
      annotations: [
        annotation(
          'http://purl.org/dc/terms/title',
          langTaggedLiteral('x', 'en'),
        ),
      ],
    });
    expect(m2.annotations.length).toBe(1);
  });

  it('SchemaArtifactMetadata adds schema versioning', () => {
    const m = artifactMetadata({ descriptiveMetadata: dm, provenance: tp });
    const sm = schemaArtifactMetadata({ artifact: m, versioning: sv });
    expect(sm.artifact).toBe(m);
    expect(sm.versioning).toBe(sv);
  });
});
