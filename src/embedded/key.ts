import { type KeyIdentifier, keyIdentifier } from '../leaves/index.js';

// EmbeddedArtifactKey — see grammar.md §Embedded Artifact Key.
// Local identifier of an EmbeddedArtifact within its containing Template.
// Distinct from artifact identifiers (FieldId, TemplateId, ...): identifies
// the embedding site rather than the reusable artifact being referenced. The
// same reusable Field may be embedded more than once under different keys.
export interface EmbeddedArtifactKey {
  readonly kind: 'embedded_artifact_key';
  readonly identifier: KeyIdentifier;
}

// Idempotent: an existing EmbeddedArtifactKey passes through unchanged. This
// lets call-site constructors (embeddedField, fieldValue, ...) call this
// unconditionally on a `string | EmbeddedArtifactKey` input.
export function embeddedArtifactKey(
  value: string | KeyIdentifier | EmbeddedArtifactKey,
): EmbeddedArtifactKey {
  if (typeof value === 'object' && value.kind === 'embedded_artifact_key') {
    return value;
  }
  return {
    kind: 'embedded_artifact_key',
    identifier: typeof value === 'string' ? keyIdentifier(value) : value,
  };
}

export const isEmbeddedArtifactKey = (x: unknown): x is EmbeddedArtifactKey =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'embedded_artifact_key';
