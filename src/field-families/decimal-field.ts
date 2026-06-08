// =====================================================================
// Decimal field family — exact arbitrary-precision decimals
// =====================================================================
//
// Complete vertical slice for the decimal field family:
//   - identifier type            : DecimalFieldId
//   - instance value             : DecimalValue
//   - schema constraints         : DecimalFieldSpec
//   - reusable Field artifact    : DecimalField
//   - Template-embedding wrapper : EmbeddedDecimalField
//
// DecimalValue carries `value: string` (a base-10 decimal lexical form). The datatype is
// fixed at xsd:decimal and is not carried.

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

export interface DecimalFieldId {
  readonly kind: 'DecimalFieldId';
  readonly iri: Iri;
}


export const decimalFieldId = (
  v: DecimalFieldId | Iri | string,
): DecimalFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'DecimalFieldId'
  ) {
    return v as DecimalFieldId;
  }
  return {
    kind: 'DecimalFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface DecimalValue {
  readonly kind: 'DecimalValue';
  readonly value: string;
}

export type DecimalValueInput = DecimalValue | string;

export function decimalValue(value: string): DecimalValue;
export function decimalValue(value: DecimalValue): DecimalValue;
export function decimalValue(
  value: DecimalValue | string,
): DecimalValue {
  if (typeof value !== 'string') return value;
  return { kind: 'DecimalValue', value };
}

export function isDecimalValue(x: unknown): x is DecimalValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'DecimalValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function decimalValueToNumber(v: DecimalValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface DecimalFieldSpec {
  readonly kind: 'DecimalFieldSpec';
  readonly defaultValue?: DecimalValue;
  readonly unit?: Unit;
  readonly minValue?: DecimalValue;
  readonly maxValue?: DecimalValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly DecimalValue[];
}

export interface DecimalFieldSpecInit {
  readonly defaultValue?: DecimalValueInput;
  readonly unit?: Unit;
  readonly minValue?: DecimalValue;
  readonly maxValue?: DecimalValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly (DecimalValueInput | DecimalValue)[];
}

export function decimalFieldSpec(
  init?: DecimalFieldSpecInit,
): DecimalFieldSpec {
  const out: {
    kind: 'DecimalFieldSpec';
    defaultValue?: DecimalValue;
    unit?: Unit;
    minValue?: DecimalValue;
    maxValue?: DecimalValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'DecimalFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? decimalValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly DecimalValue[] }).examples = init.examples.map((e) => decimalValue(e as never));
  }
  return out;
}

export const isDecimalFieldSpec = (
  x: unknown,
): x is DecimalFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'DecimalFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DecimalField {
  readonly kind: 'DecimalField';
  readonly id: DecimalFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DecimalFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface DecimalFieldInit {
  readonly id: DecimalFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DecimalFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const decimalField = (
  init: DecimalFieldInit,
): DecimalField => {
  const out: DecimalField = {
    kind: 'DecimalField',
    id: decimalFieldId(init.id),
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

export interface EmbeddedDecimalField {
  readonly kind: 'EmbeddedDecimalField';
  readonly key: string;
  readonly artifactRef: DecimalFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: DecimalValue;
}

export interface EmbeddedDecimalFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: DecimalFieldId | DecimalField;
  readonly defaultValue?: DecimalValueInput;
}

export function embeddedDecimalField(
  init: EmbeddedDecimalFieldInit,
): EmbeddedDecimalField {
  const out: EmbeddedDecimalField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDecimalField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? decimalValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
