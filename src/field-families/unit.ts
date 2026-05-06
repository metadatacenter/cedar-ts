// =====================================================================
// Unit — measurement / quantity unit, shared by IntegerNumberFieldSpec
// and RealNumberFieldSpec.
// =====================================================================
//
// The grammar pairs an Iri with an optional human-readable Label,
// modeled here as a MultilingualString.

import { type Iri, iri } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

export interface Unit {
  readonly iri: Iri;
  readonly label?: MultilingualString;
}

export interface UnitInit {
  readonly iri: Iri | string;
  readonly label?: MultilingualStringInput;
}

export function unit(init: UnitInit): Unit {
  const out: { iri: Iri; label?: MultilingualString } = {
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = multilingualString(init.label);
  return out;
}
