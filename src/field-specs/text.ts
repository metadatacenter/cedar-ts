import type { NonNegativeInteger } from '../leaves/index.js';
import type { TextDefaultValue } from '../defaults.js';
import type { TextRenderingHint } from './rendering-hints.js';

// TextFieldSpec — see grammar.md §Field Specs.
//   - default value, min/max length, validating regex, single-/multi-line hint
// All components are optional.

export interface TextFieldSpec {
  readonly kind: 'text_field_spec';
  readonly defaultValue?: TextDefaultValue;
  readonly minLength?: NonNegativeInteger;
  readonly maxLength?: NonNegativeInteger;
  readonly validationRegex?: string;
  readonly renderingHint?: TextRenderingHint;
}

export interface TextFieldSpecInit {
  readonly defaultValue?: TextDefaultValue;
  readonly minLength?: NonNegativeInteger;
  readonly maxLength?: NonNegativeInteger;
  readonly validationRegex?: string;
  readonly renderingHint?: TextRenderingHint;
}

export function textFieldSpec(init: TextFieldSpecInit = {}): TextFieldSpec {
  const out: {
    kind: 'text_field_spec';
    defaultValue?: TextDefaultValue;
    minLength?: NonNegativeInteger;
    maxLength?: NonNegativeInteger;
    validationRegex?: string;
    renderingHint?: TextRenderingHint;
  } = { kind: 'text_field_spec' };
  if (init.defaultValue !== undefined) out.defaultValue = init.defaultValue;
  if (init.minLength !== undefined) out.minLength = init.minLength;
  if (init.maxLength !== undefined) out.maxLength = init.maxLength;
  if (init.validationRegex !== undefined) out.validationRegex = init.validationRegex;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isTextFieldSpec = (x: unknown): x is TextFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'text_field_spec';
