// =====================================================================
// MultipleChoice field family — multiple selections from a curated set
// of literal or controlled-term options
// =====================================================================
//
// This file is the complete vertical slice for the multiple-choice
// field family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : MultipleChoiceFieldId
//   - instance value             : MultipleChoiceValue
//   - schema constraints         : MultipleChoiceFieldSpec
//   - reusable Field artifact    : MultipleChoiceField
//   - Template-embedding wrapper : EmbeddedMultipleChoiceField
//
// Wire `kind` values: "MultipleChoiceField" (artifact),
// "EmbeddedMultipleChoiceField" (embedding).
//
// The `MultipleChoiceFieldSpec` is itself a union of
// `LiteralMultipleChoiceFieldSpec` and
// `ControlledTermMultipleChoiceFieldSpec`, both of which live in this
// file. The cross-cutting `ChoiceFieldSpec` union (single | multiple)
// lives here too. Choice options and choice values are shared with the
// single-choice family — see `choice-shared.ts`.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { MultipleChoiceRenderingHint } from './rendering-hints.js';
import type {
  LiteralChoiceOption,
  ControlledTermChoiceOption,
  ChoiceValue,
} from './choice-shared.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';
import type {
  SingleChoiceFieldSpec,
  LiteralSingleChoiceFieldSpec,
  ControlledTermSingleChoiceFieldSpec,
} from './single-choice-field.js';
import {
  isSingleChoiceFieldSpec,
} from './single-choice-field.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `MultipleChoiceField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `MultipleChoiceField`'s IRI where (say) a
// `NumericField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface MultipleChoiceFieldId {
  readonly kind: 'MultipleChoiceFieldId';
  readonly iri: Iri;
}

export type MultipleChoiceFieldReference = MultipleChoiceFieldId;

// Identifier-wrapper constructor for the MultipleChoice field family.
// Idempotent: an existing MultipleChoiceFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The MultipleChoiceFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const multipleChoiceFieldId = (
  v: MultipleChoiceFieldId | Iri | string,
): MultipleChoiceFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'MultipleChoiceFieldId') {
    return v as MultipleChoiceFieldId;
  }
  return {
    kind: 'MultipleChoiceFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value — see field-families/choice-shared.ts (ChoiceValue)
// =====================================================================

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface LiteralMultipleChoiceFieldSpec {
  readonly kind: 'LiteralMultipleChoiceFieldSpec';
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}

export function literalMultipleChoiceFieldSpec(init: {
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}): LiteralMultipleChoiceFieldSpec {
  const out: {
    kind: 'LiteralMultipleChoiceFieldSpec';
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: MultipleChoiceRenderingHint;
  } = { kind: 'LiteralMultipleChoiceFieldSpec', options: init.options };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export interface ControlledTermMultipleChoiceFieldSpec {
  readonly kind: 'ControlledTermMultipleChoiceFieldSpec';
  readonly options: readonly [
    ControlledTermChoiceOption,
    ...ControlledTermChoiceOption[],
  ];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}

export function controlledTermMultipleChoiceFieldSpec(init: {
  readonly options: readonly [
    ControlledTermChoiceOption,
    ...ControlledTermChoiceOption[],
  ];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}): ControlledTermMultipleChoiceFieldSpec {
  const out: {
    kind: 'ControlledTermMultipleChoiceFieldSpec';
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: MultipleChoiceRenderingHint;
  } = {
    kind: 'ControlledTermMultipleChoiceFieldSpec',
    options: init.options,
  };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export type MultipleChoiceFieldSpec =
  | LiteralMultipleChoiceFieldSpec
  | ControlledTermMultipleChoiceFieldSpec;

// Convenience union spanning both single- and multiple-choice fields. Kept
// here so the choice families can share a single import for the union plus
// the multiple-choice predicate; the corresponding single-choice predicate
// lives in single-choice-field.ts.
export type ChoiceFieldSpec = SingleChoiceFieldSpec | MultipleChoiceFieldSpec;

export const isLiteralMultipleChoiceFieldSpec = (
  x: unknown,
): x is LiteralMultipleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LiteralMultipleChoiceFieldSpec';

export const isControlledTermMultipleChoiceFieldSpec = (
  x: unknown,
): x is ControlledTermMultipleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'ControlledTermMultipleChoiceFieldSpec';

export const isMultipleChoiceFieldSpec = (x: unknown): x is MultipleChoiceFieldSpec =>
  isLiteralMultipleChoiceFieldSpec(x) || isControlledTermMultipleChoiceFieldSpec(x);

export const isChoiceFieldSpec = (x: unknown): x is ChoiceFieldSpec =>
  isSingleChoiceFieldSpec(x) || isMultipleChoiceFieldSpec(x);

// Re-exports of the single-choice spec types so callers can find both halves
// of the choice-family spec union on a single module if desired.
export type {
  LiteralSingleChoiceFieldSpec,
  ControlledTermSingleChoiceFieldSpec,
};

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface MultipleChoiceField {
  readonly kind: 'MultipleChoiceField';
  readonly id: MultipleChoiceFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export interface MultipleChoiceFieldInit {
  readonly id: MultipleChoiceFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export const multipleChoiceField = (
  init: MultipleChoiceFieldInit,
): MultipleChoiceField =>
  ({
    kind: 'MultipleChoiceField',
    id: multipleChoiceFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedMultipleChoiceField {
  readonly kind: 'EmbeddedMultipleChoiceField';
  readonly key: string;
  readonly reference: MultipleChoiceFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: ChoiceValue;
}

export interface EmbeddedMultipleChoiceFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: MultipleChoiceFieldReference | MultipleChoiceField;
  readonly defaultValue?: ChoiceValue;
}

export function embeddedMultipleChoiceField(
  init: EmbeddedMultipleChoiceFieldInit,
): EmbeddedMultipleChoiceField {
  const out: EmbeddedMultipleChoiceField = {
    ...assembleCommon(init),
    kind: 'EmbeddedMultipleChoiceField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
