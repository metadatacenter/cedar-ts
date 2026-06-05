import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { LifecycleMetadata } from './lifecycle-metadata.js';
import type { Annotation } from './annotations.js';

// CatalogMetadata bundles the catalog-oriented metadata common to every
// artifact (grammar §Aggregate Structure): descriptive properties
// (preferredLabel, description, identifier, altLabels), lifecycle
// information, and annotations.
//
// CatalogMetadata is distinct from an artifact's *rendered* display
// name. A Field carries a top-level `label` slot (the rendered question
// text); a Template carries a top-level `title` slot (the rendered form
// title); a TemplateInstance MAY carry an optional top-level `label`
// (a user-supplied instance name); a PresentationComponent carries no
// rendered display name at all. These rendered slots are defined on
// the per-artifact types in src/template.ts, the field-family files,
// src/instance.ts, and src/presentation/ respectively.
//
// On schema artifacts (Template, Field), versioning information lives
// in a separate top-level `versioning` slot of type
// SchemaArtifactVersioning, not nested inside CatalogMetadata.
// PresentationComponent and TemplateInstance do not carry versioning.
//
// Per the design rule "brand only leaves that get mixed up at call sites",
// we don't introduce dedicated leaf wrappers per descriptive property; the
// property name preserves the grammar's distinction. `preferredLabel`,
// `description`, and each entry of `altLabels` are MultilingualStrings —
// non-empty sets of language-tagged localizations. `externalSourceId` is a
// plain string: a technical key recording some external or institutional
// system's identifier for this artifact (distinct from the artifact's own
// IRI identity), not human-readable display text.

export interface CatalogMetadata {
  readonly preferredLabel?: MultilingualString;
  readonly description?: MultilingualString;
  readonly externalSourceId?: string;
  readonly altLabels: readonly MultilingualString[];
  readonly lifecycle: LifecycleMetadata;
  readonly annotations: readonly Annotation[];
}

export interface CatalogMetadataInit {
  readonly preferredLabel?: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly externalSourceId?: string;
  readonly altLabels?: readonly MultilingualStringInput[];
  readonly lifecycle: LifecycleMetadata;
  readonly annotations?: readonly Annotation[];
}

export function catalogMetadata(init: CatalogMetadataInit): CatalogMetadata {
  const out: {
    preferredLabel?: MultilingualString;
    description?: MultilingualString;
    externalSourceId?: string;
    altLabels: readonly MultilingualString[];
    lifecycle: LifecycleMetadata;
    annotations: readonly Annotation[];
  } = {
    altLabels: (init.altLabels ?? []).map(multilingualString),
    lifecycle: init.lifecycle,
    annotations: init.annotations ?? [],
  };
  if (init.preferredLabel !== undefined)
    out.preferredLabel = multilingualString(init.preferredLabel);
  if (init.description !== undefined) out.description = multilingualString(init.description);
  if (init.externalSourceId !== undefined)
    out.externalSourceId = init.externalSourceId;
  return out;
}
