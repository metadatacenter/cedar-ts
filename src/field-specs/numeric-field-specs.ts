import type { Iri, NumericDatatypeKind } from '../leaves/index.js';
import { iri, assertNonNegativeInteger } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { NumericValue } from '../values/index.js';
import type { NumericRenderingHint } from './rendering-hints.js';

// Unit denotes a measurement or quantity unit. The grammar pairs an Iri with
// an optional human-readable Label, modeled here as a MultilingualString.
export interface Unit {
  readonly iri: Iri;
  readonly label?: MultilingualString;
}

export interface UnitInit {
  readonly iri: Iri | string;
  readonly label?: MultilingualStringInput;
}

export function unit(init: UnitInit): Unit {
  const out: { iri: Iri; label?: MultilingualString } = {
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  return out;
}

// NumericFieldSpec — see grammar.md §Field Specs.
//   - numeric datatype (xsd numeric kind), optional unit, precision, min/max
//     value bounds, rendering hint.
//
// The current placement of `unit` here is a pragmatic compromise — see the
// note in grammar.md about a possible future QuantityFieldSpec.

export interface NumericFieldSpec {
  readonly kind: 'NumericFieldSpec';
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
    kind: 'NumericFieldSpec';
    datatype: NumericDatatypeKind;
    unit?: Unit;
    numericPrecision?: number;
    minValue?: NumericValue;
    maxValue?: NumericValue;
    renderingHint?: NumericRenderingHint;
  } = { kind: 'NumericFieldSpec', datatype: init.datatype };
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
  (x as { kind?: unknown }).kind === 'NumericFieldSpec';
