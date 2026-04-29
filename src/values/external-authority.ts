import { type Iri, iri } from '../leaves/index.js';

// Typed IRIs for each external authority. Each is a tagged wrapper around an
// Iri; pattern conformance is enforced by Phase 2 of the validation algorithm
// (validate_external_authority_value), not by these constructors.

export interface OrcidIri    { readonly kind: 'orcid_iri';    readonly value: Iri; }
export interface RorIri      { readonly kind: 'ror_iri';      readonly value: Iri; }
export interface DoiIri      { readonly kind: 'doi_iri';      readonly value: Iri; }
export interface PubMedIri   { readonly kind: 'pub_med_iri';  readonly value: Iri; }
export interface RridIri     { readonly kind: 'rrid_iri';     readonly value: Iri; }
export interface NihGrantIri { readonly kind: 'nih_grant_iri'; readonly value: Iri; }

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const orcidIri    = (v: Iri | string): OrcidIri    => ({ kind: 'orcid_iri',    value: wrapIri(v) });
export const rorIri      = (v: Iri | string): RorIri      => ({ kind: 'ror_iri',      value: wrapIri(v) });
export const doiIri      = (v: Iri | string): DoiIri      => ({ kind: 'doi_iri',      value: wrapIri(v) });
export const pubMedIri   = (v: Iri | string): PubMedIri   => ({ kind: 'pub_med_iri',  value: wrapIri(v) });
export const rridIri     = (v: Iri | string): RridIri     => ({ kind: 'rrid_iri',     value: wrapIri(v) });
export const nihGrantIri = (v: Iri | string): NihGrantIri => ({ kind: 'nih_grant_iri', value: wrapIri(v) });

// External authority values.

export interface OrcidValue {
  readonly kind: 'orcid_value';
  readonly iri: OrcidIri;
  readonly label?: string;
}
export interface RorValue {
  readonly kind: 'ror_value';
  readonly iri: RorIri;
  readonly label?: string;
}
export interface DoiValue {
  readonly kind: 'doi_value';
  readonly iri: DoiIri;
  readonly label?: string;
}
export interface PubMedIdValue {
  readonly kind: 'pub_med_id_value';
  readonly iri: PubMedIri;
  readonly label?: string;
}
export interface RridValue {
  readonly kind: 'rrid_value';
  readonly iri: RridIri;
  readonly label?: string;
}
export interface NihGrantIdValue {
  readonly kind: 'nih_grant_id_value';
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
  authorityValueFromInput('orcid_value', toOrcidIri, input);
export const rorValue = (input: AuthorityValueInput<RorIri>): RorValue =>
  authorityValueFromInput('ror_value', toRorIri, input);
export const doiValue = (input: AuthorityValueInput<DoiIri>): DoiValue =>
  authorityValueFromInput('doi_value', toDoiIri, input);
export const pubMedIdValue = (input: AuthorityValueInput<PubMedIri>): PubMedIdValue =>
  authorityValueFromInput('pub_med_id_value', toPubMedIri, input);
export const rridValue = (input: AuthorityValueInput<RridIri>): RridValue =>
  authorityValueFromInput('rrid_value', toRridIri, input);
export const nihGrantIdValue = (input: AuthorityValueInput<NihGrantIri>): NihGrantIdValue =>
  authorityValueFromInput('nih_grant_id_value', toNihGrantIri, input);

function isTaggedIri<K extends string>(x: unknown, kind: K): boolean {
  return typeof x === 'object' && x !== null && (x as { kind?: unknown }).kind === kind;
}

function toOrcidIri(v: OrcidIri | Iri | string): OrcidIri {
  if (isTaggedIri(v, 'orcid_iri')) return v as OrcidIri;
  return orcidIri(v as Iri | string);
}
function toRorIri(v: RorIri | Iri | string): RorIri {
  if (isTaggedIri(v, 'ror_iri')) return v as RorIri;
  return rorIri(v as Iri | string);
}
function toDoiIri(v: DoiIri | Iri | string): DoiIri {
  if (isTaggedIri(v, 'doi_iri')) return v as DoiIri;
  return doiIri(v as Iri | string);
}
function toPubMedIri(v: PubMedIri | Iri | string): PubMedIri {
  if (isTaggedIri(v, 'pub_med_iri')) return v as PubMedIri;
  return pubMedIri(v as Iri | string);
}
function toRridIri(v: RridIri | Iri | string): RridIri {
  if (isTaggedIri(v, 'rrid_iri')) return v as RridIri;
  return rridIri(v as Iri | string);
}
function toNihGrantIri(v: NihGrantIri | Iri | string): NihGrantIri {
  if (isTaggedIri(v, 'nih_grant_iri')) return v as NihGrantIri;
  return nihGrantIri(v as Iri | string);
}

export const isOrcidValue       = (x: unknown): x is OrcidValue       => isTaggedIri(x, 'orcid_value');
export const isRorValue         = (x: unknown): x is RorValue         => isTaggedIri(x, 'ror_value');
export const isDoiValue         = (x: unknown): x is DoiValue         => isTaggedIri(x, 'doi_value');
export const isPubMedIdValue    = (x: unknown): x is PubMedIdValue    => isTaggedIri(x, 'pub_med_id_value');
export const isRridValue        = (x: unknown): x is RridValue        => isTaggedIri(x, 'rrid_value');
export const isNihGrantIdValue  = (x: unknown): x is NihGrantIdValue  => isTaggedIri(x, 'nih_grant_id_value');

export function isExternalAuthorityValue(x: unknown): x is ExternalAuthorityValue {
  return (
    isOrcidValue(x) || isRorValue(x) || isDoiValue(x) ||
    isPubMedIdValue(x) || isRridValue(x) || isNihGrantIdValue(x)
  );
}
