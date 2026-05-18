// =====================================================================
// Link field family — hyperlink to an external resource (IRI plus
// optional label)
// =====================================================================
//
// This file is the complete vertical slice for the link field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : LinkFieldId
//   - instance value             : LinkValue
//   - schema constraints         : LinkFieldSpec
//   - reusable Field artifact    : LinkField
//   - Template-embedding wrapper : EmbeddedLinkField
//
// Wire `kind` values: "LinkField" (artifact), "EmbeddedLinkField"
// (embedding).

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { LinkRenderingHint } from './rendering-hints.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `LinkField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `LinkField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface LinkFieldId {
  readonly kind: 'LinkFieldId';
  readonly iri: Iri;
}


// Identifier-wrapper constructor for the Link field family.
// Idempotent: an existing LinkFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The LinkFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
export const linkFieldId = (
  v: LinkFieldId | Iri | string,
): LinkFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'LinkFieldId') {
    return v as LinkFieldId;
  }
  return {
    kind: 'LinkFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface LinkValue {
  readonly kind: 'LinkValue';
  readonly iri: Iri;
  readonly label?: MultilingualString;
}

export interface LinkValueInit {
  readonly iri: Iri | string;
  readonly label?: MultilingualStringInput;
}

export function linkValue(init: LinkValueInit): LinkValue {
  const out: { kind: 'LinkValue'; iri: Iri; label?: MultilingualString } = {
    kind: 'LinkValue',
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  return out;
}

export function isLinkValue(x: unknown): x is LinkValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LinkValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

// LinkFieldSpec carries only an optional defaultValue at the model level.
// The field's value rules are fixed by the FieldSpec-to-Value correspondence.
export interface LinkFieldSpec {
  readonly kind: 'LinkFieldSpec';
  readonly defaultValue?: LinkValue;
  readonly renderingHint?: LinkRenderingHint;
}

export interface LinkFieldSpecInit {
  readonly defaultValue?: LinkValue;
  readonly renderingHint?: LinkRenderingHint;
}

export function linkFieldSpec(init?: LinkFieldSpecInit): LinkFieldSpec {
  const out: { kind: 'LinkFieldSpec'; defaultValue?: LinkValue;
     renderingHint?: LinkRenderingHint;
  } = {
    kind: 'LinkFieldSpec',
  };
  if (init?.defaultValue !== undefined) out.defaultValue = init.defaultValue;
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  return out;
}

export const isLinkFieldSpec = (x: unknown): x is LinkFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LinkFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface LinkField {
  readonly kind: 'LinkField';
  readonly id: LinkFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
  readonly helpText?: MultilingualString;
}

export interface LinkFieldInit {
  readonly id: LinkFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
  readonly helpText?: MultilingualString;
}

export const linkField = (init: LinkFieldInit): LinkField => {
  const out: LinkField = {
    kind: 'LinkField',
    id: linkFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    ...(init.helpText !== undefined && { helpText: init.helpText }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedLinkField {
  readonly kind: 'EmbeddedLinkField';
  readonly key: string;
  readonly artifactRef: LinkFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: LinkValue;
}

export interface EmbeddedLinkFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: LinkFieldId | LinkField;
  readonly defaultValue?: LinkValue;
}

export function embeddedLinkField(init: EmbeddedLinkFieldInit): EmbeddedLinkField {
  const out: EmbeddedLinkField = {
    ...assembleCommon(init),
    kind: 'EmbeddedLinkField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
