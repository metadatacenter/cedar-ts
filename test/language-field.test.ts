import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  catalogMetadata,
  languageField,
  languageFieldId,
  languageFieldSpec,
  languageValue,
  embeddedLanguageField,
  isLanguageFieldSpec,
  isLanguageValue,
  isField,
  isEmbeddedField,
  lifecycleMetadata,
  schemaArtifactVersioning,
  serialize,
  parseTemplate,
  template,
  templateId,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const meta = {
  metadata: catalogMetadata({ preferredLabel: 'Language field test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
  prompt: 'Language field test',
  title: 'Language field test',
};

const MV = '0.1.0';

describe('LanguageValue', () => {
  it('carries a BCP 47 tag as value', () => {
    const v = languageValue('en');
    expect(v.kind).toBe('LanguageValue');
    expect(v.value).toBe('en');
  });

  it('accepts a tag with script subtag', () => {
    expect(languageValue('zh-Hans').value).toBe('zh-Hans');
  });

  it('accepts a tag with region subtag', () => {
    expect(languageValue('en-US').value).toBe('en-US');
  });

  it('rejects a malformed tag', () => {
    expect(() => languageValue('english_USA')).toThrow(CedarConstructionError);
    expect(() => languageValue('not a tag')).toThrow(CedarConstructionError);
    expect(() => languageValue('')).toThrow(CedarConstructionError);
  });

  it('isLanguageValue discriminates', () => {
    expect(isLanguageValue(languageValue('en'))).toBe(true);
    expect(isLanguageValue({ kind: 'TextValue' })).toBe(false);
    expect(isLanguageValue(null)).toBe(false);
  });

  it('passes a pre-built LanguageValue through unchanged', () => {
    const a = languageValue('en');
    expect(languageValue(a)).toBe(a);
  });
});

describe('LanguageFieldSpec', () => {
  it('constructs without any slots', () => {
    const spec = languageFieldSpec();
    expect(spec.kind).toBe('LanguageFieldSpec');
    expect(spec.defaultValue).toBeUndefined();
    expect(spec.permittedLanguages).toBeUndefined();
    expect(spec.renderingHint).toBeUndefined();
  });

  it('carries a default value', () => {
    const spec = languageFieldSpec({ defaultValue: 'en' });
    expect(spec.defaultValue?.value).toBe('en');
  });

  it('carries a permittedLanguages closed set', () => {
    const spec = languageFieldSpec({
      permittedLanguages: ['en', 'es', 'fr'],
    });
    expect(spec.permittedLanguages).toEqual(['en', 'es', 'fr']);
  });

  it('rejects an empty permittedLanguages', () => {
    expect(() =>
      languageFieldSpec({ permittedLanguages: [] }),
    ).toThrow(CedarConstructionError);
  });

  it('rejects a permittedLanguages entry that is not a valid BCP 47 tag', () => {
    expect(() =>
      languageFieldSpec({ permittedLanguages: ['en', 'english_USA'] }),
    ).toThrow(CedarConstructionError);
  });

  it('rejects a defaultValue not in permittedLanguages', () => {
    expect(() =>
      languageFieldSpec({
        defaultValue: 'de',
        permittedLanguages: ['en', 'es', 'fr'],
      }),
    ).toThrow(/permittedLanguages/);
  });

  it('accepts a defaultValue that appears in permittedLanguages', () => {
    const spec = languageFieldSpec({
      defaultValue: 'es',
      permittedLanguages: ['en', 'es', 'fr'],
    });
    expect(spec.defaultValue?.value).toBe('es');
  });

  it('carries a rendering hint', () => {
    const spec = languageFieldSpec({ renderingHint: 'autocomplete' });
    expect(spec.renderingHint).toBe('autocomplete');
    expect(languageFieldSpec({ renderingHint: 'dropdown' }).renderingHint).toBe('dropdown');
    expect(languageFieldSpec({ renderingHint: 'radio' }).renderingHint).toBe('radio');
  });

  it('isLanguageFieldSpec discriminates', () => {
    expect(isLanguageFieldSpec(languageFieldSpec())).toBe(true);
    expect(isLanguageFieldSpec({ kind: 'TextFieldSpec' })).toBe(false);
  });
});

describe('LanguageField', () => {
  it('builds a tagged LanguageField artifact', () => {
    const f = languageField({
      id: 'https://example.org/fields/primary-language',
      modelVersion: MV,
      ...meta,
      fieldSpec: languageFieldSpec({
        defaultValue: 'en',
        renderingHint: 'autocomplete',
      }),
    });
    expect(f.kind).toBe('LanguageField');
    expect(f.id.kind).toBe('LanguageFieldId');
    expect(f.id.iri.value).toBe('https://example.org/fields/primary-language');
    expect(isField(f)).toBe(true);
  });

  it('idempotent LanguageFieldId construction', () => {
    const a = languageFieldId('https://example.org/fields/x');
    const b = languageFieldId(a);
    expect(b).toBe(a);
  });
});

describe('EmbeddedLanguageField', () => {
  const ref = languageFieldId('https://example.org/fields/primary-language');

  it('builds an embedded language field', () => {
    const ef = embeddedLanguageField({ key: 'primary_language', artifactRef: ref });
    expect(ef.kind).toBe('EmbeddedLanguageField');
    expect(isEmbeddedField(ef)).toBe(true);
  });

  it('carries valueRequirement, visibility, default', () => {
    const ef = embeddedLanguageField({
      key: 'primary_language',
      artifactRef: ref,
      valueRequirement: 'required',
      visibility: 'visible',
      defaultValue: 'en',
    });
    expect(ef.valueRequirement).toBe('required');
    expect(ef.visibility).toBe('visible');
    expect(ef.defaultValue?.kind).toBe('LanguageValue');
    expect(ef.defaultValue?.value).toBe('en');
  });

  it('accepts a LanguageValue or a bare string as defaultValue', () => {
    const a = embeddedLanguageField({
      key: 'a',
      artifactRef: ref,
      defaultValue: 'en',
    });
    const b = embeddedLanguageField({
      key: 'b',
      artifactRef: ref,
      defaultValue: languageValue('en'),
    });
    expect(a.defaultValue?.value).toBe('en');
    expect(b.defaultValue?.value).toBe('en');
  });

  it('extracts .id when given a LanguageField artifact', () => {
    const f = languageField({
      id: 'https://example.org/fields/primary-language',
      modelVersion: MV,
      ...meta,
      fieldSpec: languageFieldSpec(),
    });
    const ef = embeddedLanguageField({ key: 'primary_language', artifactRef: f });
    expect(ef.artifactRef).toBe(f.id);
    expect(ef.artifactRef.kind).toBe('LanguageFieldId');
  });
});

describe('Language wire form', () => {
  const fld = languageField({
    id: 'https://example.org/fields/primary-language',
    modelVersion: MV,
    ...meta,
    fieldSpec: languageFieldSpec({
      defaultValue: 'en',
      permittedLanguages: ['en', 'es', 'fr', 'de', 'zh-Hans'],
      renderingHint: 'dropdown',
    }),
  });

  it('serializes LanguageField with kind tag and field spec', () => {
    const wire = serialize(fld) as Record<string, unknown>;
    expect(wire['kind']).toBe('LanguageField');
    expect(wire['id']).toBe('https://example.org/fields/primary-language');
    const fs = wire['fieldSpec'] as Record<string, unknown>;
    expect(fs['kind']).toBe('LanguageFieldSpec');
    expect(fs['defaultValue']).toEqual({ kind: 'LanguageValue', value: 'en' });
    expect(fs['permittedLanguages']).toEqual(['en', 'es', 'fr', 'de', 'zh-Hans']);
    expect(fs['renderingHint']).toBe('dropdown');
  });

  it('round-trips a Template containing an EmbeddedLanguageField', () => {
    const tpl = template({
      id: templateId('https://example.org/templates/t'),
      modelVersion: MV,
      ...meta,
      members: [
        embeddedLanguageField({
          key: 'primary_language',
          artifactRef: fld,
          valueRequirement: 'required',
          defaultValue: 'en',
        }),
      ],
    });
    const wire = serialize(tpl) as Record<string, unknown>;
    const back = parseTemplate(wire);
    expect(serialize(back)).toEqual(wire);
    const member = (wire['members'] as unknown[])[0] as Record<string, unknown>;
    expect(member['kind']).toBe('EmbeddedLanguageField');
    expect((member['defaultValue'] as Record<string, unknown>)['value']).toBe('en');
  });
});
