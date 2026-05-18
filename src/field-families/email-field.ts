// =====================================================================
// Email field family — email address (RFC 5321 / 5322 lexical form)
// =====================================================================
//
// EmailValue carries `value: string` directly.

import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';
import type { EmailRenderingHint } from './rendering-hints.js';
import { type MultilingualString, type MultilingualStringInput, multilingualString } from '../multilingual.js';
import type { CatalogMetadata, SchemaArtifactVersioning } from '../metadata/index.js';
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

export interface EmailFieldId {
  readonly kind: 'EmailFieldId';
  readonly iri: Iri;
}


export const emailFieldId = (
  v: EmailFieldId | Iri | string,
): EmailFieldId => {
  if (typeof v !== 'string' && (v as { kind?: unknown }).kind === 'EmailFieldId') {
    return v as EmailFieldId;
  }
  return {
    kind: 'EmailFieldId',
    iri: typeof v === 'string' ? iri(v) : (v as Iri),
  };
};

// =====================================================================
// 2. Value
// =====================================================================

export interface EmailValue {
  readonly kind: 'EmailValue';
  readonly value: string;
}

export type EmailValueInput = EmailValue | string;

export function emailValue(value: string): EmailValue;
export function emailValue(value: EmailValue): EmailValue;
export function emailValue(value: EmailValue | string): EmailValue {
  if (typeof value !== 'string') return value;
  return { kind: 'EmailValue', value };
}

export function isEmailValue(x: unknown): x is EmailValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'EmailValue'
  );
}

// =====================================================================
// 3. FieldSpec
// =====================================================================

export interface EmailFieldSpec {
  readonly kind: 'EmailFieldSpec';
  readonly defaultValue?: EmailValue;
  readonly renderingHint?: EmailRenderingHint;
}

export interface EmailFieldSpecInit {
  readonly defaultValue?: EmailValueInput;
  readonly renderingHint?: EmailRenderingHint;
}

export function emailFieldSpec(init?: EmailFieldSpecInit): EmailFieldSpec {
  const out: { kind: 'EmailFieldSpec'; defaultValue?: EmailValue;
     renderingHint?: EmailRenderingHint;
  } = {
    kind: 'EmailFieldSpec',
  };
  if (init?.defaultValue !== undefined) {
    out.defaultValue =
      typeof init.defaultValue === 'string'
        ? emailValue(init.defaultValue)
        : init.defaultValue;
  }
  if (init?.renderingHint !== undefined)
    out.renderingHint = init.renderingHint;
  return out;
}
export const isEmailFieldSpec = (x: unknown): x is EmailFieldSpec =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'EmailFieldSpec';

// =====================================================================
// 4. Field artifact
// =====================================================================

export interface EmailField {
  readonly kind: 'EmailField';
  readonly id: EmailFieldId;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: EmailFieldSpec;
  readonly label: MultilingualString;
  readonly helpText?: MultilingualString;
}

export interface EmailFieldInit {
  readonly id: EmailFieldId | Iri | string;
  readonly modelVersion: string;
  readonly metadata: CatalogMetadata;
  readonly versioning: SchemaArtifactVersioning;
  readonly fieldSpec: EmailFieldSpec;
  readonly label: MultilingualStringInput;
  readonly helpText?: MultilingualString;
}

export const emailField = (init: EmailFieldInit): EmailField => {
  const out: EmailField = {
    kind: 'EmailField',
    id: emailFieldId(init.id),
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
    versioning: init.versioning,
    label: multilingualString(init.label),
    ...(init.helpText !== undefined && { helpText: init.helpText }),
  };
  return out;
};

// =====================================================================
// 5. EmbeddedField
// =====================================================================

export interface EmbeddedEmailField {
  readonly kind: 'EmbeddedEmailField';
  readonly key: string;
  readonly artifactRef: EmailFieldId;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly labelOverride?: LabelOverride;
  readonly helpTextOverride?: MultilingualString;
  readonly property?: Property;
  readonly defaultValue?: EmailValue;
}

export interface EmbeddedEmailFieldInit extends EmbeddedFieldInitCommon {
  readonly artifactRef: EmailFieldId | EmailField;
  readonly defaultValue?: EmailValueInput;
}

export function embeddedEmailField(init: EmbeddedEmailFieldInit): EmbeddedEmailField {
  const out: EmbeddedEmailField = {
    ...assembleCommon(init),
    kind: 'EmbeddedEmailField',
    artifactRef: fieldRef(init.artifactRef),
    ...(init.defaultValue !== undefined && {
      defaultValue:
        typeof init.defaultValue === 'string'
          ? emailValue(init.defaultValue)
          : init.defaultValue,
    }),
  };
  return out;
}
