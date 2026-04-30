import { parseIriString } from './iri.js';
import { parseBcp47Tag } from './lang.js';
import { parseIso8601DateTimeLexicalForm } from './datetime.js';

// ----- Iri -----

export interface Iri {
  readonly kind: 'iri';
  readonly value: string;
}

export function iri(value: string): Iri {
  return { kind: 'iri', value: parseIriString(value) };
}

export function isIri(x: unknown): x is Iri {
  return typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === 'iri';
}

// DatatypeIri and TermIri are intentionally just Iri — see grammar.md §Core IRI and String Types.
// They are documented roles, not distinct shapes.
export type DatatypeIri = Iri;
export type TermIri = Iri;

// ----- LanguageTag -----

export interface LanguageTag {
  readonly kind: 'language_tag';
  readonly value: string;
}

export function languageTag(value: string): LanguageTag {
  return { kind: 'language_tag', value: parseBcp47Tag(value) };
}

// ----- IsoDateTimeStamp -----

export interface IsoDateTimeStamp {
  readonly kind: 'iso_date_time_stamp';
  readonly value: string;
}

export function isoDateTimeStamp(value: string): IsoDateTimeStamp {
  return {
    kind: 'iso_date_time_stamp',
    value: parseIso8601DateTimeLexicalForm(value),
  };
}
