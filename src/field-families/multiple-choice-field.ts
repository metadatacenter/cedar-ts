import { type Iri, iri } from '../leaves/index.js';
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
  ChoiceDefaultValue,
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

export interface MultipleChoiceFieldId {
  readonly kind: 'FieldId';
  readonly fieldKind: 'MultipleChoice';
  readonly iri: Iri;
}

export type MultipleChoiceFieldReference = MultipleChoiceFieldId;

export const multipleChoiceFieldId = (
  v: MultipleChoiceFieldId | Iri | string,
): MultipleChoiceFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as MultipleChoiceFieldId;
  }
  return {
    kind: 'FieldId',
    fieldKind: 'MultipleChoice',
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
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export interface MultipleChoiceFieldInit {
  readonly id: MultipleChoiceFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export const multipleChoiceField = (
  init: MultipleChoiceFieldInit,
): MultipleChoiceField =>
  ({
    kind: 'MultipleChoiceField',
    id: multipleChoiceFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue — see field-families/choice-shared.ts (ChoiceDefaultValue)
// =====================================================================

// =====================================================================
// 6. EmbeddedField
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
  readonly defaultValue?: ChoiceDefaultValue;
}

export interface EmbeddedMultipleChoiceFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: MultipleChoiceFieldReference | MultipleChoiceField;
  readonly defaultValue?: ChoiceDefaultValue;
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
