import { type Iri, iri } from '../leaves/index.js';
import type { ArtifactMetadata } from '../metadata/index.js';
import type { PresentationComponentId } from '../identity.js';

// PresentationComponent contributes presentational or instructional structure
// to a rendered template without producing instance data. Five concrete
// variants per grammar §Presentation Components.

export interface RichTextComponent {
  readonly kind: 'rich_text_component';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  // HtmlContent — the permitted feature set and any sanitization requirements
  // are out of scope for the abstract specification.
  readonly htmlContent: string;
}

export interface RichTextComponentInit {
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly htmlContent: string;
}

export const richTextComponent = (init: RichTextComponentInit): RichTextComponent => ({
  kind: 'rich_text_component',
  ...init,
});

export interface ImageComponent {
  readonly kind: 'image_component';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly imageSource: Iri;
}

export interface ImageComponentInit {
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly imageSource: Iri | string;
}

export function imageComponent(init: ImageComponentInit): ImageComponent {
  return {
    kind: 'image_component',
    id: init.id,
    metadata: init.metadata,
    imageSource:
      typeof init.imageSource === 'string' ? iri(init.imageSource) : init.imageSource,
  };
}

export interface YoutubeVideoComponent {
  readonly kind: 'youtube_video_component';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly youtubeVideoSource: Iri;
}

export interface YoutubeVideoComponentInit {
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly youtubeVideoSource: Iri | string;
}

export function youtubeVideoComponent(
  init: YoutubeVideoComponentInit,
): YoutubeVideoComponent {
  return {
    kind: 'youtube_video_component',
    id: init.id,
    metadata: init.metadata,
    youtubeVideoSource:
      typeof init.youtubeVideoSource === 'string'
        ? iri(init.youtubeVideoSource)
        : init.youtubeVideoSource,
  };
}

export interface SectionBreakComponent {
  readonly kind: 'section_break_component';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export interface SectionBreakComponentInit {
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export const sectionBreakComponent = (
  init: SectionBreakComponentInit,
): SectionBreakComponent => ({
  kind: 'section_break_component',
  ...init,
});

export interface PageBreakComponent {
  readonly kind: 'page_break_component';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export interface PageBreakComponentInit {
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export const pageBreakComponent = (
  init: PageBreakComponentInit,
): PageBreakComponent => ({
  kind: 'page_break_component',
  ...init,
});

export type PresentationComponent =
  | RichTextComponent
  | ImageComponent
  | YoutubeVideoComponent
  | SectionBreakComponent
  | PageBreakComponent;

const taggedKind = (x: unknown): unknown =>
  typeof x === 'object' && x !== null ? (x as { kind?: unknown }).kind : undefined;

export const isRichTextComponent = (x: unknown): x is RichTextComponent =>
  taggedKind(x) === 'rich_text_component';
export const isImageComponent = (x: unknown): x is ImageComponent =>
  taggedKind(x) === 'image_component';
export const isYoutubeVideoComponent = (x: unknown): x is YoutubeVideoComponent =>
  taggedKind(x) === 'youtube_video_component';
export const isSectionBreakComponent = (x: unknown): x is SectionBreakComponent =>
  taggedKind(x) === 'section_break_component';
export const isPageBreakComponent = (x: unknown): x is PageBreakComponent =>
  taggedKind(x) === 'page_break_component';

export function isPresentationComponent(x: unknown): x is PresentationComponent {
  const k = taggedKind(x);
  return (
    k === 'rich_text_component' ||
    k === 'image_component' ||
    k === 'youtube_video_component' ||
    k === 'section_break_component' ||
    k === 'page_break_component'
  );
}
