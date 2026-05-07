// =====================================================================
// Enum-shared types — cross-cutting types used by both the
// single-valued-enum and multi-valued-enum field families
// =====================================================================
//
// This file holds:
//
//   - Token — the canonical key of a permissible value or selection.
//   - PermissibleValue — an entry in an EnumFieldSpec's permissible-value
//     list: a Token plus optional human-readable label/description and
//     zero-or-more Meaning entries binding the token to ontology terms.
//   - Meaning — binds a permissible-value token to a TermIri in an
//     external vocabulary, optionally cached with the bound term's
//     human-readable label.
//   - EnumValue — the instance value type produced by enum fields. A
//     plain Token reference into the spec's permissibleValues.

import { type Iri, type TermIri, iri } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// =====================================================================
// Token
// =====================================================================
//
// A Token is the canonical key of a PermissibleValue or EnumValue. It is
// a non-empty Unicode string. This module exposes it as a bare string —
// the wire form is a bare string and the in-memory form follows suit
// (no wrapper object).

export type Token = string;

// =====================================================================
// Meaning
// =====================================================================

export interface Meaning {
  readonly iri: TermIri;
  readonly label?: MultilingualString;
}

export interface MeaningInit {
  readonly iri: TermIri | Iri | string;
  readonly label?: MultilingualStringInput;
}

export function meaning(init: MeaningInit): Meaning {
  const out: { iri: TermIri; label?: MultilingualString } = {
    iri: typeof init.iri === 'string' ? iri(init.iri) : (init.iri as TermIri),
  };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  return out;
}

// =====================================================================
// PermissibleValue
// =====================================================================

export interface PermissibleValue {
  readonly value: Token;
  readonly label?: MultilingualString;
  readonly description?: MultilingualString;
  readonly meanings: readonly Meaning[];
}

export interface PermissibleValueInit {
  readonly value: Token;
  readonly label?: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly meanings?: readonly Meaning[];
}

export function permissibleValue(
  init: PermissibleValueInit,
): PermissibleValue {
  const out: {
    value: Token;
    label?: MultilingualString;
    description?: MultilingualString;
    meanings: readonly Meaning[];
  } = {
    value: init.value,
    meanings: init.meanings ?? [],
  };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  if (init.description !== undefined)
    out.description = multilingualString(init.description);
  return out;
}

// =====================================================================
// EnumValue
// =====================================================================
//
// An EnumValue carries a Token selection from the permissible values
// declared by an EnumFieldSpec. The wire form is `{kind:"EnumValue",
// value: Token}`; the in-memory form mirrors that.

export interface EnumValue {
  readonly kind: 'EnumValue';
  readonly value: Token;
}

export function enumValue(value: Token): EnumValue {
  return { kind: 'EnumValue', value };
}

export function isEnumValue(x: unknown): x is EnumValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'EnumValue'
  );
}
