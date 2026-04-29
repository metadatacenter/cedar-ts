export interface EmailFieldSpec {
  readonly kind: 'email_field_spec';
}
export const emailFieldSpec = (): EmailFieldSpec => ({ kind: 'email_field_spec' });
export const isEmailFieldSpec = (x: unknown): x is EmailFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'email_field_spec';

export interface PhoneNumberFieldSpec {
  readonly kind: 'phone_number_field_spec';
}
export const phoneNumberFieldSpec = (): PhoneNumberFieldSpec =>
  ({ kind: 'phone_number_field_spec' });
export const isPhoneNumberFieldSpec = (x: unknown): x is PhoneNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'phone_number_field_spec';

export type ContactFieldSpec = EmailFieldSpec | PhoneNumberFieldSpec;
