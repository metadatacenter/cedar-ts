import { type Literal, langStringLiteral } from '../literals/index.js';
import {
  type ControlledTermValue,
  isControlledTermValue,
} from './controlled-term.js';

export interface LiteralChoiceValue {
  readonly kind: 'literal_choice_value';
  readonly literal: Literal;
}

// Accepts either a fully-built Literal, or a (text, lang) pair that's wrapped
// as a langStringLiteral. The (text, lang) shortcut covers the very common
// case of human-readable choice labels in a specific language.
export function literalChoiceValue(literal: Literal): LiteralChoiceValue;
export function literalChoiceValue(text: string, lang: string): LiteralChoiceValue;
export function literalChoiceValue(
  arg1: Literal | string,
  arg2?: string,
): LiteralChoiceValue {
  const literal: Literal =
    typeof arg1 === 'string' ? langStringLiteral(arg1, arg2 as string) : arg1;
  return { kind: 'literal_choice_value', literal };
}

export interface ControlledTermChoiceValue {
  readonly kind: 'controlled_term_choice_value';
  readonly value: ControlledTermValue;
}

export function controlledTermChoiceValue(
  value: ControlledTermValue,
): ControlledTermChoiceValue {
  return { kind: 'controlled_term_choice_value', value };
}

export type ChoiceValue = LiteralChoiceValue | ControlledTermChoiceValue;

export function isLiteralChoiceValue(x: unknown): x is LiteralChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'literal_choice_value'
  );
}
export function isControlledTermChoiceValue(
  x: unknown,
): x is ControlledTermChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'controlled_term_choice_value' &&
    isControlledTermValue((x as ControlledTermChoiceValue).value)
  );
}
export function isChoiceValue(x: unknown): x is ChoiceValue {
  return isLiteralChoiceValue(x) || isControlledTermChoiceValue(x);
}
