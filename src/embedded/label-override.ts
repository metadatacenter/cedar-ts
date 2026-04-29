// LabelOverride — see grammar.md §Label Override.
// Provides template-specific labeling for an embedded artifact, overriding
// the reusable artifact's default label in this embedding context.
//
// Per the design rule "brand only leaves that get mixed up at call sites"
// (see metadata/descriptive.ts), the grammar's `Label` and `AlternativeLabel`
// wrappers are kept as plain string properties; the property name on this
// struct preserves the grammar distinction.

export interface LabelOverride {
  readonly kind: 'label_override';
  readonly label: string;
  readonly alternativeLabels: readonly string[];
}

export interface LabelOverrideInit {
  readonly label: string;
  readonly alternativeLabels?: readonly string[];
}

export function labelOverride(init: LabelOverrideInit): LabelOverride {
  return {
    kind: 'label_override',
    label: init.label,
    alternativeLabels: init.alternativeLabels ?? [],
  };
}

export const isLabelOverride = (x: unknown): x is LabelOverride =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'label_override';
