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
//   - default value              : LinkDefaultValue
//   - Template-embedding wrapper : EmbeddedLinkField
//
// Wire `kind` values: "LinkField" (artifact), "EmbeddedLinkField"
// (embedding).

import { type Iri, iri } from '../leaves/index.js';
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

export interface LinkFieldId {
  readonly kind: 'LinkFieldId';
  readonly iri: Iri;
}

export type LinkFieldReference = LinkFieldId;

// Identifier-wrapper constructor for the Link field family.
// Idempotent: an existing LinkFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The LinkFieldId wrapper is distinguished from
// sibling field-id types (e.g. `NumericFieldId`, `EmailFieldId`) by the
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
  readonly label?: string;
}

export interface LinkValueInit {
  readonly iri: Iri | string;
  readonly label?: string;
}

export function linkValue(init: LinkValueInit): LinkValue {
  const out: { kind: 'LinkValue'; iri: Iri; label?: string } = {
    kind: 'LinkValue',
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = init.label;
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

// LinkFieldSpec is a body-less spec at the model level. The kind discriminant
// alone is sufficient; the field's value rules are fixed by the
// FieldSpec-to-Value correspondence.
export interface LinkFieldSpec {
  readonly kind: 'LinkFieldSpec';
}

export const linkFieldSpec = (): LinkFieldSpec => ({ kind: 'LinkFieldSpec' });

export const isLinkFieldSpec = (x: unknown): x is LinkFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'LinkFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface LinkField {
  readonly kind: 'LinkField';
  readonly id: LinkFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}

export interface LinkFieldInit {
  readonly id: LinkFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}

export const linkField = (init: LinkFieldInit): LinkField =>
  ({ kind: 'LinkField', id: linkFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface LinkDefaultValue {
  readonly kind: 'LinkDefaultValue';
  readonly value: LinkValue;
}
export const linkDefaultValue = (value: LinkValue): LinkDefaultValue =>
  ({ kind: 'LinkDefaultValue', value });

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedLinkField {
  readonly kind: 'EmbeddedLinkField';
  readonly key: string;
  readonly reference: LinkFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: LinkDefaultValue;
}

export interface EmbeddedLinkFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: LinkFieldReference | LinkField;
  readonly defaultValue?: LinkDefaultValue;
}

export function embeddedLinkField(init: EmbeddedLinkFieldInit): EmbeddedLinkField {
  const out: EmbeddedLinkField = {
    ...assembleCommon(init),
    kind: 'EmbeddedLinkField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
