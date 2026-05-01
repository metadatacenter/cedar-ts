// =====================================================================
// Rendering hints — presentational hints carried by FieldSpec families
// =====================================================================
//
// Cross-cutting type module. Each rendering-hint type is a small
// configuration object carried by a specific FieldSpec family to
// influence how the field is rendered. They are NOT field-family-
// specific in the same vertical-slice sense as everything else in this
// folder — instead, multiple field families reference particular hint
// types as the type of their `renderingHint?` slot.
//
// Holds:
//
//   - the union RenderingHint
//   - per-family hint types: TextRenderingHint, NumericRenderingHint,
//     SingleChoiceRenderingHint, MultipleChoiceRenderingHint,
//     DateRenderingHint, TimeRenderingHint, DateTimeRenderingHint
//   - related enums: DateComponentOrder, TimeFormat

// Rendering hints. Each hint is typed to a specific FieldSpec family so that
// only compatible combinations are expressible. Where the grammar uses
// nullary constructors only (e.g. SingleLineTextRenderingHint vs
// MultiLineTextRenderingHint), the hint is a string-literal union for
// simpler comparison and serialization.

export type TextRenderingHint = 'singleLine' | 'multiLine';
export const TEXT_RENDERING_HINTS: readonly TextRenderingHint[] = Object.freeze([
  'singleLine',
  'multiLine',
]);

export type SingleChoiceRenderingHint = 'radio' | 'singleSelectDropdown';
export const SINGLE_CHOICE_RENDERING_HINTS: readonly SingleChoiceRenderingHint[] =
  Object.freeze(['radio', 'singleSelectDropdown']);

export type MultipleChoiceRenderingHint = 'checkbox' | 'multiSelectDropdown';
export const MULTIPLE_CHOICE_RENDERING_HINTS: readonly MultipleChoiceRenderingHint[] =
  Object.freeze(['checkbox', 'multiSelectDropdown']);

// NumericRenderingHint has only one widget. Modeled as a singleton union
// for symmetry and forward-compatibility.
export type NumericRenderingHint = 'numericInput';

// DateComponentOrder is the ordering used by DateRenderingHint to display
// or acquire date components.
export type DateComponentOrder = 'dayMonthYear' | 'monthDayYear' | 'yearMonthDay';
export const DATE_COMPONENT_ORDERS: readonly DateComponentOrder[] = Object.freeze([
  'dayMonthYear',
  'monthDayYear',
  'yearMonthDay',
]);

// TimeFormat distinguishes 12- and 24-hour clock display. Used by both
// TimeRenderingHint and DateTimeRenderingHint.
export type TimeFormat = 'twelveHour' | 'twentyFourHour';
export const TIME_FORMATS: readonly TimeFormat[] = Object.freeze([
  'twelveHour',
  'twentyFourHour',
]);

// Temporal rendering hints carry only their configuration component. Each
// hint occupies a singleton position on its FieldSpec, so there is no need
// for a `kind` discriminant; each family has only one possible widget, so
// there is no need for a `widget` field either. (See spec/serialization.md
// §6 and grammar.md §Temporal Field Specs.)

export interface DateRenderingHint {
  readonly componentOrder?: DateComponentOrder;
}

export function dateRenderingHint(componentOrder?: DateComponentOrder): DateRenderingHint {
  const out: { componentOrder?: DateComponentOrder } = {};
  if (componentOrder !== undefined) out.componentOrder = componentOrder;
  return out;
}

export interface TimeRenderingHint {
  readonly timeFormat?: TimeFormat;
}

export function timeRenderingHint(timeFormat?: TimeFormat): TimeRenderingHint {
  const out: { timeFormat?: TimeFormat } = {};
  if (timeFormat !== undefined) out.timeFormat = timeFormat;
  return out;
}

export interface DateTimeRenderingHint {
  readonly timeFormat?: TimeFormat;
}

export function dateTimeRenderingHint(timeFormat?: TimeFormat): DateTimeRenderingHint {
  const out: { timeFormat?: TimeFormat } = {};
  if (timeFormat !== undefined) out.timeFormat = timeFormat;
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
