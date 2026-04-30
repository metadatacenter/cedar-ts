// Rendering hints. Each hint is typed to a specific FieldSpec family so that
// only compatible combinations are expressible. Where the grammar uses
// nullary constructors only (e.g. SingleLineTextRenderingHint vs
// MultiLineTextRenderingHint), the hint is a string-literal union for
// simpler comparison and serialization.

export type TextRenderingHint = 'single_line_text' | 'multi_line_text';
export const TEXT_RENDERING_HINTS: readonly TextRenderingHint[] = Object.freeze([
  'single_line_text',
  'multi_line_text',
]);

export type SingleChoiceRenderingHint = 'radio' | 'single_select_dropdown';
export const SINGLE_CHOICE_RENDERING_HINTS: readonly SingleChoiceRenderingHint[] =
  Object.freeze(['radio', 'single_select_dropdown']);

export type MultipleChoiceRenderingHint = 'checkbox' | 'multi_select_dropdown';
export const MULTIPLE_CHOICE_RENDERING_HINTS: readonly MultipleChoiceRenderingHint[] =
  Object.freeze(['checkbox', 'multi_select_dropdown']);

// NumericRenderingHint has only one widget. Modeled as a singleton union
// for symmetry and forward-compatibility.
export type NumericRenderingHint = 'numeric_input';

// DateComponentOrder is the ordering used by DateRenderingHint to display
// or acquire date components.
export type DateComponentOrder = 'day_month_year' | 'month_day_year' | 'year_month_day';
export const DATE_COMPONENT_ORDERS: readonly DateComponentOrder[] = Object.freeze([
  'day_month_year',
  'month_day_year',
  'year_month_day',
]);

// TimeFormat distinguishes 12- and 24-hour clock display. Used by both
// TimeRenderingHint and DateTimeRenderingHint.
export type TimeFormat = 'twelve_hour' | 'twenty_four_hour';
export const TIME_FORMATS: readonly TimeFormat[] = Object.freeze([
  'twelve_hour',
  'twenty_four_hour',
]);

// Temporal rendering hints retain object structure because they pair a
// widget kind with an optional format component.

export interface DateRenderingHint {
  readonly kind: 'DateRenderingHint';
  readonly widget: 'date_picker';
  readonly format?: DateComponentOrder;
}

export function dateRenderingHint(format?: DateComponentOrder): DateRenderingHint {
  const out: { kind: 'DateRenderingHint'; widget: 'date_picker'; format?: DateComponentOrder } =
    { kind: 'DateRenderingHint', widget: 'date_picker' };
  if (format !== undefined) out.format = format;
  return out;
}

export interface TimeRenderingHint {
  readonly kind: 'TimeRenderingHint';
  readonly widget: 'time_picker';
  readonly format?: TimeFormat;
}

export function timeRenderingHint(format?: TimeFormat): TimeRenderingHint {
  const out: { kind: 'TimeRenderingHint'; widget: 'time_picker'; format?: TimeFormat } =
    { kind: 'TimeRenderingHint', widget: 'time_picker' };
  if (format !== undefined) out.format = format;
  return out;
}

export interface DateTimeRenderingHint {
  readonly kind: 'DateTimeRenderingHint';
  readonly widget: 'date_time_picker';
  readonly format?: TimeFormat;
}

export function dateTimeRenderingHint(format?: TimeFormat): DateTimeRenderingHint {
  const out: {
    kind: 'DateTimeRenderingHint';
    widget: 'date_time_picker';
    format?: TimeFormat;
  } = { kind: 'DateTimeRenderingHint', widget: 'date_time_picker' };
  if (format !== undefined) out.format = format;
  return out;
}

export type RenderingHint =
  | TextRenderingHint
  | SingleChoiceRenderingHint
  | MultipleChoiceRenderingHint
  | NumericRenderingHint
  | DateRenderingHint
  | TimeRenderingHint
  | DateTimeRenderingHint;
