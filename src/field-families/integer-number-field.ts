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
// IntegerNumberValue carries `value: string` (a base-10 integer lexical
// form). The datatype is fixed at xsd:integer and is not carried.

import {
  type Iri,
  iri,
  parseSemanticVersion, parseAsciiIdentifier
} from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
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
  readonly value: string;
}

export type IntegerNumberValueInput = IntegerNumberValue | string;

export function integerNumberValue(value: string): IntegerNumberValue;
export function integerNumberValue(value: IntegerNumberValue): IntegerNumberValue;
export function integerNumberValue(
  value: IntegerNumberValue | string,
): IntegerNumberValue {
  if (typeof value !== 'string') return value;
  return { kind: 'IntegerNumberValue', value };
}

export function isIntegerNumberValue(x: unknown): x is IntegerNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'IntegerNumberValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function integerNumberValueToNumber(v: IntegerNumberValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface IntegerNumberFieldSpec {
  readonly kind: 'IntegerNumberFieldSpec';
  readonly defaultValue?: IntegerNumberValue;
  readonly unit?: Unit;
  readonly minValue?: IntegerNumberValue;
  readonly maxValue?: IntegerNumberValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly IntegerNumberValue[];
}

export interface IntegerNumberFieldSpecInit {
  readonly defaultValue?: IntegerNumberValueInput;
  readonly unit?: Unit;
  readonly minValue?: IntegerNumberValue;
  readonly maxValue?: IntegerNumberValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly (IntegerNumberValueInput | IntegerNumberValue)[];
}

export function integerNumberFieldSpec(
  init?: IntegerNumberFieldSpecInit,
): IntegerNumberFieldSpec {
  const out: {
    kind: 'IntegerNumberFieldSpec';
    defaultValue?: IntegerNumberValue;
    unit?: Unit;
    minValue?: IntegerNumberValue;
    maxValue?: IntegerNumberValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'IntegerNumberFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? integerNumberValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly IntegerNumberValue[] }).examples = init.examples.map((e) => integerNumberValue(e as never));
  }
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
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: IntegerNumberFieldSpec;
  readonly label: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export interface IntegerNumberFieldInit {
  readonly id: IntegerNumberFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: IntegerNumberFieldSpec;
  readonly label: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export const integerNumberField = (
  init: IntegerNumberFieldInit,
): IntegerNumberField => {
  const out: IntegerNumberField = {
    kind: 'IntegerNumberField',
    id: integerNumberFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    label: multilingualString(init.label),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.recommendedKey !== undefined && {
      recommendedKey: parseAsciiIdentifier(init.recommendedKey),
    }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedIntegerNumberField {
  readonly kind: 'EmbeddedIntegerNumberField';
  readonly key: string;
  readonly artifactRef: IntegerNumberFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: IntegerNumberValue;
}

export interface EmbeddedIntegerNumberFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: IntegerNumberFieldId | IntegerNumberField;
  readonly defaultValue?: IntegerNumberValueInput;
}

export function embeddedIntegerNumberField(
  init: EmbeddedIntegerNumberFieldInit,
): EmbeddedIntegerNumberField {
  const out: EmbeddedIntegerNumberField = {
    ...assembleCommon(init),
    kind: 'EmbeddedIntegerNumberField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? integerNumberValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
