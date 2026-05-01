// LinkFieldSpec is a body-less spec at the model level. The kind discriminant
// alone is sufficient; the field's value rules are fixed by the
// FieldSpec-to-Value correspondence.
export interface LinkFieldSpec {
  readonly kind: 'LinkFieldSpec';
}

export const linkFieldSpec = (): LinkFieldSpec => ({ kind: 'LinkFieldSpec' });

export const isLinkFieldSpec = (x: unknown): x is LinkFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LinkFieldSpec';
