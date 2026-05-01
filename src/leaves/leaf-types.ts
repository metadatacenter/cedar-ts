import { parseIriString } from './iri-syntax.js';
import { parseBcp47Tag } from './bcp47-syntax.js';
import { parseIso8601DateTimeLexicalForm } from './datetime-syntax.js';

// ----- Iri -----

export interface Iri {
  readonly kind: 'Iri';
  readonly value: string;
}

export function iri(value: string): Iri {
  return { kind: 'Iri', value: parseIriString(value) };
}

export function isIri(x: unknown): x is Iri {
  return typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === 'Iri';
}

// DatatypeIri and TermIri are intentionally just Iri — see grammar.md §Core IRI and String Types.
// They are documented roles, not distinct shapes.
export type DatatypeIri = Iri;
export type TermIri = Iri;

// ----- LanguageTag -----

export interface LanguageTag {
  readonly value: string;
}

export function languageTag(value: string): LanguageTag {
  return { value: parseBcp47Tag(value) };
}

// ----- IsoDateTimeStamp -----

export interface IsoDateTimeStamp {
  readonly value: string;
}

export function isoDateTimeStamp(value: string): IsoDateTimeStamp {
  return {
    value: parseIso8601DateTimeLexicalForm(value),
  };
}
