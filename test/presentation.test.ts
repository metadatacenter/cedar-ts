import { describe, expect, it } from 'vitest';
import {
  artifactMetadata,
  CedarConstructionError,
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
  lifecycleMetadata,
  youtubeVideoComponent,
  type PresentationComponent,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});
const meta = artifactMetadata({ preferredLabel: 'X', lifecycle: tp });
const id = presentationComponentId('https://example.org/pc/1');
const MV = '2.0.0';

describe('PresentationComponent variants', () => {
  it('RichTextComponent carries HTML content', () => {
    const c = richTextComponent({
      id,
      modelVersion: MV,
      metadata: meta,
      html: '<p>Instructions go here.</p>',
    });
    expect(c.kind).toBe('RichTextComponent');
    expect(c.html).toBe('<p>Instructions go here.</p>');
    expect(isRichTextComponent(c)).toBe(true);
    expect(isPresentationComponent(c)).toBe(true);
  });

  it('ImageComponent wraps an Iri image source from a string', () => {
    const c = imageComponent({
      id,
      modelVersion: MV,
      metadata: meta,
      image: 'https://example.org/img/1.png',
    });
    expect(c.kind).toBe('ImageComponent');
    expect(c.image.value).toBe('https://example.org/img/1.png');
    expect(isImageComponent(c)).toBe(true);
  });

  it('ImageComponent rejects malformed source strings', () => {
    expect(() =>
      imageComponent({ id, modelVersion: MV, metadata: meta, image: 'not an iri' }),
    ).toThrow(CedarConstructionError);
  });

  it('YoutubeVideoComponent wraps an Iri video source', () => {
    const c = youtubeVideoComponent({
      id,
      modelVersion: MV,
      metadata: meta,
      video: 'https://www.youtube.com/watch?v=abc123',
    });
    expect(c.kind).toBe('YoutubeVideoComponent');
    expect(c.video.value).toBe('https://www.youtube.com/watch?v=abc123');
    expect(isYoutubeVideoComponent(c)).toBe(true);
  });

  it('SectionBreakComponent carries only id and metadata', () => {
    const c = sectionBreakComponent({ id, modelVersion: MV, metadata: meta });
    expect(c.kind).toBe('SectionBreakComponent');
    expect(isSectionBreakComponent(c)).toBe(true);
  });

  it('PageBreakComponent carries only id and metadata', () => {
    const c = pageBreakComponent({ id, modelVersion: MV, metadata: meta });
    expect(c.kind).toBe('PageBreakComponent');
    expect(isPageBreakComponent(c)).toBe(true);
  });
});

describe('isPresentationComponent', () => {
  it('accepts every concrete variant', () => {
    const variants: PresentationComponent[] = [
      richTextComponent({ id, modelVersion: MV, metadata: meta, html: '' }),
      imageComponent({ id, modelVersion: MV, metadata: meta, image: 'https://example.org/i.png' }),
      youtubeVideoComponent({
        id,
        modelVersion: MV,
        metadata: meta,
        video: 'https://www.youtube.com/watch?v=x',
      }),
      sectionBreakComponent({ id, modelVersion: MV, metadata: meta }),
      pageBreakComponent({ id, modelVersion: MV, metadata: meta }),
    ];
    for (const c of variants) expect(isPresentationComponent(c)).toBe(true);
  });

  it('rejects non-component objects', () => {
    expect(isPresentationComponent({})).toBe(false);
    expect(isPresentationComponent({ kind: 'not_a_component' })).toBe(false);
    expect(isPresentationComponent(null)).toBe(false);
  });
});
