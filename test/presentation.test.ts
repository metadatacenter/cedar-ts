import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  CedarConstructionError,
  descriptiveMetadata,
  imageComponent,
  isImageComponent,
  isPageBreakComponent,
  isPresentationComponent,
  isRichTextComponent,
  isSectionBreakComponent,
  isYoutubeVideoComponent,
  pageBreakComponent,
  presentationComponentId,
  richTextComponent,
  sectionBreakComponent,
  temporalProvenance,
  youtubeVideoComponent,
  type PresentationComponent,
} from '../src/index.js';

const dm = descriptiveMetadata({ name: 'X' });
const tp = temporalProvenance({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = artifactMetadata({ descriptiveMetadata: dm, provenance: tp });
const id = presentationComponentId('https://example.org/pc/1');

describe('PresentationComponent variants', () => {
  it('RichTextComponent carries HTML content', () => {
    const c = richTextComponent({
      id,
      metadata: meta,
      html: '<p>Instructions go here.</p>',
    });
    expect(c.kind).toBe('rich_text_component');
    expect(c.html).toBe('<p>Instructions go here.</p>');
    expect(isRichTextComponent(c)).toBe(true);
    expect(isPresentationComponent(c)).toBe(true);
  });

  it('ImageComponent wraps an Iri image source from a string', () => {
    const c = imageComponent({
      id,
      metadata: meta,
      image: 'https://example.org/img/1.png',
    });
    expect(c.kind).toBe('image_component');
    expect(c.image.value).toBe('https://example.org/img/1.png');
    expect(isImageComponent(c)).toBe(true);
  });

  it('ImageComponent rejects malformed source strings', () => {
    expect(() =>
      imageComponent({ id, metadata: meta, image: 'not an iri' }),
    ).toThrow(CedarConstructionError);
  });

  it('YoutubeVideoComponent wraps an Iri video source', () => {
    const c = youtubeVideoComponent({
      id,
      metadata: meta,
      video: 'https://www.youtube.com/watch?v=abc123',
    });
    expect(c.kind).toBe('youtube_video_component');
    expect(c.video.value).toBe('https://www.youtube.com/watch?v=abc123');
    expect(isYoutubeVideoComponent(c)).toBe(true);
  });

  it('SectionBreakComponent carries only id and metadata', () => {
    const c = sectionBreakComponent({ id, metadata: meta });
    expect(c.kind).toBe('section_break_component');
    expect(isSectionBreakComponent(c)).toBe(true);
  });

  it('PageBreakComponent carries only id and metadata', () => {
    const c = pageBreakComponent({ id, metadata: meta });
    expect(c.kind).toBe('page_break_component');
    expect(isPageBreakComponent(c)).toBe(true);
  });
});

describe('isPresentationComponent', () => {
  it('accepts every concrete variant', () => {
    const variants: PresentationComponent[] = [
      richTextComponent({ id, metadata: meta, html: '' }),
      imageComponent({ id, metadata: meta, image: 'https://example.org/i.png' }),
      youtubeVideoComponent({
        id,
        metadata: meta,
        video: 'https://www.youtube.com/watch?v=x',
      }),
      sectionBreakComponent({ id, metadata: meta }),
      pageBreakComponent({ id, metadata: meta }),
    ];
    for (const c of variants) expect(isPresentationComponent(c)).toBe(true);
  });

  it('rejects non-component objects', () => {
    expect(isPresentationComponent({})).toBe(false);
    expect(isPresentationComponent({ kind: 'not_a_component' })).toBe(false);
    expect(isPresentationComponent(null)).toBe(false);
  });
});
