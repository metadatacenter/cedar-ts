import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  lifecycleMetadata,
  schemaArtifactVersioning,
  STATUSES,
  isStatus,
  annotation,
  isAnnotationValue,
  catalogMetadata,
  iri,
  annotationStringValue,
} from '../src/index.js';

describe('LifecycleMetadata', () => {
  it('parses string inputs into typed leaves', () => {
    const tp = lifecycleMetadata({
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
      lifecycleMetadata({
        createdOn: 'not-a-timestamp',
        createdBy: 'https://example.org/u',
        modifiedOn: '2024-01-01T00:00:00Z',
        modifiedBy: 'https://example.org/u',
      }),
    ).toThrow(CedarConstructionError);

    expect(() =>
      lifecycleMetadata({
        createdOn: '2024-01-01T00:00:00Z',
        createdBy: 'not-an-iri',
        modifiedOn: '2024-01-01T00:00:00Z',
        modifiedBy: 'https://example.org/u',
      }),
    ).toThrow(CedarConstructionError);
  });
});

describe('Status and SchemaArtifactVersioning', () => {
  it('Status admits exactly draft and published', () => {
    expect(STATUSES).toEqual(['draft', 'published']);
    expect(isStatus('draft')).toBe(true);
    expect(isStatus('published')).toBe(true);
    expect(isStatus('retracted')).toBe(false);
  });

  it('SchemaArtifactVersioning parses semver strings and accepts optional lineage', () => {
    const sv = schemaArtifactVersioning({
      version: '1.2.3',
      status: 'published',
      previousVersion: 'https://example.org/templates/t/1.2.2',
      derivedFrom: 'https://example.org/templates/source/1.0.0',
    });
    expect(sv.version).toBe('1.2.3');
    expect(sv.previousVersion?.value).toBe(
      'https://example.org/templates/t/1.2.2',
    );
    expect(sv.derivedFrom?.value).toBe('https://example.org/templates/source/1.0.0');
  });

  it('rejects malformed semver', () => {
    expect(() =>
      schemaArtifactVersioning({ version: '1.0', status: 'draft' }),
    ).toThrow(CedarConstructionError);
  });

  it('omits optional lineage fields when absent', () => {
    const sv = schemaArtifactVersioning({
      version: '1.0.0',
      status: 'draft',
    });
    expect('previousVersion' in sv).toBe(false);
    expect('derivedFrom' in sv).toBe(false);
  });
});

describe('Annotation', () => {
  it('string-valued annotation', () => {
    const a = annotation(
      'http://purl.org/dc/terms/title',
      annotationStringValue('A study', 'en'),
    );
    expect(a.property.kind).toBe('Iri');
    expect(a.property.value).toBe('http://purl.org/dc/terms/title');
    expect(a.body.kind).toBe('AnnotationStringValue');
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
  const tp = lifecycleMetadata({
    createdOn: '2024-01-01T00:00:00Z',
    createdBy: 'https://example.org/u',
    modifiedOn: '2024-01-01T00:00:00Z',
    modifiedBy: 'https://example.org/u',
  });
  const sv = schemaArtifactVersioning({
    version: '0.1.0',
    status: 'draft',
  });

  it('requires only a preferredLabel and defaults altLabels and annotations to empty', () => {
    const m = catalogMetadata({ preferredLabel: 'Title', lifecycle: tp });
    expect(m.preferredLabel).toEqual([{ value: 'Title', lang: 'und' }]);
    expect(m.altLabels).toEqual([]);
    expect(m.annotations).toEqual([]);
    expect('description' in m).toBe(false);
    expect('identifier' in m).toBe(false);
  });

  it('passes through optional descriptive fields when provided', () => {
    const m = catalogMetadata({
      preferredLabel: 'Study title',
      description: 'The study title',
      identifier: 'study-001',
      altLabels: ['Title', 'Name of study'],
      lifecycle: tp,
    });
    expect(m.preferredLabel).toEqual([{ value: 'Study title', lang: 'und' }]);
    expect(m.description).toEqual([{ value: 'The study title', lang: 'und' }]);
    expect(m.identifier).toBe('study-001');
    expect(m.altLabels).toEqual([
      [{ value: 'Title', lang: 'und' }],
      [{ value: 'Name of study', lang: 'und' }],
    ]);
  });

  it('carries annotations when provided', () => {
    const m = catalogMetadata({
      preferredLabel: 'Test',
      lifecycle: tp,
      annotations: [
        annotation(
          'http://purl.org/dc/terms/title',
          annotationStringValue('x', 'en'),
        ),
      ],
    });
    expect(m.annotations.length).toBe(1);
  });

});
