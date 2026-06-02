import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  alternativePrompt,
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
  textField,
  textFieldId,
  textFieldSpec,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const baseMeta = {
  metadata: catalogMetadata({ preferredLabel: 'AltPrompt test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
  prompt: 'What is the patient date of birth?',
};

const MV = '2.0.0';

const fieldWithAltPrompts = () =>
  textField({
    ...baseMeta,
    id: 'https://example.org/cdes/dob',
    modelVersion: MV,
    fieldSpec: textFieldSpec(),
    altPrompts: [
      { key: 'short', prompt: 'Patient date of birth' },
      { key: 'acronym', prompt: { value: 'DOB', lang: 'en' } },
    ],
  });

describe('AlternativePrompt construction', () => {
  it('builds from a key + bare-string wording', () => {
    const ap = alternativePrompt({ key: 'short', prompt: 'DOB' });
    expect(ap.key).toBe('short');
    expect(ap.prompt).toEqual([{ value: 'DOB', lang: 'und' }]);
  });

  it('rejects a key that is not an ASCII identifier', () => {
    expect(() => alternativePrompt({ key: 'not a key', prompt: 'DOB' })).toThrow(
      CedarConstructionError,
    );
  });
});

describe('Field.altPrompts', () => {
  it('is absent by default', () => {
    const f = textField({
      ...baseMeta,
      id: 'https://example.org/cdes/dob',
      modelVersion: MV,
      fieldSpec: textFieldSpec(),
    });
    expect('altPrompts' in f).toBe(false);
  });

  it('carries the curated set, normalising lenient inputs', () => {
    const f = fieldWithAltPrompts();
    expect(f.altPrompts).toHaveLength(2);
    expect(f.altPrompts?.[0]?.key).toBe('short');
    expect(f.altPrompts?.[1]?.prompt).toEqual([{ value: 'DOB', lang: 'en' }]);
  });

  it('rejects duplicate PromptKeys within a field', () => {
    expect(() =>
      textField({
        ...baseMeta,
        id: 'https://example.org/cdes/dob',
        modelVersion: MV,
        fieldSpec: textFieldSpec(),
        altPrompts: [
          { key: 'short', prompt: 'Patient date of birth' },
          { key: 'short', prompt: 'DOB' },
        ],
      }),
    ).toThrow(CedarConstructionError);
  });

  it('round-trips through serialize / parseArtifact', () => {
    const f = fieldWithAltPrompts();
    const wire = serialize(f) as Record<string, unknown>;
    expect(wire['altPrompts']).toEqual([
      { key: 'short', prompt: [{ value: 'Patient date of birth', lang: 'und' }] },
      { key: 'acronym', prompt: [{ value: 'DOB', lang: 'en' }] },
    ]);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
  });
});

describe('EmbeddedField.promptKey', () => {
  const ref = textFieldId('https://example.org/cdes/dob');

  it('is absent by default', () => {
    const e = embeddedTextField({ key: 'dob', artifactRef: ref });
    expect('promptKey' in e).toBe(false);
  });

  it('carries a selected promptKey and round-trips inside a Template', () => {
    const e = embeddedTextField({ key: 'dob', artifactRef: ref, promptKey: 'acronym' });
    expect(e.promptKey).toBe('acronym');
    const t = template({
      id: templateId('https://example.org/templates/survey'),
      modelVersion: MV,
      metadata: baseMeta.metadata,
      versioning: baseMeta.versioning,
      title: 'Survey',
      members: [e],
    });
    const wire = serialize(t) as Record<string, unknown>;
    const member = (wire['members'] as Record<string, unknown>[])[0];
    expect(member?.['promptKey']).toBe('acronym');
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });

  it('rejects a promptKey that is not an ASCII identifier', () => {
    expect(() =>
      embeddedTextField({ key: 'dob', artifactRef: ref, promptKey: 'not a key' }),
    ).toThrow(CedarConstructionError);
  });

  it('rejects an embedding carrying both promptKey and promptOverride', () => {
    expect(() =>
      embeddedTextField({
        key: 'dob',
        artifactRef: ref,
        promptKey: 'acronym',
        promptOverride: 'Birthday?',
      }),
    ).toThrow(CedarConstructionError);
  });

  it('enforces mutual exclusion on a cardinality-less family too (boolean)', () => {
    // EmbeddedBooleanField bypasses assembleCommon; exercise its own guard.
    const bref = booleanFieldId('https://example.org/cdes/consent');
    expect(() =>
      embeddedBooleanField({
        key: 'consent',
        artifactRef: bref,
        promptKey: 'acronym',
        promptOverride: 'Agree?',
      }),
    ).toThrow(CedarConstructionError);
    // ...and carries promptKey when alone, round-tripping inside a Template.
    const ok = embeddedBooleanField({ key: 'consent', artifactRef: bref, promptKey: 'short' });
    expect(ok.promptKey).toBe('short');
    const t = template({
      id: templateId('https://example.org/templates/consent'),
      modelVersion: MV,
      metadata: baseMeta.metadata,
      versioning: baseMeta.versioning,
      title: 'Consent',
      members: [ok],
    });
    const wire = serialize(t) as Record<string, unknown>;
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });
});
