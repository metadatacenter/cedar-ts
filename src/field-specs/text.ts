import { assertNonNegativeInteger } from '../leaves/index.js';
import type { TextDefaultValue } from '../defaults.js';
import type { TextRenderingHint } from './rendering-hints.js';

// TextFieldSpec — see grammar.md §Field Specs.
//   - default value, min/max length, validating regex, single-/multi-line hint
// All components are optional.

export interface TextFieldSpec {
  readonly kind: 'TextFieldSpec';
  readonly defaultValue?: TextDefaultValue;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly validationRegex?: string;
  readonly renderingHint?: TextRenderingHint;
}

export interface TextFieldSpecInit {
  readonly defaultValue?: TextDefaultValue;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly validationRegex?: string;
  readonly renderingHint?: TextRenderingHint;
}

export function textFieldSpec(init: TextFieldSpecInit = {}): TextFieldSpec {
  const out: {
    kind: 'TextFieldSpec';
    defaultValue?: TextDefaultValue;
    minLength?: number;
    maxLength?: number;
    validationRegex?: string;
    renderingHint?: TextRenderingHint;
  } = { kind: 'TextFieldSpec' };
  if (init.defaultValue !== undefined) out.defaultValue = init.defaultValue;
  if (init.minLength !== undefined) out.minLength = assertNonNegativeInteger(init.minLength);
  if (init.maxLength !== undefined) out.maxLength = assertNonNegativeInteger(init.maxLength);
  if (init.validationRegex !== undefined) out.validationRegex = init.validationRegex;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isTextFieldSpec = (x: unknown): x is TextFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TextFieldSpec';
