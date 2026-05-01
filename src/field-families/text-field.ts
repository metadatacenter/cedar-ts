import { type Iri, iri, assertNonNegativeInteger } from '../leaves/index.js';
import {
  type TextLiteral,
  simpleLiteral,
} from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { TextRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface TextFieldId {
  readonly kind: 'FieldId';
  readonly fieldKind: 'Text';
  readonly iri: Iri;
}

export type TextFieldReference = TextFieldId;

export const textFieldId = (
  v: TextFieldId | Iri | string,
): TextFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as TextFieldId;
  }
  return {
    kind: 'FieldId',
    fieldKind: 'Text',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface TextValue {
  readonly kind: 'TextValue';
  readonly literal: TextLiteral;
}

// Accepts a TextLiteral, or a plain string (wrapped as a SimpleLiteral with
// implicit datatype xsd:string). The string shortcut exists so callers don't
// have to write textValue(simpleLiteral('x')) when xsd:string is what they
// mean — pass langTaggedLiteral(...) explicitly when a language tag is needed.
export function textValue(input: TextLiteral | string): TextValue {
  return {
    kind: 'TextValue',
    literal: typeof input === 'string' ? simpleLiteral(input) : input,
  };
}

export function isTextValue(x: unknown): x is TextValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'TextValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

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

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface TextField {
  readonly kind: 'TextField';
  readonly id: TextFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export interface TextFieldInit {
  readonly id: TextFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export const textField = (init: TextFieldInit): TextField =>
  ({ kind: 'TextField', id: textFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface TextDefaultValue {
  readonly kind: 'TextDefaultValue';
  readonly value: TextValue;
}

// Idempotent. Accepts any of:
//   - a fully-built TextDefaultValue (passes through)
//   - a TextValue (wrapped)
//   - a TextLiteral (wrapped via textValue)
//   - a plain string (wrapped via textValue → simpleLiteral; xsd:string)
// The widened input avoids three-layer call sites like
//   textDefaultValue(textValue(simpleLiteral('Hello')))
// for the common case where xsd:string is what's intended.
export function textDefaultValue(
  input: TextDefaultValue | TextValue | TextLiteral | string,
): TextDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'TextDefaultValue') {
    return input;
  }
  return {
    kind: 'TextDefaultValue',
    value: isTextValue(input) ? input : textValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedTextField {
  readonly kind: 'EmbeddedTextField';
  readonly key: string;
  readonly reference: TextFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: TextDefaultValue;
}

export interface EmbeddedTextFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: TextFieldReference | TextField;
  readonly defaultValue?: TextDefaultValue | TextValue | TextLiteral | string;
}

export function embeddedTextField(init: EmbeddedTextFieldInit): EmbeddedTextField {
  const out: EmbeddedTextField = {
    ...assembleCommon(init),
    kind: 'EmbeddedTextField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: textDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
