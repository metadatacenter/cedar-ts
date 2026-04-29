import { CedarConstructionError } from './leaves/index.js';
import { type TemplateId, templateId } from './identity.js';
import type { SchemaArtifactMetadata } from './metadata/index.js';
import type { EmbeddedArtifact } from './embedded/index.js';
import type { Field } from './fields.js';

// Template — see grammar.md §Core Structure.
// The central container of the model. Assembles an ordered sequence of
// EmbeddedArtifact constructs and defines the schema that TemplateInstance
// constructs conform to.
//
// Per the design rule "brand only leaves that get mixed up at call sites"
// (see metadata/descriptive.ts), Header and Footer are kept as plain optional
// string properties; the property names preserve the grammar distinction.
//
// `kind: 'template'` is the discriminant against other artifact unions
// (Field, PresentationComponent, TemplateInstance).

export interface Template {
  readonly kind: 'template';
  readonly id: TemplateId;
  readonly metadata: SchemaArtifactMetadata;
  readonly header?: string;
  readonly footer?: string;
  readonly embedded: readonly EmbeddedArtifact[];
}

export interface TemplateInit {
  readonly id: TemplateId | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly header?: string;
  readonly footer?: string;
  readonly embedded?: readonly EmbeddedArtifact[];
}

// Constructor. Enforces the structural invariant that EmbeddedArtifactKey
// values are unique within a Template (grammar §Embedded Artifact Key).
// Order of `embedded` is preserved (grammar §Embedded Artifacts: "Conforming
// implementations MUST preserve this order").
export function template(init: TemplateInit): Template {
  const embedded = init.embedded ?? [];
  assertUniqueEmbeddedArtifactKeys(embedded);
  const out: {
    kind: 'template';
    id: TemplateId;
    metadata: SchemaArtifactMetadata;
    header?: string;
    footer?: string;
    embedded: readonly EmbeddedArtifact[];
  } = {
    kind: 'template',
    id: typeof init.id === 'string' ? templateId(init.id) : init.id,
    metadata: init.metadata,
    embedded,
  };
  if (init.header !== undefined) out.header = init.header;
  if (init.footer !== undefined) out.footer = init.footer;
  return out;
}

function assertUniqueEmbeddedArtifactKeys(
  embedded: readonly EmbeddedArtifact[],
): void {
  const seen = new Set<string>();
  for (const e of embedded) {
    const k = e.key.identifier.value;
    if (seen.has(k)) {
      throw new CedarConstructionError(
        `Duplicate EmbeddedArtifactKey within Template: ${JSON.stringify(k)}`,
      );
    }
    seen.add(k);
  }
}

export function isTemplate(x: unknown): x is Template {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'template'
  );
}

// SchemaArtifact — grammar §Core Structure.
// Union of the two reusable schema-artifact kinds.
export type SchemaArtifact = Field | Template;

export const isSchemaArtifact = (x: unknown): x is SchemaArtifact => {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return k === 'field' || k === 'template';
};
