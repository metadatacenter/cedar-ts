// =====================================================================
// PhoneNumber field family — phone number (E.164 international format)
// =====================================================================
//
// PhoneNumberValue carries `value: string` directly.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
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


export const phoneNumberFieldId = (
  v: PhoneNumberFieldId | Iri | string,
): PhoneNumberFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'PhoneNumberFieldId') {
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
  readonly value: string;
}

export type PhoneNumberValueInput = PhoneNumberValue | string;

export function phoneNumberValue(value: string): PhoneNumberValue;
export function phoneNumberValue(value: PhoneNumberValue): PhoneNumberValue;
export function phoneNumberValue(value: PhoneNumberValue | string): PhoneNumberValue {
  if (typeof value !== 'string') return value;
  return { kind: 'PhoneNumberValue', value };
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
  readonly defaultValue?: PhoneNumberValue;
}

export interface PhoneNumberFieldSpecInit {
  readonly defaultValue?: PhoneNumberValueInput;
}

export function phoneNumberFieldSpec(
  init?: PhoneNumberFieldSpecInit,
): PhoneNumberFieldSpec {
  const out: { kind: 'PhoneNumberFieldSpec'; defaultValue?: PhoneNumberValue } = {
    kind: 'PhoneNumberFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? phoneNumberValue(init.defaultValue)
        : init.defaultValue;
  }
  return out;
}
export const isPhoneNumberFieldSpec = (x: unknown): x is PhoneNumberFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'PhoneNumberFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface PhoneNumberField {
  readonly kind: 'PhoneNumberField';
  readonly id: PhoneNumberFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export interface PhoneNumberFieldInit {
  readonly id: PhoneNumberFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export const phoneNumberField = (init: PhoneNumberFieldInit): PhoneNumberField =>
  ({
    kind: 'PhoneNumberField',
    id: phoneNumberFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedPhoneNumberField {
  readonly kind: 'EmbeddedPhoneNumberField';
  readonly key: string;
  readonly artifactRef: PhoneNumberFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: PhoneNumberValue;
}

export interface EmbeddedPhoneNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: PhoneNumberFieldId | PhoneNumberField;
  readonly defaultValue?: PhoneNumberValueInput;
}

export function embeddedPhoneNumberField(
  init: EmbeddedPhoneNumberFieldInit,
): EmbeddedPhoneNumberField {
  const out: EmbeddedPhoneNumberField = {
    ...assembleCommon(init),
    kind: 'EmbeddedPhoneNumberField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? phoneNumberValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
