// =====================================================================
// Rrid field family — Research Resource Identifier (RRID)
// =====================================================================
//
// This file is the complete vertical slice for the rrid field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : RridFieldId
//   - instance value             : RridValue
//   - schema constraints         : RridFieldSpec
//   - reusable Field artifact    : RridField
//   - Template-embedding wrapper : EmbeddedRridField
//
// Wire `kind` values: "RridField" (artifact), "EmbeddedRridField"
// (embedding).
//
// One of six external-authority families; shares the value-shape
// pattern (`iri` + optional `label`) via `external-authority-shared.ts`.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type AuthorityValueInput,
  authorityValueFromInput,
  isTaggedKind,
} from './external-authority-shared.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `RridField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `RridField`'s IRI where (say) a
// `NumericField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface RridFieldId {
  readonly kind: 'RridFieldId';
  readonly iri: Iri;
}

export type RridFieldReference = RridFieldId;

// Identifier-wrapper constructor for the Rrid field family.
// Idempotent: an existing RridFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The RridFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const rridFieldId = (
  v: RridFieldId | Iri | string,
): RridFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'RridFieldId') {
    return v as RridFieldId;
  }
  return {
    kind: 'RridFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface RridIri {
  readonly kind: 'RridIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const rridIri = (v: Iri | string): RridIri =>
  ({ kind: 'RridIri', value: wrapIri(v) });

export interface RridValue {
  readonly kind: 'RridValue';
  readonly iri: RridIri;
  readonly label?: string;
}

function toRridIri(v: RridIri | Iri | string): RridIri {
  if (isTaggedKind(v, 'RridIri')) return v as RridIri;
  return rridIri(v as Iri | string);
}

export const rridValue = (input: AuthorityValueInput<RridIri>): RridValue =>
  authorityValueFromInput('RridValue', toRridIri, input);

export const isRridValue = (x: unknown): x is RridValue =>
  isTaggedKind(x, 'RridValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface RridFieldSpec { readonly kind: 'RridFieldSpec'; }

export const rridFieldSpec = (): RridFieldSpec => ({ kind: 'RridFieldSpec' });

export const isRridFieldSpec = (x: unknown): x is RridFieldSpec =>
  isTaggedKind(x, 'RridFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface RridField {
  readonly kind: 'RridField';
  readonly id: RridFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export interface RridFieldInit {
  readonly id: RridFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export const rridField = (init: RridFieldInit): RridField =>
  ({
    kind: 'RridField',
    id: rridFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedRridField {
  readonly kind: 'EmbeddedRridField';
  readonly key: string;
  readonly reference: RridFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: RridValue;
}

export interface EmbeddedRridFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: RridFieldReference | RridField;
  readonly defaultValue?: RridValue | AuthorityValueInput<RridIri>;
}

export function embeddedRridField(init: EmbeddedRridFieldInit): EmbeddedRridField {
  const out: EmbeddedRridField = {
    ...assembleCommon(init),
    kind: 'EmbeddedRridField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: isRridValue(init.defaultValue)
        ? init.defaultValue
        : rridValue(init.defaultValue),
    }),
  };
  return out;
}
