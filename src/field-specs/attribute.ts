export interface AttributeValueFieldSpec {
  readonly kind: 'attribute_value_field_spec';
}

export const attributeValueFieldSpec = (): AttributeValueFieldSpec =>
  ({ kind: 'attribute_value_field_spec' });

export const isAttributeValueFieldSpec = (x: unknown): x is AttributeValueFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'attribute_value_field_spec';
