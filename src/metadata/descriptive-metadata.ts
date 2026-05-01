import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// DescriptiveMetadata identifies the human-oriented descriptive properties of
// an artifact (grammar §Descriptive Metadata).
//
// Per the design rule "brand only leaves that get mixed up at call sites",
// we don't introduce dedicated leaf wrappers per property; the parent
// property name preserves the grammar's distinction (between `name`,
// `description`, `preferredLabel`, etc.).
//
// `name`, `description`, `preferredLabel`, and each entry of `altLabels`
// are MultilingualStrings — non-empty sets of language-tagged localizations.
// `identifier` is a plain string (a technical key, not human-readable
// display text).

export interface DescriptiveMetadata {
  readonly name: MultilingualString;
  readonly description?: MultilingualString;
  readonly identifier?: string;
  readonly preferredLabel?: MultilingualString;
  readonly altLabels: readonly MultilingualString[];
}

export interface DescriptiveMetadataInit {
  readonly name: MultilingualStringInput;
  readonly description?: MultilingualStringInput;
  readonly identifier?: string;
  readonly preferredLabel?: MultilingualStringInput;
  readonly altLabels?: readonly MultilingualStringInput[];
}

export function descriptiveMetadata(init: DescriptiveMetadataInit): DescriptiveMetadata {
  const out: {
    name: MultilingualString;
    description?: MultilingualString;
    identifier?: string;
    preferredLabel?: MultilingualString;
    altLabels: readonly MultilingualString[];
  } = {
    name: multilingualString(init.name),
    altLabels: (init.altLabels ?? []).map(multilingualString),
  };
  if (init.description !== undefined) out.description = multilingualString(init.description);
  if (init.identifier !== undefined) out.identifier = init.identifier;
  if (init.preferredLabel !== undefined)
    out.preferredLabel = multilingualString(init.preferredLabel);
  return out;
}
