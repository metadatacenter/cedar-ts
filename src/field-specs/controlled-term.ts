import type { Iri, NonNegativeInteger } from '../leaves/index.js';
import { iri } from '../leaves/index.js';

// OntologyDisplayHint — at least one of acronym/name must be present per
// grammar:
//   OntologyDisplayHintContent ::= OntologyAcronym | OntologyName | OntologyAcronym OntologyName
// We model this with two optional fields and a runtime check at construction.
import { CedarConstructionError } from '../leaves/index.js';

export interface OntologyDisplayHint {
  readonly kind: 'ontology_display_hint';
  readonly acronym?: string;
  readonly name?: string;
}

export interface OntologyDisplayHintInit {
  readonly acronym?: string;
  readonly name?: string;
}

export function ontologyDisplayHint(init: OntologyDisplayHintInit): OntologyDisplayHint {
  if (init.acronym === undefined && init.name === undefined) {
    throw new CedarConstructionError(
      'OntologyDisplayHint requires at least one of acronym or name',
    );
  }
  const out: { kind: 'ontology_display_hint'; acronym?: string; name?: string } = {
    kind: 'ontology_display_hint',
  };
  if (init.acronym !== undefined) out.acronym = init.acronym;
  if (init.name !== undefined) out.name = init.name;
  return out;
}

export interface OntologyReference {
  readonly kind: 'ontology_reference';
  readonly ontologyIri: Iri;
  readonly displayHint?: OntologyDisplayHint;
}

export interface OntologyReferenceInit {
  readonly ontologyIri: Iri | string;
  readonly displayHint?: OntologyDisplayHint;
}

export function ontologyReference(init: OntologyReferenceInit): OntologyReference {
  const out: {
    kind: 'ontology_reference';
    ontologyIri: Iri;
    displayHint?: OntologyDisplayHint;
  } = {
    kind: 'ontology_reference',
    ontologyIri:
      typeof init.ontologyIri === 'string' ? iri(init.ontologyIri) : init.ontologyIri,
  };
  if (init.displayHint !== undefined) out.displayHint = init.displayHint;
  return out;
}

// ControlledTermSource variants.

export interface OntologySource {
  readonly kind: 'ontology_source';
  readonly ontology: OntologyReference;
}

export const ontologySource = (ontology: OntologyReference): OntologySource =>
  ({ kind: 'ontology_source', ontology });

export interface BranchSource {
  readonly kind: 'branch_source';
  readonly ontology: OntologyReference;
  readonly rootTermIri: Iri;
  readonly rootTermLabel: string;
  readonly maxTraversalDepth?: NonNegativeInteger;
}

export interface BranchSourceInit {
  readonly ontology: OntologyReference;
  readonly rootTermIri: Iri | string;
  readonly rootTermLabel: string;
  readonly maxTraversalDepth?: NonNegativeInteger;
}

export function branchSource(init: BranchSourceInit): BranchSource {
  const out: {
    kind: 'branch_source';
    ontology: OntologyReference;
    rootTermIri: Iri;
    rootTermLabel: string;
    maxTraversalDepth?: NonNegativeInteger;
  } = {
    kind: 'branch_source',
    ontology: init.ontology,
    rootTermIri:
      typeof init.rootTermIri === 'string' ? iri(init.rootTermIri) : init.rootTermIri,
    rootTermLabel: init.rootTermLabel,
  };
  if (init.maxTraversalDepth !== undefined)
    out.maxTraversalDepth = init.maxTraversalDepth;
  return out;
}

export interface ControlledTermClass {
  readonly kind: 'controlled_term_class';
  readonly termIri: Iri;
  readonly label: string;
  readonly ontology: OntologyReference;
}

export interface ControlledTermClassInit {
  readonly termIri: Iri | string;
  readonly label: string;
  readonly ontology: OntologyReference;
}

export function controlledTermClass(
  init: ControlledTermClassInit,
): ControlledTermClass {
  return {
    kind: 'controlled_term_class',
    termIri: typeof init.termIri === 'string' ? iri(init.termIri) : init.termIri,
    label: init.label,
    ontology: init.ontology,
  };
}

export interface ClassSource {
  readonly kind: 'class_source';
  readonly classes: readonly [ControlledTermClass, ...ControlledTermClass[]];
}

export function classSource(
  ...classes: [ControlledTermClass, ...ControlledTermClass[]]
): ClassSource {
  return { kind: 'class_source', classes };
}

export interface ValueSetSource {
  readonly kind: 'value_set_source';
  readonly identifier: string;
  readonly name?: string;
  readonly valueSetIri?: Iri;
}

export interface ValueSetSourceInit {
  readonly identifier: string;
  readonly name?: string;
  readonly valueSetIri?: Iri | string;
}

export function valueSetSource(init: ValueSetSourceInit): ValueSetSource {
  const out: {
    kind: 'value_set_source';
    identifier: string;
    name?: string;
    valueSetIri?: Iri;
  } = { kind: 'value_set_source', identifier: init.identifier };
  if (init.name !== undefined) out.name = init.name;
  if (init.valueSetIri !== undefined) {
    out.valueSetIri =
      typeof init.valueSetIri === 'string' ? iri(init.valueSetIri) : init.valueSetIri;
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
  readonly kind: 'controlled_term_field_spec';
  readonly sources: readonly [ControlledTermSource, ...ControlledTermSource[]];
}

export function controlledTermFieldSpec(
  ...sources: [ControlledTermSource, ...ControlledTermSource[]]
): ControlledTermFieldSpec {
  return { kind: 'controlled_term_field_spec', sources };
}

export const isControlledTermFieldSpec = (x: unknown): x is ControlledTermFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'controlled_term_field_spec';
