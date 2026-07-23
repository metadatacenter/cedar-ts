// =====================================================================
// toYaml / fromYaml — YAML rendering of the wire form.
// =====================================================================

import { describe, expect, it } from 'vitest';
import { parse as parseYamlText } from 'yaml';
import {
  catalogMetadata,
  embeddedTextField,
  fieldEntry,
  fromYaml,
  lifecycleMetadata,
  schemaArtifactVersioning,
  serialize,
  template,
  templateInstance,
  templateInstanceId,
  textField,
  textFieldId,
  textFieldSpec,
  textValue,
  toYaml,
} from '../src/index.js';

// ---- Shared fixtures --------------------------------------------------

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-02T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const am = catalogMetadata({ preferredLabel: 'Demo', lifecycle: tp });
const sam = {
  metadata: am,
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
  prompt: 'Demo',
  title: 'Demo',
};

const MV = '0.1.0';

const sampleTemplate = template({
  id: 'https://example.org/templates/demo',
  modelVersion: MV,
  ...sam,
  header: 'Hello',
  footer: 'Bye',
  members: [
    embeddedTextField({
      key: 'title',
      artifactRef: textFieldId('https://example.org/fields/title'),
      valueRequirement: 'required',
    }),
  ],
});

const sampleField = textField({
  id: 'https://example.org/fields/x',
  modelVersion: MV,
  ...sam,
  fieldSpec: textFieldSpec(),
});

const sampleInstance = templateInstance({
  id: templateInstanceId('https://example.org/instances/i1'),
  modelVersion: MV,
  metadata: am,
  templateRef: 'https://example.org/templates/demo',
  entries: [fieldEntry('title', textValue('hello'))],
});

// ---- toYaml -----------------------------------------------------------

describe('toYaml', () => {
  it('emits YAML that parses to the exact JSON wire form', () => {
    const text = toYaml(sampleTemplate);
    expect(parseYamlText(text)).toEqual(serialize(sampleTemplate));
  });

  it('emits YAML text, not JSON', () => {
    const text = toYaml(sampleField);
    expect(text).toContain('kind: TextField');
    expect(text.trimStart().startsWith('{')).toBe(false);
  });
});

// ---- fromYaml ---------------------------------------------------------

describe('fromYaml', () => {
  it('round-trips a Template', () => {
    expect(fromYaml(toYaml(sampleTemplate), 'Template')).toEqual(
      sampleTemplate,
    );
  });

  it('round-trips a TemplateInstance', () => {
    expect(fromYaml(toYaml(sampleInstance), 'TemplateInstance')).toEqual(
      sampleInstance,
    );
  });

  it('round-trips a Field', () => {
    expect(fromYaml(toYaml(sampleField), 'Field')).toEqual(sampleField);
  });

  it('defaults to "Artifact" and dispatches by kind', () => {
    expect(fromYaml(toYaml(sampleTemplate)).kind).toBe('Template');
    expect(fromYaml(toYaml(sampleField)).kind).toBe('TextField');
    expect(fromYaml(toYaml(sampleInstance)).kind).toBe('TemplateInstance');
  });

  it('rejects syntactically invalid YAML', () => {
    expect(() => fromYaml('kind: [unclosed')).toThrow(/invalid YAML/);
  });

  it('rejects YAML with duplicate map keys', () => {
    expect(() =>
      fromYaml('kind: Template\nkind: Template'),
    ).toThrow(/invalid YAML/);
  });

  it('rejects well-formed YAML that is not a conforming artifact', () => {
    expect(() => fromYaml('id: x')).toThrow(/string "kind"/);
  });

  it('rejects an empty document (parses to null)', () => {
    expect(() => fromYaml('')).toThrow(/got null/);
  });

  it('rejects explicit null for an optional property', () => {
    const wire = serialize(sampleTemplate) as Record<string, unknown>;
    wire['header'] = null;
    // JSON is valid YAML 1.2, so the mutated wire object can feed fromYaml directly.
    expect(() => fromYaml(JSON.stringify(wire), 'Template')).toThrow(/null/);
  });
});
