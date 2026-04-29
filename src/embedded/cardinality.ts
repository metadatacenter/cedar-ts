import { type NonNegativeInteger, nonNegativeInteger } from '../leaves/index.js';

// Cardinality — see grammar.md §Cardinality.
// Bounds the permitted number of values for an embedded artifact in its
// embedding context. Orthogonal to ValueRequirement: the requirement governs
// whether the user is obligated to supply any values; cardinality governs the
// permitted count if any are supplied.

// Marker for an unbounded upper cardinality. Tagged so it can be discriminated
// from NonNegativeInteger inside CardinalityUpperBound.
export interface UnboundedCardinality {
  readonly kind: 'unbounded_cardinality';
}

export const unboundedCardinality: UnboundedCardinality = Object.freeze({
  kind: 'unbounded_cardinality',
});

export const isUnboundedCardinality = (x: unknown): x is UnboundedCardinality =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'unbounded_cardinality';

export type CardinalityUpperBound = NonNegativeInteger | UnboundedCardinality;

export interface Cardinality {
  readonly kind: 'cardinality';
  readonly min: NonNegativeInteger;
  readonly max?: CardinalityUpperBound;
}

// Permissive init: integers (number/bigint/string) are coerced via
// nonNegativeInteger; existing NonNegativeInteger / UnboundedCardinality
// values pass through.
export interface CardinalityInit {
  readonly min: NonNegativeInteger | number | bigint | string;
  readonly max?: CardinalityUpperBound | number | bigint | string;
}

function asNonNegativeInteger(
  v: NonNegativeInteger | number | bigint | string,
): NonNegativeInteger {
  if (typeof v === 'object' && v !== null &&
      (v as { kind?: unknown }).kind === 'non_negative_integer') {
    return v as NonNegativeInteger;
  }
  return nonNegativeInteger(v as number | bigint | string);
}

function asUpperBound(
  v: CardinalityUpperBound | number | bigint | string,
): CardinalityUpperBound {
  if (typeof v === 'object' && v !== null) {
    const k = (v as { kind?: unknown }).kind;
    if (k === 'unbounded_cardinality') return v as UnboundedCardinality;
    if (k === 'non_negative_integer') return v as NonNegativeInteger;
  }
  return nonNegativeInteger(v as number | bigint | string);
}

export function cardinality(init: CardinalityInit): Cardinality {
  const out: {
    kind: 'cardinality';
    min: NonNegativeInteger;
    max?: CardinalityUpperBound;
  } = {
    kind: 'cardinality',
    min: asNonNegativeInteger(init.min),
  };
  if (init.max !== undefined) out.max = asUpperBound(init.max);
  return out;
}

export const isCardinality = (x: unknown): x is Cardinality =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'cardinality';
