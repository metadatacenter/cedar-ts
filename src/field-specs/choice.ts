import { type Literal, langStringLiteral } from '../literals/index.js';
import type { ControlledTermValue } from '../values/index.js';
import type {
  SingleChoiceRenderingHint,
  MultipleChoiceRenderingHint,
} from './rendering-hints.js';

// LiteralChoiceOption pairs a literal value with an optional default-marker.
// `default` is modeled as a plain boolean property; the grammar's
// `default_option()` nullary constructor collapses to `default: true` here.
export interface LiteralChoiceOption {
  readonly kind: 'literal_choice_option';
  readonly literal: Literal;
  readonly default?: true;
}

// Accepts either a fully-built Literal, or a (text, lang) pair that's wrapped
// as a langStringLiteral. The (text, lang) shortcut covers the very common
// case of human-readable choice labels in a specific language.
export function literalChoiceOption(
  literal: Literal,
  options?: { default?: boolean },
): LiteralChoiceOption;
export function literalChoiceOption(
  text: string,
  lang: string,
  options?: { default?: boolean },
): LiteralChoiceOption;
export function literalChoiceOption(
  arg1: Literal | string,
  arg2?: string | { default?: boolean },
  arg3?: { default?: boolean },
): LiteralChoiceOption {
  const literal: Literal =
    typeof arg1 === 'string' ? langStringLiteral(arg1, arg2 as string) : arg1;
  const options =
    typeof arg1 === 'string'
      ? arg3
      : (arg2 as { default?: boolean } | undefined);
  const out: { kind: 'literal_choice_option'; literal: Literal; default?: true } = {
    kind: 'literal_choice_option',
    literal,
  };
  if (options?.default === true) out.default = true;
  return out;
}

export interface ControlledTermChoiceOption {
  readonly kind: 'controlled_term_choice_option';
  readonly value: ControlledTermValue;
  readonly default?: true;
}

export function controlledTermChoiceOption(
  value: ControlledTermValue,
  options: { default?: boolean } = {},
): ControlledTermChoiceOption {
  const out: {
    kind: 'controlled_term_choice_option';
    value: ControlledTermValue;
    default?: true;
  } = { kind: 'controlled_term_choice_option', value };
  if (options.default === true) out.default = true;
  return out;
}

// Choice field specs are refined along two dimensions:
//   - cardinality: single vs multiple
//   - value kind:  literal vs controlled-term
// All four concrete combinations are distinct types, plus the single-/multiple-
// choice unions and the all-encompassing ChoiceFieldSpec.

export interface LiteralSingleChoiceFieldSpec {
  readonly kind: 'literal_single_choice_field_spec';
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: SingleChoiceRenderingHint;
}

export function literalSingleChoiceFieldSpec(init: {
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: SingleChoiceRenderingHint;
}): LiteralSingleChoiceFieldSpec {
  const out: {
    kind: 'literal_single_choice_field_spec';
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: SingleChoiceRenderingHint;
  } = { kind: 'literal_single_choice_field_spec', options: init.options };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export interface ControlledTermSingleChoiceFieldSpec {
  readonly kind: 'controlled_term_single_choice_field_spec';
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
    kind: 'controlled_term_single_choice_field_spec';
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: SingleChoiceRenderingHint;
  } = {
    kind: 'controlled_term_single_choice_field_spec',
    options: init.options,
  };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export interface LiteralMultipleChoiceFieldSpec {
  readonly kind: 'literal_multiple_choice_field_spec';
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}

export function literalMultipleChoiceFieldSpec(init: {
  readonly options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
  readonly renderingHint?: MultipleChoiceRenderingHint;
}): LiteralMultipleChoiceFieldSpec {
  const out: {
    kind: 'literal_multiple_choice_field_spec';
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: MultipleChoiceRenderingHint;
  } = { kind: 'literal_multiple_choice_field_spec', options: init.options };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export interface ControlledTermMultipleChoiceFieldSpec {
  readonly kind: 'controlled_term_multiple_choice_field_spec';
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
    kind: 'controlled_term_multiple_choice_field_spec';
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: MultipleChoiceRenderingHint;
  } = {
    kind: 'controlled_term_multiple_choice_field_spec',
    options: init.options,
  };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export type SingleChoiceFieldSpec =
  | LiteralSingleChoiceFieldSpec
  | ControlledTermSingleChoiceFieldSpec;

export type MultipleChoiceFieldSpec =
  | LiteralMultipleChoiceFieldSpec
  | ControlledTermMultipleChoiceFieldSpec;

export type ChoiceFieldSpec = SingleChoiceFieldSpec | MultipleChoiceFieldSpec;

export const isLiteralSingleChoiceFieldSpec = (
  x: unknown,
): x is LiteralSingleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'literal_single_choice_field_spec';

export const isControlledTermSingleChoiceFieldSpec = (
  x: unknown,
): x is ControlledTermSingleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'controlled_term_single_choice_field_spec';

export const isLiteralMultipleChoiceFieldSpec = (
  x: unknown,
): x is LiteralMultipleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'literal_multiple_choice_field_spec';

export const isControlledTermMultipleChoiceFieldSpec = (
  x: unknown,
): x is ControlledTermMultipleChoiceFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'controlled_term_multiple_choice_field_spec';

export const isSingleChoiceFieldSpec = (x: unknown): x is SingleChoiceFieldSpec =>
  isLiteralSingleChoiceFieldSpec(x) || isControlledTermSingleChoiceFieldSpec(x);

export const isMultipleChoiceFieldSpec = (x: unknown): x is MultipleChoiceFieldSpec =>
  isLiteralMultipleChoiceFieldSpec(x) || isControlledTermMultipleChoiceFieldSpec(x);

export const isChoiceFieldSpec = (x: unknown): x is ChoiceFieldSpec =>
  isSingleChoiceFieldSpec(x) || isMultipleChoiceFieldSpec(x);
