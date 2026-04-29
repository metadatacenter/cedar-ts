export interface OrcidFieldSpec      { readonly kind: 'orcid_field_spec'; }
export interface RorFieldSpec        { readonly kind: 'ror_field_spec'; }
export interface DoiFieldSpec        { readonly kind: 'doi_field_spec'; }
export interface PubMedIdFieldSpec   { readonly kind: 'pub_med_id_field_spec'; }
export interface RridFieldSpec       { readonly kind: 'rrid_field_spec'; }
export interface NihGrantIdFieldSpec { readonly kind: 'nih_grant_id_field_spec'; }

export const orcidFieldSpec      = (): OrcidFieldSpec      => ({ kind: 'orcid_field_spec' });
export const rorFieldSpec        = (): RorFieldSpec        => ({ kind: 'ror_field_spec' });
export const doiFieldSpec        = (): DoiFieldSpec        => ({ kind: 'doi_field_spec' });
export const pubMedIdFieldSpec   = (): PubMedIdFieldSpec   => ({ kind: 'pub_med_id_field_spec' });
export const rridFieldSpec       = (): RridFieldSpec       => ({ kind: 'rrid_field_spec' });
export const nihGrantIdFieldSpec = (): NihGrantIdFieldSpec => ({ kind: 'nih_grant_id_field_spec' });

const taggedKind = (x: unknown): unknown =>
  typeof x === 'object' && x !== null ? (x as { kind?: unknown }).kind : undefined;

export const isOrcidFieldSpec      = (x: unknown): x is OrcidFieldSpec      => taggedKind(x) === 'orcid_field_spec';
export const isRorFieldSpec        = (x: unknown): x is RorFieldSpec        => taggedKind(x) === 'ror_field_spec';
export const isDoiFieldSpec        = (x: unknown): x is DoiFieldSpec        => taggedKind(x) === 'doi_field_spec';
export const isPubMedIdFieldSpec   = (x: unknown): x is PubMedIdFieldSpec   => taggedKind(x) === 'pub_med_id_field_spec';
export const isRridFieldSpec       = (x: unknown): x is RridFieldSpec       => taggedKind(x) === 'rrid_field_spec';
export const isNihGrantIdFieldSpec = (x: unknown): x is NihGrantIdFieldSpec => taggedKind(x) === 'nih_grant_id_field_spec';

export type ExternalAuthorityFieldSpec =
  | OrcidFieldSpec
  | RorFieldSpec
  | DoiFieldSpec
  | PubMedIdFieldSpec
  | RridFieldSpec
  | NihGrantIdFieldSpec;

export const isExternalAuthorityFieldSpec = (
  x: unknown,
): x is ExternalAuthorityFieldSpec =>
  isOrcidFieldSpec(x) || isRorFieldSpec(x) || isDoiFieldSpec(x) ||
  isPubMedIdFieldSpec(x) || isRridFieldSpec(x) || isNihGrantIdFieldSpec(x);
