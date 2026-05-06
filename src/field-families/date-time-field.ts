// =====================================================================
// DateTime field family — combined date-time values at minute / second
// / fractional-second precision
// =====================================================================
//
// DateTimeValue carries `value: string` (an xsd:dateTime lexical
// form). The datatype is fixed at xsd:dateTime and is not carried.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
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

export interface DateTimeFieldId {
  readonly kind: 'DateTimeFieldId';
  readonly iri: Iri;
}

export type DateTimeFieldReference = DateTimeFieldId;

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
  readonly value: string;
}

export type DateTimeValueInput = DateTimeValue | string;

export function dateTimeValue(value: string): DateTimeValue;
export function dateTimeValue(value: DateTimeValue): DateTimeValue;
export function dateTimeValue(value: DateTimeValue | string): DateTimeValue {
  if (typeof value !== 'string') return value;
  return { kind: 'DateTimeValue', value };
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
  readonly artifactRef: DateTimeFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: DateTimeValue;
}

export interface EmbeddedDateTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: DateTimeFieldReference | DateTimeField;
  readonly defaultValue?: DateTimeValueInput;
}

export function embeddedDateTimeField(
  init: EmbeddedDateTimeFieldInit,
): EmbeddedDateTimeField {
  const out: EmbeddedDateTimeField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDateTimeField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? dateTimeValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
