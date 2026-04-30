import { type Iri, iri } from '../leaves/index.js';

// Property — see grammar.md §Properties.
// Associates a semantic property IRI with an EmbeddedField or EmbeddedTemplate
// within a specific Template. Distinct from the intrinsic metadata of the
// referenced artifact: the same reusable artifact may be embedded under
// different property IRIs in different templates.

export interface Property {
  readonly kind: 'property';
  readonly iri: Iri;
  readonly label?: string;
}

export interface PropertyInit {
  readonly iri: Iri | string;
  readonly label?: string;
}

// All input shapes accepted by property(). The bare-string and bare-Iri forms
// cover the common case where only an IRI matters; the init object adds an
// optional label; an existing Property passes through unchanged.
export type PropertyInput = string | Iri | PropertyInit | Property;

// Idempotent: an existing Property passes through unchanged. A bare string or
// Iri is treated as the IRI with no label. An init object carries an optional
// label.
export function property(input: PropertyInput): Property {
  if (typeof input === 'string') {
    return { kind: 'property', iri: iri(input) };
  }
  if ('kind' in input) {
    // Iri or Property
    if (input.kind === 'property') return input;
    return { kind: 'property', iri: input };
  }
  // PropertyInit
  const out: { kind: 'property'; iri: Iri; label?: string } = {
    kind: 'property',
    iri: typeof input.iri === 'string' ? iri(input.iri) : input.iri,
  };
  if (input.label !== undefined) out.label = input.label;
  return out;
}

export const isProperty = (x: unknown): x is Property =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'property';
