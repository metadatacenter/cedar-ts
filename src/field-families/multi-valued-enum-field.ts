// =====================================================================
// MultiValuedEnum field family — zero or more selections from a declared
// set of permissible values
// =====================================================================
//
// Per the cedar-ts convention each family file holds:
//
//   - identifier type            : MultiValuedEnumFieldId
//   - instance value             : EnumValue (shared with single-valued)
//   - schema constraints         : MultiValuedEnumFieldSpec
//   - reusable Field artifact    : MultiValuedEnumField
//   - Template-embedding wrapper : EmbeddedMultiValuedEnumField
//
// Wire `kind` values: "MultiValuedEnumField" (artifact),
// "EmbeddedMultiValuedEnumField" (embedding). The embedding's
// `defaultValue` slot is a sequence of EnumValue.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { Editability } from '../embedded/editability.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';
import type { MultiValuedEnumRenderingHint } from './rendering-hints.js';
import { type PermissibleValue, type EnumValue, enumValue } from './enum-shared.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface MultiValuedEnumFieldId {
  readonly kind: 'MultiValuedEnumFieldId';
  readonly iri: Iri;
}

export const multiValuedEnumFieldId = (
  v: MultiValuedEnumFieldId | Iri | string,
): MultiValuedEnumFieldId => {
  if (
    typeof v !== 'string' &&
    (v as { kind?: unknown }).kind === 'MultiValuedEnumFieldId'
  ) {
    return v as MultiValuedEnumFieldId;
  }
  return {
    kind: 'MultiValuedEnumFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value — see ./enum-shared.ts (EnumValue)
// =====================================================================

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface MultiValuedEnumFieldSpec {
  readonly kind: 'MultiValuedEnumFieldSpec';
  readonly permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
  // Spec-level defaults; EnumValue entries whose tokens must each equal one
  // of permissibleValues' value tokens.
  readonly defaultValues: readonly EnumValue[];
  readonly renderingHint?: MultiValuedEnumRenderingHint;
  // Illustrative examples — each entry is a *single* EnumValue (one
  // permitted token at a time), not a sequence. See spec/grammar.md §Field
  // Specs for the rationale.
  readonly examples?: readonly EnumValue[];
}

export interface MultiValuedEnumFieldSpecInit {
  readonly permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
  readonly defaultValues?: readonly (EnumValue | string)[];
  readonly renderingHint?: MultiValuedEnumRenderingHint;
  readonly examples?: readonly (EnumValue | string)[];
}

export function multiValuedEnumFieldSpec(
  init: MultiValuedEnumFieldSpecInit,
): MultiValuedEnumFieldSpec {
  const out: {
    kind: 'MultiValuedEnumFieldSpec';
    permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
    defaultValues: readonly EnumValue[];
    renderingHint?: MultiValuedEnumRenderingHint;
  } = {
    kind: 'MultiValuedEnumFieldSpec',
    permissibleValues: init.permissibleValues,
    defaultValues:
      init.defaultValues === undefined
        ? []
        : init.defaultValues.map((v) =>
            typeof v === 'string' ? enumValue(v) : v,
          ),
  };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined)
    (out as { examples?: readonly EnumValue[] }).examples = init.examples.map(
      (e) => (typeof e === 'string' ? enumValue(e) : e),
    );
  return out;
}

export const isMultiValuedEnumFieldSpec = (
  x: unknown,
): x is MultiValuedEnumFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'MultiValuedEnumFieldSpec';

// EnumFieldSpec union covers both variants.
export type EnumFieldSpec =
  | MultiValuedEnumFieldSpec
  | import('./single-valued-enum-field.js').SingleValuedEnumFieldSpec;

export const isEnumFieldSpec = (x: unknown): x is EnumFieldSpec =>
  isMultiValuedEnumFieldSpec(x) ||
  (typeof x === 'object' &&
    x !== null &&
    (x as { kind?: unknown }).kind === 'SingleValuedEnumFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface MultiValuedEnumField {
  readonly kind: 'MultiValuedEnumField';
  readonly id: MultiValuedEnumFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: MultiValuedEnumFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface MultiValuedEnumFieldInit {
  readonly id: MultiValuedEnumFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: MultiValuedEnumFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const multiValuedEnumField = (
  init: MultiValuedEnumFieldInit,
): MultiValuedEnumField => {
  const out: MultiValuedEnumField = {
    kind: 'MultiValuedEnumField',
    id: multiValuedEnumFieldId(init.id),
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

export interface EmbeddedMultiValuedEnumField {
  readonly kind: 'EmbeddedMultiValuedEnumField';
  readonly key: string;
  readonly artifactRef: MultiValuedEnumFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: import('../embedded/property.js').Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  // Sequence of EnumValue defaults. Empty when absent. The grammar models
  // this as `EnumValue*` rather than an optional single value.
  readonly defaultValue?: readonly EnumValue[];
}

export interface EmbeddedMultiValuedEnumFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: MultiValuedEnumFieldId | MultiValuedEnumField;
  readonly defaultValue?: readonly EnumValue[];
}

export function embeddedMultiValuedEnumField(
  init: EmbeddedMultiValuedEnumFieldInit,
): EmbeddedMultiValuedEnumField {
  const out: EmbeddedMultiValuedEnumField = {
    ...assembleCommon(init),
    kind: 'EmbeddedMultiValuedEnumField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
