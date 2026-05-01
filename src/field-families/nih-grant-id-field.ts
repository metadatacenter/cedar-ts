// =====================================================================
// NihGrantId field family — NIH grant identifier
// =====================================================================
//
// This file is the complete vertical slice for the nih-grant-id field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : NihGrantIdFieldId
//   - instance value             : NihGrantIdValue
//   - schema constraints         : NihGrantIdFieldSpec
//   - reusable Field artifact    : NihGrantIdField
//   - default value              : NihGrantIdDefaultValue
//   - Template-embedding wrapper : EmbeddedNihGrantIdField
//
// Wire `kind` values: "NihGrantIdField" (artifact),
// "EmbeddedNihGrantIdField" (embedding).
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

export interface NihGrantIdFieldId {
  readonly kind: 'NihGrantIdFieldId';
  readonly iri: Iri;
}

export type NihGrantIdFieldReference = NihGrantIdFieldId;

export const nihGrantIdFieldId = (
  v: NihGrantIdFieldId | Iri | string,
): NihGrantIdFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as NihGrantIdFieldId;
  }
  return {
    kind: 'NihGrantIdFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface NihGrantIri {
  readonly kind: 'NihGrantIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const nihGrantIri = (v: Iri | string): NihGrantIri =>
  ({ kind: 'NihGrantIri', value: wrapIri(v) });

export interface NihGrantIdValue {
  readonly kind: 'NihGrantIdValue';
  readonly iri: NihGrantIri;
  readonly label?: string;
}

function toNihGrantIri(v: NihGrantIri | Iri | string): NihGrantIri {
  if (isTaggedKind(v, 'NihGrantIri')) return v as NihGrantIri;
  return nihGrantIri(v as Iri | string);
}

export const nihGrantIdValue = (input: AuthorityValueInput<NihGrantIri>): NihGrantIdValue =>
  authorityValueFromInput('NihGrantIdValue', toNihGrantIri, input);

export const isNihGrantIdValue = (x: unknown): x is NihGrantIdValue =>
  isTaggedKind(x, 'NihGrantIdValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface NihGrantIdFieldSpec { readonly kind: 'NihGrantIdFieldSpec'; }

export const nihGrantIdFieldSpec = (): NihGrantIdFieldSpec =>
  ({ kind: 'NihGrantIdFieldSpec' });

export const isNihGrantIdFieldSpec = (x: unknown): x is NihGrantIdFieldSpec =>
  isTaggedKind(x, 'NihGrantIdFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface NihGrantIdField {
  readonly kind: 'NihGrantIdField';
  readonly id: NihGrantIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}

export interface NihGrantIdFieldInit {
  readonly id: NihGrantIdFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}

export const nihGrantIdField = (init: NihGrantIdFieldInit): NihGrantIdField =>
  ({
    kind: 'NihGrantIdField',
    id: nihGrantIdFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface NihGrantIdDefaultValue {
  readonly kind: 'NihGrantIdDefaultValue';
  readonly value: NihGrantIdValue;
}
export function nihGrantIdDefaultValue(
  input: NihGrantIdDefaultValue | AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>,
): NihGrantIdDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'NihGrantIdDefaultValue') {
    return input;
  }
  return {
    kind: 'NihGrantIdDefaultValue',
    value: isNihGrantIdValue(input) ? input : nihGrantIdValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedNihGrantIdField {
  readonly kind: 'EmbeddedNihGrantIdField';
  readonly key: string;
  readonly reference: NihGrantIdFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: NihGrantIdDefaultValue;
}

export interface EmbeddedNihGrantIdFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: NihGrantIdFieldReference | NihGrantIdField;
  readonly defaultValue?:
    | NihGrantIdDefaultValue
    | AuthorityDefaultValueInput<NihGrantIri, NihGrantIdValue>;
}

export function embeddedNihGrantIdField(
  init: EmbeddedNihGrantIdFieldInit,
): EmbeddedNihGrantIdField {
  const out: EmbeddedNihGrantIdField = {
    ...assembleCommon(init),
    kind: 'EmbeddedNihGrantIdField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: nihGrantIdDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
