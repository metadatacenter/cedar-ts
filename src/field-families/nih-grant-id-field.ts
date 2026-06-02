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
//   - Template-embedding wrapper : EmbeddedNihGrantIdField
//
// Wire `kind` values: "NihGrantIdField" (artifact),
// "EmbeddedNihGrantIdField" (embedding).
//
// One of six external-authority families; shares the value-shape
// pattern (`iri` + optional `label`) via `external-authority-shared.ts`.

import { type Iri, iri, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import type { NihGrantIdRenderingHint } from './rendering-hints.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { Editability } from '../embedded/editability.js';
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

// Identifier for a `NihGrantIdField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `NihGrantIdField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface NihGrantIdFieldId {
  readonly kind: 'NihGrantIdFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the NihGrantId field family.
// Idempotent: an existing NihGrantIdFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The NihGrantIdFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const nihGrantIdFieldId = (
  v: NihGrantIdFieldId | Iri | string,
): NihGrantIdFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'NihGrantIdFieldId') {
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
  readonly label?: MultilingualString;
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

export interface NihGrantIdFieldSpec {
  readonly kind: 'NihGrantIdFieldSpec';
  readonly defaultValue?: NihGrantIdValue;
  readonly renderingHint?: NihGrantIdRenderingHint;
  readonly examples?: readonly NihGrantIdValue[];
}

export interface NihGrantIdFieldSpecInit {
  readonly defaultValue?: NihGrantIdValue | AuthorityValueInput<NihGrantIri>;
  readonly renderingHint?: NihGrantIdRenderingHint;
  readonly examples?: readonly (NihGrantIdValue | AuthorityValueInput<NihGrantIri> | NihGrantIdValue)[];
}

export function nihGrantIdFieldSpec(
  init?: NihGrantIdFieldSpecInit,
): NihGrantIdFieldSpec {
  const out: { kind: 'NihGrantIdFieldSpec'; defaultValue?: NihGrantIdValue;
     renderingHint?: NihGrantIdRenderingHint;
  } = {
    kind: 'NihGrantIdFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue = isNihGrantIdValue(init.defaultValue)
      ? init.defaultValue
      : nihGrantIdValue(init.defaultValue);
  }
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly NihGrantIdValue[] }).examples = init.examples.slice() as readonly NihGrantIdValue[];
  }
  return out;
}

export const isNihGrantIdFieldSpec = (x: unknown): x is NihGrantIdFieldSpec =>
  isTaggedKind(x, 'NihGrantIdFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface NihGrantIdField {
  readonly kind: 'NihGrantIdField';
  readonly id: NihGrantIdFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: NihGrantIdFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface NihGrantIdFieldInit {
  readonly id: NihGrantIdFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: NihGrantIdFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const nihGrantIdField = (init: NihGrantIdFieldInit): NihGrantIdField => {
  const out: NihGrantIdField = {
    kind: 'NihGrantIdField',
    id: nihGrantIdFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    prompt: multilingualString(init.prompt),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.altPrompts !== undefined && {
      altPrompts: assembleAltPrompts(init.altPrompts),
    }),
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

export interface EmbeddedNihGrantIdField {
  readonly kind: 'EmbeddedNihGrantIdField';
  readonly key: string;
  readonly artifactRef: NihGrantIdFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: NihGrantIdValue;
}

export interface EmbeddedNihGrantIdFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: NihGrantIdFieldId | NihGrantIdField;
  readonly defaultValue?: NihGrantIdValue | AuthorityValueInput<NihGrantIri>;
}

export function embeddedNihGrantIdField(
  init: EmbeddedNihGrantIdFieldInit,
): EmbeddedNihGrantIdField {
  const out: EmbeddedNihGrantIdField = {
    ...assembleCommon(init),
    kind: 'EmbeddedNihGrantIdField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue: isNihGrantIdValue(init.defaultValue)
        ? init.defaultValue
        : nihGrantIdValue(init.defaultValue),
    }),
  };
  return out;
}
