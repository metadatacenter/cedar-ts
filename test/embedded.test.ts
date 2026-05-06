import { describe, expect, it } from 'vitest';
import {
  type ValueRequirement,
  VALUE_REQUIREMENTS,
  DEFAULT_VALUE_REQUIREMENT,
  isValueRequirement,
  type Visibility,
  VISIBILITIES,
  DEFAULT_VISIBILITY,
  isVisibility,
  cardinality,
  labelOverride,
  property,
  isEmbeddedField,
  embeddedTextField,
  embeddedIntegerNumberField,
  embeddedDateField,
  embeddedSingleChoiceField,
  embeddedAttributeValueField,
  embeddedTemplate,
  isEmbeddedTemplate,
  embeddedPresentationComponent,
  isEmbeddedPresentationComponent,
  isEmbeddedArtifact,
  type EmbeddedArtifact,
  type EmbeddedTextField,
  type EmbeddedDateField,
  textFieldId,
  integerNumberFieldId,
  dateFieldId,
  singleChoiceFieldId,
  attributeValueFieldId,
  templateId,
  presentationComponentId,
  simpleLiteral,
  integerNumberLiteral,
  textField,
  textFieldSpec,
  template,
  richTextComponent,
  artifactMetadata,
  lifecycleMetadata,
  schemaArtifactMetadata,
  schemaVersioning,
} from '../src/index.js';

// Shared fixtures for tests that need to construct full Field / Template /
// PresentationComponent artifacts.
const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({ name: 'X', lifecycle: tp }),
  versioning: schemaVersioning({
    version: '1.0.0',
    status: 'draft',
  }),
});

describe('Inline Field/Template/PresentationComponent reference inputs', () => {
  it('embeddedTextField extracts .id when given a TextField artifact', () => {
    const artifact = textField({
      id: textFieldId('https://example.org/fields/title'),
      modelVersion: '2.0.0',
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    const ef = embeddedTextField({ key: 'title', artifactRef: artifact });
    expect(ef.artifactRef).toBe(artifact.id);
    expect(ef.artifactRef.kind).toBe('TextFieldId');
  });

  it('embeddedTextField passes the FieldReference through', () => {
    const ref = textFieldId('https://example.org/fields/title');
    const ef = embeddedTextField({ key: 'title', artifactRef: ref });
    expect(ef.artifactRef).toBe(ref);
  });

  it('embeddedDateField rejects a TextField reference at the type level', () => {
    const wrongFamily = textField({
      id: textFieldId('https://example.org/fields/x'),
      modelVersion: '2.0.0',
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    embeddedDateField({
      key: 'born',
      // @ts-expect-error TextField is not a DateField (or DateFieldReference)
      artifactRef: wrongFamily,
    });
  });

  it('embeddedTemplate extracts .id when given a Template artifact', () => {
    const t = template({
      id: templateId('https://example.org/templates/address'),
      modelVersion: '2.0.0',
      metadata: meta,
    });
    const et = embeddedTemplate({ key: 'address', artifactRef: t });
    expect(et.artifactRef).toBe(t.id);
    expect(et.artifactRef.kind).toBe('TemplateId');
  });

  it('embeddedPresentationComponent extracts .id when given a PresentationComponent', () => {
    const pc = richTextComponent({
      id: presentationComponentId('https://example.org/pc/intro'),
      modelVersion: '2.0.0',
      metadata: artifactMetadata({ name: 'Intro', lifecycle: tp }),
      html: '<p>hi</p>',
    });
    const ep = embeddedPresentationComponent({ key: 'intro', artifactRef: pc });
    expect(ep.artifactRef).toBe(pc.id);
    expect(ep.artifactRef.kind).toBe('PresentationComponentId');
  });
});

describe('Bare-string key inputs at the embedding init layer', () => {
  it('embeddedField accepts a bare string key and validates it', () => {
    const ef = embeddedTextField({ key: 'title', artifactRef: txtRef });
    expect(ef.key).toBe('title');

    expect(() =>
      embeddedTextField({ key: '1bad', artifactRef: txtRef }),
    ).toThrow();
  });

  it('embeddedTemplate and embeddedPresentationComponent also accept bare strings', () => {
    const et = embeddedTemplate({
      key: 'address',
      artifactRef: templateId('https://example.org/templates/address'),
    });
    expect(et.key).toBe('address');

    const ep = embeddedPresentationComponent({
      key: 'intro',
      artifactRef: presentationComponentId('https://example.org/pc/intro'),
    });
    expect(ep.key).toBe('intro');
  });
});

describe('ValueRequirement', () => {
  it('exposes the three values, recognises them, and defaults to optional', () => {
    expect(VALUE_REQUIREMENTS).toEqual(['required', 'recommended', 'optional']);
    expect(DEFAULT_VALUE_REQUIREMENT).toBe('optional');
    for (const v of VALUE_REQUIREMENTS) expect(isValueRequirement(v)).toBe(true);
    expect(isValueRequirement('mandatory')).toBe(false);
    const r: ValueRequirement = 'required';
    void r;
  });
});

describe('Visibility', () => {
  it('exposes the two values, recognises them, and defaults to visible', () => {
    expect(VISIBILITIES).toEqual(['visible', 'hidden']);
    expect(DEFAULT_VISIBILITY).toBe('visible');
    for (const v of VISIBILITIES) expect(isVisibility(v)).toBe(true);
    expect(isVisibility('invisible')).toBe(false);
    const v: Visibility = 'hidden';
    void v;
  });
});

describe('Cardinality', () => {
  it('accepts plain numbers', () => {
    const c = cardinality({ min: 1, max: 3 });
    expect(c.min).toBe(1);
    expect(c.max).toBe(3);
  });

  it('omits max when not supplied (unbounded)', () => {
    const c = cardinality({ min: 0 });
    expect(c.max).toBeUndefined();
  });

  it('rejects a negative bound at construction', () => {
    expect(() => cardinality({ min: -1 })).toThrow();
  });
});

describe('LabelOverride and Property', () => {
  it('labelOverride defaults altLabels to an empty array', () => {
    const lo = labelOverride({ label: 'Participant' });
    expect(lo.label).toEqual([{ value: 'Participant', lang: 'und' }]);
    expect(lo.altLabels).toEqual([]);
  });

  it('property accepts an init object with iri and optional label', () => {
    const p = property({
      iri: 'https://schema.org/identifier',
      label: 'identifier',
    });
    expect(p.iri.kind).toBe('Iri');
    expect(p.iri.value).toBe('https://schema.org/identifier');
    expect(p.label).toEqual([{ value: 'identifier', lang: 'und' }]);
  });

  it('property accepts a bare string IRI (no label)', () => {
    const p = property('https://schema.org/name');
    expect(p.iri.value).toBe('https://schema.org/name');
    expect(p.label).toBeUndefined();
  });

  it('property accepts an existing Property structurally (init shape)', () => {
    const p1 = property('https://schema.org/name');
    const p2 = property(p1);
    expect(p2.iri.value).toBe('https://schema.org/name');
    expect(p2.label).toBeUndefined();
  });

  it('embedded-init property accepts a bare string IRI', () => {
    const ef = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
      property: 'https://schema.org/name',
    });
    expect(ef.property?.iri.value).toBe('https://schema.org/name');
    expect(ef.property?.label).toBeUndefined();
  });

  it('embedded-init property accepts an init object with a label', () => {
    const ef = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
      property: {
        iri: 'https://schema.org/name',
        label: 'name',
      },
    });
    expect(ef.property?.label).toEqual([{ value: 'name', lang: 'und' }]);
  });
});

const txtRef = textFieldId('https://example.org/fields/title');
const numRef = integerNumberFieldId('https://example.org/fields/age');
const dateRef = dateFieldId('https://example.org/fields/born');
const choiceRef = singleChoiceFieldId('https://example.org/fields/sex');
const attrRef = attributeValueFieldId('https://example.org/fields/attr');

describe('EmbeddedField constructors', () => {
  it('embeddedTextField composes key, reference, and a tagged shape', () => {
    const ef = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
    });
    expect(ef.kind).toBe('EmbeddedTextField');
    expect(ef.artifactRef.kind).toBe('TextFieldId');
    expect(isEmbeddedField(ef)).toBe(true);
  });

  it('per-family helpers pin the type', () => {
    const ef: EmbeddedTextField = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
    });
    expect(ef.kind).toBe('EmbeddedTextField');

    // @ts-expect-error EmbeddedTextField is not assignable to EmbeddedDateField
    const d: EmbeddedDateField = ef;
    void d;
  });

  it('rejects a misaligned reference at the type level', () => {
    embeddedDateField({
      key: 'born',
      // @ts-expect-error TextFieldReference is not a DateFieldReference
      artifactRef: txtRef,
    });

    // @ts-expect-error TextFieldReference is not an IntegerNumberFieldReference
    embeddedIntegerNumberField({ key: 'age', artifactRef: txtRef });
  });

  it('rejects a misaligned default value at the type level', () => {
    // @ts-expect-error IntegerNumberLiteral cannot satisfy a TextField defaultValue (TextLiteral)
    embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
      defaultValue: integerNumberLiteral('1'),
    });
  });

  it('attribute-value embeddings cannot carry a default value', () => {
    const ef = embeddedAttributeValueField({
      key: 'attr',
      artifactRef: attrRef,
    });
    expect(ef.kind).toBe('EmbeddedAttributeValueField');
    expect(ef.defaultValue).toBeUndefined();

    // @ts-expect-error AttributeValueField has no defaultValue slot
    embeddedAttributeValueField({
      key: 'attr',
      artifactRef: attrRef,
      defaultValue: simpleLiteral('x'),
    });
  });

  it('carries every embedding-level property when supplied', () => {
    const ef = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
      valueRequirement: 'required',
      cardinality: cardinality({ min: 1 }),
      visibility: 'visible',
      defaultValue: simpleLiteral('Untitled'),
      labelOverride: labelOverride({ label: 'Document Title' }),
      property: property({ iri: 'https://schema.org/name' }),
    });
    expect(ef.valueRequirement).toBe('required');
    expect(ef.cardinality?.min).toBe(1);
    expect(ef.visibility).toBe('visible');
    expect(ef.defaultValue?.kind).toBe('SimpleLiteral');
    expect(ef.defaultValue?.lexicalForm).toBe('Untitled');
    expect(ef.labelOverride?.label).toEqual([{ value: 'Document Title', lang: 'und' }]);
    expect(ef.property?.iri.value).toBe('https://schema.org/name');
  });

  it('embeddedDateField accepts a date string and discriminates by lexical shape', () => {
    const ef = embeddedDateField({
      key: 'born',
      artifactRef: dateRef,
      defaultValue: '1990-06-15',
    });
    expect(ef.defaultValue?.kind).toBe('FullDateValue');

    const efYear = embeddedDateField({
      key: 'year',
      artifactRef: dateRef,
      defaultValue: '1990',
    });
    expect(efYear.defaultValue?.kind).toBe('YearValue');
  });

  it('coerces a primitive defaultValue input by family kind', () => {
    const ef = embeddedTextField({
      key: 'title',
      artifactRef: txtRef,
      defaultValue: 'Untitled',
    });
    expect(ef.defaultValue?.kind).toBe('SimpleLiteral');
    expect(ef.defaultValue?.lexicalForm).toBe('Untitled');

    const ef2 = embeddedAttributeValueField({
      key: 'attr',
      artifactRef: attrRef,
    });
    expect(ef2.defaultValue).toBeUndefined();
  });

  it('embeddedIntegerNumberField rejects a string defaultValue', () => {
    embeddedIntegerNumberField({
      key: 'count',
      artifactRef: numRef,
      // @ts-expect-error EmbeddedIntegerNumberFieldInit's defaultValue is IntegerNumberLiteral only
      defaultValue: 'oops',
    });
  });

  it('builds a numeric, date, and single-choice embedding without errors', () => {
    embeddedIntegerNumberField({ key: 'age', artifactRef: numRef });
    embeddedDateField({ key: 'born', artifactRef: dateRef });
    embeddedSingleChoiceField({ key: 'sex', artifactRef: choiceRef });
  });
});

describe('EmbeddedTemplate', () => {
  it('embeds a Template under a key', () => {
    const et = embeddedTemplate({
      key: 'address',
      artifactRef: templateId('https://example.org/templates/address'),
      cardinality: cardinality({ min: 0 }),
      property: property({ iri: 'https://schema.org/address' }),
    });
    expect(isEmbeddedTemplate(et)).toBe(true);
    expect(et.kind).toBe('EmbeddedTemplate');
    expect(et.cardinality?.min).toBe(0);
    expect(et.property?.iri.value).toBe('https://schema.org/address');
  });
});

describe('EmbeddedPresentationComponent', () => {
  it('embeds a PresentationComponent with only visibility/label-override', () => {
    const ep = embeddedPresentationComponent({
      key: 'intro',
      artifactRef: presentationComponentId('https://example.org/pc/intro'),
      visibility: 'hidden',
    });
    expect(isEmbeddedPresentationComponent(ep)).toBe(true);
    expect(ep.kind).toBe('EmbeddedPresentationComponent');
    expect(ep.visibility).toBe('hidden');
  });
});

describe('EmbeddedArtifact union', () => {
  it('isEmbeddedArtifact recognises all three forms and rejects others', () => {
    const all: EmbeddedArtifact[] = [
      embeddedTextField({ key: 'a', artifactRef: txtRef }),
      embeddedTemplate({
        key: 'b',
        artifactRef: templateId('https://example.org/t/b'),
      }),
      embeddedPresentationComponent({
        key: 'c',
        artifactRef: presentationComponentId('https://example.org/pc/c'),
      }),
    ];
    for (const a of all) expect(isEmbeddedArtifact(a)).toBe(true);
    expect(isEmbeddedArtifact({ kind: 'TextField' })).toBe(false);
    expect(isEmbeddedArtifact(null)).toBe(false);
    expect(isEmbeddedArtifact('embedded_field')).toBe(false);
  });
});
