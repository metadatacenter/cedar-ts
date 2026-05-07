// =====================================================================
// Rendering hints — presentational hints carried by FieldSpec families
// =====================================================================
//
// Cross-cutting type module. Each rendering-hint type is a small
// configuration object carried by a specific FieldSpec family to
// influence how the field is rendered.
//
// Holds:
//
//   - the union RenderingHint
//   - per-family hint types: TextRenderingHint, NumericRenderingHint,
//     SingleValuedEnumRenderingHint, MultiValuedEnumRenderingHint,
//     BooleanRenderingHint, DateRenderingHint, TimeRenderingHint,
//     DateTimeRenderingHint
//   - related enums: DateComponentOrder, TimeFormat
//
// Rendering hints are typed to a specific FieldSpec family so that
// only compatible combinations are expressible. Where the spec admits
// only flat string-literal alternatives (e.g. "singleLine" |
// "multiLine"), the hint is a string-literal union.

export type TextRenderingHint = 'singleLine' | 'multiLine';
export const TEXT_RENDERING_HINTS: readonly TextRenderingHint[] = Object.freeze([
  'singleLine',
  'multiLine',
]);

export type SingleValuedEnumRenderingHint = 'radio' | 'dropdown';
export const SINGLE_VALUED_ENUM_RENDERING_HINTS: readonly SingleValuedEnumRenderingHint[] =
  Object.freeze(['radio', 'dropdown']);

export type MultiValuedEnumRenderingHint = 'checkbox' | 'multiSelect';
export const MULTI_VALUED_ENUM_RENDERING_HINTS: readonly MultiValuedEnumRenderingHint[] =
  Object.freeze(['checkbox', 'multiSelect']);

// NumericRenderingHint is shared by IntegerNumberFieldSpec and
// RealNumberFieldSpec. It carries an optional `decimalPlaces` value that
// tells a rendering implementation how many digits to display after the
// decimal point. `decimalPlaces` is a presentation concern only — it does
// NOT constrain the lexical form of submitted values; encoders and
// decoders MUST NOT enforce a precision cap based on this slot.
export interface NumericRenderingHint {
  readonly decimalPlaces?: number;
}

export function numericRenderingHint(decimalPlaces?: number): NumericRenderingHint {
  const out: { decimalPlaces?: number } = {};
  if (decimalPlaces !== undefined) out.decimalPlaces = decimalPlaces;
  return out;
}

// BooleanRenderingHint admits four widget choices distinguished by how
// they handle the *unset* state of a boolean field. `radio` and
// `dropdown` faithfully represent the unset state; `checkbox` and
// `toggle` cannot distinguish *false* from *unset*.
export type BooleanRenderingHint = 'checkbox' | 'toggle' | 'radio' | 'dropdown';
export const BOOLEAN_RENDERING_HINTS: readonly BooleanRenderingHint[] = Object.freeze([
  'checkbox',
  'toggle',
  'radio',
  'dropdown',
]);

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

// Temporal rendering hints carry only their configuration component.

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
  | SingleValuedEnumRenderingHint
  | MultiValuedEnumRenderingHint
  | NumericRenderingHint
  | BooleanRenderingHint
  | DateRenderingHint
  | TimeRenderingHint
  | DateTimeRenderingHint;
