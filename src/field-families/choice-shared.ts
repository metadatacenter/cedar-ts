// =====================================================================
// Choice-shared types — cross-cutting types used by both the
// single-choice and multiple-choice field families
// =====================================================================
//
// Both `single-choice-field.ts` and `multiple-choice-field.ts` depend
// on the same option types and the same value types. Co-locating them
// here avoids either duplicating the definitions or arbitrarily
// designating one of the two family files as the owner.
//
// This file holds:
//
//   - LiteralChoiceOption, ControlledTermChoiceOption — option types
//     used by the four concrete choice-spec variants
//     (LiteralSingleChoice / ControlledTermSingleChoice /
//     LiteralMultipleChoice / ControlledTermMultipleChoice).
//   - LiteralChoiceValue, ControlledTermChoiceValue — instance value
//     types selected by a choice field.
//   - ChoiceValue — the union admitted at SingleChoiceField and
//     MultipleChoiceField instances. Also serves directly as the
//     `defaultValue` slot type on EmbeddedSingleChoiceField and
//     EmbeddedMultipleChoiceField (kind retained on the wire as the
//     union is polymorphic).

import { type Literal, langTaggedLiteral } from '../literals/index.js';
import {
  type ControlledTermValue,
  isControlledTermValue,
} from './controlled-term-field.js';

// =====================================================================
// Choice options (used by SingleChoiceFieldSpec / MultipleChoiceFieldSpec)
// =====================================================================

// LiteralChoiceOption pairs a literal value with an optional default-marker.
// `default` is modeled as a plain boolean property; the grammar's
// `default_option()` nullary constructor collapses to `default: true` here.
export interface LiteralChoiceOption {
  readonly literal: Literal;
  readonly default?: true;
}

// Accepts either a fully-built Literal, or a (text, lang) pair that's wrapped
// as a langTaggedLiteral. The (text, lang) shortcut covers the very common
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
    typeof arg1 === 'string' ? langTaggedLiteral(arg1, arg2 as string) : arg1;
  const options =
    typeof arg1 === 'string'
      ? arg3
      : (arg2 as { default?: boolean } | undefined);
  const out: { literal: Literal; default?: true } = {
    literal,
  };
  if (options?.default === true) out.default = true;
  return out;
}

export interface ControlledTermChoiceOption {
  readonly value: ControlledTermValue;
  readonly default?: true;
}

export function controlledTermChoiceOption(
  value: ControlledTermValue,
  options: { default?: boolean } = {},
): ControlledTermChoiceOption {
  const out: {
    value: ControlledTermValue;
    default?: true;
  } = { value };
  if (options.default === true) out.default = true;
  return out;
}

// =====================================================================
// Choice values (the runtime value carried by single-/multiple-choice fields)
// =====================================================================

export interface LiteralChoiceValue {
  readonly kind: 'LiteralChoiceValue';
  readonly literal: Literal;
}

// Accepts either a fully-built Literal, or a (text, lang) pair that's wrapped
// as a langTaggedLiteral. The (text, lang) shortcut covers the very common
// case of human-readable choice labels in a specific language.
export function literalChoiceValue(literal: Literal): LiteralChoiceValue;
export function literalChoiceValue(text: string, lang: string): LiteralChoiceValue;
export function literalChoiceValue(
  arg1: Literal | string,
  arg2?: string,
): LiteralChoiceValue {
  const literal: Literal =
    typeof arg1 === 'string' ? langTaggedLiteral(arg1, arg2 as string) : arg1;
  return { kind: 'LiteralChoiceValue', literal };
}

export interface ControlledTermChoiceValue {
  readonly kind: 'ControlledTermChoiceValue';
  readonly value: ControlledTermValue;
}

export function controlledTermChoiceValue(
  value: ControlledTermValue,
): ControlledTermChoiceValue {
  return { kind: 'ControlledTermChoiceValue', value };
}

export type ChoiceValue = LiteralChoiceValue | ControlledTermChoiceValue;

export function isLiteralChoiceValue(x: unknown): x is LiteralChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LiteralChoiceValue'
  );
}
export function isControlledTermChoiceValue(
  x: unknown,
): x is ControlledTermChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'ControlledTermChoiceValue' &&
    isControlledTermValue((x as ControlledTermChoiceValue).value)
  );
}
export function isChoiceValue(x: unknown): x is ChoiceValue {
  return isLiteralChoiceValue(x) || isControlledTermChoiceValue(x);
}

