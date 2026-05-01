import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  descriptiveMetadata,
  fieldValue,
  fullDateLiteral,
  fullDateValue,
  isArtifact,
  isFieldValue,
  isInstanceValue,
  isNestedTemplateInstance,
  isTemplateInstance,
  nestedTemplateInstance,
  numericLiteral,
  numericValue,
  presentationComponentId,
  richTextComponent,
  schemaArtifactMetadata,
  schemaVersioning,
  simpleLiteral,
  template,
  templateId,
  templateInstance,
  templateInstanceId,
  temporalProvenance,
  textValue,
  type Artifact,
  type InstanceValue,
  type TemplateInstance,
} from '../src/index.js';

const dm = descriptiveMetadata({ name: 'Demo Instance' });
const tp = temporalProvenance({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const am = artifactMetadata({ descriptiveMetadata: dm, provenance: tp });

const tref = templateId('https://example.org/templates/demo');
const titleKey = 'title';
const studyArmKey = 'study_arm';

describe('FieldValue', () => {
  it('builds a FieldValue with a single value', () => {
    const fv = fieldValue(titleKey, textValue(simpleLiteral('Hello')));
    expect(fv.kind).toBe('FieldValue');
    expect(fv.key).toBe(titleKey);
    expect(fv.values).toHaveLength(1);
    expect(isFieldValue(fv)).toBe(true);
    expect(isInstanceValue(fv)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const fv = fieldValue('title', textValue(simpleLiteral('Hello')));
    expect(fv.key).toBe('title');
  });

  it('builds a FieldValue with multiple values for a multi-valued field', () => {
    const fv = fieldValue(
      'keywords',
      textValue(simpleLiteral('alpha')),
      textValue(simpleLiteral('beta')),
      textValue(simpleLiteral('gamma')),
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
    const inner = fieldValue(titleKey, textValue(simpleLiteral('Arm A')));
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
        fieldValue(k1, textValue(simpleLiteral('A'))),
        nestedTemplateInstance(k2),
        fieldValue(k3, textValue(simpleLiteral('C'))),
      ],
    });
    expect(ti.values.map((v) => v.key)).toEqual(['a', 'b', 'c']);
  });

  it('permits multiple NestedTemplateInstance entries with the same key (multi-cardinality)', () => {
    const ti = templateInstance({
      ...baseInit,
      values: [
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue(simpleLiteral('Arm A'))),
        ]),
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue(simpleLiteral('Arm B'))),
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
          fieldValue(titleKey, textValue(simpleLiteral('A'))),
          fieldValue(titleKey, textValue(simpleLiteral('B'))),
        ],
      }),
    ).toThrow(/Duplicate FieldValue key/);
  });

  it('rejects a key that appears as both a FieldValue and a NestedTemplateInstance', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          fieldValue(titleKey, textValue(simpleLiteral('A'))),
          nestedTemplateInstance(titleKey),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);

    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          nestedTemplateInstance(titleKey),
          fieldValue(titleKey, textValue(simpleLiteral('A'))),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);
  });

  it('accepts FieldValues drawn from any Value family', () => {
    const ti: TemplateInstance = templateInstance({
      ...baseInit,
      values: [
        fieldValue('count', numericValue(numericLiteral('1', 'integer'))),
        fieldValue('born', fullDateValue(fullDateLiteral('1990-01-01'))),
      ],
    });
    const all: InstanceValue[] = [...ti.values];
    expect(all).toHaveLength(2);
  });
});

describe('Artifact union', () => {
  const meta = schemaArtifactMetadata({
    artifact: am,
    versioning: schemaVersioning({
      version: '1.0.0',
      status: 'draft',
      modelVersion: '2.0.0',
    }),
  });

  it('isArtifact recognises Field, Template, PresentationComponent, and TemplateInstance', () => {
    const f = attributeValueField({
      id: attributeValueFieldId('https://example.org/fields/x'),
      metadata: meta,
      fieldSpec: attributeValueFieldSpec(),
    });
    const t = template({
      id: templateId('https://example.org/templates/demo'),
      metadata: meta,
    });
    const pc = richTextComponent({
      id: presentationComponentId('https://example.org/pc/r'),
      metadata: am,
      html: 'Hi',
    });
    const ti = templateInstance({
      id: templateInstanceId('https://example.org/instances/i1'),
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
