import { type TextLiteral, stringLiteral } from '../literals/index.js';
import { type NumericLiteral } from '../literals/index.js';

export interface TextValue {
  readonly kind: 'TextValue';
  readonly literal: TextLiteral;
}

// Accepts a TextLiteral, or a plain string (wrapped as a StringLiteral with
// implicit datatype xsd:string). The string shortcut exists so callers don't
// have to write textValue(stringLiteral('x')) when xsd:string is what they
// mean — pass langStringLiteral(...) explicitly when a language tag is needed.
export function textValue(input: TextLiteral | string): TextValue {
  return {
    kind: 'TextValue',
    literal: typeof input === 'string' ? stringLiteral(input) : input,
  };
}

export function isTextValue(x: unknown): x is TextValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'TextValue'
  );
}

export interface NumericValue {
  readonly kind: 'NumericValue';
  readonly literal: NumericLiteral;
}

export function numericValue(literal: NumericLiteral): NumericValue {
  return { kind: 'NumericValue', literal };
}

export function isNumericValue(x: unknown): x is NumericValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'NumericValue'
  );
}
