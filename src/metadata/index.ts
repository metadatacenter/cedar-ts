// =====================================================================
// Metadata — public surface for artifact-level metadata types
// =====================================================================
//
// Re-exports:
//
//   - LifecycleMetadata             (lifecycle-metadata.ts):
//       creation and modification timestamps and agents
//   - SchemaArtifactVersioning + Status     (schema-artifact-versioning.ts):
//       artifact version, lifecycle status, model version
//   - Annotation + AnnotationValue  (annotations.ts):
//       arbitrary RDF-flavored annotations on an artifact
//   - ArtifactMetadata              (artifact-metadata.ts):
//       the bundle (descriptive properties + lifecycle + annotations)
//       carried by every Artifact except those that need versioning too
//   - SchemaArtifactMetadata        (artifact-metadata.ts):
//       ArtifactMetadata + SchemaArtifactVersioning, carried by reusable
//       schema artifacts (Field and Template)

export {
  type LifecycleMetadata,
  type LifecycleMetadataInit,
  lifecycleMetadata,
} from './lifecycle-metadata.js';

export {
  type Status,
  STATUSES,
  isStatus,
  type SchemaArtifactVersioning,
  type SchemaArtifactVersioningInit,
  schemaArtifactVersioning,
} from './schema-artifact-versioning.js';

export {
  type AnnotationStringValue,
  annotationStringValue,
  isAnnotationStringValue,
  type AnnotationIriValue,
  annotationIriValue,
  isAnnotationIriValue,
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
