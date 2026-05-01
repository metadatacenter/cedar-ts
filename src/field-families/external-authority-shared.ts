// =====================================================================
// External-authority-shared helpers — used by the six external-authority
// field families (Orcid / Ror / Doi / PubMedId / Rrid / NihGrantId)
// =====================================================================
//
// All six external-authority value types share the same structural
// shape: an authoritative IRI plus an optional human-readable label.
// This file holds the common shape-and-construction helpers so the per-
// family files in this folder remain small and parallel.
//
// Holds:
//
//   - WithLabel<Kind, IriType> — the value record shape shared by the
//     six families: `{ kind, iri, label? }`.
//   - authorityValueFromInput — the widening constructor helper (accepts
//     a string IRI, an Iri, or a partial init object).
//   - isTaggedKind — the predicate helper used to build the per-family
//     `isXxxValue` functions.

import type { Iri } from '../leaves/index.js';

// Internal shared helpers for the six external-authority families
// (orcid, ror, doi, pub-med-id, rrid, nih-grant-id). Each family carries
// the same shape: { kind: 'XxxValue'; iri: <typed>; label?: string }.
//
// These helpers centralize the authority-value construction pattern so
// the family files can stay small. They are intentionally not exported
// from the package barrel: they are used only by external-authority
// family files within field-families/.

export interface WithLabel<K extends string, I> {
  readonly kind: K;
  readonly iri: I;
  readonly label?: string;
}

export function makeAuthorityValue<K extends string, I>(
  kind: K,
  iriValue: I,
  label?: string,
): WithLabel<K, I> {
  const out: { kind: K; iri: I; label?: string } = { kind, iri: iriValue };
  if (label !== undefined) out.label = label;
  return out;
}

// Each external-authority value constructor accepts any of:
//   - a bare string IRI                           (no label)
//   - an Iri                                      (no label)
//   - the typed authority-specific IRI            (no label)
//   - an init object { iri, label? }              (with optional label)
// The string / Iri / typed-iri shortcuts cover the very common case where
// only the IRI matters; reach for the init object when a label is needed.
export type AuthorityValueInput<I> =
  | I
  | Iri
  | string
  | { readonly iri: I | Iri | string; readonly label?: string };

export function authorityValueFromInput<K extends string, I extends object>(
  kind: K,
  toTypedIri: (v: I | Iri | string) => I,
  input: AuthorityValueInput<I>,
): WithLabel<K, I> {
  if (typeof input === 'string') {
    return makeAuthorityValue(kind, toTypedIri(input), undefined);
  }
  // Init objects carry an `iri` property; tagged Iri / typed-iri values do not.
  if ('iri' in input) {
    return makeAuthorityValue(kind, toTypedIri(input.iri), input.label);
  }
  return makeAuthorityValue(kind, toTypedIri(input), undefined);
}

export function isTaggedKind<K extends string>(x: unknown, kind: K): boolean {
  return typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === kind;
}

// Permissive input type for each external-authority default-value constructor.
// Matches the corresponding xxxValue() input plus the value type itself, so
// callers can pass a bare string IRI, a tagged Iri / typed-iri, an init object,
// or a fully-built value.
export type AuthorityDefaultValueInput<I extends object, V> =
  | V
  | I
  | Iri
  | string
  | { readonly iri: I | Iri | string; readonly label?: string };
