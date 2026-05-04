// =====================================================================
// DateTime field family — combined date-time values at minute / second
// / fractional-second precision
// =====================================================================
//
// This file is the complete vertical slice for the date-time field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : DateTimeFieldId
//   - instance value             : DateTimeValue
//   - schema constraints         : DateTimeFieldSpec
//   - reusable Field artifact    : DateTimeField
//   - Template-embedding wrapper : EmbeddedDateTimeField
//
// Wire `kind` values: "DateTimeField" (artifact), "EmbeddedDateTimeField"
// (embedding).
//
// Owns the `DateTimeValueType` enum. References `DateTimeLiteral` from
// `src/literals/temporal-literals.ts`. The `defaultValue` slot on
// `EmbeddedDateTimeField` is a `DateTimeLiteral` directly (no wrapper).

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import {
  type DateTimeLiteral,
  dateTimeLiteral,
} from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { DateTimeRenderingHint } from './rendering-hints.js';
import type { TimezoneRequirement } from './time-field.js';
import type { DateFieldSpec } from './date-field.js';
import type { TimeFieldSpec } from './time-field.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `DateTimeField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `DateTimeField`'s IRI where (say) a
// `NumericField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface DateTimeFieldId {
  readonly kind: 'DateTimeFieldId';
  readonly iri: Iri;
}

export type DateTimeFieldReference = DateTimeFieldId;

// Identifier-wrapper constructor for the DateTime field family.
// Idempotent: an existing DateTimeFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The DateTimeFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const dateTimeFieldId = (
  v: DateTimeFieldId | Iri | string,
): DateTimeFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'DateTimeFieldId') {
    return v as DateTimeFieldId;
  }
  return {
    kind: 'DateTimeFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface DateTimeValue {
  readonly kind: 'DateTimeValue';
  readonly literal: DateTimeLiteral;
}

// Accepts a DateTimeLiteral or its lexical form directly. See fullDateValue.
export function dateTimeValue(input: DateTimeLiteral | string): DateTimeValue {
  return {
    kind: 'DateTimeValue',
    literal: typeof input === 'string' ? dateTimeLiteral(input) : input,
  };
}

export function isDateTimeValue(x: unknown): x is DateTimeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'DateTimeValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

// DateTimeValueType identifies the finest permitted date-time precision.
// Same strict-truncation rule as TimePrecision applies.
export type DateTimeValueType =
  | 'dateHourMinute'
  | 'dateHourMinuteSecond'
  | 'dateHourMinuteSecondFraction';
export const DATE_TIME_VALUE_TYPES: readonly DateTimeValueType[] = Object.freeze([
  'dateHourMinute',
  'dateHourMinuteSecond',
  'dateHourMinuteSecondFraction',
]);

export interface DateTimeFieldSpec {
  readonly kind: 'DateTimeFieldSpec';
  readonly dateTimeValueType: DateTimeValueType;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: DateTimeRenderingHint;
}

export interface DateTimeFieldSpecInit {
  readonly dateTimeValueType: DateTimeValueType;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: DateTimeRenderingHint;
}

export function dateTimeFieldSpec(init: DateTimeFieldSpecInit): DateTimeFieldSpec {
  const out: {
    kind: 'DateTimeFieldSpec';
    dateTimeValueType: DateTimeValueType;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: DateTimeRenderingHint;
  } = { kind: 'DateTimeFieldSpec', dateTimeValueType: init.dateTimeValueType };
  if (init.timezoneRequirement !== undefined)
    out.timezoneRequirement = init.timezoneRequirement;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isDateTimeFieldSpec = (x: unknown): x is DateTimeFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'DateTimeFieldSpec';

// Convenience union of the three temporal field specs.
export type TemporalFieldSpec = DateFieldSpec | TimeFieldSpec | DateTimeFieldSpec;

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DateTimeField {
  readonly kind: 'DateTimeField';
  readonly id: DateTimeFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}

export interface DateTimeFieldInit {
  readonly id: DateTimeFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}

export const dateTimeField = (init: DateTimeFieldInit): DateTimeField =>
  ({
    kind: 'DateTimeField',
    id: dateTimeFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedDateTimeField {
  readonly kind: 'EmbeddedDateTimeField';
  readonly key: string;
  readonly reference: DateTimeFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: DateTimeLiteral;
}

// `defaultValue` accepts a DateTimeLiteral or a plain xsd:dateTime
// lexical form (wrapped via dateTimeLiteral).
export interface EmbeddedDateTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DateTimeFieldReference | DateTimeField;
  readonly defaultValue?: DateTimeLiteral | string;
}

export function embeddedDateTimeField(
  init: EmbeddedDateTimeFieldInit,
): EmbeddedDateTimeField {
  const out: EmbeddedDateTimeField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDateTimeField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? dateTimeLiteral(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
