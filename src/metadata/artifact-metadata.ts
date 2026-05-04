import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { TemporalProvenance } from './temporal-provenance.js';
import type { SchemaVersioning } from './schema-versioning.js';
import type { Annotation } from './annotations.js';

// ArtifactMetadata bundles the metadata common to all artifacts other than
// identity (grammar §Aggregate Structure). The descriptive properties
// (name, description, identifier, preferredLabel, altLabels) sit directly
// on ArtifactMetadata; the spec no longer groups them under a separate
// DescriptiveMetadata production.
//
// Per the design rule "brand only leaves that get mixed up at call sites",
// we don't introduce dedicated leaf wrappers per descriptive property; the
// property name preserves the grammar's distinction (between `name`,
// `description`, `preferredLabel`, etc.). `name`, `description`,
// `preferredLabel`, and each entry of `altLabels` are MultilingualStrings —
// non-empty sets of language-tagged localizations. `identifier` is a plain
// string (a technical key, not human-readable display text).

export interface ArtifactMetadata {
  readonly name: MultilingualString;
  readonly description?: MultilingualString;
  readonly identifier?: string;
  readonly preferredLabel?: MultilingualString;
  readonly altLabels: readonly MultilingualString[];
  readonly provenance: TemporalProvenance;
  readonly annotations: readonly Annotation[];
}

export interface ArtifactMetadataInit {
  readonly name: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly identifier?: string;
  readonly preferredLabel?: MultilingualStringInput;
  readonly altLabels?: readonly MultilingualStringInput[];
  readonly provenance: TemporalProvenance;
  readonly annotations?: readonly Annotation[];
}

export function artifactMetadata(init: ArtifactMetadataInit): ArtifactMetadata {
  const out: {
    name: MultilingualString;
    description?: MultilingualString;
    identifier?: string;
    preferredLabel?: MultilingualString;
    altLabels: readonly MultilingualString[];
    provenance: TemporalProvenance;
    annotations: readonly Annotation[];
  } = {
    name: multilingualString(init.name),
    altLabels: (init.altLabels ?? []).map(multilingualString),
    provenance: init.provenance,
    annotations: init.annotations ?? [],
  };
  if (init.description !== undefined) out.description = multilingualString(init.description);
  if (init.identifier !== undefined) out.identifier = init.identifier;
  if (init.preferredLabel !== undefined)
    out.preferredLabel = multilingualString(init.preferredLabel);
  return out;
}

// SchemaArtifactMetadata adds versioning information for reusable schema
// artifacts (Template, Field).
export interface SchemaArtifactMetadata {
  readonly artifact: ArtifactMetadata;
  readonly versioning: SchemaVersioning;
}

export interface SchemaArtifactMetadataInit {
  readonly artifact: ArtifactMetadata;
  readonly versioning: SchemaVersioning;
}

export function schemaArtifactMetadata(
  init: SchemaArtifactMetadataInit,
): SchemaArtifactMetadata {
  return {
    artifact: init.artifact,
    versioning: init.versioning,
  };
}
