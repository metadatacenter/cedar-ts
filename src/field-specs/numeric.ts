import type { Iri, NumericDatatypeKind } from '../leaves/index.js';
import { iri, assertNonNegativeInteger } from '../leaves/index.js';
import type { NumericValue } from '../values/index.js';
import type { NumericRenderingHint } from './rendering-hints.js';

// Unit denotes a measurement or quantity unit. The grammar pairs an Iri with
// an optional Label; we model Label as a plain optional string.
export interface Unit {
  readonly kind: 'unit';
  readonly iri: Iri;
  readonly label?: string;
}

export interface UnitInit {
  readonly iri: Iri | string;
  readonly label?: string;
}

export function unit(init: UnitInit): Unit {
  const out: { kind: 'unit'; iri: Iri; label?: string } = {
    kind: 'unit',
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = init.label;
  return out;
}

// NumericFieldSpec — see grammar.md §Field Specs.
//   - numeric datatype (xsd numeric kind), optional unit, precision, min/max
//     value bounds, rendering hint.
//
// The current placement of `unit` here is a pragmatic compromise — see the
// note in grammar.md about a possible future QuantityFieldSpec.

export interface NumericFieldSpec {
  readonly kind: 'numeric_field_spec';
  readonly datatype: NumericDatatypeKind;
  readonly unit?: Unit;
  readonly numericPrecision?: number;
  readonly minValue?: NumericValue;
  readonly maxValue?: NumericValue;
  readonly renderingHint?: NumericRenderingHint;
}

export interface NumericFieldSpecInit {
  readonly datatype: NumericDatatypeKind;
  readonly unit?: Unit;
  readonly numericPrecision?: number;
  readonly minValue?: NumericValue;
  readonly maxValue?: NumericValue;
  readonly renderingHint?: NumericRenderingHint;
}

export function numericFieldSpec(init: NumericFieldSpecInit): NumericFieldSpec {
  const out: {
    kind: 'numeric_field_spec';
    datatype: NumericDatatypeKind;
    unit?: Unit;
    numericPrecision?: number;
    minValue?: NumericValue;
    maxValue?: NumericValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'numeric_field_spec', datatype: init.datatype };
  if (init.unit !== undefined) out.unit = init.unit;
  if (init.numericPrecision !== undefined)
    out.numericPrecision = assertNonNegativeInteger(init.numericPrecision);
  if (init.minValue !== undefined) out.minValue = init.minValue;
  if (init.maxValue !== undefined) out.maxValue = init.maxValue;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isNumericFieldSpec = (x: unknown): x is NumericFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'numeric_field_spec';
