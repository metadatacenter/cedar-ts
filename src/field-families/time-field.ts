// =====================================================================
// Time field family — time-of-day values at hour-minute / second /
// fractional-second precision
// =====================================================================
//
// This file is the complete vertical slice for the time field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : TimeFieldId
//   - instance value             : TimeValue
//   - schema constraints         : TimeFieldSpec
//   - reusable Field artifact    : TimeField
//   - default value              : TimeDefaultValue
//   - Template-embedding wrapper : EmbeddedTimeField
//
// Wire `kind` values: "TimeField" (artifact), "EmbeddedTimeField"
// (embedding).
//
// Owns the `TimePrecision` and `TimezoneRequirement` enums. References
// `TimeLiteral` from `src/literals/temporal-literals.ts`.

import { type Iri, iri } from '../leaves/index.js';
import {
  type TimeLiteral,
  timeLiteral,
} from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { TimeRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface TimeFieldId {
  readonly kind: 'TimeFieldId';
  readonly iri: Iri;
}

export type TimeFieldReference = TimeFieldId;

// Identifier-wrapper constructor for the Time field family.
// Idempotent: an existing TimeFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The TimeFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const timeFieldId = (
  v: TimeFieldId | Iri | string,
): TimeFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'TimeFieldId') {
    return v as TimeFieldId;
  }
  return {
    kind: 'TimeFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface TimeValue {
  readonly kind: 'TimeValue';
  readonly literal: TimeLiteral;
}

// Accepts a TimeLiteral or its lexical form directly. See fullDateValue.
export function timeValue(input: TimeLiteral | string): TimeValue {
  return {
    kind: 'TimeValue',
    literal: typeof input === 'string' ? timeLiteral(input) : input,
  };
}

export function isTimeValue(x: unknown): x is TimeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'TimeValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

// TimePrecision identifies the finest time precision permitted by a TimeFieldSpec.
// Strict-truncation rules apply at validation: finer components MUST be omitted.
export type TimePrecision =
  | 'hourMinute'
  | 'hourMinuteSecond'
  | 'hourMinuteSecondFraction';
export const TIME_PRECISIONS: readonly TimePrecision[] = Object.freeze([
  'hourMinute',
  'hourMinuteSecond',
  'hourMinuteSecondFraction',
]);

// TimezoneRequirement: whether timezone information is required.
export type TimezoneRequirement = 'required' | 'notRequired';
export const TIMEZONE_REQUIREMENTS: readonly TimezoneRequirement[] = Object.freeze([
  'required',
  'notRequired',
]);

export interface TimeFieldSpec {
  readonly kind: 'TimeFieldSpec';
  readonly timePrecision?: TimePrecision;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: TimeRenderingHint;
}

export interface TimeFieldSpecInit {
  readonly timePrecision?: TimePrecision;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: TimeRenderingHint;
}

export function timeFieldSpec(init: TimeFieldSpecInit = {}): TimeFieldSpec {
  const out: {
    kind: 'TimeFieldSpec';
    timePrecision?: TimePrecision;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: TimeRenderingHint;
  } = { kind: 'TimeFieldSpec' };
  if (init.timePrecision !== undefined) out.timePrecision = init.timePrecision;
  if (init.timezoneRequirement !== undefined)
    out.timezoneRequirement = init.timezoneRequirement;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isTimeFieldSpec = (x: unknown): x is TimeFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TimeFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface TimeField {
  readonly kind: 'TimeField';
  readonly id: TimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export interface TimeFieldInit {
  readonly id: TimeFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export const timeField = (init: TimeFieldInit): TimeField =>
  ({ kind: 'TimeField', id: timeFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface TimeDefaultValue {
  readonly kind: 'TimeDefaultValue';
  readonly value: TimeValue;
}

// Idempotent. Accepts a TimeDefaultValue, a TimeValue, a TimeLiteral, or a
// plain xsd:time lexical form. See textDefaultValue for the rationale.
export function timeDefaultValue(
  input: TimeDefaultValue | TimeValue | TimeLiteral | string,
): TimeDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'TimeDefaultValue') {
    return input;
  }
  return {
    kind: 'TimeDefaultValue',
    value: isTimeValue(input) ? input : timeValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedTimeField {
  readonly kind: 'EmbeddedTimeField';
  readonly key: string;
  readonly reference: TimeFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: TimeDefaultValue;
}

export interface EmbeddedTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: TimeFieldReference | TimeField;
  readonly defaultValue?: TimeDefaultValue | TimeValue | TimeLiteral | string;
}

export function embeddedTimeField(init: EmbeddedTimeFieldInit): EmbeddedTimeField {
  const out: EmbeddedTimeField = {
    ...assembleCommon(init),
    kind: 'EmbeddedTimeField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: timeDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
