// =====================================================================
// Real-number field family — real-valued numeric content (xsd:decimal,
// xsd:float, xsd:double)
// =====================================================================
//
// RealNumberValue carries `value: string` (a base-10 real-valued
// lexical form) plus the required `datatype` enum (`decimal | float
// | double`).

import {
  type Iri,
  type RealNumberDatatypeKind,
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

export interface RealNumberFieldId {
  readonly kind: 'RealNumberFieldId';
  readonly iri: Iri;
}


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
  readonly value: string;
  readonly datatype: RealNumberDatatypeKind;
}

export function realNumberValue(
  value: string,
  datatype: RealNumberDatatypeKind,
): RealNumberValue;
export function realNumberValue(value: RealNumberValue): RealNumberValue;
export function realNumberValue(
  value: RealNumberValue | string,
  datatype?: RealNumberDatatypeKind,
): RealNumberValue {
  if (typeof value !== 'string') return value;
  return { kind: 'RealNumberValue', value, datatype: datatype as RealNumberDatatypeKind };
}

export function isRealNumberValue(x: unknown): x is RealNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'RealNumberValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function realNumberValueToNumber(v: RealNumberValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface RealNumberFieldSpec {
  readonly kind: 'RealNumberFieldSpec';
  readonly datatype: RealNumberDatatypeKind;
  readonly defaultValue?: RealNumberValue;
  readonly unit?: Unit;
  readonly minValue?: RealNumberValue;
  readonly maxValue?: RealNumberValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly RealNumberValue[];
}

export interface RealNumberFieldSpecInit {
  readonly datatype: RealNumberDatatypeKind;
  readonly defaultValue?: RealNumberValue;
  readonly unit?: Unit;
  readonly minValue?: RealNumberValue;
  readonly maxValue?: RealNumberValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly RealNumberValue[];
}

export function realNumberFieldSpec(
  init: RealNumberFieldSpecInit,
): RealNumberFieldSpec {
  const out: {
    kind: 'RealNumberFieldSpec';
    datatype: RealNumberDatatypeKind;
    defaultValue?: RealNumberValue;
    unit?: Unit;
    minValue?: RealNumberValue;
    maxValue?: RealNumberValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'RealNumberFieldSpec', datatype: init.datatype };
  if (init.defaultValue !== undefined) out.defaultValue = init.defaultValue;
  if (init.unit !== undefined) out.unit = init.unit;
  if (init.minValue !== undefined) out.minValue = init.minValue;
  if (init.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined)
    (out as { examples?: readonly RealNumberValue[] }).examples = init.examples.slice();
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
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RealNumberFieldSpec;
  readonly label: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export interface RealNumberFieldInit {
  readonly id: RealNumberFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RealNumberFieldSpec;
  readonly label: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export const realNumberField = (init: RealNumberFieldInit): RealNumberField => {
  const out: RealNumberField = {
    kind: 'RealNumberField',
    id: realNumberFieldId(init.id),
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

export interface EmbeddedRealNumberField {
  readonly kind: 'EmbeddedRealNumberField';
  readonly key: string;
  readonly artifactRef: RealNumberFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: RealNumberValue;
}

export interface EmbeddedRealNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: RealNumberFieldId | RealNumberField;
  readonly defaultValue?: RealNumberValue;
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
