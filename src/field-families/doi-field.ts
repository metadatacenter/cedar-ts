import { type Iri, iri } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import {
  type AuthorityValueInput,
  type AuthorityDefaultValueInput,
  authorityValueFromInput,
  isTaggedKind,
} from './external-authority-shared.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface DoiFieldId {
  readonly kind: 'DoiFieldId';
  readonly iri: Iri;
}

export type DoiFieldReference = DoiFieldId;

export const doiFieldId = (
  v: DoiFieldId | Iri | string,
): DoiFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'FieldId') {
    return v as DoiFieldId;
  }
  return {
    kind: 'DoiFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface DoiIri {
  readonly kind: 'DoiIri';
  readonly value: Iri;
}

const wrapIri = (raw: Iri | string): Iri =>
  typeof raw === 'string' ? iri(raw) : raw;

export const doiIri = (v: Iri | string): DoiIri =>
  ({ kind: 'DoiIri', value: wrapIri(v) });

export interface DoiValue {
  readonly kind: 'DoiValue';
  readonly iri: DoiIri;
  readonly label?: string;
}

function toDoiIri(v: DoiIri | Iri | string): DoiIri {
  if (isTaggedKind(v, 'DoiIri')) return v as DoiIri;
  return doiIri(v as Iri | string);
}

export const doiValue = (input: AuthorityValueInput<DoiIri>): DoiValue =>
  authorityValueFromInput('DoiValue', toDoiIri, input);

export const isDoiValue = (x: unknown): x is DoiValue =>
  isTaggedKind(x, 'DoiValue');

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface DoiFieldSpec { readonly kind: 'DoiFieldSpec'; }

export const doiFieldSpec = (): DoiFieldSpec => ({ kind: 'DoiFieldSpec' });

export const isDoiFieldSpec = (x: unknown): x is DoiFieldSpec =>
  isTaggedKind(x, 'DoiFieldSpec');

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DoiField {
  readonly kind: 'DoiField';
  readonly id: DoiFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export interface DoiFieldInit {
  readonly id: DoiFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export const doiField = (init: DoiFieldInit): DoiField =>
  ({ kind: 'DoiField', id: doiFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// =====================================================================
// 5. DefaultValue
// =====================================================================

export interface DoiDefaultValue {
  readonly kind: 'DoiDefaultValue';
  readonly value: DoiValue;
}
export function doiDefaultValue(
  input: DoiDefaultValue | AuthorityDefaultValueInput<DoiIri, DoiValue>,
): DoiDefaultValue {
  if (typeof input === 'object' && 'kind' in input && input.kind === 'DoiDefaultValue') {
    return input;
  }
  return {
    kind: 'DoiDefaultValue',
    value: isDoiValue(input) ? input : doiValue(input),
  };
}

// =====================================================================
// 6. EmbeddedField
// =====================================================================

export interface EmbeddedDoiField {
  readonly kind: 'EmbeddedDoiField';
  readonly key: string;
  readonly reference: DoiFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: DoiDefaultValue;
}

export interface EmbeddedDoiFieldInit extends EmbeddedFieldInitCommon {
  readonly reference: DoiFieldReference | DoiField;
  readonly defaultValue?:
    | DoiDefaultValue
    | AuthorityDefaultValueInput<DoiIri, DoiValue>;
}

export function embeddedDoiField(init: EmbeddedDoiFieldInit): EmbeddedDoiField {
  const out: EmbeddedDoiField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDoiField',
    reference: fieldRef(init.reference),
    ...(init.defaultValue !== undefined && {
      defaultValue: doiDefaultValue(init.defaultValue),
    }),
  };
  return out;
}
