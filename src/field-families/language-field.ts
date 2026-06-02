// =====================================================================
// Language field family — natural language as data (BCP 47 tag)
// =====================================================================
//
// LanguageValue carries `value: string` directly — the canonical BCP 47
// language tag. No denormalized display label is stored; conforming
// tooling renders display names against the IANA Language Subtag Registry.
//
// LanguageFieldSpec may carry an optional closed `permittedLanguages`
// set; when present, instance values MUST appear verbatim in the set.

import {
  type Iri,
  CedarConstructionError,
  iri,
  parseBcp47Tag,
  parseSemanticVersion, parseAsciiIdentifier
} from '../leaves/index.js';
import type { LanguageRenderingHint } from './rendering-hints.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface LanguageFieldId {
  readonly kind: 'LanguageFieldId';
  readonly iri: Iri;
}

export const languageFieldId = (
  v: LanguageFieldId | Iri | string,
): LanguageFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'LanguageFieldId') {
    return v as LanguageFieldId;
  }
  return {
    kind: 'LanguageFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface LanguageValue {
  readonly kind: 'LanguageValue';
  readonly value: string;
}

export type LanguageValueInput = LanguageValue | string;

export function languageValue(value: string): LanguageValue;
export function languageValue(value: LanguageValue): LanguageValue;
export function languageValue(value: LanguageValue | string): LanguageValue {
  if (typeof value !== 'string') return value;
  return { kind: 'LanguageValue', value: parseBcp47Tag(value) };
}

export function isLanguageValue(x: unknown): x is LanguageValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LanguageValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface LanguageFieldSpec {
  readonly kind: 'LanguageFieldSpec';
  readonly defaultValue?: LanguageValue;
  readonly permittedLanguages?: readonly string[];
  readonly renderingHint?: LanguageRenderingHint;
  readonly examples?: readonly LanguageValue[];
}

export interface LanguageFieldSpecInit {
  readonly defaultValue?: LanguageValueInput;
  readonly permittedLanguages?: readonly string[];
  readonly renderingHint?: LanguageRenderingHint;
  readonly examples?: readonly (LanguageValueInput | LanguageValue)[];
}

export function languageFieldSpec(init?: LanguageFieldSpecInit): LanguageFieldSpec {
  const out: {
    kind: 'LanguageFieldSpec';
    defaultValue?: LanguageValue;
    permittedLanguages?: readonly string[];
    renderingHint?: LanguageRenderingHint;
  } = {
    kind: 'LanguageFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? languageValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.permittedLanguages !== undefined) {
    if (init.permittedLanguages.length === 0) {
      throw new CedarConstructionError(
        'permittedLanguages, when present, must be a non-empty list',
      );
    }
    const tags = init.permittedLanguages.map((t) => parseBcp47Tag(t));
    if (
      out.defaultValue !== undefined &&
      !tags.includes(out.defaultValue.value)
    ) {
      throw new CedarConstructionError(
        `defaultValue ${JSON.stringify(out.defaultValue.value)} is not in permittedLanguages`,
      );
    }
    out.permittedLanguages = Object.freeze(tags.slice());
  }
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly LanguageValue[] }).examples = init.examples.map((e) => languageValue(e as never));
  }
  return out;
}

export const isLanguageFieldSpec = (x: unknown): x is LanguageFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LanguageFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface LanguageField {
  readonly kind: 'LanguageField';
  readonly id: LanguageFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: LanguageFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface LanguageFieldInit {
  readonly id: LanguageFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: LanguageFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const languageField = (init: LanguageFieldInit): LanguageField => {
  const out: LanguageField = {
    kind: 'LanguageField',
    id: languageFieldId(init.id),
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

export interface EmbeddedLanguageField {
  readonly kind: 'EmbeddedLanguageField';
  readonly key: string;
  readonly artifactRef: LanguageFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly defaultValue?: LanguageValue;
}

export interface EmbeddedLanguageFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: LanguageFieldId | LanguageField;
  readonly defaultValue?: LanguageValueInput;
}

export function embeddedLanguageField(
  init: EmbeddedLanguageFieldInit,
): EmbeddedLanguageField {
  const out: EmbeddedLanguageField = {
    ...assembleCommon(init),
    kind: 'EmbeddedLanguageField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? languageValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
