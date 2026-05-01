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
//   - default value              : RridDefaultValue
//   - Template-embedding wrapper : EmbeddedRridField
//
// Wire `kind` values: "RridField" (artifact), "EmbeddedRridField"
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

export interface RridFieldId {
  readonly kind: 'RridFieldId';
  readonly iri: Iri;
}

export type RridFieldReference = RridFieldId;

export const rridFieldId = (
  v: RridFieldId | Iri | string,
): RridFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
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
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export interface RridFieldInit {
  readonly id: RridFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export const rridField = (init: RridFieldInit): RridField =>
  ({ kind: 'RridField', id: rridFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface RridDefaultValue {
  readonly kind: 'RridDefaultValue';
  readonly value: RridValue;
}
export function rridDefaultValue(
  input: RridDefaultValue | AuthorityDefaultValueInput<RridIri, RridValue>,
): RridDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'RridDefaultValue') {
    return input;
  }
  return {
    kind: 'RridDefaultValue',
    value: isRridValue(input) ? input : rridValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
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
  readonly defaultValue?: RridDefaultValue;
}

export interface EmbeddedRridFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: RridFieldReference | RridField;
  readonly defaultValue?:
    | RridDefaultValue
    | AuthorityDefaultValueInput<RridIri, RridValue>;
}

export function embeddedRridField(init: EmbeddedRridFieldInit): EmbeddedRridField {
  const out: EmbeddedRridField = {
    ...assembleCommon(init),
    kind: 'EmbeddedRridField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: rridDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
