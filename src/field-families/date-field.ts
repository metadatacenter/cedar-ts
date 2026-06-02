// =====================================================================
// Date field family — calendar-date values at year / year-month /
// full-date precision
// =====================================================================
//
// DateValue is a discriminated union of YearValue, YearMonthValue, and
// FullDateValue. All three variants carry their lexical form directly
// (`value: string`); the datatype is fixed by the variant's `kind`.

import { type Iri, iri, CedarConstructionError, parseSemanticVersion, parseAsciiIdentifier } from '../leaves/index.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';
import { type AlternativePrompt, type AlternativePromptInput, assembleAltPrompts } from '../embedded/alternative-prompt.js';
import type { Editability } from '../embedded/editability.js';
import type { DateRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface DateFieldId {
  readonly kind: 'DateFieldId';
  readonly iri: Iri;
}


export const dateFieldId = (
  v: DateFieldId | Iri | string,
): DateFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'DateFieldId') {
    return v as DateFieldId;
  }
  return {
    kind: 'DateFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface YearValue {
  readonly kind: 'YearValue';
  readonly value: string;
}

export function yearValue(value: string): YearValue {
  return { kind: 'YearValue', value };
}

export interface YearMonthValue {
  readonly kind: 'YearMonthValue';
  readonly value: string;
}

export function yearMonthValue(value: string): YearMonthValue {
  return { kind: 'YearMonthValue', value };
}

export interface FullDateValue {
  readonly kind: 'FullDateValue';
  readonly value: string;
}

export function fullDateValue(value: string): FullDateValue {
  return { kind: 'FullDateValue', value };
}

export type DateValue = YearValue | YearMonthValue | FullDateValue;

// Lexical-shape discriminators for the three DateValue variants.
const YEAR_RE = /^\d{4,}$/;
const YEAR_MONTH_RE = /^\d{4,}-\d{2}$/;
const FULL_DATE_RE = /^\d{4,}-\d{2}-\d{2}/;

// Smart DateValue constructor. Discriminates a string input by lexical
// shape:
//   'YYYY'         → YearValue       (xsd:gYear)
//   'YYYY-MM'      → YearMonthValue  (xsd:gYearMonth)
//   'YYYY-MM-DD…'  → FullDateValue   (xsd:date; trailing time zone tolerated)
export function dateValue(input: string | DateValue): DateValue {
  if (typeof input === 'string') {
    if (FULL_DATE_RE.test(input)) return fullDateValue(input);
    if (YEAR_MONTH_RE.test(input)) return yearMonthValue(input);
    if (YEAR_RE.test(input)) return yearValue(input);
    throw new CedarConstructionError(
      `Cannot infer DateValue variant from ${JSON.stringify(input)}: ` +
        `expected 'YYYY', 'YYYY-MM', or 'YYYY-MM-DD'`,
    );
  }
  return input;
}

export function isYearValue(x: unknown): x is YearValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'YearValue'
  );
}
export function isYearMonthValue(x: unknown): x is YearMonthValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'YearMonthValue'
  );
}
export function isFullDateValue(x: unknown): x is FullDateValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'FullDateValue'
  );
}
export function isDateValue(x: unknown): x is DateValue {
  return isYearValue(x) || isYearMonthValue(x) || isFullDateValue(x);
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export type DateValueType = 'year' | 'yearMonth' | 'fullDate';
export const DATE_VALUE_TYPES: readonly DateValueType[] = Object.freeze([
  'year',
  'yearMonth',
  'fullDate',
]);

export interface DateFieldSpec {
  readonly kind: 'DateFieldSpec';
  readonly dateValueType: DateValueType;
  // When present, the DateValue arm MUST match `dateValueType`:
  //   year      → YearValue
  //   yearMonth → YearMonthValue
  //   fullDate  → FullDateValue
  readonly defaultValue?: DateValue;
  readonly renderingHint?: DateRenderingHint;
  readonly examples?: readonly DateValue[];
}

export interface DateFieldSpecInit {
  readonly dateValueType: DateValueType;
  readonly defaultValue?: DateValue | string;
  readonly renderingHint?: DateRenderingHint;
  readonly examples?: readonly (DateValue | string)[];
}

export function dateFieldSpec(init: DateFieldSpecInit): DateFieldSpec {
  const out: {
    kind: 'DateFieldSpec';
    dateValueType: DateValueType;
    defaultValue?: DateValue;
    renderingHint?: DateRenderingHint;
  } = { kind: 'DateFieldSpec', dateValueType: init.dateValueType };
  if (init.defaultValue !== undefined) {
    const dv = isDateValue(init.defaultValue)
      ? init.defaultValue
      : dateValue(init.defaultValue);
    assertDateValueArmMatchesType(dv, init.dateValueType, 'DateFieldSpec.defaultValue');
    out.defaultValue = dv;
  }
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  if (init?.examples !== undefined) {
    (out as { examples?: readonly DateValue[] }).examples = init.examples.map((e) => dateValue(e as never));
  }
  return out;
}

// Enforces the cross-slot invariant that `defaultValue`'s DateValue arm
// agrees with `dateValueType`. Used by both DateFieldSpec and
// EmbeddedDateField; the same check applies at both layers.
export function assertDateValueArmMatchesType(
  v: DateValue,
  t: DateValueType,
  where: string,
): void {
  const expected =
    t === 'year' ? 'YearValue' : t === 'yearMonth' ? 'YearMonthValue' : 'FullDateValue';
  if (v.kind !== expected) {
    throw new CedarConstructionError(
      `${where}: dateValueType "${t}" requires a ${expected}, got ${v.kind}`,
    );
  }
}

export const isDateFieldSpec = (x: unknown): x is DateFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'DateFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface DateField {
  readonly kind: 'DateField';
  readonly id: DateFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DateFieldSpec;
  readonly prompt: MultilingualString;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePrompt[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: Property;
}

export interface DateFieldInit {
  readonly id: DateFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: DateFieldSpec;
  readonly prompt: MultilingualStringInput;
  readonly helpText?: MultilingualString;
  readonly altPrompts?: readonly AlternativePromptInput[];
  readonly recommendedKey?: string;
  readonly recommendedProperty?: PropertyInput;
}

export const dateField = (init: DateFieldInit): DateField => {
  const out: DateField = {
    kind: 'DateField',
    id: dateFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    prompt: multilingualString(init.prompt),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
    ...(init.altPrompts !== undefined && {
      altPrompts: assembleAltPrompts(init.altPrompts),
    }),
    ...(init.recommendedKey !== undefined && {
      recommendedKey: parseAsciiIdentifier(init.recommendedKey),
    }),
    ...(init.recommendedProperty !== undefined && {
      recommendedProperty: property(init.recommendedProperty),
    }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedDateField {
  readonly kind: 'EmbeddedDateField';
  readonly key: string;
  readonly artifactRef: DateFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualString;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly promptKey?: string;
  readonly editability?: Editability;
  readonly defaultValue?: DateValue;
}

export interface EmbeddedDateFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: DateFieldId | DateField;
  readonly defaultValue?: DateValue | string;
}

export function embeddedDateField(init: EmbeddedDateFieldInit): EmbeddedDateField {
  const out: EmbeddedDateField = {
    ...assembleCommon(init),
    kind: 'EmbeddedDateField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue: isDateValue(init.defaultValue)
        ? init.defaultValue
        : dateValue(init.defaultValue),
    }),
  };
  return out;
}
