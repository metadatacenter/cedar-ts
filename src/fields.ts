import {
  type TextFieldId,
  type NumericFieldId,
  type DateFieldId,
  type TimeFieldId,
  type DateTimeFieldId,
  type ControlledTermFieldId,
  type SingleChoiceFieldId,
  type MultipleChoiceFieldId,
  type LinkFieldId,
  type EmailFieldId,
  type PhoneNumberFieldId,
  type OrcidFieldId,
  type RorFieldId,
  type DoiFieldId,
  type PubMedIdFieldId,
  type RridFieldId,
  type NihGrantIdFieldId,
  type AttributeValueFieldId,
  textFieldId,
  numericFieldId,
  dateFieldId,
  timeFieldId,
  dateTimeFieldId,
  controlledTermFieldId,
  singleChoiceFieldId,
  multipleChoiceFieldId,
  linkFieldId,
  emailFieldId,
  phoneNumberFieldId,
  orcidFieldId,
  rorFieldId,
  doiFieldId,
  pubMedIdFieldId,
  rridFieldId,
  nihGrantIdFieldId,
  attributeValueFieldId,
} from './identity.js';
import type { Iri } from './leaves/index.js';
import type { SchemaArtifactMetadata } from './metadata/index.js';
import type {
  TextFieldSpec,
  NumericFieldSpec,
  DateFieldSpec,
  TimeFieldSpec,
  DateTimeFieldSpec,
  ControlledTermFieldSpec,
  SingleChoiceFieldSpec,
  MultipleChoiceFieldSpec,
  LinkFieldSpec,
  EmailFieldSpec,
  PhoneNumberFieldSpec,
  OrcidFieldSpec,
  RorFieldSpec,
  DoiFieldSpec,
  PubMedIdFieldSpec,
  RridFieldSpec,
  NihGrantIdFieldSpec,
  AttributeValueFieldSpec,
} from './field-specs/index.js';

// A reusable Field artifact. The 18 concrete Field interfaces each carry a
// per-variant `kind` discriminant matching the interface name (TextField,
// NumericField, …); narrowing on `kind` is the idiomatic TypeScript pattern.
// The `id` and `fieldSpec` types are pinned per family for compile-time
// alignment (a TextField cannot carry a NumericFieldSpec). Writing the
// families out as concrete interfaces (rather than parameterizing over a
// single Field<K>) keeps IDE hovers fully resolved and autocomplete hints
// concrete at the call site.

// ---- Concrete Field interfaces -----------------------------------------

export interface TextField {
  readonly kind: 'TextField';
  readonly id: TextFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export interface NumericField {
  readonly kind: 'NumericField';
  readonly id: NumericFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}

export interface DateField {
  readonly kind: 'DateField';
  readonly id: DateFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}

export interface TimeField {
  readonly kind: 'TimeField';
  readonly id: TimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export interface DateTimeField {
  readonly kind: 'DateTimeField';
  readonly id: DateTimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}

export interface ControlledTermField {
  readonly kind: 'ControlledTermField';
  readonly id: ControlledTermFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}

export interface SingleChoiceField {
  readonly kind: 'SingleChoiceField';
  readonly id: SingleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}

export interface MultipleChoiceField {
  readonly kind: 'MultipleChoiceField';
  readonly id: MultipleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export interface LinkField {
  readonly kind: 'LinkField';
  readonly id: LinkFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}

export interface EmailField {
  readonly kind: 'EmailField';
  readonly id: EmailFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export interface PhoneNumberField {
  readonly kind: 'PhoneNumberField';
  readonly id: PhoneNumberFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export interface OrcidField {
  readonly kind: 'OrcidField';
  readonly id: OrcidFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export interface RorField {
  readonly kind: 'RorField';
  readonly id: RorFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RorFieldSpec;
}

export interface DoiField {
  readonly kind: 'DoiField';
  readonly id: DoiFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export interface PubMedIdField {
  readonly kind: 'PubMedIdField';
  readonly id: PubMedIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}

export interface RridField {
  readonly kind: 'RridField';
  readonly id: RridFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export interface NihGrantIdField {
  readonly kind: 'NihGrantIdField';
  readonly id: NihGrantIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}

export interface AttributeValueField {
  readonly kind: 'AttributeValueField';
  readonly id: AttributeValueFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: AttributeValueFieldSpec;
}

// ---- Discriminated union -----------------------------------------------

export type Field =
  | TextField
  | NumericField
  | DateField
  | TimeField
  | DateTimeField
  | ControlledTermField
  | SingleChoiceField
  | MultipleChoiceField
  | LinkField
  | EmailField
  | PhoneNumberField
  | OrcidField
  | RorField
  | DoiField
  | PubMedIdField
  | RridField
  | NihGrantIdField
  | AttributeValueField;

// ---- Init types (per family) ------------------------------------------
//
// `id` accepts the typed XxxFieldId, an Iri, or a bare string IRI. The
// constructor coerces via the corresponding xxxFieldId() helper (idempotent).

export interface TextFieldInit {
  readonly id: TextFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}
export interface NumericFieldInit {
  readonly id: NumericFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}
export interface DateFieldInit {
  readonly id: DateFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}
export interface TimeFieldInit {
  readonly id: TimeFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}
export interface DateTimeFieldInit {
  readonly id: DateTimeFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}
export interface ControlledTermFieldInit {
  readonly id: ControlledTermFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}
export interface SingleChoiceFieldInit {
  readonly id: SingleChoiceFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}
export interface MultipleChoiceFieldInit {
  readonly id: MultipleChoiceFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}
export interface LinkFieldInit {
  readonly id: LinkFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}
export interface EmailFieldInit {
  readonly id: EmailFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}
export interface PhoneNumberFieldInit {
  readonly id: PhoneNumberFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}
export interface OrcidFieldInit {
  readonly id: OrcidFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}
export interface RorFieldInit {
  readonly id: RorFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RorFieldSpec;
}
export interface DoiFieldInit {
  readonly id: DoiFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}
export interface PubMedIdFieldInit {
  readonly id: PubMedIdFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}
export interface RridFieldInit {
  readonly id: RridFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}
export interface NihGrantIdFieldInit {
  readonly id: NihGrantIdFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}
export interface AttributeValueFieldInit {
  readonly id: AttributeValueFieldId | Iri | string;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: AttributeValueFieldSpec;
}

// ---- Per-family constructors -------------------------------------------

export const textField = (init: TextFieldInit): TextField =>
  ({ kind: 'TextField', id: textFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const numericField = (init: NumericFieldInit): NumericField =>
  ({ kind: 'NumericField', id: numericFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const dateField = (init: DateFieldInit): DateField =>
  ({ kind: 'DateField', id: dateFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const timeField = (init: TimeFieldInit): TimeField =>
  ({ kind: 'TimeField', id: timeFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const dateTimeField = (init: DateTimeFieldInit): DateTimeField =>
  ({ kind: 'DateTimeField', id: dateTimeFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const controlledTermField = (init: ControlledTermFieldInit): ControlledTermField =>
  ({ kind: 'ControlledTermField', id: controlledTermFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const singleChoiceField = (init: SingleChoiceFieldInit): SingleChoiceField =>
  ({ kind: 'SingleChoiceField', id: singleChoiceFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const multipleChoiceField = (init: MultipleChoiceFieldInit): MultipleChoiceField =>
  ({ kind: 'MultipleChoiceField', id: multipleChoiceFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const linkField = (init: LinkFieldInit): LinkField =>
  ({ kind: 'LinkField', id: linkFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const emailField = (init: EmailFieldInit): EmailField =>
  ({ kind: 'EmailField', id: emailFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const phoneNumberField = (init: PhoneNumberFieldInit): PhoneNumberField =>
  ({ kind: 'PhoneNumberField', id: phoneNumberFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const orcidField = (init: OrcidFieldInit): OrcidField =>
  ({ kind: 'OrcidField', id: orcidFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const rorField = (init: RorFieldInit): RorField =>
  ({ kind: 'RorField', id: rorFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const doiField = (init: DoiFieldInit): DoiField =>
  ({ kind: 'DoiField', id: doiFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const pubMedIdField = (init: PubMedIdFieldInit): PubMedIdField =>
  ({ kind: 'PubMedIdField', id: pubMedIdFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const rridField = (init: RridFieldInit): RridField =>
  ({ kind: 'RridField', id: rridFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const nihGrantIdField = (init: NihGrantIdFieldInit): NihGrantIdField =>
  ({ kind: 'NihGrantIdField', id: nihGrantIdFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const attributeValueField = (init: AttributeValueFieldInit): AttributeValueField =>
  ({ kind: 'AttributeValueField', id: attributeValueFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// ---- Type guards -------------------------------------------------------

// Set of every Field-family `kind` discriminant. Used by `isField` for a
// constant-time membership check across the 18 variants.
const FIELD_KINDS: ReadonlySet<string> = new Set([
  'TextField',
  'NumericField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleChoiceField',
  'MultipleChoiceField',
  'LinkField',
  'EmailField',
  'PhoneNumberField',
  'OrcidField',
  'RorField',
  'DoiField',
  'PubMedIdField',
  'RridField',
  'NihGrantIdField',
  'AttributeValueField',
]);

export function isField(x: unknown): x is Field {
  return (
    typeof x === 'object' && x !== null &&
    FIELD_KINDS.has((x as { kind?: unknown }).kind as string)
  );
}
