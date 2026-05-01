// =====================================================================
// Presentation — public surface for presentation components
// =====================================================================
//
// Re-exports the five PresentationComponent variants
// (presentation-components.ts):
//
//   RichTextComponent, ImageComponent, YoutubeVideoComponent,
//   SectionBreakComponent, PageBreakComponent
//
// Plus their constructors, init types, and predicates, and the
// PresentationComponent union.
//
// PresentationComponents are reusable artifacts (each has an IRI
// identity and metadata) but they are NOT SchemaArtifacts — they
// don't carry version / status / model-version. They contribute
// presentational structure to a rendered Template without producing
// instance data.

export {
  type RichTextComponent,
  type RichTextComponentInit,
  richTextComponent,
  type ImageComponent,
  type ImageComponentInit,
  imageComponent,
  type YoutubeVideoComponent,
  type YoutubeVideoComponentInit,
  youtubeVideoComponent,
  type SectionBreakComponent,
  type SectionBreakComponentInit,
  sectionBreakComponent,
  type PageBreakComponent,
  type PageBreakComponentInit,
  pageBreakComponent,
  type PresentationComponent,
  isRichTextComponent,
  isImageComponent,
  isYoutubeVideoComponent,
  isSectionBreakComponent,
  isPageBreakComponent,
  isPresentationComponent,
} from './presentation-components.js';
