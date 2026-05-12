// =====================================================================
// Text field family — plain string content (with optional length /
// regex / single-vs-multi-line constraints)
// =====================================================================
//
// This file is the complete vertical slice for the text field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : TextFieldId
//   - instance value             : TextValue
//   - schema constraints         : TextFieldSpec
//   - reusable Field artifact    : TextField
//   - Template-embedding wrapper : EmbeddedTextField
//
// Wire `kind` values: "TextField" (artifact), "EmbeddedTextField"
// (embedding).
//
// `TextValue` carries its content directly — `value: string` plus
// optional `lang: LanguageTag`. The `defaultValue` slot on
// `EmbeddedTextField` and `TextFieldSpec` is also a `TextValue`.

import {
  type Iri,
  type LanguageTag,
  iri,
  languageTag,
  assertNonNegativeInteger,
  parseSemanticVersion,
} from '../leaves/index.js';
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
  readonly kind: 'TextFieldId';
  readonly iri: Iri;
}


export const textFieldId = (
  v: TextFieldId | Iri | string,
): TextFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'TextFieldId') {
    return v as TextFieldId;
  }
  return {
    kind: 'TextFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface TextValue {
  readonly kind: 'TextValue';
  readonly value: string;
  readonly lang?: LanguageTag;
}

export type TextValueInput = TextValue | string;

// Accepts either a bare string (lang absent), or a pre-built TextValue
// (idempotent passthrough). Pass `lang` explicitly as the second
// argument to attach a BCP 47 language tag.
export function textValue(value: string, lang?: string | LanguageTag): TextValue;
export function textValue(value: TextValue): TextValue;
export function textValue(
  value: TextValue | string,
  lang?: string | LanguageTag,
): TextValue {
  if (typeof value !== 'string') return value;
  if (lang === undefined) return { kind: 'TextValue', value };
  const tag: LanguageTag =
    typeof lang === 'string' ? languageTag(lang) : lang;
  return { kind: 'TextValue', value, lang: tag };
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

export type LangTagRequirement =
  | 'langTagRequired'
  | 'langTagOptional'
  | 'langTagForbidden';
export const LANG_TAG_REQUIREMENTS: readonly LangTagRequirement[] = Object.freeze([
  'langTagRequired',
  'langTagOptional',
  'langTagForbidden',
]);

export interface TextFieldSpec {
  readonly kind: 'TextFieldSpec';
  readonly defaultValue?: TextValue;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly validationRegex?: string;
  readonly langTagRequirement?: LangTagRequirement;
  readonly renderingHint?: TextRenderingHint;
}

export interface TextFieldSpecInit {
  readonly defaultValue?: TextValueInput;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly validationRegex?: string;
  readonly langTagRequirement?: LangTagRequirement;
  readonly renderingHint?: TextRenderingHint;
}

export function textFieldSpec(init: TextFieldSpecInit = {}): TextFieldSpec {
  const out: {
    kind: 'TextFieldSpec';
    defaultValue?: TextValue;
    minLength?: number;
    maxLength?: number;
    validationRegex?: string;
    langTagRequirement?: LangTagRequirement;
    renderingHint?: TextRenderingHint;
  } = { kind: 'TextFieldSpec' };
  if (init.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? textValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init.minLength !== undefined) out.minLength = assertNonNegativeInteger(init.minLength);
  if (init.maxLength !== undefined) out.maxLength = assertNonNegativeInteger(init.maxLength);
  if (init.validationRegex !== undefined) out.validationRegex = init.validationRegex;
  if (init.langTagRequirement !== undefined)
    out.langTagRequirement = init.langTagRequirement;
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
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export interface TextFieldInit {
  readonly id: TextFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export const textField = (init: TextFieldInit): TextField =>
  ({
    kind: 'TextField',
    id: textFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedTextField {
  readonly kind: 'EmbeddedTextField';
  readonly key: string;
  readonly artifactRef: TextFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: TextValue;
}

export interface EmbeddedTextFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: TextFieldId | TextField;
  readonly defaultValue?: TextValueInput;
}

export function embeddedTextField(init: EmbeddedTextFieldInit): EmbeddedTextField {
  const out: EmbeddedTextField = {
    ...assembleCommon(init),
    kind: 'EmbeddedTextField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? textValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
