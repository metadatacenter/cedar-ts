// =====================================================================
// Metadata — public surface for artifact-level metadata types
// =====================================================================
//
// Re-exports:
//
//   - LifecycleMetadata             (lifecycle-metadata.ts):
//       creation and modification timestamps and agents
//   - SchemaArtifactVersioning + Status     (schema-artifact-versioning.ts):
//       artifact version, lifecycle status, model version. Schema artifacts
//       carry this as a top-level slot alongside CatalogMetadata.
//   - Annotation + AnnotationValue  (annotations.ts):
//       arbitrary RDF-flavored annotations on an artifact
//   - CatalogMetadata               (catalog-metadata.ts):
//       the bundle of catalog-oriented descriptive properties +
//       lifecycle + annotations carried by every Artifact

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
  type CatalogMetadata,
  type CatalogMetadataInit,
  catalogMetadata,
} from './catalog-metadata.js';
