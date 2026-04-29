export {
  type DescriptiveMetadata,
  type DescriptiveMetadataInit,
  descriptiveMetadata,
  isDescriptiveMetadata,
} from './descriptive.js';

export {
  type TemporalProvenance,
  type TemporalProvenanceInit,
  temporalProvenance,
  isTemporalProvenance,
} from './provenance.js';

export {
  type Status,
  STATUSES,
  isStatus,
  type SchemaVersioning,
  type SchemaVersioningInit,
  schemaVersioning,
  isSchemaVersioning,
} from './versioning.js';

export {
  type AnnotationName,
  annotationName,
  type LiteralAnnotationValue,
  literalAnnotationValue,
  type IriAnnotationValue,
  iriAnnotationValue,
  type AnnotationValue,
  isLiteralAnnotationValue,
  isIriAnnotationValue,
  isAnnotationValue,
  type Annotation,
  annotation,
  isAnnotation,
} from './annotations.js';

import type { DescriptiveMetadata } from './descriptive.js';
import type { TemporalProvenance } from './provenance.js';
import type { SchemaVersioning } from './versioning.js';
import type { Annotation } from './annotations.js';

// ArtifactMetadata bundles the metadata common to all artifacts other than
// identity (grammar §Aggregate Structure).
export interface ArtifactMetadata {
  readonly kind: 'artifact_metadata';
  readonly descriptive: DescriptiveMetadata;
  readonly provenance: TemporalProvenance;
  readonly annotations: readonly Annotation[];
}

export interface ArtifactMetadataInit {
  readonly descriptive: DescriptiveMetadata;
  readonly provenance: TemporalProvenance;
  readonly annotations?: readonly Annotation[];
}

export function artifactMetadata(init: ArtifactMetadataInit): ArtifactMetadata {
  return {
    kind: 'artifact_metadata',
    descriptive: init.descriptive,
    provenance: init.provenance,
    annotations: init.annotations ?? [],
  };
}

export function isArtifactMetadata(x: unknown): x is ArtifactMetadata {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'artifact_metadata'
  );
}

// SchemaArtifactMetadata adds versioning information for reusable schema
// artifacts (Template, Field).
export interface SchemaArtifactMetadata {
  readonly kind: 'schema_artifact_metadata';
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
    kind: 'schema_artifact_metadata',
    artifact: init.artifact,
    versioning: init.versioning,
  };
}

export function isSchemaArtifactMetadata(x: unknown): x is SchemaArtifactMetadata {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'schema_artifact_metadata'
  );
}
