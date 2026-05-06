// =====================================================================
// Date field family — calendar-date values at year / year-month /
// full-date precision
// =====================================================================
//
// This file is the complete vertical slice for the date field
// family. Per the cedar-ts convention each family file holds:
//
//   - identifier type            : DateFieldId
//   - instance value             : DateValue
//   - schema constraints         : DateFieldSpec
//   - reusable Field artifact    : DateField
//   - Template-embedding wrapper : EmbeddedDateField
//
// Wire `kind` values: "DateField" (artifact), "EmbeddedDateField"
// (embedding).
//
// Owns the `DateValueType` enum. References `FullDateLiteral` from
// `src/literals/temporal-literals.ts`. The `defaultValue` slot on
// `EmbeddedDateField` is a `DateValue` directly (polymorphic union;
// kind retained on the wire).

import { type Iri, iri, CedarConstructionError, parseSemanticVersion } from '../leaves/index.js';
import {
  type FullDateLiteral,
  fullDateLiteral,
} from '../literals/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { DateRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

// Identifier for a `DateField` reusable schema artifact: a typed wrapper
// around the field's IRI. Distinguished at compile time and runtime from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) so a caller
// can't accidentally pass a `DateField`'s IRI where (say) a
// `IntegerNumberField`'s IRI is expected.
//
// On the wire this collapses to a plain JSON string IRI; the typed
// wrapper exists only in memory.
export interface DateFieldId {
  readonly kind: 'DateFieldId';
  readonly iri: Iri;
}

export type DateFieldReference = DateFieldId;

// Identifier-wrapper constructor for the Date field family.
// Idempotent: an existing DateFieldId passes through unchanged. A bare
// string IRI is validated and wrapped via `iri()`; a typed `Iri` is wrapped
// without re-validation. The DateFieldId wrapper is distinguished from
// sibling field-id types (e.g. `IntegerNumberFieldId`, `EmailFieldId`) by the
// per-variant `kind` discriminator.
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
//
// DateValue is one of:
//   YearValue       (plain string matching YYYY)
//   YearMonthValue  (plain string matching YYYY-MM)
//   FullDateValue   (carries an xsd:date typed literal)
//
// Constructors are permissive (accept any string); pattern conformance is
// checked by validate_date_value in Phase 2.

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
  readonly literal: FullDateLiteral;
}

// Accepts a FullDateLiteral or its lexical form directly (wrapped via
// fullDateLiteral). Lexical conformance to xsd:date is checked at validation,
// matching the behavior of fullDateLiteral itself.
export function fullDateValue(input: FullDateLiteral | string): FullDateValue {
  return {
    kind: 'FullDateValue',
    literal: typeof input === 'string' ? fullDateLiteral(input) : input,
  };
}

export type DateValue = YearValue | YearMonthValue | FullDateValue;

// Lexical-shape discriminators for the three DateValue variants. These match
// the bare ISO 8601 forms used in everyday metadata; xsd:date's optional
// trailing time-zone designator is tolerated only on full dates (xsd:gYear and
// xsd:gYearMonth permit one too, but accepting tz suffixes there would make
// '2024' vs '2024-...' harder to discriminate cleanly — defer to validation).
const YEAR_RE = /^\d{4,}$/;
const YEAR_MONTH_RE = /^\d{4,}-\d{2}$/;
const FULL_DATE_RE = /^\d{4,}-\d{2}-\d{2}/;

// Smart DateValue constructor. Discriminates a string input by lexical shape:
//   'YYYY'         → YearValue       (xsd:gYear)
//   'YYYY-MM'      → YearMonthValue  (xsd:gYearMonth)
//   'YYYY-MM-DD…'  → FullDateValue   (xsd:date; trailing time zone tolerated)
// A pre-built DateValue passes through; a FullDateLiteral is wrapped as a
// FullDateValue. Lexical conformance to the chosen XSD datatype is checked
// at validation, matching the per-variant constructors.
export function dateValue(
  input: string | DateValue | FullDateLiteral,
): DateValue {
  if (typeof input === 'string') {
    if (FULL_DATE_RE.test(input)) return fullDateValue(input);
    if (YEAR_MONTH_RE.test(input)) return yearMonthValue(input);
    if (YEAR_RE.test(input)) return yearValue(input);
    throw new CedarConstructionError(
      `Cannot infer DateValue variant from ${JSON.stringify(input)}: ` +
        `expected 'YYYY', 'YYYY-MM', or 'YYYY-MM-DD'`,
    );
  }
  if (isDateValue(input)) return input;
  return fullDateValue(input);
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

// DateValueType selects the granularity of dates accepted by a DateFieldSpec.
// String-literal union (per nullary-constructor convention).
export type DateValueType = 'year' | 'yearMonth' | 'fullDate';
export const DATE_VALUE_TYPES: readonly DateValueType[] = Object.freeze([
  'year',
  'yearMonth',
  'fullDate',
]);

export interface DateFieldSpec {
  readonly kind: 'DateFieldSpec';
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export interface DateFieldSpecInit {
  readonly dateValueType: DateValueType;
  readonly renderingHint?: DateRenderingHint;
}

export function dateFieldSpec(init: DateFieldSpecInit): DateFieldSpec {
  const out: {
    kind: 'DateFieldSpec';
    dateValueType: DateValueType;
    renderingHint?: DateRenderingHint;
  } = { kind: 'DateFieldSpec', dateValueType: init.dateValueType };
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
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
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}

export interface DateFieldInit {
  readonly id: DateFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}

export const dateField = (init: DateFieldInit): DateField =>
  ({
    kind: 'DateField',
    id: dateFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedDateField {
  readonly kind: 'EmbeddedDateField';
  readonly key: string;
  readonly artifactRef: DateFieldReference;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: DateValue;
}

// `defaultValue` accepts a fully-built DateValue, a FullDateLiteral
// (wrapped as a FullDateValue), or a plain string discriminated by
// lexical shape ('YYYY', 'YYYY-MM', 'YYYY-MM-DD...'). See dateValue.
export interface EmbeddedDateFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: DateFieldReference | DateField;
  readonly defaultValue?: DateValue | FullDateLiteral | string;
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
