import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { LifecycleMetadata } from './lifecycle-metadata.js';
import type { SchemaArtifactVersioning } from './schema-artifact-versioning.js';
import type { Annotation } from './annotations.js';

// ArtifactMetadata bundles the metadata common to all artifacts other than
// identity (grammar §Aggregate Structure). The descriptive properties
// (preferredLabel, description, identifier, altLabels) sit directly
// on ArtifactMetadata; the spec no longer groups them under a separate
// DescriptiveMetadata production.
//
// Per the design rule "brand only leaves that get mixed up at call sites",
// we don't introduce dedicated leaf wrappers per descriptive property; the
// property name preserves the grammar's distinction. `preferredLabel`,
// `description`, and each entry of `altLabels` are MultilingualStrings —
// non-empty sets of language-tagged localizations. `identifier` is a plain
// string (a technical key, not human-readable display text).

export interface ArtifactMetadata {
  readonly preferredLabel: MultilingualString;
  readonly description?: MultilingualString;
  readonly identifier?: string;
  readonly altLabels: readonly MultilingualString[];
  readonly lifecycle: LifecycleMetadata;
  readonly annotations: readonly Annotation[];
}

export interface ArtifactMetadataInit {
  readonly preferredLabel: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly identifier?: string;
  readonly altLabels?: readonly MultilingualStringInput[];
  readonly lifecycle: LifecycleMetadata;
  readonly annotations?: readonly Annotation[];
}

export function artifactMetadata(init: ArtifactMetadataInit): ArtifactMetadata {
  const out: {
    preferredLabel: MultilingualString;
    description?: MultilingualString;
    identifier?: string;
    altLabels: readonly MultilingualString[];
    lifecycle: LifecycleMetadata;
    annotations: readonly Annotation[];
  } = {
    preferredLabel: multilingualString(init.preferredLabel),
    altLabels: (init.altLabels ?? []).map(multilingualString),
    lifecycle: init.lifecycle,
    annotations: init.annotations ?? [],
  };
  if (init.description !== undefined) out.description = multilingualString(init.description);
  if (init.identifier !== undefined) out.identifier = init.identifier;
  return out;
}

// SchemaArtifactMetadata adds versioning information for reusable schema
// artifacts (Template, Field). The in-memory shape is fully flat: the
// `ArtifactMetadata` properties sit directly alongside `versioning`.
export interface SchemaArtifactMetadata extends ArtifactMetadata {
  readonly versioning: SchemaArtifactVersioning;
}

// The init shape composes a pre-built `ArtifactMetadata` with a
// `versioning` slot — call sites typically build an `ArtifactMetadata`
// up front and reuse it across artifacts.
export interface SchemaArtifactMetadataInit {
  readonly artifact: ArtifactMetadata;
  readonly versioning: SchemaArtifactVersioning;
}

export function schemaArtifactMetadata(
  init: SchemaArtifactMetadataInit,
): SchemaArtifactMetadata {
  return {
    ...init.artifact,
    versioning: init.versioning,
  };
}
