// =====================================================================
// SingleChoice field family — one selection from a curated set of
// literal or controlled-term options
// =====================================================================
//
// This file is the complete vertical slice for the single-choice field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : SingleChoiceFieldId
//   - instance value             : SingleChoiceValue
//   - schema constraints         : SingleChoiceFieldSpec
//   - reusable Field artifact    : SingleChoiceField
//   - default value              : SingleChoiceDefaultValue
//   - Template-embedding wrapper : EmbeddedSingleChoiceField
//
// Wire `kind` values: "SingleChoiceField" (artifact),
// "EmbeddedSingleChoiceField" (embedding).
//
// The `SingleChoiceFieldSpec` is itself a union of
// `LiteralSingleChoiceFieldSpec` and
// `ControlledTermSingleChoiceFieldSpec`, both of which live in this
// file. Choice options and choice values are shared with the
// multiple-choice family — see `choice-shared.ts`.

import { type Iri, iri } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { SingleChoiceRenderingHint } from './rendering-hints.js';
import type {
  LiteralChoiceOption,
  ControlledTermChoiceOption,
  ChoiceDefaultValue,
} from './choice-shared.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface SingleChoiceFieldId {
  readonly kind: 'SingleChoiceFieldId';
  readonly iri: Iri;
}

export type SingleChoiceFieldReference = SingleChoiceFieldId;

// Identifier-wrapper constructor for the SingleChoice field family.
// Idempotent: an existing SingleChoiceFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The SingleChoiceFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const singleChoiceFieldId = (
  v: SingleChoiceFieldId | Iri | string,
): SingleChoiceFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'SingleChoiceFieldId') {
    return v as SingleChoiceFieldId;
  }
  return {
    kind: 'SingleChoiceFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value — see field-families/choice-shared.ts (ChoiceValue)
// =====================================================================

// =====================================================================
// 3. FieldSpec
// =====================================================================

// Choice field specs are refined along two dimensions:
//   - cardinality: single vs multiple
//   - value kind:  literal vs controlled-term
// All four concrete combinations are distinct types, plus the single-/multiple-
// choice unions and the all-encompassing ChoiceFieldSpec.

export interface LiteralSingleChoiceFieldSpec {
  readonly kind: 'LiteralSingleChoiceFieldSpec';
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: SingleChoiceRenderingHint;
}

export function literalSingleChoiceFieldSpec(init: {
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: SingleChoiceRenderingHint;
}): LiteralSingleChoiceFieldSpec {
  const out: {
    kind: 'LiteralSingleChoiceFieldSpec';
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: SingleChoiceRenderingHint;
  } = { kind: 'LiteralSingleChoiceFieldSpec', options: init.options };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export interface ControlledTermSingleChoiceFieldSpec {
  readonly kind: 'ControlledTermSingleChoiceFieldSpec';
  readonly options: readonly [
    ControlledTermChoiceOption,
    ...ControlledTermChoiceOption[],
  ];
  readonly renderingHint?: SingleChoiceRenderingHint;
}

export function controlledTermSingleChoiceFieldSpec(init: {
  readonly options: readonly [
    ControlledTermChoiceOption,
    ...ControlledTermChoiceOption[],
  ];
  readonly renderingHint?: SingleChoiceRenderingHint;
}): ControlledTermSingleChoiceFieldSpec {
  const out: {
    kind: 'ControlledTermSingleChoiceFieldSpec';
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: SingleChoiceRenderingHint;
  } = {
    kind: 'ControlledTermSingleChoiceFieldSpec',
    options: init.options,
  };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export type SingleChoiceFieldSpec =
  | LiteralSingleChoiceFieldSpec
  | ControlledTermSingleChoiceFieldSpec;

export const isLiteralSingleChoiceFieldSpec = (
  x: unknown,
): x is LiteralSingleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LiteralSingleChoiceFieldSpec';

export const isControlledTermSingleChoiceFieldSpec = (
  x: unknown,
): x is ControlledTermSingleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'ControlledTermSingleChoiceFieldSpec';

export const isSingleChoiceFieldSpec = (x: unknown): x is SingleChoiceFieldSpec =>
  isLiteralSingleChoiceFieldSpec(x) || isControlledTermSingleChoiceFieldSpec(x);

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface SingleChoiceField {
  readonly kind: 'SingleChoiceField';
  readonly id: SingleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}

export interface SingleChoiceFieldInit {
  readonly id: SingleChoiceFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}

export const singleChoiceField = (init: SingleChoiceFieldInit): SingleChoiceField =>
  ({
    kind: 'SingleChoiceField',
    id: singleChoiceFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue — see field-families/choice-shared.ts (ChoiceDefaultValue)
// =====================================================================

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedSingleChoiceField {
  readonly kind: 'EmbeddedSingleChoiceField';
  readonly key: string;
  readonly reference: SingleChoiceFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedSingleChoiceFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: SingleChoiceFieldReference | SingleChoiceField;
  readonly defaultValue?: ChoiceDefaultValue;
}

export function embeddedSingleChoiceField(
  init: EmbeddedSingleChoiceFieldInit,
): EmbeddedSingleChoiceField {
  const out: EmbeddedSingleChoiceField = {
    ...assembleCommon(init),
    kind: 'EmbeddedSingleChoiceField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
