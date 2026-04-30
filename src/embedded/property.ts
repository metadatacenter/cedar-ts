import { type Iri, iri } from '../leaves/index.js';

// Property — see grammar.md §Properties.
// Associates a semantic property IRI with an EmbeddedField or EmbeddedTemplate
// within a specific Template. Distinct from the intrinsic metadata of the
// referenced artifact: the same reusable artifact may be embedded under
// different property IRIs in different templates.

export interface Property {
  readonly iri: Iri;
  readonly label?: string;
}

export interface PropertyInit {
  readonly iri: Iri | string;
  readonly label?: string;
}

// All input shapes accepted by property(). The bare-string and bare-Iri forms
// cover the common case where only an IRI matters; the init object (which is
// also the structural shape of Property) adds an optional label.
export type PropertyInput = string | Iri | PropertyInit;

// A bare string or Iri is treated as the property IRI with no label. An init
// object (which has the same structural shape as Property itself) carries an
// optional label, so passing an existing Property is a no-op-equivalent.
export function property(input: PropertyInput): Property {
  if (typeof input === 'string') {
    return { iri: iri(input) };
  }
  // An Iri carries `kind: 'Iri'` (and a `value` rather than an `iri` property);
  // a PropertyInit / Property exposes an `iri` property.
  if ('iri' in input) {
    const out: { iri: Iri; label?: string } = {
      iri: typeof input.iri === 'string' ? iri(input.iri) : input.iri,
    };
    if (input.label !== undefined) out.label = input.label;
    return out;
  }
  // Bare Iri
  return { iri: input };
}
