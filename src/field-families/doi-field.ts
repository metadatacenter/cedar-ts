// =====================================================================
// Doi field family — Digital Object Identifier (https://doi.org/...
// URL form)
// =====================================================================
//
// This file is the complete vertical slice for the doi field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : DoiFieldId
//   - instance value             : DoiValue
//   - schema constraints         : DoiFieldSpec
//   - reusable Field artifact    : DoiField
//   - Template-embedding wrapper : EmbeddedDoiField
//
// Wire `kind` values: "DoiField" (artifact), "EmbeddedDoiField"
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

// Identifier for a `DoiField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `DoiField`'s IRI where (say) a
// `NumericField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface DoiFieldId {
  readonly kind: 'DoiFieldId';
  readonly iri: Iri;
}

export type DoiFieldReference = DoiFieldId;

// Identifier-wrapper constructor for the Doi field family.
// Idempotent: an existing DoiFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The DoiFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const doiFieldId = (
  v: DoiFieldId | Iri | string,
): DoiFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'DoiFieldId') {
    return v as DoiFieldId;
  }
  return {
    kind: 'DoiFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface DoiIri {
  readonly kind: 'DoiIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const doiIri = (v: Iri | string): DoiIri =>
  ({ kind: 'DoiIri', value: wrapIri(v) });

export interface DoiValue {
  readonly kind: 'DoiValue';
  readonly iri: DoiIri;
  readonly label?: string;
}

function toDoiIri(v: DoiIri | Iri | string): DoiIri {
  if (isTaggedKind(v, 'DoiIri')) return v as DoiIri;
  return doiIri(v as Iri | string);
}

export const doiValue = (input: AuthorityValueInput<DoiIri>): DoiValue =>
  authorityValueFromInput('DoiValue', toDoiIri, input);

export const isDoiValue = (x: unknown): x is DoiValue =>
  isTaggedKind(x, 'DoiValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface DoiFieldSpec { readonly kind: 'DoiFieldSpec'; }

export const doiFieldSpec = (): DoiFieldSpec => ({ kind: 'DoiFieldSpec' });

export const isDoiFieldSpec = (x: unknown): x is DoiFieldSpec =>
  isTaggedKind(x, 'DoiFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DoiField {
  readonly kind: 'DoiField';
  readonly id: DoiFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export interface DoiFieldInit {
  readonly id: DoiFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export const doiField = (init: DoiFieldInit): DoiField =>
  ({
    kind: 'DoiField',
    id: doiFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedDoiField {
  readonly kind: 'EmbeddedDoiField';
  readonly key: string;
  readonly reference: DoiFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: DoiValue;
}

export interface EmbeddedDoiFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DoiFieldReference | DoiField;
  readonly defaultValue?: DoiValue | AuthorityValueInput<DoiIri>;
}

export function embeddedDoiField(init: EmbeddedDoiFieldInit): EmbeddedDoiField {
  const out: EmbeddedDoiField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDoiField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: isDoiValue(init.defaultValue)
        ? init.defaultValue
        : doiValue(init.defaultValue),
    }),
  };
  return out;
}
