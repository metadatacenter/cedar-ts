import { describe, expect, it } from 'vitest';
import {
  catalogMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  fieldValue,
  fullDateValue,
  isArtifact,
  isFieldValue,
  isInstanceValue,
  isNestedTemplateInstance,
  isTemplateInstance,
  nestedTemplateInstance,
  integerNumberValue,
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
  type InstanceValue,
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

describe('FieldValue', () => {
  it('builds a FieldValue with a single value', () => {
    const fv = fieldValue(titleKey, textValue('Hello'));
    expect(fv.kind).toBe('FieldValue');
    expect(fv.key).toBe(titleKey);
    expect(fv.values).toHaveLength(1);
    expect(isFieldValue(fv)).toBe(true);
    expect(isInstanceValue(fv)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const fv = fieldValue('title', textValue('Hello'));
    expect(fv.key).toBe('title');
  });

  it('builds a FieldValue with multiple values for a multi-valued field', () => {
    const fv = fieldValue(
      'keywords',
      textValue('alpha'),
      textValue('beta'),
      textValue('gamma'),
    );
    expect(fv.values).toHaveLength(3);
  });

  it('rejects construction without at least one Value at the type level', () => {
    // @ts-expect-error fieldValue requires at least one Value (Value+ in the grammar)
    expect(() => fieldValue(titleKey)).toBeDefined();
  });
});

describe('NestedTemplateInstance', () => {
  it('defaults to empty values when none are supplied', () => {
    const nti = nestedTemplateInstance(studyArmKey);
    expect(nti.kind).toBe('NestedTemplateInstance');
    expect(nti.values).toEqual([]);
    expect(isNestedTemplateInstance(nti)).toBe(true);
    expect(isInstanceValue(nti)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const nti = nestedTemplateInstance('study_arm');
    expect(nti.key).toBe('study_arm');
  });

  it('supports recursive nesting via InstanceValue', () => {
    const inner = fieldValue(titleKey, textValue('Arm A'));
    const nti = nestedTemplateInstance(studyArmKey, [inner]);
    expect(nti.values).toHaveLength(1);
    expect(isFieldValue(nti.values[0])).toBe(true);

    const deeper = nestedTemplateInstance('outer', [nti]);
    expect(isNestedTemplateInstance(deeper.values[0])).toBe(true);
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
    expect(ti.values).toEqual([]);
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
      values: [
        fieldValue(k1, textValue('A')),
        nestedTemplateInstance(k2),
        fieldValue(k3, textValue('C')),
      ],
    });
    expect(ti.values.map((v) => v.key)).toEqual(['a', 'b', 'c']);
  });

  it('permits multiple NestedTemplateInstance entries with the same key (multi-cardinality)', () => {
    const ti = templateInstance({
      ...baseInit,
      values: [
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue('Arm A')),
        ]),
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue('Arm B')),
        ]),
      ],
    });
    expect(ti.values).toHaveLength(2);
    expect(ti.values.every((v) => v.key === 'study_arm')).toBe(true);
  });

  it('rejects two FieldValues sharing a key', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          fieldValue(titleKey, textValue('A')),
          fieldValue(titleKey, textValue('B')),
        ],
      }),
    ).toThrow(/Duplicate FieldValue key/);
  });

  it('rejects a key that appears as both a FieldValue and a NestedTemplateInstance', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          fieldValue(titleKey, textValue('A')),
          nestedTemplateInstance(titleKey),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);

    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          nestedTemplateInstance(titleKey),
          fieldValue(titleKey, textValue('A')),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);
  });

  it('accepts FieldValues drawn from any Value family', () => {
    const ti: TemplateInstance = templateInstance({
      ...baseInit,
      values: [
        fieldValue('count', integerNumberValue('1')),
        fieldValue('born', fullDateValue('1990-01-01')),
      ],
    });
    const all: InstanceValue[] = [...ti.values];
    expect(all).toHaveLength(2);
  });
});

describe('Artifact union', () => {
  const meta = {
    metadata: am,
    versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' }),
    label: 'Demo',
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
    expect(isArtifact({ kind: 'FieldValue' })).toBe(false);
    expect(isArtifact(null)).toBe(false);
  });
});
