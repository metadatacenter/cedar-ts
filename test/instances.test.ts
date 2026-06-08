import { describe, expect, it } from 'vitest';
import {
  catalogMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  fieldEntry,
  fullDateValue,
  isArtifact,
  isFieldEntry,
  isInstanceEntry,
  isTemplateEntry,
  isTemplateInstance,
  templateEntry,
  integerValue,
  presentationComponentId,
  richTextComponent,
  schemaArtifactVersioning,
  template,
  templateId,
  templateInstance,
  templateInstanceId,
  lifecycleMetadata,
  textValue,
  type Artifact,
  type InstanceEntry,
  type TemplateInstance,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const am = catalogMetadata({ preferredLabel: 'Demo Instance', lifecycle: tp });

const tref = templateId('https://example.org/templates/demo');
const titleKey = 'title';
const studyArmKey = 'study_arm';

describe('FieldEntry', () => {
  it('builds a FieldEntry with a single value', () => {
    const fv = fieldEntry(titleKey, textValue('Hello'));
    expect(fv.kind).toBe('FieldEntry');
    expect(fv.key).toBe(titleKey);
    expect(fv.values).toHaveLength(1);
    expect(isFieldEntry(fv)).toBe(true);
    expect(isInstanceEntry(fv)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const fv = fieldEntry('title', textValue('Hello'));
    expect(fv.key).toBe('title');
  });

  it('builds a FieldEntry with multiple values for a multi-valued field', () => {
    const fv = fieldEntry(
      'keywords',
      textValue('alpha'),
      textValue('beta'),
      textValue('gamma'),
    );
    expect(fv.values).toHaveLength(3);
  });

  it('rejects construction without at least one Value at the type level', () => {
    // @ts-expect-error fieldEntry requires at least one Value (Value+ in the grammar)
    expect(() => fieldEntry(titleKey)).toBeDefined();
  });
});

describe('TemplateEntry', () => {
  it('defaults to empty entries when none are supplied', () => {
    const nti = templateEntry(studyArmKey);
    expect(nti.kind).toBe('TemplateEntry');
    expect(nti.entries).toEqual([]);
    expect(isTemplateEntry(nti)).toBe(true);
    expect(isInstanceEntry(nti)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const nti = templateEntry('study_arm');
    expect(nti.key).toBe('study_arm');
  });

  it('supports recursive nesting via InstanceEntry', () => {
    const inner = fieldEntry(titleKey, textValue('Arm A'));
    const nti = templateEntry(studyArmKey, [inner]);
    expect(nti.entries).toHaveLength(1);
    expect(isFieldEntry(nti.entries[0])).toBe(true);

    const deeper = templateEntry('outer', [nti]);
    expect(isTemplateEntry(deeper.entries[0])).toBe(true);
  });
});

describe('TemplateInstance', () => {
  const baseInit = {
    id: templateInstanceId('https://example.org/instances/i1'),
    modelVersion: '2.0.0',
    metadata: am,
    templateRef: tref,
  };

  it('builds an empty TemplateInstance', () => {
    const ti = templateInstance(baseInit);
    expect(ti.kind).toBe('TemplateInstance');
    expect(ti.entries).toEqual([]);
    expect(ti.templateRef.iri.value).toBe('https://example.org/templates/demo');
    expect(isTemplateInstance(ti)).toBe(true);
  });

  it('coerces string id and templateRef', () => {
    const ti = templateInstance({
      id: 'https://example.org/instances/i2',
      modelVersion: '2.0.0',
      metadata: am,
      templateRef: 'https://example.org/templates/demo',
    });
    expect(ti.id.kind).toBe('TemplateInstanceId');
    expect(ti.templateRef.kind).toBe('TemplateId');
  });

  it('preserves the order of InstanceValues', () => {
    const k1 = 'a';
    const k2 = 'b';
    const k3 = 'c';
    const ti = templateInstance({
      ...baseInit,
      entries: [
        fieldEntry(k1, textValue('A')),
        templateEntry(k2),
        fieldEntry(k3, textValue('C')),
      ],
    });
    expect(ti.entries.map((v) => v.key)).toEqual(['a', 'b', 'c']);
  });

  it('permits multiple TemplateEntry entries with the same key (multi-cardinality)', () => {
    const ti = templateInstance({
      ...baseInit,
      entries: [
        templateEntry(studyArmKey, [
          fieldEntry(titleKey, textValue('Arm A')),
        ]),
        templateEntry(studyArmKey, [
          fieldEntry(titleKey, textValue('Arm B')),
        ]),
      ],
    });
    expect(ti.entries).toHaveLength(2);
    expect(ti.entries.every((v) => v.key === 'study_arm')).toBe(true);
  });

  it('rejects two FieldValues sharing a key', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        entries: [
          fieldEntry(titleKey, textValue('A')),
          fieldEntry(titleKey, textValue('B')),
        ],
      }),
    ).toThrow(/Duplicate FieldEntry key/);
  });

  it('rejects a key that appears as both a FieldEntry and a TemplateEntry', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        entries: [
          fieldEntry(titleKey, textValue('A')),
          templateEntry(titleKey),
        ],
      }),
    ).toThrow(/both a FieldEntry and a TemplateEntry/);

    expect(() =>
      templateInstance({
        ...baseInit,
        entries: [
          templateEntry(titleKey),
          fieldEntry(titleKey, textValue('A')),
        ],
      }),
    ).toThrow(/both a FieldEntry and a TemplateEntry/);
  });

  it('accepts FieldValues drawn from any Value family', () => {
    const ti: TemplateInstance = templateInstance({
      ...baseInit,
      entries: [
        fieldEntry('count', integerValue('1')),
        fieldEntry('born', fullDateValue('1990-01-01')),
      ],
    });
    const all: InstanceEntry[] = [...ti.entries];
    expect(all).toHaveLength(2);
  });
});

describe('Artifact union', () => {
  const meta = {
    metadata: am,
    versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
    prompt: 'Demo',
    title: 'Demo',
  };

  it('isArtifact recognises Field, Template, PresentationComponent, and TemplateInstance', () => {
    const f = attributeValueField({
      id: attributeValueFieldId('https://example.org/fields/x'),
      modelVersion: '2.0.0',
      ...meta,
      fieldSpec: attributeValueFieldSpec(),
    });
    const t = template({
      id: templateId('https://example.org/templates/demo'),
      modelVersion: '2.0.0',
      ...meta,
    });
    const pc = richTextComponent({
      id: presentationComponentId('https://example.org/pc/r'),
      modelVersion: '2.0.0',
      metadata: am,
      html: 'Hi',
    });
    const ti = templateInstance({
      id: templateInstanceId('https://example.org/instances/i1'),
      modelVersion: '2.0.0',
      metadata: am,
      templateRef: tref,
    });

    const all: Artifact[] = [f, t, pc, ti];
    for (const a of all) expect(isArtifact(a)).toBe(true);

    expect(isArtifact({ kind: 'EmbeddedTextField' })).toBe(false);
    expect(isArtifact({ kind: 'FieldEntry' })).toBe(false);
    expect(isArtifact(null)).toBe(false);
  });
});
