// =====================================================================
// Integer-number field family — exact-integer numeric content
// =====================================================================
//
// This file is the complete vertical slice for the integer-number field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : IntegerNumberFieldId
//   - instance value             : IntegerNumberValue
//   - schema constraints         : IntegerNumberFieldSpec
//   - reusable Field artifact    : IntegerNumberField
//   - Template-embedding wrapper : EmbeddedIntegerNumberField
//
// Wire `kind` values: "IntegerNumberField" (artifact),
// "EmbeddedIntegerNumberField" (embedding), "IntegerNumberValue" (value),
// "IntegerNumberFieldSpec" (spec).
//
// IntegerNumberFieldSpec carries no `datatype` slot — its datatype is
// fixed at xsd:integer. This contrasts with RealNumberFieldSpec, which
// carries a datatype enum (decimal | float | double).

import {
  type Iri,
  iri,
  parseSemanticVersion,
} from '../leaves/index.js';
import type { IntegerNumberLiteral } from '../literals/index.js';
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

export interface IntegerNumberFieldId {
  readonly kind: 'IntegerNumberFieldId';
  readonly iri: Iri;
}

export type IntegerNumberFieldReference = IntegerNumberFieldId;

export const integerNumberFieldId = (
  v: IntegerNumberFieldId | Iri | string,
): IntegerNumberFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'IntegerNumberFieldId'
  ) {
    return v as IntegerNumberFieldId;
  }
  return {
    kind: 'IntegerNumberFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface IntegerNumberValue {
  readonly kind: 'IntegerNumberValue';
  readonly literal: IntegerNumberLiteral;
}

export function integerNumberValue(
  literal: IntegerNumberLiteral,
): IntegerNumberValue {
  return { kind: 'IntegerNumberValue', literal };
}

export function isIntegerNumberValue(x: unknown): x is IntegerNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'IntegerNumberValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface IntegerNumberFieldSpec {
  readonly kind: 'IntegerNumberFieldSpec';
  readonly unit?: Unit;
  readonly minValue?: IntegerNumberValue;
  readonly maxValue?: IntegerNumberValue;
  readonly renderingHint?: NumericRenderingHint;
}

export interface IntegerNumberFieldSpecInit {
  readonly unit?: Unit;
  readonly minValue?: IntegerNumberValue;
  readonly maxValue?: IntegerNumberValue;
  readonly renderingHint?: NumericRenderingHint;
}

export function integerNumberFieldSpec(
  init?: IntegerNumberFieldSpecInit,
): IntegerNumberFieldSpec {
  const out: {
    kind: 'IntegerNumberFieldSpec';
    unit?: Unit;
    minValue?: IntegerNumberValue;
    maxValue?: IntegerNumberValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'IntegerNumberFieldSpec' };
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isIntegerNumberFieldSpec = (
  x: unknown,
): x is IntegerNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'IntegerNumberFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface IntegerNumberField {
  readonly kind: 'IntegerNumberField';
  readonly id: IntegerNumberFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: IntegerNumberFieldSpec;
}

export interface IntegerNumberFieldInit {
  readonly id: IntegerNumberFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: IntegerNumberFieldSpec;
}

export const integerNumberField = (
  init: IntegerNumberFieldInit,
): IntegerNumberField => ({
  kind: 'IntegerNumberField',
  id: integerNumberFieldId(init.id),
  modelVersion: parseSemanticVersion(init.modelVersion),
  metadata: init.metadata,
  fieldSpec: init.fieldSpec,
});

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedIntegerNumberField {
  readonly kind: 'EmbeddedIntegerNumberField';
  readonly key: string;
  readonly artifactRef: IntegerNumberFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: IntegerNumberLiteral;
}

export interface EmbeddedIntegerNumberFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: IntegerNumberFieldReference | IntegerNumberField;
  readonly defaultValue?: IntegerNumberLiteral;
}

export function embeddedIntegerNumberField(
  init: EmbeddedIntegerNumberFieldInit,
): EmbeddedIntegerNumberField {
  const out: EmbeddedIntegerNumberField = {
    ...assembleCommon(init),
    kind: 'EmbeddedIntegerNumberField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
