import { type StringLiteral, stringLiteral } from '../literals/index.js';

export interface EmailValue {
  readonly kind: 'email_value';
  readonly literal: StringLiteral;
}

export function emailValue(literal: StringLiteral | string): EmailValue {
  return {
    kind: 'email_value',
    literal: typeof literal === 'string' ? stringLiteral(literal) : literal,
  };
}

export function isEmailValue(x: unknown): x is EmailValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'email_value'
  );
}

export interface PhoneNumberValue {
  readonly kind: 'phone_number_value';
  readonly literal: StringLiteral;
}

export function phoneNumberValue(literal: StringLiteral | string): PhoneNumberValue {
  return {
    kind: 'phone_number_value',
    literal: typeof literal === 'string' ? stringLiteral(literal) : literal,
  };
}

export function isPhoneNumberValue(x: unknown): x is PhoneNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'phone_number_value'
  );
}
