import { CedarConstructionError } from './errors.js';
import { parseIriString } from './iri.js';
import { parseBcp47Tag } from './lang.js';
import { parseIso8601DateTimeLexicalForm } from './datetime.js';
import {
  parseIntegerLexicalForm,
  integerLexicalFormFromNumber,
} from './integer.js';
import { parseAsciiIdentifier } from './ascii-id.js';

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

// ----- NonNegativeInteger -----

export interface NonNegativeInteger {
  readonly kind: 'non_negative_integer';
  readonly value: string;
}

export function nonNegativeInteger(value: number | bigint | string): NonNegativeInteger {
  let lexical: string;
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0) {
      throw new CedarConstructionError(
        `NonNegativeInteger must be a non-negative integer; got ${value}`,
      );
    }
    lexical = integerLexicalFormFromNumber(value);
  } else if (typeof value === 'bigint') {
    if (value < 0n) {
      throw new CedarConstructionError(
        `NonNegativeInteger must be non-negative; got ${value.toString()}`,
      );
    }
    lexical = value.toString(10);
  } else {
    const lf = parseIntegerLexicalForm(value);
    if (lf.startsWith('-')) {
      throw new CedarConstructionError(
        `NonNegativeInteger must be non-negative; got ${value}`,
      );
    }
    lexical = lf;
  }
  return { kind: 'non_negative_integer', value: lexical };
}

export function nonNegativeIntegerToNumber(n: NonNegativeInteger): number {
  return Number.parseInt(n.value, 10);
}

export function nonNegativeIntegerToBigInt(n: NonNegativeInteger): bigint {
  return BigInt(n.value);
}

// ----- KeyIdentifier (used by EmbeddedArtifactKey) -----

export interface KeyIdentifier {
  readonly kind: 'key_identifier';
  readonly value: string;
}

export function keyIdentifier(value: string): KeyIdentifier {
  return { kind: 'key_identifier', value: parseAsciiIdentifier(value) };
}
