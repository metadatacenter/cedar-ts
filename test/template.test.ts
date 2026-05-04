import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
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
  lifecycleMetadata,
  textField,
  textFieldId,
  textFieldSpec,
  type SchemaArtifact,
  type Template,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({ name: 'Demo Template', lifecycle: tp }),
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
    expect(t.members).toEqual([]);
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
      members: [introEmbedding, titleEmbedding, addressEmbedding, subtitleEmbedding],
    });
    expect(t.members.map((e) => e.key)).toEqual([
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
        members: [titleEmbedding, dup],
      }),
    ).toThrow(/Duplicate EmbeddedArtifactKey/);
  });

  it('permits the same key across two distinct templates', () => {
    const t1 = template({
      id: templateId('https://example.org/templates/a'),
      modelVersion: '2.0.0',
      metadata: meta,
      members: [titleEmbedding],
    });
    const t2 = template({
      id: templateId('https://example.org/templates/b'),
      modelVersion: '2.0.0',
      metadata: meta,
      members: [titleEmbedding],
    });
    expect(t1.members[0]?.key).toBe('title');
    expect(t2.members[0]?.key).toBe('title');
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
