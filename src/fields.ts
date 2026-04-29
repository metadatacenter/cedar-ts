import type { FieldKind, FieldId } from './identity.js';
import type { SchemaArtifactMetadata } from './metadata/index.js';
import type { FieldSpecFor } from './field-specs/index.js';

// A reusable Field artifact. The type-level link between FieldId<K>,
// FieldSpecFor<K>, and the local fieldKind tag enforces family alignment:
// a TextField (Field<'text'>) can only carry a TextFieldId and a TextFieldSpec.
//
// `kind: 'field'` is the discriminant against other artifact unions
// (Template, PresentationComponent, TemplateInstance). `fieldKind` is the
// inner family discriminant for narrowing across the 18 variants.
export interface Field<K extends FieldKind = FieldKind> {
  readonly kind: 'field';
  readonly fieldKind: K;
  readonly id: FieldId<K>;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: FieldSpecFor<K>;
}

export interface FieldInit<K extends FieldKind> {
  readonly fieldKind: K;
  readonly id: FieldId<K>;
  readonly metadata: SchemaArtifactMetadata;
  readonly fieldSpec: FieldSpecFor<K>;
}

// Generic constructor.
export function field<K extends FieldKind>(init: FieldInit<K>): Field<K> {
  return {
    kind: 'field',
    fieldKind: init.fieldKind,
    id: init.id,
    metadata: init.metadata,
    fieldSpec: init.fieldSpec,
  };
}

// ----- Per-family aliases and helpers -----
//
// Each helper takes the init shape sans the redundant `fieldKind` and pins
// it to the corresponding family at the type level. They are pure ergonomic
// wrappers; calling field({...}) directly works identically.

export type TextField            = Field<'text'>;
export type NumericField         = Field<'numeric'>;
export type DateField            = Field<'date'>;
export type TimeField            = Field<'time'>;
export type DateTimeField        = Field<'date_time'>;
export type ControlledTermField  = Field<'controlled_term'>;
export type SingleChoiceField    = Field<'single_choice'>;
export type MultipleChoiceField  = Field<'multiple_choice'>;
export type LinkField            = Field<'link'>;
export type EmailField           = Field<'email'>;
export type PhoneNumberField     = Field<'phone_number'>;
export type OrcidField           = Field<'orcid'>;
export type RorField             = Field<'ror'>;
export type DoiField             = Field<'doi'>;
export type PubMedIdField        = Field<'pub_med_id'>;
export type RridField            = Field<'rrid'>;
export type NihGrantIdField      = Field<'nih_grant_id'>;
export type AttributeValueField  = Field<'attribute_value'>;

type FamilyInit<K extends FieldKind> = Omit<FieldInit<K>, 'fieldKind'>;

const fieldOf =
  <K extends FieldKind>(fieldKind: K) =>
  (init: FamilyInit<K>): Field<K> =>
    field({ fieldKind, ...init });

export const textField            = fieldOf('text');
export const numericField         = fieldOf('numeric');
export const dateField            = fieldOf('date');
export const timeField            = fieldOf('time');
export const dateTimeField        = fieldOf('date_time');
export const controlledTermField  = fieldOf('controlled_term');
export const singleChoiceField    = fieldOf('single_choice');
export const multipleChoiceField  = fieldOf('multiple_choice');
export const linkField            = fieldOf('link');
export const emailField           = fieldOf('email');
export const phoneNumberField     = fieldOf('phone_number');
export const orcidField           = fieldOf('orcid');
export const rorField             = fieldOf('ror');
export const doiField             = fieldOf('doi');
export const pubMedIdField        = fieldOf('pub_med_id');
export const rridField            = fieldOf('rrid');
export const nihGrantIdField      = fieldOf('nih_grant_id');
export const attributeValueField  = fieldOf('attribute_value');

export function isField(x: unknown): x is Field {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'field'
  );
}

export function isFieldOfKind<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is Field<K> {
  return isField(x) && x.fieldKind === fieldKind;
}
