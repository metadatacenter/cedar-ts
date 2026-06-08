// =====================================================================
// Rendering hints — presentational hints carried by FieldSpec families
// =====================================================================
//
// Cross-cutting type module. Each rendering-hint type is a small
// configuration object carried by a specific FieldSpec family to
// influence how the field is rendered.
//
// Rendering hints are typed to a specific FieldSpec family so that
// only compatible combinations are expressible.
//
// Where a hint configures a text-entry widget, it carries an optional
// `placeholder` — a MultilingualString shown inside an empty input as
// format-demonstration sample text. `placeholder` is presentational
// only; it is NOT validated against the field spec's value
// constraints. See grammar.md §"Placeholder" for the normative
// description.

import type { MultilingualString } from '../multilingual.js';

// =====================================================================
// TextRenderingHint
// =====================================================================
//
// In prior revisions this was a bare string enum (`"singleLine" |
// "multiLine"`). It is now a structured object carrying the former
// enum content as an optional `lineMode` slot plus an optional
// `placeholder`. Templates that carry the bare-string form no longer
// decode; producers MUST migrate to the object form.

export type TextLineMode = 'singleLine' | 'multiLine';
export const TEXT_LINE_MODES: readonly TextLineMode[] = Object.freeze([
  'singleLine',
  'multiLine',
]);

export interface TextRenderingHint {
  readonly lineMode?: TextLineMode;
  readonly placeholder?: MultilingualString;
}

export function textRenderingHint(init: {
  readonly lineMode?: TextLineMode;
  readonly placeholder?: MultilingualString;
} = {}): TextRenderingHint {
  const out: { lineMode?: TextLineMode; placeholder?: MultilingualString } = {};
  if (init.lineMode !== undefined) out.lineMode = init.lineMode;
  if (init.placeholder !== undefined) out.placeholder = init.placeholder;
  return out;
}

// =====================================================================
// Enum and Boolean rendering hints (string-literal enums)
// =====================================================================
//
// Enum and Boolean rendering hints remain bare string enums — their
// widgets are not text-entry surfaces, so they do not gain a
// placeholder slot.

export type SingleValuedEnumRenderingHint = 'radio' | 'dropdown';
export const SINGLE_VALUED_ENUM_RENDERING_HINTS: readonly SingleValuedEnumRenderingHint[] =
  Object.freeze(['radio', 'dropdown']);

export type MultiValuedEnumRenderingHint = 'checkbox' | 'multiSelect';
export const MULTI_VALUED_ENUM_RENDERING_HINTS: readonly MultiValuedEnumRenderingHint[] =
  Object.freeze(['checkbox', 'multiSelect']);

export type BooleanRenderingHint = 'checkbox' | 'toggle' | 'radio' | 'dropdown';
export const BOOLEAN_RENDERING_HINTS: readonly BooleanRenderingHint[] = Object.freeze([
  'checkbox',
  'toggle',
  'radio',
  'dropdown',
]);

export type LanguageRenderingHint = 'autocomplete' | 'dropdown' | 'radio';
export const LANGUAGE_RENDERING_HINTS: readonly LanguageRenderingHint[] = Object.freeze([
  'autocomplete',
  'dropdown',
  'radio',
]);

// =====================================================================
// NumericRenderingHint
// =====================================================================
//
// Shared by IntegerFieldSpec and DecimalFieldSpec. Carries an
// optional `decimalPlaces` (a presentation concern only) plus an
// optional `placeholder` for the numeric text-entry input.

export interface NumericRenderingHint {
  readonly decimalPlaces?: number;
  readonly placeholder?: MultilingualString;
}

export function numericRenderingHint(
  init: number | {
    readonly decimalPlaces?: number;
    readonly placeholder?: MultilingualString;
  } = {},
): NumericRenderingHint {
  const norm = typeof init === 'number' ? { decimalPlaces: init } : init;
  const out: { decimalPlaces?: number; placeholder?: MultilingualString } = {};
  if (norm.decimalPlaces !== undefined) out.decimalPlaces = norm.decimalPlaces;
  if (norm.placeholder !== undefined) out.placeholder = norm.placeholder;
  return out;
}

// =====================================================================
// Temporal rendering hints
// =====================================================================
//
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

export interface DateRenderingHint {
  readonly componentOrder?: DateComponentOrder;
  readonly placeholder?: MultilingualString;
}

export function dateRenderingHint(
  init: DateComponentOrder | {
    readonly componentOrder?: DateComponentOrder;
    readonly placeholder?: MultilingualString;
  } = {},
): DateRenderingHint {
  const norm = typeof init === 'string' ? { componentOrder: init } : init;
  const out: { componentOrder?: DateComponentOrder; placeholder?: MultilingualString } = {};
  if (norm.componentOrder !== undefined) out.componentOrder = norm.componentOrder;
  if (norm.placeholder !== undefined) out.placeholder = norm.placeholder;
  return out;
}

export interface TimeRenderingHint {
  readonly timeFormat?: TimeFormat;
  readonly placeholder?: MultilingualString;
}

export function timeRenderingHint(
  init: TimeFormat | {
    readonly timeFormat?: TimeFormat;
    readonly placeholder?: MultilingualString;
  } = {},
): TimeRenderingHint {
  const norm = typeof init === 'string' ? { timeFormat: init } : init;
  const out: { timeFormat?: TimeFormat; placeholder?: MultilingualString } = {};
  if (norm.timeFormat !== undefined) out.timeFormat = norm.timeFormat;
  if (norm.placeholder !== undefined) out.placeholder = norm.placeholder;
  return out;
}

export interface DateTimeRenderingHint {
  readonly timeFormat?: TimeFormat;
  readonly placeholder?: MultilingualString;
}

export function dateTimeRenderingHint(
  init: TimeFormat | {
    readonly timeFormat?: TimeFormat;
    readonly placeholder?: MultilingualString;
  } = {},
): DateTimeRenderingHint {
  const norm = typeof init === 'string' ? { timeFormat: init } : init;
  const out: { timeFormat?: TimeFormat; placeholder?: MultilingualString } = {};
  if (norm.timeFormat !== undefined) out.timeFormat = norm.timeFormat;
  if (norm.placeholder !== undefined) out.placeholder = norm.placeholder;
  return out;
}

// =====================================================================
// Single-slot rendering hints for previously hint-less families
// =====================================================================
//
// Each carries only an optional `placeholder` today. Each is its own
// nominal type to preserve the structural constraint that only the
// matching FieldSpec accepts each hint kind (per grammar.md's
// "typed rendering hints make incompatible combinations structurally
// invalid" principle).

export interface ControlledTermRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function controlledTermRenderingHint(
  placeholder?: MultilingualString,
): ControlledTermRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface EmailRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function emailRenderingHint(
  placeholder?: MultilingualString,
): EmailRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface PhoneNumberRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function phoneNumberRenderingHint(
  placeholder?: MultilingualString,
): PhoneNumberRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface LinkRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function linkRenderingHint(
  placeholder?: MultilingualString,
): LinkRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface OrcidRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function orcidRenderingHint(
  placeholder?: MultilingualString,
): OrcidRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface RorRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function rorRenderingHint(
  placeholder?: MultilingualString,
): RorRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface DoiRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function doiRenderingHint(
  placeholder?: MultilingualString,
): DoiRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface PubMedIdRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function pubMedIdRenderingHint(
  placeholder?: MultilingualString,
): PubMedIdRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface RridRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function rridRenderingHint(
  placeholder?: MultilingualString,
): RridRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

export interface NihGrantIdRenderingHint {
  readonly placeholder?: MultilingualString;
}
export function nihGrantIdRenderingHint(
  placeholder?: MultilingualString,
): NihGrantIdRenderingHint {
  return placeholder !== undefined ? { placeholder } : {};
}

// =====================================================================
// RenderingHint union
// =====================================================================

export type RenderingHint =
  | TextRenderingHint
  | SingleValuedEnumRenderingHint
  | MultiValuedEnumRenderingHint
  | NumericRenderingHint
  | BooleanRenderingHint
  | DateRenderingHint
  | TimeRenderingHint
  | DateTimeRenderingHint
  | ControlledTermRenderingHint
  | EmailRenderingHint
  | PhoneNumberRenderingHint
  | LinkRenderingHint
  | OrcidRenderingHint
  | RorRenderingHint
  | DoiRenderingHint
  | PubMedIdRenderingHint
  | RridRenderingHint
  | NihGrantIdRenderingHint
  | LanguageRenderingHint;
