// =====================================================================
// cedar-ts — public package surface
// =====================================================================
//
// Top-level barrel: re-exports every public name from the per-layer
// folders. Importing from `'@metadatacenter/cedar-model'` (or
// `'../src/index.js'` from in-repo tests) gives access to the entire
// public API.
//
// Layering, top to bottom:
//
//   - leaves/        : string-syntax validators, datatype IRIs, the
//                      leaf types (Iri, LanguageTag, IsoDateTimeStamp),
//                      CedarConstructionError
//   - multilingual.ts: LangString, MultilingualString and selectors
//   - identifiers.ts : top-level artifact identifiers (TemplateId,
//                      TemplateInstanceId, PresentationComponentId)
//   - metadata/      : descriptive / lifecycle-metadata / schema-versioning /
//                      annotations / artifact-metadata
//   - field-families/: the 20 per-family vertical slices (TextField,
//                      IntegerNumberField, RealNumberField, BooleanField,
//                      …, AttributeValueField), plus the Field,
//                      EmbeddedField, Value, FieldSpec unions. Each Value
//                      type carries its content directly (no Literal layer).
//   - presentation/  : presentation components (RichText / Image /
//                      YoutubeVideo / SectionBreak / PageBreak)
//   - embedded/      : per-embedding configuration (Cardinality,
//                      Property, LabelOverride, ValueRequirement,
//                      Visibility) and the non-field embedded types
//                      (EmbeddedTemplate, EmbeddedPresentationComponent)
//   - template.ts    : Template artifact and the SchemaArtifact union
//   - instances/     : TemplateInstance, FieldValue, NestedTemplateInstance

export * from './leaves/index.js';
export * from './multilingual.js';
export * from './identifiers.js';
export * from './metadata/index.js';
export * from './field-families/index.js';
export * from './presentation/index.js';
export * from './embedded/index.js';
export * from './template.js';
export * from './instances/index.js';
export * from './serialize/index.js';
