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

export interface PhoneNumberFieldId {
  readonly kind: 'PhoneNumberFieldId';
  readonly iri: Iri;
}

export type PhoneNumberFieldReference = PhoneNumberFieldId;

export const phoneNumberFieldId = (
  v: PhoneNumberFieldId | Iri | string,
): PhoneNumberFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as PhoneNumberFieldId;
  }
  return {
    kind: 'PhoneNumberFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface PhoneNumberValue {
  readonly kind: 'PhoneNumberValue';
  readonly literal: SimpleLiteral;
}

export function phoneNumberValue(literal: SimpleLiteral | string): PhoneNumberValue {
  return {
    kind: 'PhoneNumberValue',
    literal: typeof literal === 'string' ? simpleLiteral(literal) : literal,
  };
}

export function isPhoneNumberValue(x: unknown): x is PhoneNumberValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'PhoneNumberValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface PhoneNumberFieldSpec {
  readonly kind: 'PhoneNumberFieldSpec';
}
export const phoneNumberFieldSpec = (): PhoneNumberFieldSpec =>
  ({ kind: 'PhoneNumberFieldSpec' });
export const isPhoneNumberFieldSpec = (x: unknown): x is PhoneNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'PhoneNumberFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface PhoneNumberField {
  readonly kind: 'PhoneNumberField';
  readonly id: PhoneNumberFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export interface PhoneNumberFieldInit {
  readonly id: PhoneNumberFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export const phoneNumberField = (init: PhoneNumberFieldInit): PhoneNumberField =>
  ({
    kind: 'PhoneNumberField',
    id: phoneNumberFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface PhoneNumberDefaultValue {
  readonly kind: 'PhoneNumberDefaultValue';
  readonly value: PhoneNumberValue;
}
export function phoneNumberDefaultValue(
  input: PhoneNumberDefaultValue | PhoneNumberValue | SimpleLiteral | string,
): PhoneNumberDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'PhoneNumberDefaultValue') {
    return input;
  }
  return {
    kind: 'PhoneNumberDefaultValue',
    value: isPhoneNumberValue(input) ? input : phoneNumberValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedPhoneNumberField {
  readonly kind: 'EmbeddedPhoneNumberField';
  readonly key: string;
  readonly reference: PhoneNumberFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: PhoneNumberDefaultValue;
}

export interface EmbeddedPhoneNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: PhoneNumberFieldReference | PhoneNumberField;
  readonly defaultValue?:
    | PhoneNumberDefaultValue
    | PhoneNumberValue
    | SimpleLiteral
    | string;
}

export function embeddedPhoneNumberField(
  init: EmbeddedPhoneNumberFieldInit,
): EmbeddedPhoneNumberField {
  const out: EmbeddedPhoneNumberField = {
    ...assembleCommon(init),
    kind: 'EmbeddedPhoneNumberField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: phoneNumberDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
