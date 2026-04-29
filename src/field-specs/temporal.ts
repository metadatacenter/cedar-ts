import type {
  DateRenderingHint,
  TimeRenderingHint,
  DateTimeRenderingHint,
} from './rendering-hints.js';

// DateValueType selects the granularity of dates accepted by a DateFieldSpec.
// String-literal union (per nullary-constructor convention).
export type DateValueType = 'year' | 'year_month' | 'full_date';
export const DATE_VALUE_TYPES: readonly DateValueType[] = Object.freeze([
  'year',
  'year_month',
  'full_date',
]);

// TimePrecision identifies the finest time precision permitted by a TimeFieldSpec.
// Strict-truncation rules apply at validation: finer components MUST be omitted.
export type TimePrecision =
  | 'hour_minute'
  | 'hour_minute_second'
  | 'hour_minute_second_fraction';
export const TIME_PRECISIONS: readonly TimePrecision[] = Object.freeze([
  'hour_minute',
  'hour_minute_second',
  'hour_minute_second_fraction',
]);

// DateTimeValueType identifies the finest permitted date-time precision.
// Same strict-truncation rule as TimePrecision applies.
export type DateTimeValueType =
  | 'date_hour_minute'
  | 'date_hour_minute_second'
  | 'date_hour_minute_second_fraction';
export const DATE_TIME_VALUE_TYPES: readonly DateTimeValueType[] = Object.freeze([
  'date_hour_minute',
  'date_hour_minute_second',
  'date_hour_minute_second_fraction',
]);

// TimezoneRequirement: whether timezone information is required.
export type TimezoneRequirement = 'required' | 'not_required';
export const TIMEZONE_REQUIREMENTS: readonly TimezoneRequirement[] = Object.freeze([
  'required',
  'not_required',
]);

// ----- DateFieldSpec -----

export interface DateFieldSpec {
  readonly kind: 'date_field_spec';
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export interface DateFieldSpecInit {
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export function dateFieldSpec(init: DateFieldSpecInit): DateFieldSpec {
  const out: {
    kind: 'date_field_spec';
    dateValueType: DateValueType;
    renderingHint?: DateRenderingHint;
  } = { kind: 'date_field_spec', dateValueType: init.dateValueType };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isDateFieldSpec = (x: unknown): x is DateFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'date_field_spec';

// ----- TimeFieldSpec -----

export interface TimeFieldSpec {
  readonly kind: 'time_field_spec';
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
    kind: 'time_field_spec';
    timePrecision?: TimePrecision;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: TimeRenderingHint;
  } = { kind: 'time_field_spec' };
  if (init.timePrecision !== undefined) out.timePrecision = init.timePrecision;
  if (init.timezoneRequirement !== undefined)
    out.timezoneRequirement = init.timezoneRequirement;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isTimeFieldSpec = (x: unknown): x is TimeFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'time_field_spec';

// ----- DateTimeFieldSpec -----

export interface DateTimeFieldSpec {
  readonly kind: 'date_time_field_spec';
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
    kind: 'date_time_field_spec';
    dateTimeValueType: DateTimeValueType;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: DateTimeRenderingHint;
  } = { kind: 'date_time_field_spec', dateTimeValueType: init.dateTimeValueType };
  if (init.timezoneRequirement !== undefined)
    out.timezoneRequirement = init.timezoneRequirement;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isDateTimeFieldSpec = (x: unknown): x is DateTimeFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'date_time_field_spec';

export type TemporalFieldSpec = DateFieldSpec | TimeFieldSpec | DateTimeFieldSpec;
