import { assertNonNegativeInteger } from '../leaves/index.js';

// Cardinality — see grammar.md §Cardinality.
// Bounds the permitted number of values for an embedded artifact in its
// embedding context. Orthogonal to ValueRequirement: the requirement governs
// whether the user is obligated to supply any values; cardinality governs the
// permitted count if any are supplied.
//
// `min` is required; `max` is optional and, when omitted, denotes an
// unbounded upper bound (grammar §Cardinality).

export interface Cardinality {
  readonly kind: 'cardinality';
  readonly min: number;
  readonly max?: number;
}

export interface CardinalityInit {
  readonly min: number;
  readonly max?: number;
}

export function cardinality(init: CardinalityInit): Cardinality {
  const out: { kind: 'cardinality'; min: number; max?: number } = {
    kind: 'cardinality',
    min: assertNonNegativeInteger(init.min),
  };
  if (init.max !== undefined) out.max = assertNonNegativeInteger(init.max);
  return out;
}

export const isCardinality = (x: unknown): x is Cardinality =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'cardinality';
