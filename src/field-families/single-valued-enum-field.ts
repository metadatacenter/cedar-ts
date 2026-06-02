// =====================================================================
// SingleValuedEnum field family — exactly one selection from a declared
// set of permissible values
// =====================================================================
//
// Per the cedar-ts convention each family file holds:
//
//   - identifier type            : SingleValuedEnumFieldId
//   - instance value             : EnumValue (shared with multi-valued)
//   - schema constraints         : SingleValuedEnumFieldSpec
//   - reusable Field artifact    : SingleValuedEnumField
//   - Template-embedding wrapper : EmbeddedSingleValuedEnumField
//
// Wire `kind` values: "SingleValuedEnumField" (artifact),
// "EmbeddedSingleValuedEnumField" (embedding). The embedding carries no
// `cardinality` slot (single-valued enum is implicit, parallel to boolean).

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import type { SingleValuedEnumRenderingHint } from './rendering-hints.js';
import { type PermissibleValue, type EnumValue, enumValue } from './enum-shared.js';
import { fieldRef } from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface SingleValuedEnumFieldId {
  readonly kind: 'SingleValuedEnumFieldId';
  readonly iri: Iri;
}

export const singleValuedEnumFieldId = (
  v: SingleValuedEnumFieldId | Iri | string,
): SingleValuedEnumFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'SingleValuedEnumFieldId'
  ) {
    return v as SingleValuedEnumFieldId;
  }
  return {
    kind: 'SingleValuedEnumFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value — see ./enum-shared.ts (EnumValue)
// =====================================================================

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface SingleValuedEnumFieldSpec {
  readonly kind: 'SingleValuedEnumFieldSpec';
  readonly permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
  // Spec-level default; an EnumValue whose token must equal one of
  // permissibleValues' value tokens.
  readonly defaultValue?: EnumValue;
  readonly renderingHint?: SingleValuedEnumRenderingHint;
  readonly examples?: readonly EnumValue[];
}

export interface SingleValuedEnumFieldSpecInit {
  readonly permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
  readonly defaultValue?: EnumValue | string;
  readonly renderingHint?: SingleValuedEnumRenderingHint;
  readonly examples?: readonly (EnumValue | string)[];
}

export function singleValuedEnumFieldSpec(
  init: SingleValuedEnumFieldSpecInit,
): SingleValuedEnumFieldSpec {
  const out: {
    kind: 'SingleValuedEnumFieldSpec';
    permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
    defaultValue?: EnumValue;
    renderingHint?: SingleValuedEnumRenderingHint;
  } = {
    kind: 'SingleValuedEnumFieldSpec',
    permissibleValues: init.permissibleValues,
  };
  if (init.defaultValue !== undefined)
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? enumValue(init.defaultValue)
        : init.defaultValue;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly EnumValue[] }).examples = init.examples.map(
      (e) => (typeof e === 'string' ? enumValue(e) : e),
    );
  }
  return out;
}

export const isSingleValuedEnumFieldSpec = (
  x: unknown,
): x is SingleValuedEnumFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'SingleValuedEnumFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface SingleValuedEnumField {
  readonly kind: 'SingleValuedEnumField';
  readonly id: SingleValuedEnumFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: SingleValuedEnumFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface SingleValuedEnumFieldInit {
  readonly id: SingleValuedEnumFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: SingleValuedEnumFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const singleValuedEnumField = (
  init: SingleValuedEnumFieldInit,
): SingleValuedEnumField => {
  const out: SingleValuedEnumField = {
    kind: 'SingleValuedEnumField',
    id: singleValuedEnumFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    prompt: multilingualString(init.prompt),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
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
// 5. EmbeddedField — no cardinality (single-valued enum is implicit)
// =====================================================================

export interface EmbeddedSingleValuedEnumField {
  readonly kind: 'EmbeddedSingleValuedEnumField';
  readonly key: string;
  readonly artifactRef: SingleValuedEnumFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: EnumValue;
}

export interface EmbeddedSingleValuedEnumFieldInit {
  readonly key: string;
  readonly artifactRef: SingleValuedEnumFieldId | SingleValuedEnumField;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: PropertyInput;
  readonly defaultValue?: EnumValue;
}

export function embeddedSingleValuedEnumField(
  init: EmbeddedSingleValuedEnumFieldInit,
): EmbeddedSingleValuedEnumField {
  const out: {
    kind: 'EmbeddedSingleValuedEnumField';
    key: string;
    artifactRef: SingleValuedEnumFieldId;
    valueRequirement?: ValueRequirement;
    visibility?: Visibility;
    promptOverride?: MultilingualString;
    helpTextOverride?: MultilingualString;
    property?: Property;
    defaultValue?: EnumValue;
  } = {
    kind: 'EmbeddedSingleValuedEnumField',
    key: parseAsciiIdentifier(init.key),
    artifactRef: fieldRef(init.artifactRef),
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.promptOverride !== undefined) out.promptOverride = multilingualString(init.promptOverride);
  if (init.helpTextOverride !== undefined) out.helpTextOverride = init.helpTextOverride;
  if (init.property !== undefined) out.property = property(init.property);
  if (init.defaultValue !== undefined) out.defaultValue = init.defaultValue;
  return out;
}
