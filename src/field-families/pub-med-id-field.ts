// =====================================================================
// PubMedId field family — PubMed identifier (PMID,
// https://pubmed.ncbi.nlm.nih.gov/... URL form)
// =====================================================================
//
// This file is the complete vertical slice for the pub-med-id field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : PubMedIdFieldId
//   - instance value             : PubMedIdValue
//   - schema constraints         : PubMedIdFieldSpec
//   - reusable Field artifact    : PubMedIdField
//   - default value              : PubMedIdDefaultValue
//   - Template-embedding wrapper : EmbeddedPubMedIdField
//
// Wire `kind` values: "PubMedIdField" (artifact),
// "EmbeddedPubMedIdField" (embedding).
//
// One of six external-authority families; shares the value-shape
// pattern (`iri` + optional `label`) via `external-authority-shared.ts`.

import { type Iri, iri } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type AuthorityValueInput,
  type AuthorityDefaultValueInput,
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

export interface PubMedIdFieldId {
  readonly kind: 'PubMedIdFieldId';
  readonly iri: Iri;
}

export type PubMedIdFieldReference = PubMedIdFieldId;

// Identifier-wrapper constructor for the PubMedId field family.
// Idempotent: an existing PubMedIdFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The PubMedIdFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const pubMedIdFieldId = (
  v: PubMedIdFieldId | Iri | string,
): PubMedIdFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'PubMedIdFieldId') {
    return v as PubMedIdFieldId;
  }
  return {
    kind: 'PubMedIdFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface PubMedIri {
  readonly kind: 'PubMedIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const pubMedIri = (v: Iri | string): PubMedIri =>
  ({ kind: 'PubMedIri', value: wrapIri(v) });

export interface PubMedIdValue {
  readonly kind: 'PubMedIdValue';
  readonly iri: PubMedIri;
  readonly label?: string;
}

function toPubMedIri(v: PubMedIri | Iri | string): PubMedIri {
  if (isTaggedKind(v, 'PubMedIri')) return v as PubMedIri;
  return pubMedIri(v as Iri | string);
}

export const pubMedIdValue = (input: AuthorityValueInput<PubMedIri>): PubMedIdValue =>
  authorityValueFromInput('PubMedIdValue', toPubMedIri, input);

export const isPubMedIdValue = (x: unknown): x is PubMedIdValue =>
  isTaggedKind(x, 'PubMedIdValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface PubMedIdFieldSpec { readonly kind: 'PubMedIdFieldSpec'; }

export const pubMedIdFieldSpec = (): PubMedIdFieldSpec => ({ kind: 'PubMedIdFieldSpec' });

export const isPubMedIdFieldSpec = (x: unknown): x is PubMedIdFieldSpec =>
  isTaggedKind(x, 'PubMedIdFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface PubMedIdField {
  readonly kind: 'PubMedIdField';
  readonly id: PubMedIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}

export interface PubMedIdFieldInit {
  readonly id: PubMedIdFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}

export const pubMedIdField = (init: PubMedIdFieldInit): PubMedIdField =>
  ({
    kind: 'PubMedIdField',
    id: pubMedIdFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface PubMedIdDefaultValue {
  readonly kind: 'PubMedIdDefaultValue';
  readonly value: PubMedIdValue;
}
export function pubMedIdDefaultValue(
  input: PubMedIdDefaultValue | AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>,
): PubMedIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'PubMedIdDefaultValue') {
    return input;
  }
  return {
    kind: 'PubMedIdDefaultValue',
    value: isPubMedIdValue(input) ? input : pubMedIdValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedPubMedIdField {
  readonly kind: 'EmbeddedPubMedIdField';
  readonly key: string;
  readonly reference: PubMedIdFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: PubMedIdDefaultValue;
}

export interface EmbeddedPubMedIdFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: PubMedIdFieldReference | PubMedIdField;
  readonly defaultValue?:
    | PubMedIdDefaultValue
    | AuthorityDefaultValueInput<PubMedIri, PubMedIdValue>;
}

export function embeddedPubMedIdField(
  init: EmbeddedPubMedIdFieldInit,
): EmbeddedPubMedIdField {
  const out: EmbeddedPubMedIdField = {
    ...assembleCommon(init),
    kind: 'EmbeddedPubMedIdField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: pubMedIdDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
