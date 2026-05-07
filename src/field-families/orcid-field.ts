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
//   - Template-embedding wrapper : EmbeddedOrcidField
//
// Wire `kind` values: "OrcidField" (artifact), "EmbeddedOrcidField"
// (embedding).
//
// One of six external-authority families; shares the value-shape
// pattern (`iri` + optional `label`) via `external-authority-shared.ts`.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { MultilingualString } from '../multilingual.js';
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

// Identifier for a `OrcidField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `OrcidField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface OrcidFieldId {
  readonly kind: 'OrcidFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the Orcid field family.
// Idempotent: an existing OrcidFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The OrcidFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const orcidFieldId = (
  v: OrcidFieldId | Iri | string,
): OrcidFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'OrcidFieldId') {
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
  readonly label?: MultilingualString;
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
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export interface OrcidFieldInit {
  readonly id: OrcidFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export const orcidField = (init: OrcidFieldInit): OrcidField =>
  ({
    kind: 'OrcidField',
    id: orcidFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedOrcidField {
  readonly kind: 'EmbeddedOrcidField';
  readonly key: string;
  readonly artifactRef: OrcidFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: OrcidValue;
}

// `defaultValue` accepts a fully-built OrcidValue, or any of the
// widened inputs accepted by orcidValue (a bare string IRI, an Iri,
// a typed OrcidIri, or an init object with iri+label).
export interface EmbeddedOrcidFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: OrcidFieldId | OrcidField;
  readonly defaultValue?: OrcidValue | AuthorityValueInput<OrcidIri>;
}

export function embeddedOrcidField(init: EmbeddedOrcidFieldInit): EmbeddedOrcidField {
  const out: EmbeddedOrcidField = {
    ...assembleCommon(init),
    kind: 'EmbeddedOrcidField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue: isOrcidValue(init.defaultValue)
        ? init.defaultValue
        : orcidValue(init.defaultValue),
    }),
  };
  return out;
}
