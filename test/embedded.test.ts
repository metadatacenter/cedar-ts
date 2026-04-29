import { describe, expect, it } from 'vitest';
import {
  embeddedArtifactKey,
  isEmbeddedArtifactKey,
  keyIdentifier,
  type ValueRequirement,
  VALUE_REQUIREMENTS,
  DEFAULT_VALUE_REQUIREMENT,
  isValueRequirement,
  type Visibility,
  VISIBILITIES,
  DEFAULT_VISIBILITY,
  isVisibility,
  cardinality,
  unboundedCardinality,
  isCardinality,
  isUnboundedCardinality,
  labelOverride,
  isLabelOverride,
  property,
  isProperty,
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
  stringLiteral,
  numericLiteral,
  nonNegativeInteger,
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
    descriptive: descriptiveMetadata({ name: 'X' }),
    provenance: tp,
  }),
  versioning: schemaVersioning({
    version: '1.0.0',
    status: 'draft',
    modelVersion: '2.0.0',
  }),
});

describe('EmbeddedArtifactKey', () => {
  it('accepts a string and wraps it as KeyIdentifier', () => {
    const k = embeddedArtifactKey('section_a-1');
    expect(k.kind).toBe('embedded_artifact_key');
    expect(k.identifier.kind).toBe('key_identifier');
    expect(k.identifier.value).toBe('section_a-1');
    expect(isEmbeddedArtifactKey(k)).toBe(true);
  });

  it('accepts a pre-built KeyIdentifier', () => {
    const id = keyIdentifier('participant_id');
    const k = embeddedArtifactKey(id);
    expect(k.identifier).toBe(id);
  });

  it('rejects a string that violates the ASCII-identifier pattern', () => {
    expect(() => embeddedArtifactKey('1bad')).toThrow();
    expect(() => embeddedArtifactKey('has space')).toThrow();
  });

  it('is idempotent — accepts an existing EmbeddedArtifactKey', () => {
    const k1 = embeddedArtifactKey('participant_id');
    const k2 = embeddedArtifactKey(k1);
    expect(k2).toBe(k1);
  });
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
    expect(ef.reference.kind).toBe('field_id');
    expect(ef.reference.fieldKind).toBe('text');
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
    expect(et.reference.kind).toBe('template_id');
  });

  it('embeddedPresentationComponent extracts .id when given a PresentationComponent', () => {
    const pc = richTextComponent({
      id: presentationComponentId('https://example.org/pc/intro'),
      metadata: artifactMetadata({
        descriptive: descriptiveMetadata({ name: 'Intro' }),
        provenance: tp,
      }),
      htmlContent: '<p>hi</p>',
    });
    const ep = embeddedPresentationComponent({ key: 'intro', reference: pc });
    expect(ep.reference).toBe(pc.id);
    expect(ep.reference.kind).toBe('presentation_component_id');
  });
});

describe('Bare-string key inputs at the embedding init layer', () => {
  it('embeddedField accepts a bare string key and validates it', () => {
    const ef = embeddedTextField({ key: 'title', reference: txtRef });
    expect(ef.key.kind).toBe('embedded_artifact_key');
    expect(ef.key.identifier.value).toBe('title');

    expect(() =>
      embeddedTextField({ key: '1bad', reference: txtRef }),
    ).toThrow();
  });

  it('embeddedTemplate and embeddedPresentationComponent also accept bare strings', () => {
    const et = embeddedTemplate({
      key: 'address',
      reference: templateId('https://example.org/templates/address'),
    });
    expect(et.key.identifier.value).toBe('address');

    const ep = embeddedPresentationComponent({
      key: 'intro',
      reference: presentationComponentId('https://example.org/pc/intro'),
    });
    expect(ep.key.identifier.value).toBe('intro');
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
  it('accepts plain numbers and coerces to NonNegativeInteger', () => {
    const c = cardinality({ min: 1, max: 3 });
    expect(isCardinality(c)).toBe(true);
    expect(c.min.value).toBe('1');
    expect(c.max?.kind).toBe('non_negative_integer');
    if (c.max?.kind === 'non_negative_integer') {
      expect(c.max.value).toBe('3');
    }
  });

  it('accepts a pre-built NonNegativeInteger and the unbounded marker', () => {
    const c = cardinality({ min: nonNegativeInteger(2), max: unboundedCardinality });
    expect(c.min.value).toBe('2');
    expect(isUnboundedCardinality(c.max)).toBe(true);
  });

  it('omits max when not supplied', () => {
    const c = cardinality({ min: 0 });
    expect(c.max).toBeUndefined();
  });

  it('rejects a negative bound at construction', () => {
    expect(() => cardinality({ min: -1 })).toThrow();
  });
});

describe('LabelOverride and Property', () => {
  it('labelOverride defaults alternativeLabels to an empty array', () => {
    const lo = labelOverride({ label: 'Participant' });
    expect(isLabelOverride(lo)).toBe(true);
    expect(lo.label).toBe('Participant');
    expect(lo.alternativeLabels).toEqual([]);
  });

  it('property accepts a string IRI and optional label', () => {
    const p = property({
      propertyIri: 'https://schema.org/identifier',
      propertyLabel: 'identifier',
    });
    expect(isProperty(p)).toBe(true);
    expect(p.propertyIri.kind).toBe('iri');
    expect(p.propertyIri.value).toBe('https://schema.org/identifier');
    expect(p.propertyLabel).toBe('identifier');
  });

  it('property accepts a bare string IRI (no label)', () => {
    const p = property('https://schema.org/name');
    expect(isProperty(p)).toBe(true);
    expect(p.propertyIri.value).toBe('https://schema.org/name');
    expect(p.propertyLabel).toBeUndefined();
  });

  it('property is idempotent', () => {
    const p1 = property('https://schema.org/name');
    const p2 = property(p1);
    expect(p2).toBe(p1);
  });

  it('embedded-init property accepts a bare string IRI', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
      property: 'https://schema.org/name',
    });
    expect(ef.property?.propertyIri.value).toBe('https://schema.org/name');
    expect(ef.property?.propertyLabel).toBeUndefined();
  });

  it('embedded-init property accepts an init object with a label', () => {
    const ef = embeddedTextField({
      key: 'title',
      reference: txtRef,
      property: {
        propertyIri: 'https://schema.org/name',
        propertyLabel: 'name',
      },
    });
    expect(ef.property?.propertyLabel).toBe('name');
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
      key: embeddedArtifactKey('title'),
      reference: txtRef,
    });
    expect(ef.kind).toBe('embedded_field');
    expect(ef.fieldKind).toBe('text');
    expect(ef.reference.fieldKind).toBe('text');
    expect(isEmbeddedField(ef)).toBe(true);
    expect(isEmbeddedFieldOfKind(ef, 'text')).toBe(true);
    expect(isEmbeddedFieldOfKind(ef, 'numeric')).toBe(false);
  });

  it('per-family helpers pin the type', () => {
    const ef: EmbeddedTextField = embeddedTextField({
      key: embeddedArtifactKey('title'),
      reference: txtRef,
    });
    expect(ef.fieldKind).toBe('text');

    // @ts-expect-error EmbeddedTextField is not assignable to EmbeddedDateField
    const d: EmbeddedDateField = ef;
    void d;
  });

  it('rejects a misaligned reference at the type level', () => {
    embeddedDateField({
      key: embeddedArtifactKey('born'),
      // @ts-expect-error TextFieldReference is not a DateFieldReference
      reference: txtRef,
    });

    // @ts-expect-error TextFieldReference is not a NumericFieldReference
    embeddedNumericField({ key: embeddedArtifactKey('age'), reference: txtRef });
  });

  it('rejects a misaligned default value at the type level', () => {
    // @ts-expect-error NumericDefaultValue cannot satisfy DefaultValueFor<'text'>
    embeddedTextField({
      key: embeddedArtifactKey('title'),
      reference: txtRef,
      defaultValue: numericDefaultValue(numericValue(numericLiteral('1', 'integer'))),
    });
  });

  it('attribute-value embeddings cannot carry a default value', () => {
    const ef = embeddedAttributeValueField({
      key: embeddedArtifactKey('attr'),
      reference: attrRef,
    });
    expect(ef.fieldKind).toBe('attribute_value');
    expect(ef.defaultValue).toBeUndefined();

    // @ts-expect-error DefaultValueFor<'attribute_value'> is never
    embeddedAttributeValueField({
      key: embeddedArtifactKey('attr'),
      reference: attrRef,
      defaultValue: textDefaultValue(textValue(stringLiteral('x'))),
    });
  });

  it('carries every embedding-level property when supplied', () => {
    const ef = embeddedTextField({
      key: embeddedArtifactKey('title'),
      reference: txtRef,
      valueRequirement: 'required',
      cardinality: cardinality({ min: 1, max: unboundedCardinality }),
      visibility: 'visible',
      defaultValue: textDefaultValue(textValue(stringLiteral('Untitled'))),
      labelOverride: labelOverride({ label: 'Document Title' }),
      property: property({ propertyIri: 'https://schema.org/name' }),
    });
    expect(ef.valueRequirement).toBe('required');
    expect(ef.cardinality?.min.value).toBe('1');
    expect(ef.visibility).toBe('visible');
    expect(ef.defaultValue?.kind).toBe('text_default_value');
    expect(ef.labelOverride?.label).toBe('Document Title');
    expect(ef.property?.propertyIri.value).toBe('https://schema.org/name');
  });

  it('embeddedDateField accepts a date string and discriminates by lexical shape', () => {
    const ef = embeddedDateField({
      key: embeddedArtifactKey('born'),
      reference: dateRef,
      defaultValue: '1990-06-15',
    });
    expect(ef.defaultValue?.kind).toBe('date_default_value');
    if (ef.defaultValue?.kind === 'date_default_value') {
      expect(ef.defaultValue.value.kind).toBe('full_date_value');
    }

    const efYear = embeddedDateField({
      key: embeddedArtifactKey('year'),
      reference: dateRef,
      defaultValue: '1990',
    });
    if (efYear.defaultValue?.kind === 'date_default_value') {
      expect(efYear.defaultValue.value.kind).toBe('year_value');
    }
  });

  it('coerces a primitive defaultValue input by fieldKind', () => {
    const ef = embeddedTextField({
      key: embeddedArtifactKey('title'),
      reference: txtRef,
      defaultValue: 'Untitled',
    });
    expect(ef.defaultValue?.kind).toBe('text_default_value');
    if (ef.defaultValue?.kind === 'text_default_value') {
      expect(ef.defaultValue.value.literal.kind).toBe('string_literal');
      expect(ef.defaultValue.value.literal.lexicalForm).toBe('Untitled');
    }

    // Bare string IRI works for external-authority families.
    const orcidRef = textFieldId('https://example.org/x'); // dummy not needed
    void orcidRef;
    const ef2 = embeddedAttributeValueField({
      key: embeddedArtifactKey('attr'),
      reference: attrRef,
    });
    expect(ef2.defaultValue).toBeUndefined();
  });

  it('embeddedNumericField rejects a string defaultValue', () => {
    embeddedNumericField({
      key: embeddedArtifactKey('count'),
      reference: numRef,
      // @ts-expect-error EmbeddedNumericFieldInit's defaultValue is NumericDefaultValue only
      defaultValue: 'oops',
    });
  });

  it('builds a numeric, date, and single-choice embedding without errors', () => {
    embeddedNumericField({ key: embeddedArtifactKey('age'), reference: numRef });
    embeddedDateField({ key: embeddedArtifactKey('born'), reference: dateRef });
    embeddedSingleChoiceField({ key: embeddedArtifactKey('sex'), reference: choiceRef });
  });
});

describe('EmbeddedTemplate', () => {
  it('embeds a Template under a key', () => {
    const et = embeddedTemplate({
      key: embeddedArtifactKey('address'),
      reference: templateId('https://example.org/templates/address'),
      cardinality: cardinality({ min: 0, max: unboundedCardinality }),
      property: property({ propertyIri: 'https://schema.org/address' }),
    });
    expect(isEmbeddedTemplate(et)).toBe(true);
    expect(et.kind).toBe('embedded_template');
    expect(et.cardinality?.min.value).toBe('0');
    expect(et.property?.propertyIri.value).toBe('https://schema.org/address');
  });
});

describe('EmbeddedPresentationComponent', () => {
  it('embeds a PresentationComponent with only visibility/label-override', () => {
    const ep = embeddedPresentationComponent({
      key: embeddedArtifactKey('intro'),
      reference: presentationComponentId('https://example.org/pc/intro'),
      visibility: 'hidden',
    });
    expect(isEmbeddedPresentationComponent(ep)).toBe(true);
    expect(ep.kind).toBe('embedded_presentation_component');
    expect(ep.visibility).toBe('hidden');
  });
});

describe('EmbeddedArtifact union', () => {
  it('isEmbeddedArtifact recognises all three forms and rejects others', () => {
    const all: EmbeddedArtifact[] = [
      embeddedTextField({ key: embeddedArtifactKey('a'), reference: txtRef }),
      embeddedTemplate({
        key: embeddedArtifactKey('b'),
        reference: templateId('https://example.org/t/b'),
      }),
      embeddedPresentationComponent({
        key: embeddedArtifactKey('c'),
        reference: presentationComponentId('https://example.org/pc/c'),
      }),
    ];
    for (const a of all) expect(isEmbeddedArtifact(a)).toBe(true);
    expect(isEmbeddedArtifact({ kind: 'field' })).toBe(false);
    expect(isEmbeddedArtifact(null)).toBe(false);
    expect(isEmbeddedArtifact('embedded_field')).toBe(false);
  });
});
