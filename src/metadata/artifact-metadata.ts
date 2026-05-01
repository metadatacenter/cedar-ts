import type { DescriptiveMetadata } from './descriptive-metadata.js';
import type { TemporalProvenance } from './temporal-provenance.js';
import type { SchemaVersioning } from './schema-versioning.js';
import type { Annotation } from './annotations.js';

// ArtifactMetadata bundles the metadata common to all artifacts other than
// identity (grammar §Aggregate Structure).
export interface ArtifactMetadata {
  readonly descriptiveMetadata: DescriptiveMetadata;
  readonly provenance: TemporalProvenance;
  readonly annotations: readonly Annotation[];
}

export interface ArtifactMetadataInit {
  readonly descriptiveMetadata: DescriptiveMetadata;
  readonly provenance: TemporalProvenance;
  readonly annotations?: readonly Annotation[];
}

export function artifactMetadata(init: ArtifactMetadataInit): ArtifactMetadata {
  return {
    descriptiveMetadata: init.descriptiveMetadata,
    provenance: init.provenance,
    annotations: init.annotations ?? [],
  };
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
