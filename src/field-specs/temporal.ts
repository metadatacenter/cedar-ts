import type {
  DateRenderingHint,
  TimeRenderingHint,
  DateTimeRenderingHint,
} from './rendering-hints.js';

// DateValueType selects the granularity of dates accepted by a DateFieldSpec.
// String-literal union (per nullary-constructor convention).
export type DateValueType = 'year' | 'yearMonth' | 'fullDate';
export const DATE_VALUE_TYPES: readonly DateValueType[] = Object.freeze([
  'year',
  'yearMonth',
  'fullDate',
]);

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

// TimezoneRequirement: whether timezone information is required.
export type TimezoneRequirement = 'required' | 'notRequired';
export const TIMEZONE_REQUIREMENTS: readonly TimezoneRequirement[] = Object.freeze([
  'required',
  'notRequired',
]);

// ----- DateFieldSpec -----

export interface DateFieldSpec {
  readonly kind: 'DateFieldSpec';
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export interface DateFieldSpecInit {
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export function dateFieldSpec(init: DateFieldSpecInit): DateFieldSpec {
  const out: {
    kind: 'DateFieldSpec';
    dateValueType: DateValueType;
    renderingHint?: DateRenderingHint;
  } = { kind: 'DateFieldSpec', dateValueType: init.dateValueType };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isDateFieldSpec = (x: unknown): x is DateFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'DateFieldSpec';

// ----- TimeFieldSpec -----

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

// ----- DateTimeFieldSpec -----

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

export type TemporalFieldSpec = DateFieldSpec | TimeFieldSpec | DateTimeFieldSpec;
