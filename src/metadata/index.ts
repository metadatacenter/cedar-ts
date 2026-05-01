// =====================================================================
// Metadata — public surface for artifact-level metadata types
// =====================================================================
//
// Re-exports:
//
//   - DescriptiveMetadata           (descriptive-metadata.ts):
//       human-oriented descriptive properties (name, description,
//       identifier, preferredLabel, altLabels)
//   - TemporalProvenance            (temporal-provenance.ts):
//       creation and modification timestamps and agents
//   - SchemaVersioning + Status     (schema-versioning.ts):
//       artifact version, lifecycle status, model version
//   - Annotation + AnnotationValue  (annotations.ts):
//       arbitrary RDF-flavored annotations on an artifact
//   - ArtifactMetadata              (artifact-metadata.ts):
//       the bundle (descriptive + provenance + annotations) carried
//       by every Artifact except those that need versioning too
//   - SchemaArtifactMetadata        (artifact-metadata.ts):
//       ArtifactMetadata + SchemaVersioning, carried by reusable
//       schema artifacts (Field and Template)

export {
  type DescriptiveMetadata,
  type DescriptiveMetadataInit,
  descriptiveMetadata,
} from './descriptive-metadata.js';

export {
  type TemporalProvenance,
  type TemporalProvenanceInit,
  temporalProvenance,
} from './temporal-provenance.js';

export {
  type Status,
  STATUSES,
  isStatus,
  type SchemaVersioning,
  type SchemaVersioningInit,
  schemaVersioning,
} from './schema-versioning.js';

export {
  type AnnotationValue,
  isAnnotationValue,
  type Annotation,
  annotation,
} from './annotations.js';

export {
  type ArtifactMetadata,
  type ArtifactMetadataInit,
  artifactMetadata,
  type SchemaArtifactMetadata,
  type SchemaArtifactMetadataInit,
  schemaArtifactMetadata,
} from './artifact-metadata.js';
