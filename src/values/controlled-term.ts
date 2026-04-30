import { type TermIri, iri } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// ControlledTermValue identifies a term drawn from an ontology, branch, class
// set, or value set declared in the corresponding ControlledTermFieldSpec.
// `label` corresponds to the grammar's required Label component, but the
// validator treats label as SHOULD-include and warns rather than errors when
// absent. We follow the spec by making it optional in the type and warning
// at validation time.
//
// `label` and `preferredLabel` are MultilingualStrings (display text);
// `notation` stays a plain string (a technical short-form code, e.g. a
// SKOS notation).
export interface ControlledTermValue {
  readonly kind: 'ControlledTermValue';
  readonly term: TermIri;
  readonly label?: MultilingualString;
  readonly notation?: string;
  readonly preferredLabel?: MultilingualString;
}

export interface ControlledTermValueInit {
  readonly term: TermIri | string;
  readonly label?: MultilingualStringInput;
  readonly notation?: string;
  readonly preferredLabel?: MultilingualStringInput;
}

export function controlledTermValue(init: ControlledTermValueInit): ControlledTermValue {
  const term = typeof init.term === 'string' ? iri(init.term) : init.term;
  const out: {
    kind: 'ControlledTermValue';
    term: TermIri;
    label?: MultilingualString;
    notation?: string;
    preferredLabel?: MultilingualString;
  } = { kind: 'ControlledTermValue', term };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  if (init.notation !== undefined) out.notation = init.notation;
  if (init.preferredLabel !== undefined)
    out.preferredLabel = multilingualString(init.preferredLabel);
  return out;
}

export function isControlledTermValue(x: unknown): x is ControlledTermValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'ControlledTermValue'
  );
}
