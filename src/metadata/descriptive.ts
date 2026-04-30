// DescriptiveMetadata identifies the human-oriented descriptive properties of
// an artifact (grammar §Descriptive Metadata).
//
// Per the design rule "brand only leaves that get mixed up at call sites",
// the simple Unicode-string components (Name, Description, Identifier,
// PreferredLabel, AlternativeLabel) are kept as plain string properties on
// the parent object rather than as separate tagged wrappers. The grammar's
// distinction between e.g. `name(string)` and `description(string)` is
// preserved by the property name on this struct.

export interface DescriptiveMetadata {
  readonly kind: 'descriptive_metadata';
  readonly name: string;
  readonly description?: string;
  readonly identifier?: string;
  readonly preferredLabel?: string;
  readonly altLabels: readonly string[];
}

export interface DescriptiveMetadataInit {
  readonly name: string;
  readonly description?: string;
  readonly identifier?: string;
  readonly preferredLabel?: string;
  readonly altLabels?: readonly string[];
}

export function descriptiveMetadata(init: DescriptiveMetadataInit): DescriptiveMetadata {
  const out: {
    kind: 'descriptive_metadata';
    name: string;
    description?: string;
    identifier?: string;
    preferredLabel?: string;
    altLabels: readonly string[];
  } = {
    kind: 'descriptive_metadata',
    name: init.name,
    altLabels: init.altLabels ?? [],
  };
  if (init.description !== undefined) out.description = init.description;
  if (init.identifier !== undefined) out.identifier = init.identifier;
  if (init.preferredLabel !== undefined) out.preferredLabel = init.preferredLabel;
  return out;
}

export function isDescriptiveMetadata(x: unknown): x is DescriptiveMetadata {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'descriptive_metadata'
  );
}
