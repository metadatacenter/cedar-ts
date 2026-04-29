import type { FieldKind } from './identity.js';
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

// A reusable Field artifact. Every concrete Field interface shares the same
// outer `kind: 'field'` discriminant; the inner `fieldKind` discriminant
// keeps the eighteen families distinct, and the `id` and `fieldSpec` types
// are pinned per family for compile-time alignment (a TextField cannot carry
// a NumericFieldSpec). Writing the families out as concrete interfaces
// (rather than parameterizing over a single Field<K>) keeps IDE hovers
// fully resolved and autocomplete hints concrete at the call site.

// ---- Concrete Field interfaces -----------------------------------------

export interface TextField {
  readonly kind: 'field';
  readonly fieldKind: 'text';
  readonly id: TextFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}

export interface NumericField {
  readonly kind: 'field';
  readonly fieldKind: 'numeric';
  readonly id: NumericFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}

export interface DateField {
  readonly kind: 'field';
  readonly fieldKind: 'date';
  readonly id: DateFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}

export interface TimeField {
  readonly kind: 'field';
  readonly fieldKind: 'time';
  readonly id: TimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}

export interface DateTimeField {
  readonly kind: 'field';
  readonly fieldKind: 'date_time';
  readonly id: DateTimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}

export interface ControlledTermField {
  readonly kind: 'field';
  readonly fieldKind: 'controlled_term';
  readonly id: ControlledTermFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}

export interface SingleChoiceField {
  readonly kind: 'field';
  readonly fieldKind: 'single_choice';
  readonly id: SingleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}

export interface MultipleChoiceField {
  readonly kind: 'field';
  readonly fieldKind: 'multiple_choice';
  readonly id: MultipleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}

export interface LinkField {
  readonly kind: 'field';
  readonly fieldKind: 'link';
  readonly id: LinkFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}

export interface EmailField {
  readonly kind: 'field';
  readonly fieldKind: 'email';
  readonly id: EmailFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}

export interface PhoneNumberField {
  readonly kind: 'field';
  readonly fieldKind: 'phone_number';
  readonly id: PhoneNumberFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}

export interface OrcidField {
  readonly kind: 'field';
  readonly fieldKind: 'orcid';
  readonly id: OrcidFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}

export interface RorField {
  readonly kind: 'field';
  readonly fieldKind: 'ror';
  readonly id: RorFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RorFieldSpec;
}

export interface DoiField {
  readonly kind: 'field';
  readonly fieldKind: 'doi';
  readonly id: DoiFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}

export interface PubMedIdField {
  readonly kind: 'field';
  readonly fieldKind: 'pub_med_id';
  readonly id: PubMedIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}

export interface RridField {
  readonly kind: 'field';
  readonly fieldKind: 'rrid';
  readonly id: RridFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}

export interface NihGrantIdField {
  readonly kind: 'field';
  readonly fieldKind: 'nih_grant_id';
  readonly id: NihGrantIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}

export interface AttributeValueField {
  readonly kind: 'field';
  readonly fieldKind: 'attribute_value';
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
  ({ kind: 'field', fieldKind: 'text', id: textFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const numericField = (init: NumericFieldInit): NumericField =>
  ({ kind: 'field', fieldKind: 'numeric', id: numericFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const dateField = (init: DateFieldInit): DateField =>
  ({ kind: 'field', fieldKind: 'date', id: dateFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const timeField = (init: TimeFieldInit): TimeField =>
  ({ kind: 'field', fieldKind: 'time', id: timeFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const dateTimeField = (init: DateTimeFieldInit): DateTimeField =>
  ({ kind: 'field', fieldKind: 'date_time', id: dateTimeFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const controlledTermField = (init: ControlledTermFieldInit): ControlledTermField =>
  ({ kind: 'field', fieldKind: 'controlled_term', id: controlledTermFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const singleChoiceField = (init: SingleChoiceFieldInit): SingleChoiceField =>
  ({ kind: 'field', fieldKind: 'single_choice', id: singleChoiceFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const multipleChoiceField = (init: MultipleChoiceFieldInit): MultipleChoiceField =>
  ({ kind: 'field', fieldKind: 'multiple_choice', id: multipleChoiceFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const linkField = (init: LinkFieldInit): LinkField =>
  ({ kind: 'field', fieldKind: 'link', id: linkFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const emailField = (init: EmailFieldInit): EmailField =>
  ({ kind: 'field', fieldKind: 'email', id: emailFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const phoneNumberField = (init: PhoneNumberFieldInit): PhoneNumberField =>
  ({ kind: 'field', fieldKind: 'phone_number', id: phoneNumberFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const orcidField = (init: OrcidFieldInit): OrcidField =>
  ({ kind: 'field', fieldKind: 'orcid', id: orcidFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const rorField = (init: RorFieldInit): RorField =>
  ({ kind: 'field', fieldKind: 'ror', id: rorFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const doiField = (init: DoiFieldInit): DoiField =>
  ({ kind: 'field', fieldKind: 'doi', id: doiFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const pubMedIdField = (init: PubMedIdFieldInit): PubMedIdField =>
  ({ kind: 'field', fieldKind: 'pub_med_id', id: pubMedIdFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const rridField = (init: RridFieldInit): RridField =>
  ({ kind: 'field', fieldKind: 'rrid', id: rridFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const nihGrantIdField = (init: NihGrantIdFieldInit): NihGrantIdField =>
  ({ kind: 'field', fieldKind: 'nih_grant_id', id: nihGrantIdFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });
export const attributeValueField = (init: AttributeValueFieldInit): AttributeValueField =>
  ({ kind: 'field', fieldKind: 'attribute_value', id: attributeValueFieldId(init.id), metadata: init.metadata, fieldSpec: init.fieldSpec });

// ---- Type guards -------------------------------------------------------

export function isField(x: unknown): x is Field {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'field'
  );
}

// Narrows a Field to the concrete family identified by `fieldKind`. The
// Extract<…> return type resolves to TextField when fieldKind is 'text',
// DateField when it is 'date', and so on.
export function isFieldOfKind<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is Extract<Field, { fieldKind: K }> {
  return isField(x) && x.fieldKind === fieldKind;
}
