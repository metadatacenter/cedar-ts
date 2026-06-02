// =====================================================================
// Boolean field family — true/false values
// =====================================================================
//
// BooleanValue carries `value: boolean` directly. The datatype is
// implicitly xsd:boolean and is not carried.
//
// EmbeddedBooleanField omits the `cardinality` slot — booleans are
// inherently single-valued.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { BooleanRenderingHint } from './rendering-hints.js';
import { fieldRef, assertPromptSlotsExclusive } from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface BooleanFieldId {
  readonly kind: 'BooleanFieldId';
  readonly iri: Iri;
}


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
// 2. Value
// =====================================================================

export interface BooleanValue {
  readonly kind: 'BooleanValue';
  readonly value: boolean;
}

export type BooleanValueInput = BooleanValue | boolean;

export function booleanValue(value: boolean): BooleanValue;
export function booleanValue(value: BooleanValue): BooleanValue;
export function booleanValue(value: BooleanValue | boolean): BooleanValue {
  if (typeof value === 'boolean') return { kind: 'BooleanValue', value };
  return value;
}

export function isBooleanValue(x: unknown): x is BooleanValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'BooleanValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface BooleanFieldSpec {
  readonly kind: 'BooleanFieldSpec';
  readonly defaultValue?: BooleanValue;
  readonly renderingHint?: BooleanRenderingHint;
  readonly examples?: readonly BooleanValue[];
}

export interface BooleanFieldSpecInit {
  readonly defaultValue?: BooleanValueInput;
  readonly renderingHint?: BooleanRenderingHint;
  readonly examples?: readonly (BooleanValueInput | BooleanValue)[];
}

export function booleanFieldSpec(init?: BooleanFieldSpecInit): BooleanFieldSpec {
  const out: {
    kind: 'BooleanFieldSpec';
    defaultValue?: BooleanValue;
    renderingHint?: BooleanRenderingHint;
  } = { kind: 'BooleanFieldSpec' };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'boolean'
        ? booleanValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly BooleanValue[] }).examples = init.examples.map((e) => booleanValue(e as never));
  }
  return out;
}

export const isBooleanFieldSpec = (x: unknown): x is BooleanFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'BooleanFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface BooleanField {
  readonly kind: 'BooleanField';
  readonly id: BooleanFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: BooleanFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface BooleanFieldInit {
  readonly id: BooleanFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: BooleanFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const booleanField = (init: BooleanFieldInit): BooleanField => {
  const out: BooleanField = {
    kind: 'BooleanField',
    id: booleanFieldId(init.id),
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

export interface EmbeddedBooleanField {
  readonly kind: 'EmbeddedBooleanField';
  readonly key: string;
  readonly artifactRef: BooleanFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly defaultValue?: BooleanValue;
}

export interface EmbeddedBooleanFieldInit {
  readonly key: string;
  readonly artifactRef: BooleanFieldId | BooleanField;
  readonly valueRequirement?: ValueRequirement;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: PropertyInput;
  readonly promptKey?: string;
  readonly defaultValue?: BooleanValueInput;
}

export function embeddedBooleanField(
  init: EmbeddedBooleanFieldInit,
): EmbeddedBooleanField {
  const out: {
    kind: 'EmbeddedBooleanField';
    key: string;
    artifactRef: BooleanFieldId;
    valueRequirement?: ValueRequirement;
    visibility?: Visibility;
    promptOverride?: MultilingualString;
    helpTextOverride?: MultilingualString;
    property?: Property;
    promptKey?: string;
    defaultValue?: BooleanValue;
  } = {
    kind: 'EmbeddedBooleanField',
    key: parseAsciiIdentifier(init.key),
    artifactRef: fieldRef(init.artifactRef),
  };
  assertPromptSlotsExclusive(init);
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.promptOverride !== undefined) out.promptOverride = multilingualString(init.promptOverride);
  if (init.helpTextOverride !== undefined) out.helpTextOverride = init.helpTextOverride;
  if (init.property !== undefined) out.property = property(init.property);
  if (init.promptKey !== undefined) out.promptKey = parseAsciiIdentifier(init.promptKey);
  if (init.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'boolean'
        ? booleanValue(init.defaultValue)
        : init.defaultValue;
  }
  return out;
}
