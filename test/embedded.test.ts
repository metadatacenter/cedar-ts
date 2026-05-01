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
  isEmbeddedFieldOfKind,
  embeddedTextField,
  embeddedNumericField,
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
  numericFieldId,
  dateFieldId,
  singleChoiceFieldId,
  attributeValueFieldId,
  templateId,
  presentationComponentId,
  textDefaultValue,
  numericDefaultValue,
  textValue,
  numericValue,
  simpleLiteral,
  numericLiteral,
  textField,
  textFieldSpec,
  template,
  richTextComponent,
  artifactMetadata,
  descriptiveMetadata,
  temporalProvenance,
  schemaArtifactMetadata,
  schemaVersioning,
} from '../src/index.js';

// Shared fixtures for tests that need to construct full Field / Template /
// PresentationComponent artifacts.
const tp = temporalProvenance({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = schemaArtifactMetadata({
  artifact: artifactMetadata({
    descriptiveMetadata: descriptiveMetadata({ name: 'X' }),
    provenance: tp,
  }),
  versioning: schemaVersioning({
    version: '1.0.0',
    status: 'draft',
    modelVersion: '2.0.0',
  }),
});

describe('Inline Field/Template/PresentationComponent reference inputs', () => {
  it('embeddedTextField extracts .id when given a TextField artifact', () => {
    const artifact = textField({
      id: textFieldId('https://example.org/fields/title'),
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    const ef = embeddedTextField({ key: 'title', reference: artifact });
    expect(ef.reference).toBe(artifact.id);
    expect(ef.reference.kind).toBe('FieldId');
    expect(ef.reference.fieldKind).toBe('Text');
  });

  it('embeddedTextField passes the FieldReference through', () => {
    const ref = textFieldId('https://example.org/fields/title');
    const ef = embeddedTextField({ key: 'title', reference: ref });
    expect(ef.reference).toBe(ref);
  });

  it('embeddedDateField rejects a TextField reference at the type level', () => {
    const wrongFamily = textField({
      id: textFieldId('https://example.org/fields/x'),
      metadata: meta,
      fieldSpec: textFieldSpec(),
    });
    embeddedDateField({
      key: 'born',
      // @ts-expect-error TextField is not a DateField (or DateFieldReference)
      reference: wrongFamily,
    });
  });

  it('embeddedTemplate extracts .id when given a Template artifact', () => {
    const t = template({
      id: templateId('https://example.org/templates/address'),
      metadata: meta,
    });
    const et = embeddedTemplate({ key: 'address', reference: t });
    expect(et.reference).toBe(t.id);
    expect(et.reference.kind).toBe('TemplateId');
  });

  it('embeddedPresentationComponent extracts .id when given a PresentationComponent', () => {
    const pc = richTextComponent({
      id: presentationComponentId('https://example.org/pc/intro'),
      metadata: artifactMetadata({
        descriptiveMetadata: descriptiveMetadata({ name: 'Intro' }),
        provenance: tp,
      }),
      html: '<p>hi</p>',
    });
    const ep = embeddedPresentationComponent({ key: 'intro', reference: pc });
    expect(ep.reference).toBe(pc.id);
    expect(ep.reference.kind).toBe('PresentationComponentId');
  });
});

describe('Bare-string key inputs at the embedding init layer', () => {
  it('embeddedField accepts a bare string key and validates it', () => {
    const ef = embeddedTextField({ key: 'title', reference: txtRef });
    expect(ef.key).toBe('title');

    expect(() =>
      embeddedTextField({ key: '1bad', reference: txtRef }),
    ).toThrow();
  });

  it('embeddedTemplate and embeddedPresentationComponent also accept bare strings', () => {
    const et = embeddedTemplate({
      key: 'address',
      reference: templateId('https://example.org/templates/address'),
    });
    expect(et.key).toBe('address');

    const ep = embeddedPresentationComponent({
      key: 'intro',
      reference: presentationComponentId('https://example.org/pc/intro'),
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
      reference: txtRef,
      property: 'https://schema.org/name',
    });
    expect(ef.property?.iri.value).toBe('https://schema.org/name');
    expect(ef.property?.label).toBeUndefined();
  });

  it('embedded-init property accepts an init object with a label', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
      property: {
        iri: 'https://schema.org/name',
        label: 'name',
      },
    });
    expect(ef.property?.label).toEqual([{ value: 'name', lang: 'und' }]);
  });
});

const txtRef = textFieldId('https://example.org/fields/title');
const numRef = numericFieldId('https://example.org/fields/age');
const dateRef = dateFieldId('https://example.org/fields/born');
const choiceRef = singleChoiceFieldId('https://example.org/fields/sex');
const attrRef = attributeValueFieldId('https://example.org/fields/attr');

describe('EmbeddedField constructors', () => {
  it('embeddedTextField composes key, reference, and a tagged shape', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
    });
    expect(ef.kind).toBe('EmbeddedField');
    expect(ef.fieldKind).toBe('Text');
    expect(ef.reference.fieldKind).toBe('Text');
    expect(isEmbeddedField(ef)).toBe(true);
    expect(isEmbeddedFieldOfKind(ef, 'Text')).toBe(true);
    expect(isEmbeddedFieldOfKind(ef, 'Numeric')).toBe(false);
  });

  it('per-family helpers pin the type', () => {
    const ef: EmbeddedTextField = embeddedTextField({
      key: 'title',
      reference: txtRef,
    });
    expect(ef.fieldKind).toBe('Text');

    // @ts-expect-error EmbeddedTextField is not assignable to EmbeddedDateField
    const d: EmbeddedDateField = ef;
    void d;
  });

  it('rejects a misaligned reference at the type level', () => {
    embeddedDateField({
      key: 'born',
      // @ts-expect-error TextFieldReference is not a DateFieldReference
      reference: txtRef,
    });

    // @ts-expect-error TextFieldReference is not a NumericFieldReference
    embeddedNumericField({ key: 'age', reference: txtRef });
  });

  it('rejects a misaligned default value at the type level', () => {
    // @ts-expect-error NumericDefaultValue cannot satisfy DefaultValueFor<'text'>
    embeddedTextField({
      key: 'title',
      reference: txtRef,
      defaultValue: numericDefaultValue(numericValue(numericLiteral('1', 'integer'))),
    });
  });

  it('attribute-value embeddings cannot carry a default value', () => {
    const ef = embeddedAttributeValueField({
      key: 'attr',
      reference: attrRef,
    });
    expect(ef.fieldKind).toBe('AttributeValue');
    expect(ef.defaultValue).toBeUndefined();

    // @ts-expect-error DefaultValueFor<'attribute_value'> is never
    embeddedAttributeValueField({
      key: 'attr',
      reference: attrRef,
      defaultValue: textDefaultValue(textValue(simpleLiteral('x'))),
    });
  });

  it('carries every embedding-level property when supplied', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
      valueRequirement: 'required',
      cardinality: cardinality({ min: 1 }),
      visibility: 'visible',
      defaultValue: textDefaultValue(textValue(simpleLiteral('Untitled'))),
      labelOverride: labelOverride({ label: 'Document Title' }),
      property: property({ iri: 'https://schema.org/name' }),
    });
    expect(ef.valueRequirement).toBe('required');
    expect(ef.cardinality?.min).toBe(1);
    expect(ef.visibility).toBe('visible');
    expect(ef.defaultValue?.kind).toBe('TextDefaultValue');
    expect(ef.labelOverride?.label).toEqual([{ value: 'Document Title', lang: 'und' }]);
    expect(ef.property?.iri.value).toBe('https://schema.org/name');
  });

  it('embeddedDateField accepts a date string and discriminates by lexical shape', () => {
    const ef = embeddedDateField({
      key: 'born',
      reference: dateRef,
      defaultValue: '1990-06-15',
    });
    expect(ef.defaultValue?.kind).toBe('DateDefaultValue');
    if (ef.defaultValue?.kind === 'DateDefaultValue') {
      expect(ef.defaultValue.value.kind).toBe('FullDateValue');
    }

    const efYear = embeddedDateField({
      key: 'year',
      reference: dateRef,
      defaultValue: '1990',
    });
    if (efYear.defaultValue?.kind === 'DateDefaultValue') {
      expect(efYear.defaultValue.value.kind).toBe('YearValue');
    }
  });

  it('coerces a primitive defaultValue input by fieldKind', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
      defaultValue: 'Untitled',
    });
    expect(ef.defaultValue?.kind).toBe('TextDefaultValue');
    if (ef.defaultValue?.kind === 'TextDefaultValue') {
      expect(ef.defaultValue.value.literal.kind).toBe('SimpleLiteral');
      expect(ef.defaultValue.value.literal.lexicalForm).toBe('Untitled');
    }

    // Bare string IRI works for external-authority families.
    const orcidRef = textFieldId('https://example.org/x'); // dummy not needed
    void orcidRef;
    const ef2 = embeddedAttributeValueField({
      key: 'attr',
      reference: attrRef,
    });
    expect(ef2.defaultValue).toBeUndefined();
  });

  it('embeddedNumericField rejects a string defaultValue', () => {
    embeddedNumericField({
      key: 'count',
      reference: numRef,
      // @ts-expect-error EmbeddedNumericFieldInit's defaultValue is NumericDefaultValue only
      defaultValue: 'oops',
    });
  });

  it('builds a numeric, date, and single-choice embedding without errors', () => {
    embeddedNumericField({ key: 'age', reference: numRef });
    embeddedDateField({ key: 'born', reference: dateRef });
    embeddedSingleChoiceField({ key: 'sex', reference: choiceRef });
  });
});

describe('EmbeddedTemplate', () => {
  it('embeds a Template under a key', () => {
    const et = embeddedTemplate({
      key: 'address',
      reference: templateId('https://example.org/templates/address'),
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
      reference: presentationComponentId('https://example.org/pc/intro'),
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
      embeddedTextField({ key: 'a', reference: txtRef }),
      embeddedTemplate({
        key: 'b',
        reference: templateId('https://example.org/t/b'),
      }),
      embeddedPresentationComponent({
        key: 'c',
        reference: presentationComponentId('https://example.org/pc/c'),
      }),
    ];
    for (const a of all) expect(isEmbeddedArtifact(a)).toBe(true);
    expect(isEmbeddedArtifact({ kind: 'Field' })).toBe(false);
    expect(isEmbeddedArtifact(null)).toBe(false);
    expect(isEmbeddedArtifact('embedded_field')).toBe(false);
  });
});
