import { type StringLiteral, stringLiteral } from '../literals/index.js';

export interface EmailValue {
  readonly kind: 'EmailValue';
  readonly literal: StringLiteral;
}

export function emailValue(literal: StringLiteral | string): EmailValue {
  return {
    kind: 'EmailValue',
    literal: typeof literal === 'string' ? stringLiteral(literal) : literal,
  };
}

export function isEmailValue(x: unknown): x is EmailValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'EmailValue'
  );
}

export interface PhoneNumberValue {
  readonly kind: 'PhoneNumberValue';
  readonly literal: StringLiteral;
}

export function phoneNumberValue(literal: StringLiteral | string): PhoneNumberValue {
  return {
    kind: 'PhoneNumberValue',
    literal: typeof literal === 'string' ? stringLiteral(literal) : literal,
  };
}

export function isPhoneNumberValue(x: unknown): x is PhoneNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'PhoneNumberValue'
  );
}
