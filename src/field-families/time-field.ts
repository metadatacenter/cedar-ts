// =====================================================================
// Time field family — time-of-day values at hour-minute / second /
// fractional-second precision
// =====================================================================
//
// TimeValue carries `value: string` (an xsd:time lexical form). The
// datatype is fixed at xsd:time and is not carried.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { SchemaArtifactMetadata } from '../metadata/index.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { LabelOverride } from '../embedded/label-override.js';
import type { Property } from '../embedded/property.js';
import type { TimeRenderingHint } from './rendering-hints.js';
import {
  type EmbeddedFieldInitCommon,
  assembleCommon,
  fieldRef,
} from './embedded-field-common.js';

// =====================================================================
// 1. Identifier
// =====================================================================

export interface TimeFieldId {
  readonly kind: 'TimeFieldId';
  readonly iri: Iri;
}


export const timeFieldId = (
  v: TimeFieldId | Iri | string,
): TimeFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'TimeFieldId') {
    return v as TimeFieldId;
  }
  return {
    kind: 'TimeFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface TimeValue {
  readonly kind: 'TimeValue';
  readonly value: string;
}

export type TimeValueInput = TimeValue | string;

export function timeValue(value: string): TimeValue;
export function timeValue(value: TimeValue): TimeValue;
export function timeValue(value: TimeValue | string): TimeValue {
  if (typeof value !== 'string') return value;
  return { kind: 'TimeValue', value };
}

export function isTimeValue(x: unknown): x is TimeValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'TimeValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export type TimePrecision =
  | 'hourMinute'
  | 'hourMinuteSecond'
  | 'hourMinuteSecondFraction';
export const TIME_PRECISIONS: readonly TimePrecision[] = Object.freeze([
  'hourMinute',
  'hourMinuteSecond',
  'hourMinuteSecondFraction',
]);

export type TimezoneRequirement = 'timezoneRequired' | 'timezoneNotRequired';
export const TIMEZONE_REQUIREMENTS: readonly TimezoneRequirement[] = Object.freeze([
  'timezoneRequired',
  'timezoneNotRequired',
]);

export interface TimeFieldSpec {
  readonly kind: 'TimeFieldSpec';
  readonly defaultValue?: TimeValue;
  readonly timePrecision?: TimePrecision;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: TimeRenderingHint;
}

export interface TimeFieldSpecInit {
  readonly defaultValue?: TimeValueInput;
  readonly timePrecision?: TimePrecision;
  readonly timezoneRequirement?: TimezoneRequirement;
  readonly renderingHint?: TimeRenderingHint;
}

export function timeFieldSpec(init: TimeFieldSpecInit = {}): TimeFieldSpec {
  const out: {
    kind: 'TimeFieldSpec';
    defaultValue?: TimeValue;
    timePrecision?: TimePrecision;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: TimeRenderingHint;
  } = { kind: 'TimeFieldSpec' };
  if (init.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? timeValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init.timePrecision !== undefined) out.timePrecision = init.timePrecision;
  if (init.timezoneRequirement !== undefined)
    out.timezoneRequirement = init.timezoneRequirement;
  if (init.renderingHint !== undefined) out.renderingHint = init.renderingHint;
  return out;
}

export const isTimeFieldSpec = (x: unknown): x is TimeFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TimeFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface TimeField {
  readonly kind: 'TimeField';
  readonly id: TimeFieldId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export interface TimeFieldInit {
  readonly id: TimeFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export const timeField = (init: TimeFieldInit): TimeField =>
  ({
    kind: 'TimeField',
    id: timeFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  });

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedTimeField {
  readonly kind: 'EmbeddedTimeField';
  readonly key: string;
  readonly artifactRef: TimeFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly property?: Property;
  readonly defaultValue?: TimeValue;
}

export interface EmbeddedTimeFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: TimeFieldId | TimeField;
  readonly defaultValue?: TimeValueInput;
}

export function embeddedTimeField(init: EmbeddedTimeFieldInit): EmbeddedTimeField {
  const out: EmbeddedTimeField = {
    ...assembleCommon(init),
    kind: 'EmbeddedTimeField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? timeValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
