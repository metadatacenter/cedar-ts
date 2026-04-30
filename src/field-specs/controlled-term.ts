import type { Iri } from '../leaves/index.js';
import { iri, assertNonNegativeInteger } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// OntologyDisplayHint — at least one of acronym/name must be present per
// grammar:
//   OntologyDisplayHintContent ::= OntologyAcronym | OntologyName | OntologyAcronym OntologyName
// We model this with two optional fields and a runtime check at construction.
// `acronym` is a plain string (it is a technical short-form, not human-readable
// display text); `name` is a MultilingualString.
import { CedarConstructionError } from '../leaves/index.js';

export interface OntologyDisplayHint {
  readonly acronym?: string;
  readonly name?: MultilingualString;
}

export interface OntologyDisplayHintInit {
  readonly acronym?: string;
  readonly name?: MultilingualStringInput;
}

export function ontologyDisplayHint(init: OntologyDisplayHintInit): OntologyDisplayHint {
  if (init.acronym === undefined && init.name === undefined) {
    throw new CedarConstructionError(
      'OntologyDisplayHint requires at least one of acronym or name',
    );
  }
  const out: { acronym?: string; name?: MultilingualString } = {};
  if (init.acronym !== undefined) out.acronym = init.acronym;
  if (init.name !== undefined) out.name = multilingualString(init.name);
  return out;
}

export interface OntologyReference {
  readonly iri: Iri;
  readonly displayHint?: OntologyDisplayHint;
}

export interface OntologyReferenceInit {
  readonly iri: Iri | string;
  readonly displayHint?: OntologyDisplayHint;
}

export function ontologyReference(init: OntologyReferenceInit): OntologyReference {
  const out: {
    iri: Iri;
    displayHint?: OntologyDisplayHint;
  } = {
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.displayHint !== undefined) out.displayHint = init.displayHint;
  return out;
}

// ControlledTermSource variants.

export interface OntologySource {
  readonly kind: 'OntologySource';
  readonly ontology: OntologyReference;
}

export const ontologySource = (ontology: OntologyReference): OntologySource =>
  ({ kind: 'OntologySource', ontology });

export interface BranchSource {
  readonly kind: 'BranchSource';
  readonly ontology: OntologyReference;
  readonly rootTermIri: Iri;
  readonly rootTermLabel: MultilingualString;
  readonly maxTraversalDepth?: number;
}

export interface BranchSourceInit {
  readonly ontology: OntologyReference;
  readonly rootTermIri: Iri | string;
  readonly rootTermLabel: MultilingualStringInput;
  readonly maxTraversalDepth?: number;
}

export function branchSource(init: BranchSourceInit): BranchSource {
  const out: {
    kind: 'BranchSource';
    ontology: OntologyReference;
    rootTermIri: Iri;
    rootTermLabel: MultilingualString;
    maxTraversalDepth?: number;
  } = {
    kind: 'BranchSource',
    ontology: init.ontology,
    rootTermIri:
      typeof init.rootTermIri === 'string' ? iri(init.rootTermIri) : init.rootTermIri,
    rootTermLabel: multilingualString(init.rootTermLabel),
  };
  if (init.maxTraversalDepth !== undefined)
    out.maxTraversalDepth = assertNonNegativeInteger(init.maxTraversalDepth);
  return out;
}

export interface ControlledTermClass {
  readonly term: Iri;
  readonly label: MultilingualString;
  readonly ontology: OntologyReference;
}

export interface ControlledTermClassInit {
  readonly term: Iri | string;
  readonly label: MultilingualStringInput;
  readonly ontology: OntologyReference;
}

export function controlledTermClass(
  init: ControlledTermClassInit,
): ControlledTermClass {
  return {
    term: typeof init.term === 'string' ? iri(init.term) : init.term,
    label: multilingualString(init.label),
    ontology: init.ontology,
  };
}

export interface ClassSource {
  readonly kind: 'ClassSource';
  readonly classes: readonly [ControlledTermClass, ...ControlledTermClass[]];
}

export function classSource(
  ...classes: [ControlledTermClass, ...ControlledTermClass[]]
): ClassSource {
  return { kind: 'ClassSource', classes };
}

export interface ValueSetSource {
  readonly kind: 'ValueSetSource';
  readonly identifier: string;
  readonly name?: MultilingualString;
  readonly iri?: Iri;
}

export interface ValueSetSourceInit {
  readonly identifier: string;
  readonly name?: MultilingualStringInput;
  readonly iri?: Iri | string;
}

export function valueSetSource(init: ValueSetSourceInit): ValueSetSource {
  const out: {
    kind: 'ValueSetSource';
    identifier: string;
    name?: MultilingualString;
    iri?: Iri;
  } = { kind: 'ValueSetSource', identifier: init.identifier };
  if (init.name !== undefined) out.name = multilingualString(init.name);
  if (init.iri !== undefined) {
    out.iri = typeof init.iri === 'string' ? iri(init.iri) : init.iri;
  }
  return out;
}

export type ControlledTermSource =
  | OntologySource
  | BranchSource
  | ClassSource
  | ValueSetSource;

// ControlledTermFieldSpec requires one or more sources.
export interface ControlledTermFieldSpec {
  readonly kind: 'ControlledTermFieldSpec';
  readonly sources: readonly [ControlledTermSource, ...ControlledTermSource[]];
}

export function controlledTermFieldSpec(
  ...sources: [ControlledTermSource, ...ControlledTermSource[]]
): ControlledTermFieldSpec {
  return { kind: 'ControlledTermFieldSpec', sources };
}

export const isControlledTermFieldSpec = (x: unknown): x is ControlledTermFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'ControlledTermFieldSpec';
