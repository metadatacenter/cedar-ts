import { type Iri, iri } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';
// AttributeValue's `value` is a Value, which is the cross-family Value union
// defined in ./index.ts. The import-from-./index pattern is only safe because
// AttributeValue uses Value as a type position; the runtime value carries no
// circular reference.
import type { Value } from './index.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface AttributeValueFieldId {
  readonly kind: 'AttributeValueFieldId';
  readonly iri: Iri;
}

export type AttributeValueFieldReference = AttributeValueFieldId;

export const attributeValueFieldId = (
  v: AttributeValueFieldId | Iri | string,
): AttributeValueFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as AttributeValueFieldId;
  }
  return {
    kind: 'AttributeValueFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

// AttributeValue is a name-value pair whose `value` is itself a `Value`,
// permitting unbounded nesting depth at the model level.
export interface AttributeValue {
  readonly kind: 'AttributeValue';
  readonly name: string;
  readonly value: Value;
}

export function attributeValue(name: string, value: Value): AttributeValue {
  return { kind: 'AttributeValue', name, value };
}

export function isAttributeValue(x: unknown): x is AttributeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'AttributeValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface AttributeValueFieldSpec {
  readonly kind: 'AttributeValueFieldSpec';
}

export const attributeValueFieldSpec = (): AttributeValueFieldSpec =>
  ({ kind: 'AttributeValueFieldSpec' });

export const isAttributeValueFieldSpec = (x: unknown): x is AttributeValueFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'AttributeValueFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface AttributeValueField {
  readonly kind: 'AttributeValueField';
  readonly id: AttributeValueFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: AttributeValueFieldSpec;
}

export interface AttributeValueFieldInit {
  readonly id: AttributeValueFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: AttributeValueFieldSpec;
}

export const attributeValueField = (
  init: AttributeValueFieldInit,
): AttributeValueField =>
  ({
    kind: 'AttributeValueField',
    id: attributeValueFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue — N/A: grammar prohibits a default value for
//    attribute-value fields.
// =====================================================================

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedAttributeValueField {
  readonly kind: 'EmbeddedAttributeValueField';
  readonly key: string;
  readonly reference: AttributeValueFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  // Grammar prohibits a default value here.
}

export interface EmbeddedAttributeValueFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: AttributeValueFieldReference | AttributeValueField;
  // Grammar prohibits a default value for attribute-value fields.
}

export function embeddedAttributeValueField(
  init: EmbeddedAttributeValueFieldInit,
): EmbeddedAttributeValueField {
  return {
    ...assembleCommon(init),
    kind: 'EmbeddedAttributeValueField',
    reference: fieldRef(init.reference),
  };
}
