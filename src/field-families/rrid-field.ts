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

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import type { RridRenderingHint } from './rendering-hints.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
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
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `RridField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface RridFieldId {
  readonly kind: 'RridFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the Rrid field family.
// Idempotent: an existing RridFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The RridFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
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
  readonly label?: MultilingualString;
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

export interface RridFieldSpec {
  readonly kind: 'RridFieldSpec';
  readonly defaultValue?: RridValue;
  readonly renderingHint?: RridRenderingHint;
  readonly examples?: readonly RridValue[];
}

export interface RridFieldSpecInit {
  readonly defaultValue?: RridValue | AuthorityValueInput<RridIri>;
  readonly renderingHint?: RridRenderingHint;
  readonly examples?: readonly (RridValue | AuthorityValueInput<RridIri> | RridValue)[];
}

export function rridFieldSpec(init?: RridFieldSpecInit): RridFieldSpec {
  const out: { kind: 'RridFieldSpec'; defaultValue?: RridValue;
     renderingHint?: RridRenderingHint;
  } = {
    kind: 'RridFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue = isRridValue(init.defaultValue)
      ? init.defaultValue
      : rridValue(init.defaultValue);
  }
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly RridValue[] }).examples = init.examples.slice() as readonly RridValue[];
  }
  return out;
}

export const isRridFieldSpec = (x: unknown): x is RridFieldSpec =>
  isTaggedKind(x, 'RridFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface RridField {
  readonly kind: 'RridField';
  readonly id: RridFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RridFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface RridFieldInit {
  readonly id: RridFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RridFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const rridField = (init: RridFieldInit): RridField => {
  const out: RridField = {
    kind: 'RridField',
    id: rridFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    prompt: multilingualString(init.prompt),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.recommendedKey !== undefined && {
      recommendedKey: parseAsciiIdentifier(init.recommendedKey),
    }),
    ...(init.recommendedProperty !== undefined && {
      recommendedProperty: property(init.recommendedProperty),
    }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedRridField {
  readonly kind: 'EmbeddedRridField';
  readonly key: string;
  readonly artifactRef: RridFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: RridValue;
}

export interface EmbeddedRridFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: RridFieldId | RridField;
  readonly defaultValue?: RridValue | AuthorityValueInput<RridIri>;
}

export function embeddedRridField(init: EmbeddedRridFieldInit): EmbeddedRridField {
  const out: EmbeddedRridField = {
    ...assembleCommon(init),
    kind: 'EmbeddedRridField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue: isRridValue(init.defaultValue)
        ? init.defaultValue
        : rridValue(init.defaultValue),
    }),
  };
  return out;
}
