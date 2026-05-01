// =====================================================================
// Orcid field family — ORCID identifier (https://orcid.org/... URL
// form)
// =====================================================================
//
// This file is the complete vertical slice for the orcid field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : OrcidFieldId
//   - instance value             : OrcidValue
//   - schema constraints         : OrcidFieldSpec
//   - reusable Field artifact    : OrcidField
//   - default value              : OrcidDefaultValue
//   - Template-embedding wrapper : EmbeddedOrcidField
//
// Wire `kind` values: "OrcidField" (artifact), "EmbeddedOrcidField"
// (embedding).
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

export interface OrcidFieldId {
  readonly kind: 'OrcidFieldId';
  readonly iri: Iri;
}

export type OrcidFieldReference = OrcidFieldId;

export const orcidFieldId = (
  v: OrcidFieldId | Iri | string,
): OrcidFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as OrcidFieldId;
  }
  return {
    kind: 'OrcidFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface OrcidIri {
  readonly kind: 'OrcidIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const orcidIri = (v: Iri | string): OrcidIri =>
  ({ kind: 'OrcidIri', value: wrapIri(v) });

export interface OrcidValue {
  readonly kind: 'OrcidValue';
  readonly iri: OrcidIri;
  readonly label?: string;
}

function toOrcidIri(v: OrcidIri | Iri | string): OrcidIri {
  if (isTaggedKind(v, 'OrcidIri')) return v as OrcidIri;
  return orcidIri(v as Iri | string);
}

export const orcidValue = (input: AuthorityValueInput<OrcidIri>): OrcidValue =>
  authorityValueFromInput('OrcidValue', toOrcidIri, input);

export const isOrcidValue = (x: unknown): x is OrcidValue =>
  isTaggedKind(x, 'OrcidValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface OrcidFieldSpec { readonly kind: 'OrcidFieldSpec'; }

export const orcidFieldSpec = (): OrcidFieldSpec => ({ kind: 'OrcidFieldSpec' });

export const isOrcidFieldSpec = (x: unknown): x is OrcidFieldSpec =>
  isTaggedKind(x, 'OrcidFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface OrcidField {
  readonly kind: 'OrcidField';
  readonly id: OrcidFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export interface OrcidFieldInit {
  readonly id: OrcidFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export const orcidField = (init: OrcidFieldInit): OrcidField =>
  ({ kind: 'OrcidField', id: orcidFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface OrcidDefaultValue {
  readonly kind: 'OrcidDefaultValue';
  readonly value: OrcidValue;
}
export function orcidDefaultValue(
  input: OrcidDefaultValue | AuthorityDefaultValueInput<OrcidIri, OrcidValue>,
): OrcidDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'OrcidDefaultValue') {
    return input;
  }
  return {
    kind: 'OrcidDefaultValue',
    value: isOrcidValue(input) ? input : orcidValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedOrcidField {
  readonly kind: 'EmbeddedOrcidField';
  readonly key: string;
  readonly reference: OrcidFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: OrcidDefaultValue;
}

export interface EmbeddedOrcidFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: OrcidFieldReference | OrcidField;
  readonly defaultValue?:
    | OrcidDefaultValue
    | AuthorityDefaultValueInput<OrcidIri, OrcidValue>;
}

export function embeddedOrcidField(init: EmbeddedOrcidFieldInit): EmbeddedOrcidField {
  const out: EmbeddedOrcidField = {
    ...assembleCommon(init),
    kind: 'EmbeddedOrcidField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: orcidDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
