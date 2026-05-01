export interface EmailFieldSpec {
  readonly kind: 'EmailFieldSpec';
}
export const emailFieldSpec = (): EmailFieldSpec => ({ kind: 'EmailFieldSpec' });
export const isEmailFieldSpec = (x: unknown): x is EmailFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmailFieldSpec';

export interface PhoneNumberFieldSpec {
  readonly kind: 'PhoneNumberFieldSpec';
}
export const phoneNumberFieldSpec = (): PhoneNumberFieldSpec =>
  ({ kind: 'PhoneNumberFieldSpec' });
export const isPhoneNumberFieldSpec = (x: unknown): x is PhoneNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'PhoneNumberFieldSpec';

export type ContactFieldSpec = EmailFieldSpec | PhoneNumberFieldSpec;
