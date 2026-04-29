// LinkFieldSpec is a body-less spec at the model level. The kind discriminant
// alone is sufficient; the field's value rules are fixed by the
// FieldSpec-to-Value correspondence.
export interface LinkFieldSpec {
  readonly kind: 'link_field_spec';
}

export const linkFieldSpec = (): LinkFieldSpec => ({ kind: 'link_field_spec' });

export const isLinkFieldSpec = (x: unknown): x is LinkFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'link_field_spec';
