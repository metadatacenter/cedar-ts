// =====================================================================
// Choice-shared types — cross-cutting types used by both the
// single-choice and multiple-choice field families
// =====================================================================
//
// This file holds:
//
//   - LiteralChoiceOption, ControlledTermChoiceOption — option types
//     used by the four concrete choice-spec variants.
//   - LiteralChoiceValue, ControlledTermChoiceValue — instance value
//     types selected by a choice field.
//   - ChoiceValue — the union admitted at SingleChoiceField and
//     MultipleChoiceField instances.
//
// `LiteralChoiceValue` carries a flat shape: `{ kind, value, lang?,
// datatype? }`. The `lang` and `datatype` slots are mutually exclusive.
// `LiteralChoiceOption` mirrors that shape (without the `kind`
// discriminator, since it is at a singleton position) plus an optional
// `default: true`.

import {
  type Iri,
  type LanguageTag,
  CedarConstructionError,
  iri,
  languageTag,
} from '../leaves/index.js';
import {
  type ControlledTermValue,
  isControlledTermValue,
} from './controlled-term-field.js';

// =====================================================================
// LiteralChoiceOption / ControlledTermChoiceOption
// =====================================================================

export interface LiteralChoiceOption {
  readonly value: string;
  readonly lang?: LanguageTag;
  readonly datatype?: Iri;
  readonly default?: true;
}

export interface LiteralChoiceOptionInit {
  readonly value: string;
  readonly lang?: string | LanguageTag;
  readonly datatype?: string | Iri;
  readonly default?: boolean;
}

function assertLangDatatypeExclusive(
  hasLang: boolean,
  hasDatatype: boolean,
  where: string,
): void {
  if (hasLang && hasDatatype) {
    throw new CedarConstructionError(
      `${where}: lang and datatype are mutually exclusive; at most one may be present`,
    );
  }
}

export function literalChoiceOption(
  init: LiteralChoiceOptionInit,
): LiteralChoiceOption;
// (text, lang) shortcut: language-tagged plain text option.
export function literalChoiceOption(
  text: string,
  lang: string,
  options?: { default?: boolean },
): LiteralChoiceOption;
export function literalChoiceOption(
  arg1: LiteralChoiceOptionInit | string,
  arg2?: string,
  arg3?: { default?: boolean },
): LiteralChoiceOption {
  if (typeof arg1 === 'string') {
    const init: LiteralChoiceOptionInit = {
      value: arg1,
      lang: arg2 as string,
    };
    if (arg3?.default === true) (init as { default?: boolean }).default = true;
    return literalChoiceOption(init);
  }
  const hasLang = arg1.lang !== undefined;
  const hasDatatype = arg1.datatype !== undefined;
  assertLangDatatypeExclusive(hasLang, hasDatatype, 'LiteralChoiceOption');
  const out: {
    value: string;
    lang?: LanguageTag;
    datatype?: Iri;
    default?: true;
  } = { value: arg1.value };
  if (hasLang) {
    out.lang =
      typeof arg1.lang === 'string' ? languageTag(arg1.lang) : (arg1.lang as LanguageTag);
  }
  if (hasDatatype) {
    out.datatype =
      typeof arg1.datatype === 'string' ? iri(arg1.datatype) : (arg1.datatype as Iri);
  }
  if (arg1.default === true) out.default = true;
  return out;
}

export interface ControlledTermChoiceOption {
  readonly value: ControlledTermValue;
  readonly default?: true;
}

export function controlledTermChoiceOption(
  value: ControlledTermValue,
  options: { default?: boolean } = {},
): ControlledTermChoiceOption {
  const out: {
    value: ControlledTermValue;
    default?: true;
  } = { value };
  if (options.default === true) out.default = true;
  return out;
}

// =====================================================================
// LiteralChoiceValue / ControlledTermChoiceValue / ChoiceValue
// =====================================================================

export interface LiteralChoiceValue {
  readonly kind: 'LiteralChoiceValue';
  readonly value: string;
  readonly lang?: LanguageTag;
  readonly datatype?: Iri;
}

export interface LiteralChoiceValueInit {
  readonly value: string;
  readonly lang?: string | LanguageTag;
  readonly datatype?: string | Iri;
}

export function literalChoiceValue(
  init: LiteralChoiceValueInit,
): LiteralChoiceValue;
// (text, lang) shortcut: language-tagged plain text choice.
export function literalChoiceValue(
  text: string,
  lang: string,
): LiteralChoiceValue;
// Plain text (no lang, no datatype).
export function literalChoiceValue(text: string): LiteralChoiceValue;
export function literalChoiceValue(
  arg1: LiteralChoiceValueInit | string,
  arg2?: string,
): LiteralChoiceValue {
  if (typeof arg1 === 'string') {
    return arg2 === undefined
      ? { kind: 'LiteralChoiceValue', value: arg1 }
      : literalChoiceValue({ value: arg1, lang: arg2 });
  }
  const hasLang = arg1.lang !== undefined;
  const hasDatatype = arg1.datatype !== undefined;
  assertLangDatatypeExclusive(hasLang, hasDatatype, 'LiteralChoiceValue');
  const out: {
    kind: 'LiteralChoiceValue';
    value: string;
    lang?: LanguageTag;
    datatype?: Iri;
  } = { kind: 'LiteralChoiceValue', value: arg1.value };
  if (hasLang) {
    out.lang =
      typeof arg1.lang === 'string' ? languageTag(arg1.lang) : (arg1.lang as LanguageTag);
  }
  if (hasDatatype) {
    out.datatype =
      typeof arg1.datatype === 'string' ? iri(arg1.datatype) : (arg1.datatype as Iri);
  }
  return out;
}

export interface ControlledTermChoiceValue {
  readonly kind: 'ControlledTermChoiceValue';
  readonly value: ControlledTermValue;
}

export function controlledTermChoiceValue(
  value: ControlledTermValue,
): ControlledTermChoiceValue {
  return { kind: 'ControlledTermChoiceValue', value };
}

export type ChoiceValue = LiteralChoiceValue | ControlledTermChoiceValue;

export function isLiteralChoiceValue(x: unknown): x is LiteralChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LiteralChoiceValue'
  );
}
export function isControlledTermChoiceValue(
  x: unknown,
): x is ControlledTermChoiceValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'ControlledTermChoiceValue' &&
    isControlledTermValue((x as ControlledTermChoiceValue).value)
  );
}
export function isChoiceValue(x: unknown): x is ChoiceValue {
  return isLiteralChoiceValue(x) || isControlledTermChoiceValue(x);
}
