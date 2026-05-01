export interface AttributeValueFieldSpec {
  readonly kind: 'AttributeValueFieldSpec';
}

export const attributeValueFieldSpec = (): AttributeValueFieldSpec =>
  ({ kind: 'AttributeValueFieldSpec' });

export const isAttributeValueFieldSpec = (x: unknown): x is AttributeValueFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'AttributeValueFieldSpec';
