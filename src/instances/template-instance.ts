import { CedarConstructionError, parseSemanticVersion } from '../leaves/index.js';
import {
  type TemplateInstanceId,
  type TemplateId,
  templateInstanceId,
  templateId,
} from '../identifiers.js';
import type { CatalogMetadata } from '../metadata/index.js';
import { isFieldEntry } from './field-entry.js';
import {
  isTemplateEntry,
  type InstanceEntry,
} from './template-entry.js';

// TemplateInstance — see grammar.md §Instances.
// An Artifact recording data conforming to a specific Template. Carries
// CatalogMetadata (descriptive + lifecycle + annotations), NOT
// SchemaCatalogMetadata: instances are independently identifiable artifacts
// but do not carry schema versioning.

export interface TemplateInstance {
  readonly kind: 'TemplateInstance';
  readonly id: TemplateInstanceId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly templateRef: TemplateId;
  readonly entries: readonly InstanceEntry[];
}

export interface TemplateInstanceInit {
  readonly id: TemplateInstanceId | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly templateRef: TemplateId | string;
  readonly entries?: readonly InstanceEntry[];
}

// Constructor. Enforces the structural invariants implied by the grammar
// without consulting the referenced Template:
//   - A given EmbeddedArtifactKey appears as a FieldEntry at most once
//     (multi-valued fields collect all values within a single FieldEntry).
//   - A given EmbeddedArtifactKey does not appear as both a FieldEntry and
//     a TemplateEntry (a key in the template identifies one site,
//     which is either a Field embedding or a Template embedding, not both).
// Multiple TemplateEntry entries sharing a key ARE permitted: this
// is the structural representation of multi-cardinality template embeddings
// (grammar §Instances).
//
// Cross-template alignment (e.g., that the keys actually identify embeddings
// in the referenced Template, that values match the referenced field's
// FieldSpec, that cardinality constraints are satisfied) is enforced at
// validation, not here.
export function templateInstance(init: TemplateInstanceInit): TemplateInstance {
  const entries = init.entries ?? [];
  assertConsistentInstanceValueKeys(entries);
  return {
    kind: 'TemplateInstance',
    id: typeof init.id === 'string' ? templateInstanceId(init.id) : init.id,
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    templateRef:
      typeof init.templateRef === 'string'
        ? templateId(init.templateRef)
        : init.templateRef,
    entries,
  };
}

function assertConsistentInstanceValueKeys(
  entries: readonly InstanceEntry[],
): void {
  const fieldKeys = new Set<string>();
  const templateKeys = new Set<string>();
  for (const v of entries) {
    const k = v.key;
    if (isFieldEntry(v)) {
      if (fieldKeys.has(k)) {
        throw new CedarConstructionError(
          `Duplicate FieldEntry key in TemplateInstance: ${JSON.stringify(k)}`,
        );
      }
      if (templateKeys.has(k)) {
        throw new CedarConstructionError(
          `EmbeddedArtifactKey ${JSON.stringify(k)} appears as both a FieldEntry and a TemplateEntry in TemplateInstance`,
        );
      }
      fieldKeys.add(k);
    } else if (isTemplateEntry(v)) {
      if (fieldKeys.has(k)) {
        throw new CedarConstructionError(
          `EmbeddedArtifactKey ${JSON.stringify(k)} appears as both a FieldEntry and a TemplateEntry in TemplateInstance`,
        );
      }
      templateKeys.add(k);
    }
  }
}

export const isTemplateInstance = (x: unknown): x is TemplateInstance =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateInstance';
