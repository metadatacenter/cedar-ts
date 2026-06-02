import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  booleanFieldId,
  catalogMetadata,
  embeddedBooleanField,
  embeddedTextField,
  lifecycleMetadata,
  parseArtifact,
  schemaArtifactVersioning,
  serialize,
  template,
  templateId,
  textFieldId,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const meta = {
  metadata: catalogMetadata({ preferredLabel: 'Editability test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
};
const MV = '2.0.0';
const ref = textFieldId('https://example.org/fields/x');

const wrapInTemplate = (member: unknown) =>
  template({
    id: templateId('https://example.org/templates/t'),
    modelVersion: MV,
    ...meta,
    title: 'T',
    members: [member as never],
  });

describe('Editability construction', () => {
  it('is absent by default', () => {
    const e = embeddedTextField({ key: 'f', artifactRef: ref });
    expect('editability' in e).toBe(false);
  });

  it('carries editable / readOnly', () => {
    expect(embeddedTextField({ key: 'f', artifactRef: ref, editability: 'editable' }).editability).toBe('editable');
    expect(embeddedTextField({ key: 'f', artifactRef: ref, editability: 'readOnly' }).editability).toBe('readOnly');
  });
});

describe('readOnly + required + defaultValue rule', () => {
  it('rejects readOnly + required with no defaultValue (text)', () => {
    expect(() =>
      embeddedTextField({
        key: 'f',
        artifactRef: ref,
        editability: 'readOnly',
        valueRequirement: 'required',
      }),
    ).toThrow(CedarConstructionError);
  });

  it('accepts readOnly + required when a defaultValue is supplied', () => {
    expect(() =>
      embeddedTextField({
        key: 'f',
        artifactRef: ref,
        editability: 'readOnly',
        valueRequirement: 'required',
        defaultValue: 'ACC-000000',
      }),
    ).not.toThrow();
  });

  it('accepts readOnly + optional with no defaultValue', () => {
    expect(() =>
      embeddedTextField({
        key: 'f',
        artifactRef: ref,
        editability: 'readOnly',
        valueRequirement: 'optional',
      }),
    ).not.toThrow();
  });

  it('accepts editable + required with no defaultValue (rule is readOnly-only)', () => {
    expect(() =>
      embeddedTextField({ key: 'f', artifactRef: ref, valueRequirement: 'required' }),
    ).not.toThrow();
  });

  it('enforces the rule on the cardinality-less boolean family too', () => {
    const bref = booleanFieldId('https://example.org/fields/b');
    expect(() =>
      embeddedBooleanField({
        key: 'b',
        artifactRef: bref,
        editability: 'readOnly',
        valueRequirement: 'required',
      }),
    ).toThrow(CedarConstructionError);
    // ...satisfied with a default.
    expect(() =>
      embeddedBooleanField({
        key: 'b',
        artifactRef: bref,
        editability: 'readOnly',
        valueRequirement: 'required',
        defaultValue: true,
      }),
    ).not.toThrow();
  });
});

describe('Editability wire form', () => {
  it('round-trips editability inside a template', () => {
    const e = embeddedTextField({ key: 'f', artifactRef: ref, editability: 'readOnly', defaultValue: 'x', valueRequirement: 'required' });
    const t = wrapInTemplate(e);
    const wire = serialize(t) as Record<string, unknown>;
    const member = (wire['members'] as Record<string, unknown>[])[0];
    expect(member?.['editability']).toBe('readOnly');
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });

  it('omits editability on the wire when absent', () => {
    const t = wrapInTemplate(embeddedTextField({ key: 'f', artifactRef: ref }));
    const wire = serialize(t) as Record<string, unknown>;
    const member = (wire['members'] as Record<string, unknown>[])[0]!;
    expect('editability' in member).toBe(false);
  });

  it('rejects an unknown editability value on parse', () => {
    const t = wrapInTemplate(embeddedTextField({ key: 'f', artifactRef: ref, editability: 'readOnly', defaultValue: 'x' }));
    const wire = serialize(t) as Record<string, unknown>;
    (wire['members'] as Record<string, unknown>[])[0]!['editability'] = 'frozen';
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});
