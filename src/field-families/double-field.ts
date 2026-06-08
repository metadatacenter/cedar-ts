// =====================================================================
// Double field family — IEEE 754 double-precision numbers
// =====================================================================
//
// Complete vertical slice for the double field family:
//   - identifier type            : DoubleFieldId
//   - instance value             : DoubleValue
//   - schema constraints         : DoubleFieldSpec
//   - reusable Field artifact    : DoubleField
//   - Template-embedding wrapper : EmbeddedDoubleField
//
// DoubleValue carries `value: string` (an IEEE 754 double-precision lexical form, incl. INF/-INF/NaN). The datatype is
// fixed at xsd:double and is not carried.

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
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { Editability } from '../embedded/editability.js';
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

export interface DoubleFieldId {
  readonly kind: 'DoubleFieldId';
  readonly iri: Iri;
}


export const doubleFieldId = (
  v: DoubleFieldId | Iri | string,
): DoubleFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'DoubleFieldId'
  ) {
    return v as DoubleFieldId;
  }
  return {
    kind: 'DoubleFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface DoubleValue {
  readonly kind: 'DoubleValue';
  readonly value: string;
}

export type DoubleValueInput = DoubleValue | string;

export function doubleValue(value: string): DoubleValue;
export function doubleValue(value: DoubleValue): DoubleValue;
export function doubleValue(
  value: DoubleValue | string,
): DoubleValue {
  if (typeof value !== 'string') return value;
  return { kind: 'DoubleValue', value };
}

export function isDoubleValue(x: unknown): x is DoubleValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'DoubleValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function doubleValueToNumber(v: DoubleValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface DoubleFieldSpec {
  readonly kind: 'DoubleFieldSpec';
  readonly defaultValue?: DoubleValue;
  readonly unit?: Unit;
  readonly minValue?: DoubleValue;
  readonly maxValue?: DoubleValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly DoubleValue[];
}

export interface DoubleFieldSpecInit {
  readonly defaultValue?: DoubleValueInput;
  readonly unit?: Unit;
  readonly minValue?: DoubleValue;
  readonly maxValue?: DoubleValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly (DoubleValueInput | DoubleValue)[];
}

export function doubleFieldSpec(
  init?: DoubleFieldSpecInit,
): DoubleFieldSpec {
  const out: {
    kind: 'DoubleFieldSpec';
    defaultValue?: DoubleValue;
    unit?: Unit;
    minValue?: DoubleValue;
    maxValue?: DoubleValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'DoubleFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? doubleValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly DoubleValue[] }).examples = init.examples.map((e) => doubleValue(e as never));
  }
  return out;
}

export const isDoubleFieldSpec = (
  x: unknown,
): x is DoubleFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'DoubleFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DoubleField {
  readonly kind: 'DoubleField';
  readonly id: DoubleFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DoubleFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface DoubleFieldInit {
  readonly id: DoubleFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DoubleFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const doubleField = (
  init: DoubleFieldInit,
): DoubleField => {
  const out: DoubleField = {
    kind: 'DoubleField',
    id: doubleFieldId(init.id),
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
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedDoubleField {
  readonly kind: 'EmbeddedDoubleField';
  readonly key: string;
  readonly artifactRef: DoubleFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: DoubleValue;
}

export interface EmbeddedDoubleFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: DoubleFieldId | DoubleField;
  readonly defaultValue?: DoubleValueInput;
}

export function embeddedDoubleField(
  init: EmbeddedDoubleFieldInit,
): EmbeddedDoubleField {
  const out: EmbeddedDoubleField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDoubleField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? doubleValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
