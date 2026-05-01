import { type Iri, iri } from './leaves/index.js';
import type { FieldId } from './field-families/index.js';

// =====================================================================
// Non-field artifact identifiers
// =====================================================================
//
// The 18 per-family XxxFieldId / xxxFieldId types and constructors live in
// src/field-families/ (one file per family). This module retains only the
// non-field artifact identifiers (Template, TemplateInstance,
// PresentationComponent), the cross-family ArtifactIdentifier union, and
// the corresponding type guards.

export interface TemplateId {
  readonly kind: 'TemplateId';
  readonly iri: Iri;
}

export function templateId(value: Iri | string): TemplateId {
  return {
    kind: 'TemplateId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateId = (x: unknown): x is TemplateId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateId';

export interface PresentationComponentId {
  readonly kind: 'PresentationComponentId';
  readonly iri: Iri;
}

export function presentationComponentId(value: Iri | string): PresentationComponentId {
  return {
    kind: 'PresentationComponentId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isPresentationComponentId = (x: unknown): x is PresentationComponentId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'PresentationComponentId';

export interface TemplateInstanceId {
  readonly kind: 'TemplateInstanceId';
  readonly iri: Iri;
}

export function templateInstanceId(value: Iri | string): TemplateInstanceId {
  return {
    kind: 'TemplateInstanceId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateInstanceId = (x: unknown): x is TemplateInstanceId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateInstanceId';

// References mirror their identifier shapes.
export type TemplateReference = TemplateId;
export type PresentationComponentReference = PresentationComponentId;

// Union of all artifact identifier shapes.
export type ArtifactIdentifier =
  | FieldId
  | TemplateId
  | PresentationComponentId
  | TemplateInstanceId;
