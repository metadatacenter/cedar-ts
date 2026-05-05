// =====================================================================
// Boolean field family — true/false values
// =====================================================================
//
// This file is the complete vertical slice for the boolean field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : BooleanFieldId
//   - instance literal           : BooleanLiteral
//   - instance value             : BooleanValue
//   - schema constraints         : BooleanFieldSpec
//   - reusable Field artifact    : BooleanField
//   - Template-embedding wrapper : EmbeddedBooleanField
//
// Wire `kind` values: "BooleanField" (artifact), "EmbeddedBooleanField"
// (embedding), "BooleanValue" (value).
//
// The boolean family deviates from the otherwise-uniform EmbeddedField
// pattern: EmbeddedBooleanField omits the `cardinality` slot. A boolean
// is inherently single-valued; ValueRequirement remains as the way to
// express required vs optional.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import type { BooleanRenderingHint } from './rendering-hints.js';
import { fieldRef } from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `BooleanField` reusable schema artifact: a typed
// wrapper around the field's IRI. Distinguished at compile time and
// runtime from sibling field-id types so a caller can't accidentally
// pass a `BooleanField`'s IRI where (say) a `NumericField`'s IRI is
// expected. On the wire this collapses to a plain JSON string IRI.
export interface BooleanFieldId {
  readonly kind: 'BooleanFieldId';
  readonly iri: Iri;
}

export type BooleanFieldReference = BooleanFieldId;

export const booleanFieldId = (
  v: BooleanFieldId | Iri | string,
): BooleanFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'BooleanFieldId') {
    return v as BooleanFieldId;
  }
  return {
    kind: 'BooleanFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Literal
// =====================================================================
//
// BooleanLiteral is unique among the cedar-ts literal types: its payload
// is a JSON boolean rather than a lexical-form string. The datatype is
// implicitly xsd:boolean and is not carried.

export interface BooleanLiteral {
  readonly kind: 'BooleanLiteral';
  readonly value: boolean;
}

export const booleanLiteral = (value: boolean): BooleanLiteral => ({
  kind: 'BooleanLiteral',
  value,
});

export const isBooleanLiteral = (x: unknown): x is BooleanLiteral =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'BooleanLiteral';

// =====================================================================
// 3. Value
// =====================================================================

export interface BooleanValue {
  readonly kind: 'BooleanValue';
  readonly literal: BooleanLiteral;
}

export function booleanValue(literal: BooleanLiteral | boolean): BooleanValue {
  return {
    kind: 'BooleanValue',
    literal: typeof literal === 'boolean' ? booleanLiteral(literal) : literal,
  };
}

export function isBooleanValue(x: unknown): x is BooleanValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'BooleanValue'
  );
}

// =====================================================================
// 4. FieldSpec
// =====================================================================

export interface BooleanFieldSpec {
  readonly kind: 'BooleanFieldSpec';
  readonly renderingHint?: BooleanRenderingHint;
}

export interface BooleanFieldSpecInit {
  readonly renderingHint?: BooleanRenderingHint;
}

export function booleanFieldSpec(init?: BooleanFieldSpecInit): BooleanFieldSpec {
  const out: { kind: 'BooleanFieldSpec'; renderingHint?: BooleanRenderingHint } = {
    kind: 'BooleanFieldSpec',
  };
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isBooleanFieldSpec = (x: unknown): x is BooleanFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'BooleanFieldSpec';

// =====================================================================
// 5. Field artifact
// =====================================================================

export interface BooleanField {
  readonly kind: 'BooleanField';
  readonly id: BooleanFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: BooleanFieldSpec;
}

export interface BooleanFieldInit {
  readonly id: BooleanFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: BooleanFieldSpec;
}

export const booleanField = (init: BooleanFieldInit): BooleanField =>
  ({
    kind: 'BooleanField',
    id: booleanFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 6. EmbeddedField
// =====================================================================
//
// EmbeddedBooleanField omits the `cardinality` slot — booleans are
// inherently single-valued. ValueRequirement remains as the way to
// express required vs optional. This is the one deviation from the
// otherwise-uniform EmbeddedField pattern.

export interface EmbeddedBooleanField {
  readonly kind: 'EmbeddedBooleanField';
  readonly key: string;
  readonly artifactRef: BooleanFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: BooleanLiteral;
}

// EmbeddedBooleanField does not include cardinality, so its init type
// cannot reuse EmbeddedFieldInitCommon. The slimmer init is declared
// inline here.
export interface EmbeddedBooleanFieldInit {
  readonly key: string;
  readonly artifactRef: BooleanFieldReference | BooleanField;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: PropertyInput;
  readonly defaultValue?: BooleanLiteral | boolean;
}

export function embeddedBooleanField(
  init: EmbeddedBooleanFieldInit,
): EmbeddedBooleanField {
  const out: {
    kind: 'EmbeddedBooleanField';
    key: string;
    artifactRef: BooleanFieldReference;
    valueRequirement?: ValueRequirement;
    visibility?: Visibility;
    labelOverride?: LabelOverride;
    property?: Property;
    defaultValue?: BooleanLiteral;
  } = {
    kind: 'EmbeddedBooleanField',
    key: parseAsciiIdentifier(init.key),
    artifactRef: fieldRef(init.artifactRef),
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.labelOverride !== undefined) out.labelOverride = init.labelOverride;
  if (init.property !== undefined) out.property = property(init.property);
  if (init.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'boolean'
        ? booleanLiteral(init.defaultValue)
        : init.defaultValue;
  }
  return out;
}
