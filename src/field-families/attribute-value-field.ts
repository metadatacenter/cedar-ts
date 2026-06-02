// =====================================================================
// AttributeValue field family — user-defined attribute slot (a generic
// name + value pair)
// =====================================================================
//
// This file is the complete vertical slice for the attribute-value
// field family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : AttributeValueFieldId
//   - instance value             : AttributeValueValue
//   - schema constraints         : AttributeValueFieldSpec
//   - reusable Field artifact    : AttributeValueField
//   - Template-embedding wrapper : EmbeddedAttributeValueField
//
// Wire `kind` values: "AttributeValueField" (artifact),
// "EmbeddedAttributeValueField" (embedding).
//
// This family does NOT carry a default value (per grammar §Embedded
// Artifacts); the `EmbeddedField` interface omits `defaultValue`.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { Editability } from '../embedded/editability.js';
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

// Identifier for a `AttributeValueField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `AttributeValueField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface AttributeValueFieldId {
  readonly kind: 'AttributeValueFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the AttributeValue field family.
// Idempotent: an existing AttributeValueFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The AttributeValueFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const attributeValueFieldId = (
  v: AttributeValueFieldId | Iri | string,
): AttributeValueFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'AttributeValueFieldId') {
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
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: AttributeValueFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface AttributeValueFieldInit {
  readonly id: AttributeValueFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: AttributeValueFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const attributeValueField = (
  init: AttributeValueFieldInit,
): AttributeValueField => {
  const out: AttributeValueField = {
    kind: 'AttributeValueField',
    id: attributeValueFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    prompt: multilingualString(init.prompt),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.altPrompts !== undefined && {
      altPrompts: assembleAltPrompts(init.altPrompts),
    }),
    ...(init.recommendedKey !== undefined && {
      recommendedKey: parseAsciiIdentifier(init.recommendedKey),
    }),
    ...(init.recommendedProperty !== undefined && {
      recommendedProperty: property(init.recommendedProperty),
    }),
  };
  return out;
};

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
  readonly artifactRef: AttributeValueFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  // Grammar prohibits a default value here.
}

export interface EmbeddedAttributeValueFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: AttributeValueFieldId | AttributeValueField;
  // Grammar prohibits a default value for attribute-value fields.
}

export function embeddedAttributeValueField(
  init: EmbeddedAttributeValueFieldInit,
): EmbeddedAttributeValueField {
  return {
    ...assembleCommon(init),
    kind: 'EmbeddedAttributeValueField',
    artifactRef: fieldRef(init.artifactRef),
  };
}
