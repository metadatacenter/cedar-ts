// =====================================================================
// Email field family — email address (RFC 5321 / 5322 lexical form)
// =====================================================================
//
// This file is the complete vertical slice for the email field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : EmailFieldId
//   - instance value             : EmailValue
//   - schema constraints         : EmailFieldSpec
//   - reusable Field artifact    : EmailField
//   - Template-embedding wrapper : EmbeddedEmailField
//
// Wire `kind` values: "EmailField" (artifact), "EmbeddedEmailField"
// (embedding).

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

// Identifier for a `EmailField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `EmailField`'s IRI where (say) a
// `NumericField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface EmailFieldId {
  readonly kind: 'EmailFieldId';
  readonly iri: Iri;
}

export type EmailFieldReference = EmailFieldId;

// Identifier-wrapper constructor for the Email field family.
// Idempotent: an existing EmailFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The EmailFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const emailFieldId = (
  v: EmailFieldId | Iri | string,
): EmailFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'EmailFieldId') {
    return v as EmailFieldId;
  }
  return {
    kind: 'EmailFieldId',
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
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export interface EmailFieldInit {
  readonly id: EmailFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export const emailField = (init: EmailFieldInit): EmailField =>
  ({
    kind: 'EmailField',
    id: emailFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
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
  readonly defaultValue?: SimpleLiteral;
}

// `defaultValue` accepts a SimpleLiteral or a plain string (the email
// lexical form, wrapped via simpleLiteral).
export interface EmbeddedEmailFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: EmailFieldReference | EmailField;
  readonly defaultValue?: SimpleLiteral | string;
}

export function embeddedEmailField(init: EmbeddedEmailFieldInit): EmbeddedEmailField {
  const out: EmbeddedEmailField = {
    ...assembleCommon(init),
    kind: 'EmbeddedEmailField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? simpleLiteral(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
