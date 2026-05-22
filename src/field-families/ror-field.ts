// =====================================================================
// Ror field family — Research Organization Registry identifier
// (https://ror.org/... URL form)
// =====================================================================
//
// This file is the complete vertical slice for the ror field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : RorFieldId
//   - instance value             : RorValue
//   - schema constraints         : RorFieldSpec
//   - reusable Field artifact    : RorField
//   - Template-embedding wrapper : EmbeddedRorField
//
// Wire `kind` values: "RorField" (artifact), "EmbeddedRorField"
// (embedding).
//
// One of six external-authority families; shares the value-shape
// pattern (`iri` + optional `label`) via `external-authority-shared.ts`.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import type { RorRenderingHint } from './rendering-hints.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
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

// Identifier for a `RorField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `RorField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface RorFieldId {
  readonly kind: 'RorFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the Ror field family.
// Idempotent: an existing RorFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The RorFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const rorFieldId = (
  v: RorFieldId | Iri | string,
): RorFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'RorFieldId') {
    return v as RorFieldId;
  }
  return {
    kind: 'RorFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface RorIri {
  readonly kind: 'RorIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const rorIri = (v: Iri | string): RorIri =>
  ({ kind: 'RorIri', value: wrapIri(v) });

export interface RorValue {
  readonly kind: 'RorValue';
  readonly iri: RorIri;
  readonly label?: MultilingualString;
}

function toRorIri(v: RorIri | Iri | string): RorIri {
  if (isTaggedKind(v, 'RorIri')) return v as RorIri;
  return rorIri(v as Iri | string);
}

export const rorValue = (input: AuthorityValueInput<RorIri>): RorValue =>
  authorityValueFromInput('RorValue', toRorIri, input);

export const isRorValue = (x: unknown): x is RorValue =>
  isTaggedKind(x, 'RorValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface RorFieldSpec {
  readonly kind: 'RorFieldSpec';
  readonly defaultValue?: RorValue;
  readonly renderingHint?: RorRenderingHint;
  readonly examples?: readonly RorValue[];
}

export interface RorFieldSpecInit {
  readonly defaultValue?: RorValue | AuthorityValueInput<RorIri>;
  readonly renderingHint?: RorRenderingHint;
  readonly examples?: readonly (RorValue | AuthorityValueInput<RorIri> | RorValue)[];
}

export function rorFieldSpec(init?: RorFieldSpecInit): RorFieldSpec {
  const out: { kind: 'RorFieldSpec'; defaultValue?: RorValue;
     renderingHint?: RorRenderingHint;
  } = {
    kind: 'RorFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue = isRorValue(init.defaultValue)
      ? init.defaultValue
      : rorValue(init.defaultValue);
  }
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly RorValue[] }).examples = init.examples.slice() as readonly RorValue[];
  }
  return out;
}

export const isRorFieldSpec = (x: unknown): x is RorFieldSpec =>
  isTaggedKind(x, 'RorFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface RorField {
  readonly kind: 'RorField';
  readonly id: RorFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RorFieldSpec;
  readonly label: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export interface RorFieldInit {
  readonly id: RorFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: RorFieldSpec;
  readonly label: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly recommendedKey?: string;
}

export const rorField = (init: RorFieldInit): RorField => {
  const out: RorField = {
    kind: 'RorField',
    id: rorFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    label: multilingualString(init.label),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.recommendedKey !== undefined && {
      recommendedKey: parseAsciiIdentifier(init.recommendedKey),
    }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedRorField {
  readonly kind: 'EmbeddedRorField';
  readonly key: string;
  readonly artifactRef: RorFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: RorValue;
}

export interface EmbeddedRorFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: RorFieldId | RorField;
  readonly defaultValue?: RorValue | AuthorityValueInput<RorIri>;
}

export function embeddedRorField(init: EmbeddedRorFieldInit): EmbeddedRorField {
  const out: EmbeddedRorField = {
    ...assembleCommon(init),
    kind: 'EmbeddedRorField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue: isRorValue(init.defaultValue)
        ? init.defaultValue
        : rorValue(init.defaultValue),
    }),
  };
  return out;
}
