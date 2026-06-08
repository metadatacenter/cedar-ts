// =====================================================================
// Integer field family — exact arbitrary-precision integers
// =====================================================================
//
// Complete vertical slice for the integer field family:
//   - identifier type            : IntegerFieldId
//   - instance value             : IntegerValue
//   - schema constraints         : IntegerFieldSpec
//   - reusable Field artifact    : IntegerField
//   - Template-embedding wrapper : EmbeddedIntegerField
//
// IntegerValue carries `value: string` (a base-10 integer lexical form). The datatype is
// fixed at xsd:integer and is not carried.

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

export interface IntegerFieldId {
  readonly kind: 'IntegerFieldId';
  readonly iri: Iri;
}


export const integerFieldId = (
  v: IntegerFieldId | Iri | string,
): IntegerFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'IntegerFieldId'
  ) {
    return v as IntegerFieldId;
  }
  return {
    kind: 'IntegerFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface IntegerValue {
  readonly kind: 'IntegerValue';
  readonly value: string;
}

export type IntegerValueInput = IntegerValue | string;

export function integerValue(value: string): IntegerValue;
export function integerValue(value: IntegerValue): IntegerValue;
export function integerValue(
  value: IntegerValue | string,
): IntegerValue {
  if (typeof value !== 'string') return value;
  return { kind: 'IntegerValue', value };
}

export function isIntegerValue(x: unknown): x is IntegerValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'IntegerValue'
  );
}

// Best-effort numeric coercion. Returns `NaN` for ill-typed lexical
// forms; use validation helpers for normative checks.
export function integerValueToNumber(v: IntegerValue): number {
  return Number(v.value);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface IntegerFieldSpec {
  readonly kind: 'IntegerFieldSpec';
  readonly defaultValue?: IntegerValue;
  readonly unit?: Unit;
  readonly minValue?: IntegerValue;
  readonly maxValue?: IntegerValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly IntegerValue[];
}

export interface IntegerFieldSpecInit {
  readonly defaultValue?: IntegerValueInput;
  readonly unit?: Unit;
  readonly minValue?: IntegerValue;
  readonly maxValue?: IntegerValue;
  readonly renderingHint?: NumericRenderingHint;
  readonly examples?: readonly (IntegerValueInput | IntegerValue)[];
}

export function integerFieldSpec(
  init?: IntegerFieldSpecInit,
): IntegerFieldSpec {
  const out: {
    kind: 'IntegerFieldSpec';
    defaultValue?: IntegerValue;
    unit?: Unit;
    minValue?: IntegerValue;
    maxValue?: IntegerValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'IntegerFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? integerValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.unit !== undefined) out.unit = init.unit;
  if (init?.minValue !== undefined) out.minValue = init.minValue;
  if (init?.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly IntegerValue[] }).examples = init.examples.map((e) => integerValue(e as never));
  }
  return out;
}

export const isIntegerFieldSpec = (
  x: unknown,
): x is IntegerFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'IntegerFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface IntegerField {
  readonly kind: 'IntegerField';
  readonly id: IntegerFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: IntegerFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface IntegerFieldInit {
  readonly id: IntegerFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: IntegerFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const integerField = (
  init: IntegerFieldInit,
): IntegerField => {
  const out: IntegerField = {
    kind: 'IntegerField',
    id: integerFieldId(init.id),
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

export interface EmbeddedIntegerField {
  readonly kind: 'EmbeddedIntegerField';
  readonly key: string;
  readonly artifactRef: IntegerFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: IntegerValue;
}

export interface EmbeddedIntegerFieldInit
  extends EmbeddedFieldInitCommon {
  readonly artifactRef: IntegerFieldId | IntegerField;
  readonly defaultValue?: IntegerValueInput;
}

export function embeddedIntegerField(
  init: EmbeddedIntegerFieldInit,
): EmbeddedIntegerField {
  const out: EmbeddedIntegerField = {
    ...assembleCommon(init),
    kind: 'EmbeddedIntegerField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? integerValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
