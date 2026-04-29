import { type Iri, iri } from '../leaves/index.js';
import { type Literal } from '../literals/index.js';

// AnnotationName carries the IRI identifying the annotated metadata property.
// Modeled as a tagged wrapper because the grammar gives it an explicit
// constructor and downstream code reads `annotation.name.iri.value`.
export interface AnnotationName {
  readonly kind: 'annotation_name';
  readonly iri: Iri;
}

export function annotationName(value: Iri | string): AnnotationName {
  return {
    kind: 'annotation_name',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

// AnnotationValue is one of two forms.

export interface LiteralAnnotationValue {
  readonly kind: 'literal_annotation_value';
  readonly literal: Literal;
}

export function literalAnnotationValue(literal: Literal): LiteralAnnotationValue {
  return { kind: 'literal_annotation_value', literal };
}

export interface IriAnnotationValue {
  readonly kind: 'iri_annotation_value';
  readonly iri: Iri;
}

export function iriAnnotationValue(value: Iri | string): IriAnnotationValue {
  return {
    kind: 'iri_annotation_value',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export type AnnotationValue = LiteralAnnotationValue | IriAnnotationValue;

export function isLiteralAnnotationValue(x: unknown): x is LiteralAnnotationValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'literal_annotation_value'
  );
}
export function isIriAnnotationValue(x: unknown): x is IriAnnotationValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'iri_annotation_value'
  );
}
export function isAnnotationValue(x: unknown): x is AnnotationValue {
  return isLiteralAnnotationValue(x) || isIriAnnotationValue(x);
}

export interface Annotation {
  readonly kind: 'annotation';
  readonly name: AnnotationName;
  readonly value: AnnotationValue;
}

export function annotation(
  name: AnnotationName | Iri | string,
  value: AnnotationValue,
): Annotation {
  let resolvedName: AnnotationName;
  if (typeof name === 'string') {
    resolvedName = annotationName(name);
  } else if ('kind' in name && name.kind === 'annotation_name') {
    resolvedName = name;
  } else {
    resolvedName = annotationName(name);
  }
  return { kind: 'annotation', name: resolvedName, value };
}

export function isAnnotation(x: unknown): x is Annotation {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'annotation'
  );
}
