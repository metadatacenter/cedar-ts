import { CedarConstructionError, parseSemanticVersion } from '../leaves/index.js';
import {
  type TemplateInstanceId,
  type TemplateId,
  templateInstanceId,
  templateId,
} from '../identifiers.js';
import type { CatalogMetadata } from '../metadata/index.js';
import { isFieldValue } from './field-value.js';
import {
  isNestedTemplateInstance,
  type InstanceValue,
} from './nested-template-instance.js';

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
  readonly members: readonly InstanceValue[];
}

export interface TemplateInstanceInit {
  readonly id: TemplateInstanceId | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly templateRef: TemplateId | string;
  readonly members?: readonly InstanceValue[];
}

// Constructor. Enforces the structural invariants implied by the grammar
// without consulting the referenced Template:
//   - A given EmbeddedArtifactKey appears as a FieldValue at most once
//     (multi-valued fields collect all values within a single FieldValue).
//   - A given EmbeddedArtifactKey does not appear as both a FieldValue and
//     a NestedTemplateInstance (a key in the template identifies one site,
//     which is either a Field embedding or a Template embedding, not both).
// Multiple NestedTemplateInstance entries sharing a key ARE permitted: this
// is the structural representation of multi-cardinality template embeddings
// (grammar §Instances).
//
// Cross-template alignment (e.g., that the keys actually identify embeddings
// in the referenced Template, that values match the referenced field's
// FieldSpec, that cardinality constraints are satisfied) is enforced at
// validation, not here.
export function templateInstance(init: TemplateInstanceInit): TemplateInstance {
  const members = init.members ?? [];
  assertConsistentInstanceValueKeys(members);
  return {
    kind: 'TemplateInstance',
    id: typeof init.id === 'string' ? templateInstanceId(init.id) : init.id,
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    templateRef:
      typeof init.templateRef === 'string'
        ? templateId(init.templateRef)
        : init.templateRef,
    members,
  };
}

function assertConsistentInstanceValueKeys(
  members: readonly InstanceValue[],
): void {
  const fieldKeys = new Set<string>();
  const templateKeys = new Set<string>();
  for (const v of members) {
    const k = v.key;
    if (isFieldValue(v)) {
      if (fieldKeys.has(k)) {
        throw new CedarConstructionError(
          `Duplicate FieldValue key in TemplateInstance: ${JSON.stringify(k)}`,
        );
      }
      if (templateKeys.has(k)) {
        throw new CedarConstructionError(
          `EmbeddedArtifactKey ${JSON.stringify(k)} appears as both a FieldValue and a NestedTemplateInstance in TemplateInstance`,
        );
      }
      fieldKeys.add(k);
    } else if (isNestedTemplateInstance(v)) {
      if (fieldKeys.has(k)) {
        throw new CedarConstructionError(
          `EmbeddedArtifactKey ${JSON.stringify(k)} appears as both a FieldValue and a NestedTemplateInstance in TemplateInstance`,
        );
      }
      templateKeys.add(k);
    }
  }
}

export const isTemplateInstance = (x: unknown): x is TemplateInstance =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateInstance';
