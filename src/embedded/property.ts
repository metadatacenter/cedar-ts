import { type Iri, iri } from '../leaves/index.js';

// Property — see grammar.md §Properties.
// Associates a semantic property IRI with an EmbeddedField or EmbeddedTemplate
// within a specific Template. Distinct from the intrinsic metadata of the
// referenced artifact: the same reusable artifact may be embedded under
// different property IRIs in different templates.
//
// PropertyLabel is a plain string per the descriptive-metadata rule; PropertyIri
// uses the existing Iri leaf, which is the universal carrier of IRI semantics.

export interface Property {
  readonly kind: 'property';
  readonly propertyIri: Iri;
  readonly propertyLabel?: string;
}

export interface PropertyInit {
  readonly propertyIri: Iri | string;
  readonly propertyLabel?: string;
}

// All input shapes accepted by property(). The bare-string and bare-Iri forms
// cover the common case where only an IRI matters; the init object adds an
// optional label; an existing Property passes through unchanged.
export type PropertyInput = string | Iri | PropertyInit | Property;

// Idempotent: an existing Property passes through unchanged. A bare string or
// Iri is treated as the propertyIri with no label. An init object carries an
// optional propertyLabel.
export function property(input: PropertyInput): Property {
  if (typeof input === 'string') {
    return { kind: 'property', propertyIri: iri(input) };
  }
  if ('kind' in input) {
    // Iri or Property
    if (input.kind === 'property') return input;
    return { kind: 'property', propertyIri: input };
  }
  // PropertyInit
  const out: { kind: 'property'; propertyIri: Iri; propertyLabel?: string } = {
    kind: 'property',
    propertyIri:
      typeof input.propertyIri === 'string' ? iri(input.propertyIri) : input.propertyIri,
  };
  if (input.propertyLabel !== undefined) out.propertyLabel = input.propertyLabel;
  return out;
}

export const isProperty = (x: unknown): x is Property =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'property';
