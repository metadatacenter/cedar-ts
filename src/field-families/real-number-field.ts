// =====================================================================
// Real-number field family — real-valued numeric content (xsd:decimal,
// xsd:float, xsd:double)
// =====================================================================
//
// This file is the complete vertical slice for the real-number field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : RealNumberFieldId
//   - instance value             : RealNumberValue
//   - schema constraints         : RealNumberFieldSpec
//   - reusable Field artifact    : RealNumberField
//   - Template-embedding wrapper : EmbeddedRealNumberField
//
// Wire `kind` values: "RealNumberField" (artifact),
// "EmbeddedRealNumberField" (embedding), "RealNumberValue" (value),
// "RealNumberFieldSpec" (spec).
//
// RealNumberFieldSpec carries a `datatype` enum (decimal | float |
// double) — the family covers three real-valued XSD types that share a
// configuration template but differ in precision class.

import {
  type Iri,
  type RealNumberDatatypeKind,
  iri,
  parseSemanticVersion,
} from '../leaves/index.js';
import type { RealNumberLiteral } from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { NumericRenderingHint } from './rendering-hints.js';
import type { Unit } from './unit.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface RealNumberFieldId {
  readonly kind: 'RealNumberFieldId';
  readonly iri: Iri;
}

export type RealNumberFieldReference = RealNumberFieldId;

export const realNumberFieldId = (
  v: RealNumberFieldId | Iri | string,
): RealNumberFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'RealNumberFieldId'
  ) {
    return v as RealNumberFieldId;
  }
  return {
    kind: 'RealNumberFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface RealNumberValue {
  readonly kind: 'RealNumberValue';
  readonly literal: RealNumberLiteral;
}

export function realNumberValue(literal: RealNumberLiteral): RealNumberValue {
  return { kind: 'RealNumberValue', literal };
}

export function isRealNumberValue(x: unknown): x is RealNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'RealNumberValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface RealNumberFieldSpec {
  readonly kind: 'RealNumberFieldSpec';
  readonly datatype: RealNumberDatatypeKind;
  readonly unit?: Unit;
  readonly minValue?: RealNumberValue;
  readonly maxValue?: RealNumberValue;
  readonly renderingHint?: NumericRenderingHint;
}

export interface RealNumberFieldSpecInit {
  readonly datatype: RealNumberDatatypeKind;
  readonly unit?: Unit;
  readonly minValue?: RealNumberValue;
  readonly maxValue?: RealNumberValue;
  readonly renderingHint?: NumericRenderingHint;
}

export function realNumberFieldSpec(
  init: RealNumberFieldSpecInit,
): RealNumberFieldSpec {
  const out: {
    kind: 'RealNumberFieldSpec';
    datatype: RealNumberDatatypeKind;
    unit?: Unit;
    minValue?: RealNumberValue;
    maxValue?: RealNumberValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'RealNumberFieldSpec', datatype: init.datatype };
  if (init.unit !== undefined) out.unit = init.unit;
  if (init.minValue !== undefined) out.minValue = init.minValue;
  if (init.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isRealNumberFieldSpec = (x: unknown): x is RealNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'RealNumberFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface RealNumberField {
  readonly kind: 'RealNumberField';
  readonly id: RealNumberFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RealNumberFieldSpec;
}

export interface RealNumberFieldInit {
  readonly id: RealNumberFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RealNumberFieldSpec;
}

export const realNumberField = (init: RealNumberFieldInit): RealNumberField =>
  ({
    kind: 'RealNumberField',
    id: realNumberFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedRealNumberField {
  readonly kind: 'EmbeddedRealNumberField';
  readonly key: string;
  readonly artifactRef: RealNumberFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: RealNumberLiteral;
}

export interface EmbeddedRealNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: RealNumberFieldReference | RealNumberField;
  readonly defaultValue?: RealNumberLiteral;
}

export function embeddedRealNumberField(
  init: EmbeddedRealNumberFieldInit,
): EmbeddedRealNumberField {
  const out: EmbeddedRealNumberField = {
    ...assembleCommon(init),
    kind: 'EmbeddedRealNumberField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
