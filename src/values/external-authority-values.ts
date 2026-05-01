import { type Iri, iri } from '../leaves/index.js';

// Typed IRIs for each external authority. Each is a tagged wrapper around an
// Iri; pattern conformance is enforced by Phase 2 of the validation algorithm
// (validate_external_authority_value), not by these constructors.

export interface OrcidIri    { readonly kind: 'OrcidIri';    readonly value: Iri; }
export interface RorIri      { readonly kind: 'RorIri';      readonly value: Iri; }
export interface DoiIri      { readonly kind: 'DoiIri';      readonly value: Iri; }
export interface PubMedIri   { readonly kind: 'PubMedIri';  readonly value: Iri; }
export interface RridIri     { readonly kind: 'RridIri';     readonly value: Iri; }
export interface NihGrantIri { readonly kind: 'NihGrantIri'; readonly value: Iri; }

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const orcidIri    = (v: Iri | string): OrcidIri    => ({ kind: 'OrcidIri',    value: wrapIri(v) });
export const rorIri      = (v: Iri | string): RorIri      => ({ kind: 'RorIri',      value: wrapIri(v) });
export const doiIri      = (v: Iri | string): DoiIri      => ({ kind: 'DoiIri',      value: wrapIri(v) });
export const pubMedIri   = (v: Iri | string): PubMedIri   => ({ kind: 'PubMedIri',  value: wrapIri(v) });
export const rridIri     = (v: Iri | string): RridIri     => ({ kind: 'RridIri',     value: wrapIri(v) });
export const nihGrantIri = (v: Iri | string): NihGrantIri => ({ kind: 'NihGrantIri', value: wrapIri(v) });

// External authority values.

export interface OrcidValue {
  readonly kind: 'OrcidValue';
  readonly iri: OrcidIri;
  readonly label?: string;
}
export interface RorValue {
  readonly kind: 'RorValue';
  readonly iri: RorIri;
  readonly label?: string;
}
export interface DoiValue {
  readonly kind: 'DoiValue';
  readonly iri: DoiIri;
  readonly label?: string;
}
export interface PubMedIdValue {
  readonly kind: 'PubMedIdValue';
  readonly iri: PubMedIri;
  readonly label?: string;
}
export interface RridValue {
  readonly kind: 'RridValue';
  readonly iri: RridIri;
  readonly label?: string;
}
export interface NihGrantIdValue {
  readonly kind: 'NihGrantIdValue';
  readonly iri: NihGrantIri;
  readonly label?: string;
}

export type ExternalAuthorityValue =
  | OrcidValue
  | RorValue
  | DoiValue
  | PubMedIdValue
  | RridValue
  | NihGrantIdValue;

interface WithLabel<K extends string, I> {
  readonly kind: K;
  readonly iri: I;
  readonly label?: string;
}

function makeAuthorityValue<K extends string, I>(
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
type AuthorityValueInput<I> =
  | I
  | Iri
  | string
  | { readonly iri: I | Iri | string; readonly label?: string };

function authorityValueFromInput<K extends string, I extends object>(
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

export const orcidValue = (input: AuthorityValueInput<OrcidIri>): OrcidValue =>
  authorityValueFromInput('OrcidValue', toOrcidIri, input);
export const rorValue = (input: AuthorityValueInput<RorIri>): RorValue =>
  authorityValueFromInput('RorValue', toRorIri, input);
export const doiValue = (input: AuthorityValueInput<DoiIri>): DoiValue =>
  authorityValueFromInput('DoiValue', toDoiIri, input);
export const pubMedIdValue = (input: AuthorityValueInput<PubMedIri>): PubMedIdValue =>
  authorityValueFromInput('PubMedIdValue', toPubMedIri, input);
export const rridValue = (input: AuthorityValueInput<RridIri>): RridValue =>
  authorityValueFromInput('RridValue', toRridIri, input);
export const nihGrantIdValue = (input: AuthorityValueInput<NihGrantIri>): NihGrantIdValue =>
  authorityValueFromInput('NihGrantIdValue', toNihGrantIri, input);

function isTaggedIri<K extends string>(x: unknown, kind: K): boolean {
  return typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === kind;
}

function toOrcidIri(v: OrcidIri | Iri | string): OrcidIri {
  if (isTaggedIri(v, 'OrcidIri')) return v as OrcidIri;
  return orcidIri(v as Iri | string);
}
function toRorIri(v: RorIri | Iri | string): RorIri {
  if (isTaggedIri(v, 'RorIri')) return v as RorIri;
  return rorIri(v as Iri | string);
}
function toDoiIri(v: DoiIri | Iri | string): DoiIri {
  if (isTaggedIri(v, 'DoiIri')) return v as DoiIri;
  return doiIri(v as Iri | string);
}
function toPubMedIri(v: PubMedIri | Iri | string): PubMedIri {
  if (isTaggedIri(v, 'PubMedIri')) return v as PubMedIri;
  return pubMedIri(v as Iri | string);
}
function toRridIri(v: RridIri | Iri | string): RridIri {
  if (isTaggedIri(v, 'RridIri')) return v as RridIri;
  return rridIri(v as Iri | string);
}
function toNihGrantIri(v: NihGrantIri | Iri | string): NihGrantIri {
  if (isTaggedIri(v, 'NihGrantIri')) return v as NihGrantIri;
  return nihGrantIri(v as Iri | string);
}

export const isOrcidValue       = (x: unknown): x is OrcidValue       => isTaggedIri(x, 'OrcidValue');
export const isRorValue         = (x: unknown): x is RorValue         => isTaggedIri(x, 'RorValue');
export const isDoiValue         = (x: unknown): x is DoiValue         => isTaggedIri(x, 'DoiValue');
export const isPubMedIdValue    = (x: unknown): x is PubMedIdValue    => isTaggedIri(x, 'PubMedIdValue');
export const isRridValue        = (x: unknown): x is RridValue        => isTaggedIri(x, 'RridValue');
export const isNihGrantIdValue  = (x: unknown): x is NihGrantIdValue  => isTaggedIri(x, 'NihGrantIdValue');

export function isExternalAuthorityValue(x: unknown): x is ExternalAuthorityValue {
  return (
    isOrcidValue(x) || isRorValue(x) || isDoiValue(x) ||
    isPubMedIdValue(x) || isRridValue(x) || isNihGrantIdValue(x)
  );
}
