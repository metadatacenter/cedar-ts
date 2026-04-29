import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  attributeValueField,
  attributeValueFieldId,
  attributeValueFieldSpec,
  descriptiveMetadata,
  embeddedArtifactKey,
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
  stringLiteral,
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
const am = artifactMetadata({ descriptive: dm, provenance: tp });

const tref = templateId('https://example.org/templates/demo');
const titleKey = embeddedArtifactKey('title');
const studyArmKey = embeddedArtifactKey('study_arm');

describe('FieldValue', () => {
  it('builds a FieldValue with a single value', () => {
    const fv = fieldValue(titleKey, textValue(stringLiteral('Hello')));
    expect(fv.kind).toBe('field_value');
    expect(fv.key).toBe(titleKey);
    expect(fv.values).toHaveLength(1);
    expect(isFieldValue(fv)).toBe(true);
    expect(isInstanceValue(fv)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const fv = fieldValue('title', textValue(stringLiteral('Hello')));
    expect(fv.key.kind).toBe('embedded_artifact_key');
    expect(fv.key.identifier.value).toBe('title');
  });

  it('builds a FieldValue with multiple values for a multi-valued field', () => {
    const fv = fieldValue(
      embeddedArtifactKey('keywords'),
      textValue(stringLiteral('alpha')),
      textValue(stringLiteral('beta')),
      textValue(stringLiteral('gamma')),
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
    expect(nti.kind).toBe('nested_template_instance');
    expect(nti.values).toEqual([]);
    expect(isNestedTemplateInstance(nti)).toBe(true);
    expect(isInstanceValue(nti)).toBe(true);
  });

  it('accepts a bare string as the key', () => {
    const nti = nestedTemplateInstance('study_arm');
    expect(nti.key.identifier.value).toBe('study_arm');
  });

  it('supports recursive nesting via InstanceValue', () => {
    const inner = fieldValue(titleKey, textValue(stringLiteral('Arm A')));
    const nti = nestedTemplateInstance(studyArmKey, [inner]);
    expect(nti.values).toHaveLength(1);
    expect(isFieldValue(nti.values[0])).toBe(true);

    const deeper = nestedTemplateInstance(embeddedArtifactKey('outer'), [nti]);
    expect(isNestedTemplateInstance(deeper.values[0])).toBe(true);
  });
});

describe('TemplateInstance', () => {
  const baseInit = {
    id: templateInstanceId('https://example.org/instances/i1'),
    metadata: am,
    templateReference: tref,
  };

  it('builds an empty TemplateInstance', () => {
    const ti = templateInstance(baseInit);
    expect(ti.kind).toBe('template_instance');
    expect(ti.values).toEqual([]);
    expect(ti.templateReference.iri.value).toBe('https://example.org/templates/demo');
    expect(isTemplateInstance(ti)).toBe(true);
  });

  it('coerces string id and templateReference', () => {
    const ti = templateInstance({
      id: 'https://example.org/instances/i2',
      metadata: am,
      templateReference: 'https://example.org/templates/demo',
    });
    expect(ti.id.kind).toBe('template_instance_id');
    expect(ti.templateReference.kind).toBe('template_id');
  });

  it('preserves the order of InstanceValues', () => {
    const k1 = embeddedArtifactKey('a');
    const k2 = embeddedArtifactKey('b');
    const k3 = embeddedArtifactKey('c');
    const ti = templateInstance({
      ...baseInit,
      values: [
        fieldValue(k1, textValue(stringLiteral('A'))),
        nestedTemplateInstance(k2),
        fieldValue(k3, textValue(stringLiteral('C'))),
      ],
    });
    expect(ti.values.map((v) => v.key.identifier.value)).toEqual(['a', 'b', 'c']);
  });

  it('permits multiple NestedTemplateInstance entries with the same key (multi-cardinality)', () => {
    const ti = templateInstance({
      ...baseInit,
      values: [
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue(stringLiteral('Arm A'))),
        ]),
        nestedTemplateInstance(studyArmKey, [
          fieldValue(titleKey, textValue(stringLiteral('Arm B'))),
        ]),
      ],
    });
    expect(ti.values).toHaveLength(2);
    expect(ti.values.every((v) => v.key.identifier.value === 'study_arm')).toBe(true);
  });

  it('rejects two FieldValues sharing a key', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          fieldValue(titleKey, textValue(stringLiteral('A'))),
          fieldValue(titleKey, textValue(stringLiteral('B'))),
        ],
      }),
    ).toThrow(/Duplicate FieldValue key/);
  });

  it('rejects a key that appears as both a FieldValue and a NestedTemplateInstance', () => {
    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          fieldValue(titleKey, textValue(stringLiteral('A'))),
          nestedTemplateInstance(titleKey),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);

    expect(() =>
      templateInstance({
        ...baseInit,
        values: [
          nestedTemplateInstance(titleKey),
          fieldValue(titleKey, textValue(stringLiteral('A'))),
        ],
      }),
    ).toThrow(/both a FieldValue and a NestedTemplateInstance/);
  });

  it('accepts FieldValues drawn from any Value family', () => {
    const ti: TemplateInstance = templateInstance({
      ...baseInit,
      values: [
        fieldValue(embeddedArtifactKey('count'), numericValue(numericLiteral('1', 'integer'))),
        fieldValue(embeddedArtifactKey('born'), fullDateValue(fullDateLiteral('1990-01-01'))),
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
      metadata: meta,
      content: 'Hi',
    });
    const ti = templateInstance({
      id: templateInstanceId('https://example.org/instances/i1'),
      metadata: am,
      templateReference: tref,
    });

    const all: Artifact[] = [f, t, pc, ti];
    for (const a of all) expect(isArtifact(a)).toBe(true);

    expect(isArtifact({ kind: 'embedded_field' })).toBe(false);
    expect(isArtifact({ kind: 'field_value' })).toBe(false);
    expect(isArtifact(null)).toBe(false);
  });
});
