export interface OrcidFieldSpec      { readonly kind: 'OrcidFieldSpec'; }
export interface RorFieldSpec        { readonly kind: 'RorFieldSpec'; }
export interface DoiFieldSpec        { readonly kind: 'DoiFieldSpec'; }
export interface PubMedIdFieldSpec   { readonly kind: 'PubMedIdFieldSpec'; }
export interface RridFieldSpec       { readonly kind: 'RridFieldSpec'; }
export interface NihGrantIdFieldSpec { readonly kind: 'NihGrantIdFieldSpec'; }

export const orcidFieldSpec      = (): OrcidFieldSpec      => ({ kind: 'OrcidFieldSpec' });
export const rorFieldSpec        = (): RorFieldSpec        => ({ kind: 'RorFieldSpec' });
export const doiFieldSpec        = (): DoiFieldSpec        => ({ kind: 'DoiFieldSpec' });
export const pubMedIdFieldSpec   = (): PubMedIdFieldSpec   => ({ kind: 'PubMedIdFieldSpec' });
export const rridFieldSpec       = (): RridFieldSpec       => ({ kind: 'RridFieldSpec' });
export const nihGrantIdFieldSpec = (): NihGrantIdFieldSpec => ({ kind: 'NihGrantIdFieldSpec' });

const taggedKind = (x: unknown): unknown =>
  typeof x === 'object' && x !== null ? (x as { kind?: unknown }).kind : undefined;

export const isOrcidFieldSpec      = (x: unknown): x is OrcidFieldSpec      => taggedKind(x) === 'OrcidFieldSpec';
export const isRorFieldSpec        = (x: unknown): x is RorFieldSpec        => taggedKind(x) === 'RorFieldSpec';
export const isDoiFieldSpec        = (x: unknown): x is DoiFieldSpec        => taggedKind(x) === 'DoiFieldSpec';
export const isPubMedIdFieldSpec   = (x: unknown): x is PubMedIdFieldSpec   => taggedKind(x) === 'PubMedIdFieldSpec';
export const isRridFieldSpec       = (x: unknown): x is RridFieldSpec       => taggedKind(x) === 'RridFieldSpec';
export const isNihGrantIdFieldSpec = (x: unknown): x is NihGrantIdFieldSpec => taggedKind(x) === 'NihGrantIdFieldSpec';

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
