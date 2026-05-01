import { type Iri, iri } from '../leaves/index.js';
import type { ArtifactMetadata } from '../metadata/index.js';
import { type PresentationComponentId, presentationComponentId } from '../identifiers.js';

// Idempotent: accepts a typed PresentationComponentId, an Iri, or a bare
// string IRI. Used by every component constructor below so callers can pass
// any of the three at the `id` slot.
const toPresentationComponentId = (
  v: PresentationComponentId | Iri | string,
): PresentationComponentId =>
  typeof v !== 'string' && (v as { kind: unknown }).kind === 'PresentationComponentId'
    ? (v as PresentationComponentId)
    : presentationComponentId(v as Iri | string);

// PresentationComponent contributes presentational or instructional structure
// to a rendered template without producing instance data. Five concrete
// variants per grammar §Presentation Components.

export interface RichTextComponent {
  readonly kind: 'RichTextComponent';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  // HtmlContent — the permitted feature set and any sanitization requirements
  // are out of scope for the abstract specification.
  readonly html: string;
}

export interface RichTextComponentInit {
  readonly id: PresentationComponentId | Iri | string;
  readonly metadata: ArtifactMetadata;
  readonly html: string;
}

export const richTextComponent = (init: RichTextComponentInit): RichTextComponent => ({
  kind: 'RichTextComponent',
  id: toPresentationComponentId(init.id),
  metadata: init.metadata,
  html: init.html,
});

export interface ImageComponent {
  readonly kind: 'ImageComponent';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly image: Iri;
}

export interface ImageComponentInit {
  readonly id: PresentationComponentId | Iri | string;
  readonly metadata: ArtifactMetadata;
  readonly image: Iri | string;
}

export function imageComponent(init: ImageComponentInit): ImageComponent {
  return {
    kind: 'ImageComponent',
    id: toPresentationComponentId(init.id),
    metadata: init.metadata,
    image: typeof init.image === 'string' ? iri(init.image) : init.image,
  };
}

export interface YoutubeVideoComponent {
  readonly kind: 'YoutubeVideoComponent';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
  readonly video: Iri;
}

export interface YoutubeVideoComponentInit {
  readonly id: PresentationComponentId | Iri | string;
  readonly metadata: ArtifactMetadata;
  readonly video: Iri | string;
}

export function youtubeVideoComponent(
  init: YoutubeVideoComponentInit,
): YoutubeVideoComponent {
  return {
    kind: 'YoutubeVideoComponent',
    id: toPresentationComponentId(init.id),
    metadata: init.metadata,
    video: typeof init.video === 'string' ? iri(init.video) : init.video,
  };
}

export interface SectionBreakComponent {
  readonly kind: 'SectionBreakComponent';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export interface SectionBreakComponentInit {
  readonly id: PresentationComponentId | Iri | string;
  readonly metadata: ArtifactMetadata;
}

export const sectionBreakComponent = (
  init: SectionBreakComponentInit,
): SectionBreakComponent => ({
  kind: 'SectionBreakComponent',
  id: toPresentationComponentId(init.id),
  metadata: init.metadata,
});

export interface PageBreakComponent {
  readonly kind: 'PageBreakComponent';
  readonly id: PresentationComponentId;
  readonly metadata: ArtifactMetadata;
}

export interface PageBreakComponentInit {
  readonly id: PresentationComponentId | Iri | string;
  readonly metadata: ArtifactMetadata;
}

export const pageBreakComponent = (
  init: PageBreakComponentInit,
): PageBreakComponent => ({
  kind: 'PageBreakComponent',
  id: toPresentationComponentId(init.id),
  metadata: init.metadata,
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
  taggedKind(x) === 'RichTextComponent';
export const isImageComponent = (x: unknown): x is ImageComponent =>
  taggedKind(x) === 'ImageComponent';
export const isYoutubeVideoComponent = (x: unknown): x is YoutubeVideoComponent =>
  taggedKind(x) === 'YoutubeVideoComponent';
export const isSectionBreakComponent = (x: unknown): x is SectionBreakComponent =>
  taggedKind(x) === 'SectionBreakComponent';
export const isPageBreakComponent = (x: unknown): x is PageBreakComponent =>
  taggedKind(x) === 'PageBreakComponent';

export function isPresentationComponent(x: unknown): x is PresentationComponent {
  const k = taggedKind(x);
  return (
    k === 'RichTextComponent' ||
    k === 'ImageComponent' ||
    k === 'YoutubeVideoComponent' ||
    k === 'SectionBreakComponent' ||
    k === 'PageBreakComponent'
  );
}
