// =====================================================================
// presentation — wire-form serialize/parse for the five
// PresentationComponent variants and the PresentationComponent union
// dispatcher.
// =====================================================================
//
// Wire form (wire-grammar.md §11):
//
//   RichTextComponent      ::: { kind, id, metadata, html }
//   ImageComponent         ::: { kind, id, metadata, image }
//   YoutubeVideoComponent  ::: { kind, id, metadata, video }
//   SectionBreakComponent  ::: { kind, id, metadata }
//   PageBreakComponent     ::: { kind, id, metadata }
//
// `kind` is on the wire (polymorphic-only rule). `id` is the bare IRI
// string (PresentationComponentId collapses on the wire).

import { CedarConstructionError } from '../leaves/index.js';
import {
  type RichTextComponent,
  type ImageComponent,
  type YoutubeVideoComponent,
  type SectionBreakComponent,
  type PageBreakComponent,
  type PresentationComponent,
  richTextComponent,
  imageComponent,
  youtubeVideoComponent,
  sectionBreakComponent,
  pageBreakComponent,
} from '../presentation/index.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
} from './parse-utils.js';
import {
  serializePresentationComponentId,
  parsePresentationComponentId,
} from './collapsed-wrappers.js';
import {
  serializeArtifactMetadata,
  parseArtifactMetadata,
} from './metadata.js';

// ---- RichTextComponent ----------------------------------------------

export function serializeRichTextComponent(x: RichTextComponent): unknown {
  return {
    kind: 'RichTextComponent',
    id: serializePresentationComponentId(x.id),
    metadata: serializeArtifactMetadata(x.metadata),
    html: x.html,
  };
}

export function parseRichTextComponent(
  x: unknown,
  where = 'RichTextComponent',
): RichTextComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata', 'html']);
  if (o['kind'] !== 'RichTextComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "RichTextComponent"`,
    );
  }
  for (const k of ['id', 'metadata', 'html']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  return richTextComponent({
    id: parsePresentationComponentId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
    html: expectString(o['html'], `${where}.html`),
  });
}

// ---- ImageComponent --------------------------------------------------

export function serializeImageComponent(x: ImageComponent): unknown {
  return {
    kind: 'ImageComponent',
    id: serializePresentationComponentId(x.id),
    metadata: serializeArtifactMetadata(x.metadata),
    image: x.image.value,
  };
}

export function parseImageComponent(
  x: unknown,
  where = 'ImageComponent',
): ImageComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata', 'image']);
  if (o['kind'] !== 'ImageComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "ImageComponent"`,
    );
  }
  for (const k of ['id', 'metadata', 'image']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  return imageComponent({
    id: parsePresentationComponentId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
    image: expectString(o['image'], `${where}.image`),
  });
}

// ---- YoutubeVideoComponent -------------------------------------------

export function serializeYoutubeVideoComponent(
  x: YoutubeVideoComponent,
): unknown {
  return {
    kind: 'YoutubeVideoComponent',
    id: serializePresentationComponentId(x.id),
    metadata: serializeArtifactMetadata(x.metadata),
    video: x.video.value,
  };
}

export function parseYoutubeVideoComponent(
  x: unknown,
  where = 'YoutubeVideoComponent',
): YoutubeVideoComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata', 'video']);
  if (o['kind'] !== 'YoutubeVideoComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "YoutubeVideoComponent"`,
    );
  }
  for (const k of ['id', 'metadata', 'video']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  return youtubeVideoComponent({
    id: parsePresentationComponentId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
    video: expectString(o['video'], `${where}.video`),
  });
}

// ---- SectionBreakComponent / PageBreakComponent ----------------------

export function serializeSectionBreakComponent(
  x: SectionBreakComponent,
): unknown {
  return {
    kind: 'SectionBreakComponent',
    id: serializePresentationComponentId(x.id),
    metadata: serializeArtifactMetadata(x.metadata),
  };
}

export function parseSectionBreakComponent(
  x: unknown,
  where = 'SectionBreakComponent',
): SectionBreakComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata']);
  if (o['kind'] !== 'SectionBreakComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "SectionBreakComponent"`,
    );
  }
  for (const k of ['id', 'metadata']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  return sectionBreakComponent({
    id: parsePresentationComponentId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
  });
}

export function serializePageBreakComponent(x: PageBreakComponent): unknown {
  return {
    kind: 'PageBreakComponent',
    id: serializePresentationComponentId(x.id),
    metadata: serializeArtifactMetadata(x.metadata),
  };
}

export function parsePageBreakComponent(
  x: unknown,
  where = 'PageBreakComponent',
): PageBreakComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'metadata']);
  if (o['kind'] !== 'PageBreakComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "PageBreakComponent"`,
    );
  }
  for (const k of ['id', 'metadata']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  return pageBreakComponent({
    id: parsePresentationComponentId(o['id'], `${where}.id`),
    metadata: parseArtifactMetadata(o['metadata'], `${where}.metadata`),
  });
}

// ---- PresentationComponent union dispatcher --------------------------

const PRESENTATION_COMPONENT_KINDS = [
  'RichTextComponent',
  'ImageComponent',
  'YoutubeVideoComponent',
  'SectionBreakComponent',
  'PageBreakComponent',
] as const;

export function serializePresentationComponent(
  x: PresentationComponent,
): unknown {
  switch (x.kind) {
    case 'RichTextComponent':
      return serializeRichTextComponent(x);
    case 'ImageComponent':
      return serializeImageComponent(x);
    case 'YoutubeVideoComponent':
      return serializeYoutubeVideoComponent(x);
    case 'SectionBreakComponent':
      return serializeSectionBreakComponent(x);
    case 'PageBreakComponent':
      return serializePageBreakComponent(x);
  }
}

export function parsePresentationComponent(
  x: unknown,
  where = 'PresentationComponent',
): PresentationComponent {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, PRESENTATION_COMPONENT_KINDS, where);
  switch (k) {
    case 'RichTextComponent':
      return parseRichTextComponent(x, where);
    case 'ImageComponent':
      return parseImageComponent(x, where);
    case 'YoutubeVideoComponent':
      return parseYoutubeVideoComponent(x, where);
    case 'SectionBreakComponent':
      return parseSectionBreakComponent(x, where);
    case 'PageBreakComponent':
      return parsePageBreakComponent(x, where);
  }
}
