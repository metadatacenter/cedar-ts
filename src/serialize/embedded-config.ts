// =====================================================================
// embedded-config — wire-form serialize/parse for the per-embedding
// configuration types (Cardinality, Property, ValueRequirement,
// Visibility). PromptOverride collapses to MultilingualString on the
// wire (see grammar.md §Prompt Override) so it has no dedicated
// serializer here; callers use serializeMultilingualString /
// parseMultilingualString directly.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  type Cardinality,
  type Property,
  type ValueRequirement,
  type Visibility,
  cardinality,
  property,
  VALUE_REQUIREMENTS,
  VISIBILITIES,
} from '../embedded/index.js';
import {
  expectObject,
  expectString,
  expectNumber,
  expectKnownProperties,
  expectStringEnum,
  rejectNullProperty,
} from './parse-utils.js';
import { serializeIri } from './collapsed-wrappers.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';

// ---- ValueRequirement / Visibility (string enums) --------------------

export const serializeValueRequirement = (x: ValueRequirement): string => x;

export const parseValueRequirement = (
  x: unknown,
  where = 'ValueRequirement',
): ValueRequirement => expectStringEnum(x, VALUE_REQUIREMENTS, where);

export const serializeVisibility = (x: Visibility): string => x;

export const parseVisibility = (x: unknown, where = 'Visibility'): Visibility =>
  expectStringEnum(x, VISIBILITIES, where);

// ---- Cardinality -----------------------------------------------------

export function serializeCardinality(x: Cardinality): unknown {
  const out: Record<string, unknown> = { min: x.min };
  if (x.max !== undefined) out['max'] = x.max;
  return out;
}

export function parseCardinality(x: unknown, where = 'Cardinality'): Cardinality {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['min', 'max']);
  rejectNullProperty(o, 'max');
  if (!('min' in o)) {
    throw new CedarConstructionError(`${where}: missing required "min"`);
  }
  const init: { min: number; max?: number } = {
    min: expectNumber(o['min'], `${where}.min`),
  };
  if ('max' in o) init.max = expectNumber(o['max'], `${where}.max`);
  return cardinality(init);
}

// ---- Property --------------------------------------------------------

export function serializeProperty(x: Property): unknown {
  const out: Record<string, unknown> = { iri: serializeIri(x.iri) };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  return out;
}

export function parseProperty(x: unknown, where = 'Property'): Property {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['iri', 'label']);
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: { iri: string; label?: ReturnType<typeof parseMultilingualString> } = {
    iri: expectString(o['iri'], `${where}.iri`),
  };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  return property(init);
}

