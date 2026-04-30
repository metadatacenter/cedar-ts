import { type Iri, iri, isIri } from '../leaves/index.js';
import { type Literal, isLiteral } from '../literals/index.js';

// Annotation — see grammar.md §Annotations.
// Pairs an annotation property IRI with an annotation value. The value is
// either a Literal or an IRI; AnnotationValue is the union of those two
// shapes (no wrapper productions).

export type AnnotationValue = Literal | Iri;

export const isAnnotationValue = (x: unknown): x is AnnotationValue =>
  isLiteral(x) || isIri(x);

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
