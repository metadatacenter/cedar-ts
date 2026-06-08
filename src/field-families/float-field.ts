// =====================================================================
// Float field family — IEEE 754 single-precision numbers
// =====================================================================
//
// Complete vertical slice for the float field family:
//   - identifier type            : FloatFieldId
//   - instance value             : FloatValue
//   - schema constraints         : FloatFieldSpec
//   - reusable Field artifact    : FloatField
//   - Template-embedding wrapper : EmbeddedFloatField
//
// FloatValue carries `value: string` (an IEEE 754 single-precision lexical form, incl. INF/-INF/NaN). The datatype is
// fixed at xsd:float and is not carried.

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

export interface FloatFieldId {
  readonly kind: 'FloatFieldId';
  readonly iri: Iri;
}


export const floatFieldId = (
  v: FloatFieldId | Iri | string,
): FloatFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'FloatFieldId'
  ) {
    return v as FloatFieldId;
  }
  return {
    kind: 'FloatFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface FloatValue {
  readonly kind: 'FloatValue';
  readonly value: string;
}

export type FloatValueInput = FloatValue | string;

export function floatValue(value: string): FloatValue;
export function floatValue(value: FloatValue): FloatValue;
export function floatValue(
  value: FloatValue | string,
): FloatValue {
  if (typeof value !== 'string') return value;
  return { kind: 'FloatValue', value };
}

export function isFloatValue(x: unknown): x is FloatValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'FloatValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function floatValueToNumber(v: FloatValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface FloatFieldSpec {
  readonly kind: 'FloatFieldSpec';
  readonly defaultValue?: FloatValue;
  readonly unit?: Unit;
  readonly minValue?: FloatValue;
  readonly maxValue?: FloatValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly FloatValue[];
}

export interface FloatFieldSpecInit {
  readonly defaultValue?: FloatValueInput;
  readonly unit?: Unit;
  readonly minValue?: FloatValue;
  readonly maxValue?: FloatValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly (FloatValueInput | FloatValue)[];
}

export function floatFieldSpec(
  init?: FloatFieldSpecInit,
): FloatFieldSpec {
  const out: {
    kind: 'FloatFieldSpec';
    defaultValue?: FloatValue;
    unit?: Unit;
    minValue?: FloatValue;
    maxValue?: FloatValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'FloatFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? floatValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly FloatValue[] }).examples = init.examples.map((e) => floatValue(e as never));
  }
  return out;
}

export const isFloatFieldSpec = (
  x: unknown,
): x is FloatFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'FloatFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface FloatField {
  readonly kind: 'FloatField';
  readonly id: FloatFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: FloatFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface FloatFieldInit {
  readonly id: FloatFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: FloatFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const floatField = (
  init: FloatFieldInit,
): FloatField => {
  const out: FloatField = {
    kind: 'FloatField',
    id: floatFieldId(init.id),
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

export interface EmbeddedFloatField {
  readonly kind: 'EmbeddedFloatField';
  readonly key: string;
  readonly artifactRef: FloatFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: FloatValue;
}

export interface EmbeddedFloatFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: FloatFieldId | FloatField;
  readonly defaultValue?: FloatValueInput;
}

export function embeddedFloatField(
  init: EmbeddedFloatFieldInit,
): EmbeddedFloatField {
  const out: EmbeddedFloatField = {
    ...assembleCommon(init),
    kind: 'EmbeddedFloatField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? floatValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
