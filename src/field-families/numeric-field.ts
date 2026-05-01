// =====================================================================
// Numeric field family — numeric content typed by an XSD numeric
// datatype
// =====================================================================
//
// This file is the complete vertical slice for the numeric field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : NumericFieldId
//   - instance value             : NumericValue
//   - schema constraints         : NumericFieldSpec
//   - reusable Field artifact    : NumericField
//   - default value              : NumericDefaultValue
//   - Template-embedding wrapper : EmbeddedNumericField
//
// Wire `kind` values: "NumericField" (artifact), "EmbeddedNumericField"
// (embedding).
//
// This file also owns the `Unit` type, used by `NumericFieldSpec.unit`.

import {
  type Iri,
  type NumericDatatypeKind,
  iri,
  assertNonNegativeInteger,
} from '../leaves/index.js';
import type { NumericLiteral } from '../literals/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { NumericRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface NumericFieldId {
  readonly kind: 'NumericFieldId';
  readonly iri: Iri;
}

export type NumericFieldReference = NumericFieldId;

export const numericFieldId = (
  v: NumericFieldId | Iri | string,
): NumericFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as NumericFieldId;
  }
  return {
    kind: 'NumericFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface NumericValue {
  readonly kind: 'NumericValue';
  readonly literal: NumericLiteral;
}

export function numericValue(literal: NumericLiteral): NumericValue {
  return { kind: 'NumericValue', literal };
}

export function isNumericValue(x: unknown): x is NumericValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'NumericValue'
  );
}

// =====================================================================
// 3. FieldSpec (and Unit)
// =====================================================================

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

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface NumericField {
  readonly kind: 'NumericField';
  readonly id: NumericFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}

export interface NumericFieldInit {
  readonly id: NumericFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}

export const numericField = (init: NumericFieldInit): NumericField =>
  ({ kind: 'NumericField', id: numericFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface NumericDefaultValue {
  readonly kind: 'NumericDefaultValue';
  readonly value: NumericValue;
}
export const numericDefaultValue = (value: NumericValue): NumericDefaultValue =>
  ({ kind: 'NumericDefaultValue', value });

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedNumericField {
  readonly kind: 'EmbeddedNumericField';
  readonly key: string;
  readonly reference: NumericFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: NumericDefaultValue;
}

export interface EmbeddedNumericFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: NumericFieldReference | NumericField;
  // Numeric defaults require explicit construction (datatype ambiguity).
  readonly defaultValue?: NumericDefaultValue;
}

export function embeddedNumericField(
  init: EmbeddedNumericFieldInit,
): EmbeddedNumericField {
  const out: EmbeddedNumericField = {
    ...assembleCommon(init),
    kind: 'EmbeddedNumericField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
