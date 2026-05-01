import { type Literal, langTaggedLiteral } from '../literals/index.js';
import {
  type ControlledTermValue,
  isControlledTermValue,
} from './controlled-term.js';

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
