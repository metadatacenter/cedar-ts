import type { FieldKind } from './identity.js';
import type {
  TextFieldId,
  NumericFieldId,
  DateFieldId,
  TimeFieldId,
  DateTimeFieldId,
  ControlledTermFieldId,
  SingleChoiceFieldId,
  MultipleChoiceFieldId,
  LinkFieldId,
  EmailFieldId,
  PhoneNumberFieldId,
  OrcidFieldId,
  RorFieldId,
  DoiFieldId,
  PubMedIdFieldId,
  RridFieldId,
  NihGrantIdFieldId,
  AttributeValueFieldId,
} from './identity.js';
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
// Same shape as the corresponding Field minus the constant `kind` and
// `fieldKind` discriminants the constructor injects.

export interface TextFieldInit {
  readonly id: TextFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TextFieldSpec;
}
export interface NumericFieldInit {
  readonly id: NumericFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NumericFieldSpec;
}
export interface DateFieldInit {
  readonly id: DateFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateFieldSpec;
}
export interface TimeFieldInit {
  readonly id: TimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: TimeFieldSpec;
}
export interface DateTimeFieldInit {
  readonly id: DateTimeFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DateTimeFieldSpec;
}
export interface ControlledTermFieldInit {
  readonly id: ControlledTermFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: ControlledTermFieldSpec;
}
export interface SingleChoiceFieldInit {
  readonly id: SingleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: SingleChoiceFieldSpec;
}
export interface MultipleChoiceFieldInit {
  readonly id: MultipleChoiceFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: MultipleChoiceFieldSpec;
}
export interface LinkFieldInit {
  readonly id: LinkFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: LinkFieldSpec;
}
export interface EmailFieldInit {
  readonly id: EmailFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: EmailFieldSpec;
}
export interface PhoneNumberFieldInit {
  readonly id: PhoneNumberFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PhoneNumberFieldSpec;
}
export interface OrcidFieldInit {
  readonly id: OrcidFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: OrcidFieldSpec;
}
export interface RorFieldInit {
  readonly id: RorFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RorFieldSpec;
}
export interface DoiFieldInit {
  readonly id: DoiFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: DoiFieldSpec;
}
export interface PubMedIdFieldInit {
  readonly id: PubMedIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: PubMedIdFieldSpec;
}
export interface RridFieldInit {
  readonly id: RridFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: RridFieldSpec;
}
export interface NihGrantIdFieldInit {
  readonly id: NihGrantIdFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: NihGrantIdFieldSpec;
}
export interface AttributeValueFieldInit {
  readonly id: AttributeValueFieldId;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: AttributeValueFieldSpec;
}

// ---- Per-family constructors -------------------------------------------

export const textField = (init: TextFieldInit): TextField =>
  ({ kind: 'field', fieldKind: 'text', ...init });
export const numericField = (init: NumericFieldInit): NumericField =>
  ({ kind: 'field', fieldKind: 'numeric', ...init });
export const dateField = (init: DateFieldInit): DateField =>
  ({ kind: 'field', fieldKind: 'date', ...init });
export const timeField = (init: TimeFieldInit): TimeField =>
  ({ kind: 'field', fieldKind: 'time', ...init });
export const dateTimeField = (init: DateTimeFieldInit): DateTimeField =>
  ({ kind: 'field', fieldKind: 'date_time', ...init });
export const controlledTermField = (init: ControlledTermFieldInit): ControlledTermField =>
  ({ kind: 'field', fieldKind: 'controlled_term', ...init });
export const singleChoiceField = (init: SingleChoiceFieldInit): SingleChoiceField =>
  ({ kind: 'field', fieldKind: 'single_choice', ...init });
export const multipleChoiceField = (init: MultipleChoiceFieldInit): MultipleChoiceField =>
  ({ kind: 'field', fieldKind: 'multiple_choice', ...init });
export const linkField = (init: LinkFieldInit): LinkField =>
  ({ kind: 'field', fieldKind: 'link', ...init });
export const emailField = (init: EmailFieldInit): EmailField =>
  ({ kind: 'field', fieldKind: 'email', ...init });
export const phoneNumberField = (init: PhoneNumberFieldInit): PhoneNumberField =>
  ({ kind: 'field', fieldKind: 'phone_number', ...init });
export const orcidField = (init: OrcidFieldInit): OrcidField =>
  ({ kind: 'field', fieldKind: 'orcid', ...init });
export const rorField = (init: RorFieldInit): RorField =>
  ({ kind: 'field', fieldKind: 'ror', ...init });
export const doiField = (init: DoiFieldInit): DoiField =>
  ({ kind: 'field', fieldKind: 'doi', ...init });
export const pubMedIdField = (init: PubMedIdFieldInit): PubMedIdField =>
  ({ kind: 'field', fieldKind: 'pub_med_id', ...init });
export const rridField = (init: RridFieldInit): RridField =>
  ({ kind: 'field', fieldKind: 'rrid', ...init });
export const nihGrantIdField = (init: NihGrantIdFieldInit): NihGrantIdField =>
  ({ kind: 'field', fieldKind: 'nih_grant_id', ...init });
export const attributeValueField = (init: AttributeValueFieldInit): AttributeValueField =>
  ({ kind: 'field', fieldKind: 'attribute_value', ...init });

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
