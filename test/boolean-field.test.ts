import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  booleanField,
  booleanFieldId,
  booleanFieldSpec,
  booleanValue,
  embeddedBooleanField,
  isBooleanFieldSpec,
  isBooleanValue,
  isField,
  isEmbeddedField,
  lifecycleMetadata,
  schemaArtifactMetadata,
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

const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({ preferredLabel: 'Boolean field test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
});

const MV = '0.1.0';

describe('BooleanValue', () => {
  it('carries a JSON boolean payload directly', () => {
    const v = booleanValue(true);
    expect(v.kind).toBe('BooleanValue');
    expect(v.value).toBe(true);

    const f = booleanValue(false);
    expect(f.value).toBe(false);
  });

  it('isBooleanValue discriminates', () => {
    expect(isBooleanValue(booleanValue(true))).toBe(true);
    expect(isBooleanValue({ kind: 'IntegerNumberValue' })).toBe(false);
    expect(isBooleanValue(null)).toBe(false);
  });

  it('passes a pre-built BooleanValue through unchanged', () => {
    const a = booleanValue(true);
    expect(booleanValue(a)).toBe(a);
  });
});

describe('BooleanFieldSpec', () => {
  it('constructs without rendering hint', () => {
    const spec = booleanFieldSpec();
    expect(spec.kind).toBe('BooleanFieldSpec');
    expect(spec.renderingHint).toBeUndefined();
  });

  it('carries a checkbox or toggle rendering hint', () => {
    const cb = booleanFieldSpec({ renderingHint: 'checkbox' });
    expect(cb.renderingHint).toBe('checkbox');
    const tg = booleanFieldSpec({ renderingHint: 'toggle' });
    expect(tg.renderingHint).toBe('toggle');
  });

  it('isBooleanFieldSpec discriminates', () => {
    expect(isBooleanFieldSpec(booleanFieldSpec())).toBe(true);
    expect(isBooleanFieldSpec({ kind: 'TextFieldSpec' })).toBe(false);
  });
});

describe('BooleanField', () => {
  it('builds a tagged BooleanField artifact', () => {
    const f = booleanField({
      id: 'https://example.org/fields/active',
      modelVersion: MV,
      metadata: meta,
      fieldSpec: booleanFieldSpec({ renderingHint: 'toggle' }),
    });
    expect(f.kind).toBe('BooleanField');
    expect(f.id.kind).toBe('BooleanFieldId');
    expect(f.id.iri.value).toBe('https://example.org/fields/active');
    expect(isField(f)).toBe(true);
  });

  it('idempotent BooleanFieldId construction', () => {
    const a = booleanFieldId('https://example.org/fields/x');
    const b = booleanFieldId(a);
    expect(b).toBe(a);
  });
});

describe('EmbeddedBooleanField', () => {
  const ref = booleanFieldId('https://example.org/fields/active');

  it('omits cardinality structurally — it is not a permitted property', () => {
    const ef = embeddedBooleanField({ key: 'active', artifactRef: ref });
    expect(ef.kind).toBe('EmbeddedBooleanField');
    expect('cardinality' in ef).toBe(false);
    expect(isEmbeddedField(ef)).toBe(true);
  });

  it('carries valueRequirement, visibility, default, label-override, property', () => {
    const ef = embeddedBooleanField({
      key: 'active',
      artifactRef: ref,
      valueRequirement: 'required',
      visibility: 'visible',
      defaultValue: true,
    });
    expect(ef.valueRequirement).toBe('required');
    expect(ef.visibility).toBe('visible');
    expect(ef.defaultValue?.kind).toBe('BooleanValue');
    expect(ef.defaultValue?.value).toBe(true);
  });

  it('accepts a BooleanValue or a bare boolean as defaultValue', () => {
    const a = embeddedBooleanField({
      key: 'a',
      artifactRef: ref,
      defaultValue: false,
    });
    const b = embeddedBooleanField({
      key: 'b',
      artifactRef: ref,
      defaultValue: booleanValue(false),
    });
    expect(a.defaultValue?.value).toBe(false);
    expect(b.defaultValue?.value).toBe(false);
  });

  it('extracts .id when given a BooleanField artifact', () => {
    const f = booleanField({
      id: 'https://example.org/fields/active',
      modelVersion: MV,
      metadata: meta,
      fieldSpec: booleanFieldSpec(),
    });
    const ef = embeddedBooleanField({ key: 'active', artifactRef: f });
    expect(ef.artifactRef).toBe(f.id);
    expect(ef.artifactRef.kind).toBe('BooleanFieldId');
  });
});

describe('Boolean wire form', () => {
  const fld = booleanField({
    id: 'https://example.org/fields/active',
    modelVersion: MV,
    metadata: meta,
    fieldSpec: booleanFieldSpec({ renderingHint: 'checkbox' }),
  });

  it('serializes BooleanField with kind tag and field spec', () => {
    const wire = serialize(fld) as Record<string, unknown>;
    expect(wire['kind']).toBe('BooleanField');
    expect(wire['id']).toBe('https://example.org/fields/active');
    expect((wire['fieldSpec'] as Record<string, unknown>)['kind']).toBe(
      'BooleanFieldSpec',
    );
    expect((wire['fieldSpec'] as Record<string, unknown>)['renderingHint']).toBe(
      'checkbox',
    );
  });

  it('round-trips a Template containing an EmbeddedBooleanField', () => {
    const tpl = template({
      id: templateId('https://example.org/templates/t'),
      modelVersion: MV,
      metadata: meta,
      members: [
        embeddedBooleanField({
          key: 'is_active',
          artifactRef: fld,
          valueRequirement: 'required',
          defaultValue: true,
        }),
      ],
    });
    const wire = serialize(tpl) as Record<string, unknown>;
    const back = parseTemplate(wire);
    expect(serialize(back)).toEqual(wire);
    const member = (wire['members'] as unknown[])[0] as Record<string, unknown>;
    expect(member['kind']).toBe('EmbeddedBooleanField');
    // No cardinality on the wire — boolean is single-valued by construction.
    expect('cardinality' in member).toBe(false);
    expect((member['defaultValue'] as Record<string, unknown>)['value']).toBe(
      true,
    );
  });
});
