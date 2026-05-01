import type { Value } from './index.js';

// AttributeValue is a name-value pair whose `value` is itself a `Value`,
// permitting unbounded nesting depth at the model level.
export interface AttributeValue {
  readonly kind: 'AttributeValue';
  readonly name: string;
  readonly value: Value;
}

export function attributeValue(name: string, value: Value): AttributeValue {
  return { kind: 'AttributeValue', name, value };
}

export function isAttributeValue(x: unknown): x is AttributeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'AttributeValue'
  );
}
