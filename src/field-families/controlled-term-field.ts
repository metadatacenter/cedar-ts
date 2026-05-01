import {
  type Iri,
  type TermIri,
  iri,
  assertNonNegativeInteger,
  CedarConstructionError,
} from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface ControlledTermFieldId {
  readonly kind: 'ControlledTermFieldId';
  readonly iri: Iri;
}

export type ControlledTermFieldReference = ControlledTermFieldId;

export const controlledTermFieldId = (
  v: ControlledTermFieldId | Iri | string,
): ControlledTermFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as ControlledTermFieldId;
  }
  return {
    kind: 'ControlledTermFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================
//
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

// =====================================================================
// 3. FieldSpec (and source types)
// =====================================================================

// OntologyDisplayHint — at least one of acronym/name must be present per
// grammar:
//   OntologyDisplayHintContent ::= OntologyAcronym | OntologyName | OntologyAcronym OntologyName
// We model this with two optional fields and a runtime check at construction.
// `acronym` is a plain string (it is a technical short-form, not human-readable
// display text); `name` is a MultilingualString.

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

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface ControlledTermField {
  readonly kind: 'ControlledTermField';
  readonly id: ControlledTermFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}

export interface ControlledTermFieldInit {
  readonly id: ControlledTermFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}

export const controlledTermField = (
  init: ControlledTermFieldInit,
): ControlledTermField =>
  ({
    kind: 'ControlledTermField',
    id: controlledTermFieldId(init.id),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface ControlledTermDefaultValue {
  readonly kind: 'ControlledTermDefaultValue';
  readonly value: ControlledTermValue;
}
export const controlledTermDefaultValue = (
  value: ControlledTermValue,
): ControlledTermDefaultValue =>
  ({ kind: 'ControlledTermDefaultValue', value });

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedControlledTermField {
  readonly kind: 'EmbeddedControlledTermField';
  readonly key: string;
  readonly reference: ControlledTermFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: ControlledTermDefaultValue;
}

export interface EmbeddedControlledTermFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: ControlledTermFieldReference | ControlledTermField;
  readonly defaultValue?: ControlledTermDefaultValue;
}

export function embeddedControlledTermField(
  init: EmbeddedControlledTermFieldInit,
): EmbeddedControlledTermField {
  const out: EmbeddedControlledTermField = {
    ...assembleCommon(init),
    kind: 'EmbeddedControlledTermField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && { defaultValue: init.defaultValue }),
  };
  return out;
}
