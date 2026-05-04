import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  descriptiveMetadata,
  embeddedPresentationComponent,
  embeddedTemplate,
  embeddedTextField,
  isSchemaArtifact,
  isTemplate,
  presentationComponentId,
  schemaArtifactMetadata,
  schemaVersioning,
  template,
  templateId,
  temporalProvenance,
  textField,
  textFieldId,
  textFieldSpec,
  type SchemaArtifact,
  type Template,
} from '../src/index.js';

const dm = descriptiveMetadata({ name: 'Demo Template' });
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

const titleEmbedding = embeddedTextField({
  key: 'title',
  reference: textFieldId('https://example.org/fields/title'),
});
const subtitleEmbedding = embeddedTextField({
  key: 'subtitle',
  reference: textFieldId('https://example.org/fields/subtitle'),
});
const introEmbedding = embeddedPresentationComponent({
  key: 'intro',
  reference: presentationComponentId('https://example.org/pc/intro'),
});
const addressEmbedding = embeddedTemplate({
  key: 'address',
  reference: templateId('https://example.org/templates/address'),
});

describe('Template', () => {
  it('builds a template with the minimum required fields', () => {
    const t = template({
      id: templateId('https://example.org/templates/demo'),
      modelVersion: '2.0.0',
      metadata: meta,
    });
    expect(t.kind).toBe('Template');
    expect(t.id.kind).toBe('TemplateId');
    expect(t.embedded).toEqual([]);
    expect(t.header).toBeUndefined();
    expect(t.footer).toBeUndefined();
    expect(isTemplate(t)).toBe(true);
  });

  it('coerces a string id into a TemplateId', () => {
    const t = template({
      id: 'https://example.org/templates/demo',
      modelVersion: '2.0.0',
      metadata: meta,
    });
    expect(t.id.kind).toBe('TemplateId');
    expect(t.id.iri.value).toBe('https://example.org/templates/demo');
  });

  it('preserves the order of embedded artifacts', () => {
    const t = template({
      id: templateId('https://example.org/templates/demo'),
      modelVersion: '2.0.0',
      metadata: meta,
      embedded: [introEmbedding, titleEmbedding, addressEmbedding, subtitleEmbedding],
    });
    expect(t.embedded.map((e) => e.key)).toEqual([
      'intro',
      'title',
      'address',
      'subtitle',
    ]);
  });

  it('carries header and footer when supplied', () => {
    const t = template({
      id: templateId('https://example.org/templates/demo'),
      modelVersion: '2.0.0',
      metadata: meta,
      header: 'Welcome',
      footer: 'Thanks for participating.',
    });
    expect(t.header).toEqual([{ value: 'Welcome', lang: 'und' }]);
    expect(t.footer).toEqual([{ value: 'Thanks for participating.', lang: 'und' }]);
  });

  it('rejects duplicate EmbeddedArtifactKey values within a single template', () => {
    const dup = embeddedTextField({
      key: 'title',
      reference: textFieldId('https://example.org/fields/other-title'),
    });
    expect(() =>
      template({
        id: templateId('https://example.org/templates/demo'),
        modelVersion: '2.0.0',
        metadata: meta,
        embedded: [titleEmbedding, dup],
      }),
    ).toThrow(/Duplicate EmbeddedArtifactKey/);
  });

  it('permits the same key across two distinct templates', () => {
    const t1 = template({
      id: templateId('https://example.org/templates/a'),
      modelVersion: '2.0.0',
      metadata: meta,
      embedded: [titleEmbedding],
    });
    const t2 = template({
      id: templateId('https://example.org/templates/b'),
      modelVersion: '2.0.0',
      metadata: meta,
      embedded: [titleEmbedding],
    });
    expect(t1.embedded[0]?.key).toBe('title');
    expect(t2.embedded[0]?.key).toBe('title');
  });
});

describe('SchemaArtifact union', () => {
  it('isSchemaArtifact recognises both Field and Template', () => {
    const f = textField({
      id: textFieldId('https://example.org/fields/x'),
      modelVersion: '2.0.0',
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    const t: Template = template({
      id: templateId('https://example.org/templates/demo'),
      modelVersion: '2.0.0',
      metadata: meta,
    });
    const all: SchemaArtifact[] = [f, t];
    for (const a of all) expect(isSchemaArtifact(a)).toBe(true);

    expect(isSchemaArtifact({ kind: 'EmbeddedTextField' })).toBe(false);
    expect(isSchemaArtifact(null)).toBe(false);
  });
});
