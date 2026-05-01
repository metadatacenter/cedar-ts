import { type Iri, iri } from '../leaves/index.js';
import { type SimpleLiteral, simpleLiteral } from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface EmailFieldId {
  readonly kind: 'FieldId';
  readonly fieldKind: 'Email';
  readonly iri: Iri;
}

export type EmailFieldReference = EmailFieldId;

export const emailFieldId = (
  v: EmailFieldId | Iri | string,
): EmailFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as EmailFieldId;
  }
  return {
    kind: 'FieldId',
    fieldKind: 'Email',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface EmailValue {
  readonly kind: 'EmailValue';
  readonly literal: SimpleLiteral;
}

export function emailValue(literal: SimpleLiteral | string): EmailValue {
  return {
    kind: 'EmailValue',
    literal: typeof literal === 'string' ? simpleLiteral(literal) : literal,
  };
}

export function isEmailValue(x: unknown): x is EmailValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'EmailValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface EmailFieldSpec {
  readonly kind: 'EmailFieldSpec';
}
export const emailFieldSpec = (): EmailFieldSpec => ({ kind: 'EmailFieldSpec' });
export const isEmailFieldSpec = (x: unknown): x is EmailFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmailFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface EmailField {
  readonly kind: 'EmailField';
  readonly id: EmailFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export interface EmailFieldInit {
  readonly id: EmailFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export const emailField = (init: EmailFieldInit): EmailField =>
  ({ kind: 'EmailField', id: emailFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface EmailDefaultValue {
  readonly kind: 'EmailDefaultValue';
  readonly value: EmailValue;
}
// Idempotent. Accepts an EmailDefaultValue, an EmailValue, a SimpleLiteral,
// or a plain string (the email lexical form).
export function emailDefaultValue(
  input: EmailDefaultValue | EmailValue | SimpleLiteral | string,
): EmailDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'EmailDefaultValue') {
    return input;
  }
  return {
    kind: 'EmailDefaultValue',
    value: isEmailValue(input) ? input : emailValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedEmailField {
  readonly kind: 'EmbeddedEmailField';
  readonly key: string;
  readonly reference: EmailFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: EmailDefaultValue;
}

export interface EmbeddedEmailFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: EmailFieldReference | EmailField;
  readonly defaultValue?: EmailDefaultValue | EmailValue | SimpleLiteral | string;
}

export function embeddedEmailField(init: EmbeddedEmailFieldInit): EmbeddedEmailField {
  const out: EmbeddedEmailField = {
    ...assembleCommon(init),
    kind: 'EmbeddedEmailField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: emailDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
