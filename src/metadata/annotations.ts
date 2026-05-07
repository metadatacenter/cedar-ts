import {
  type Iri,
  type LanguageTag,
  iri,
  languageTag,
} from '../leaves/index.js';

// Annotation — see grammar.md §Annotations.
// Pairs an annotation property IRI with an annotation value. AnnotationValue
// is a discriminated union: AnnotationStringValue | AnnotationIriValue. Both
// variants are kind-tagged objects.

export interface AnnotationStringValue {
  readonly kind: 'AnnotationStringValue';
  readonly value: string;
  readonly lang?: LanguageTag;
}

export function annotationStringValue(
  value: string,
  lang?: string | LanguageTag,
): AnnotationStringValue {
  if (lang === undefined) return { kind: 'AnnotationStringValue', value };
  const tag: LanguageTag = typeof lang === 'string' ? languageTag(lang) : lang;
  return { kind: 'AnnotationStringValue', value, lang: tag };
}

export function isAnnotationStringValue(x: unknown): x is AnnotationStringValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'AnnotationStringValue'
  );
}

export interface AnnotationIriValue {
  readonly kind: 'AnnotationIriValue';
  readonly iri: Iri;
}

export function annotationIriValue(value: Iri | string): AnnotationIriValue {
  return {
    kind: 'AnnotationIriValue',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export function isAnnotationIriValue(x: unknown): x is AnnotationIriValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'AnnotationIriValue'
  );
}

export type AnnotationValue = AnnotationStringValue | AnnotationIriValue;

export const isAnnotationValue = (x: unknown): x is AnnotationValue =>
  isAnnotationStringValue(x) || isAnnotationIriValue(x);

export interface Annotation {
  readonly property: Iri;
  readonly body: AnnotationValue;
}

// Idempotent: a bare string IRI is wrapped via iri(); an existing Iri is used
// as the property. The body is passed through unchanged.
export function annotation(
  property: Iri | string,
  body: AnnotationValue,
): Annotation {
  return {
    property: typeof property === 'string' ? iri(property) : property,
    body,
  };
}
