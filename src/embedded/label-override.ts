import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// LabelOverride — see grammar.md §Label Override.
// Provides template-specific labeling for an embedded artifact, overriding
// the reusable artifact's default label in this embedding context.
//
// `label` and each entry of `altLabels` are MultilingualStrings: a non-empty
// set of (value, lang) pairs covering the desired localizations of one
// conceptual label. Multiple alternative-label phrasings are represented by
// multiple entries in `altLabels`, each itself translatable.

export interface LabelOverride {
  readonly label: MultilingualString;
  readonly altLabels: readonly MultilingualString[];
}

export interface LabelOverrideInit {
  readonly label: MultilingualStringInput;
  readonly altLabels?: readonly MultilingualStringInput[];
}

export function labelOverride(init: LabelOverrideInit): LabelOverride {
  return {
    label: multilingualString(init.label),
    altLabels: (init.altLabels ?? []).map(multilingualString),
  };
}
