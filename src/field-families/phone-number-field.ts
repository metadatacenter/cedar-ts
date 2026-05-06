// =====================================================================
// PhoneNumber field family — phone number (E.164 international format)
// =====================================================================
//
// This file is the complete vertical slice for the phone-number field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : PhoneNumberFieldId
//   - instance value             : PhoneNumberValue
//   - schema constraints         : PhoneNumberFieldSpec
//   - reusable Field artifact    : PhoneNumberField
//   - Template-embedding wrapper : EmbeddedPhoneNumberField
//
// Wire `kind` values: "PhoneNumberField" (artifact),
// "EmbeddedPhoneNumberField" (embedding).

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
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

// Identifier for a `PhoneNumberField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `PhoneNumberField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface PhoneNumberFieldId {
  readonly kind: 'PhoneNumberFieldId';
  readonly iri: Iri;
}

export type PhoneNumberFieldReference = PhoneNumberFieldId;

// Identifier-wrapper constructor for the PhoneNumber field family.
// Idempotent: an existing PhoneNumberFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The PhoneNumberFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
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
  readonly artifactRef: PhoneNumberFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: SimpleLiteral;
}

// `defaultValue` accepts a SimpleLiteral or a plain string (the phone
// lexical form, wrapped via simpleLiteral).
export interface EmbeddedPhoneNumberFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: PhoneNumberFieldReference | PhoneNumberField;
  readonly defaultValue?: SimpleLiteral | string;
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
          ? simpleLiteral(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
