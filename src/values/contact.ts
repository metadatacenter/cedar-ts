import { type SimpleLiteral, simpleLiteral } from '../literals/index.js';

export interface EmailValue {
  readonly kind: 'EmailValue';
  readonly literal: SimpleLiteral;
}

export function emailValue(literal: SimpleLiteral | string): EmailValue {
  return {
    kind: 'EmailValue',
    literal: typeof literal === 'string' ? simpleLiteral(literal) : literal,
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
  readonly literal: SimpleLiteral;
}

export function phoneNumberValue(literal: SimpleLiteral | string): PhoneNumberValue {
  return {
    kind: 'PhoneNumberValue',
    literal: typeof literal === 'string' ? simpleLiteral(literal) : literal,
  };
}

export function isPhoneNumberValue(x: unknown): x is PhoneNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'PhoneNumberValue'
  );
}
