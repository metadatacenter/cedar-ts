import { type Iri, iri } from './leaves/index.js';

// FieldKind enumerates the 18 concrete field families. Used as the inner
// discriminant on FieldId and downstream structures (FieldSpec, EmbeddedField,
// DefaultValue) so the type system can keep families aligned without 18
// hand-written near-duplicate types per layer.
export type FieldKind =
  | 'text'
  | 'numeric'
  | 'date'
  | 'time'
  | 'date_time'
  | 'controlled_term'
  | 'single_choice'
  | 'multiple_choice'
  | 'link'
  | 'email'
  | 'phone_number'
  | 'orcid'
  | 'ror'
  | 'doi'
  | 'pub_med_id'
  | 'rrid'
  | 'nih_grant_id'
  | 'attribute_value';

export const FIELD_KINDS: readonly FieldKind[] = Object.freeze([
  'text',
  'numeric',
  'date',
  'time',
  'date_time',
  'controlled_term',
  'single_choice',
  'multiple_choice',
  'link',
  'email',
  'phone_number',
  'orcid',
  'ror',
  'doi',
  'pub_med_id',
  'rrid',
  'nih_grant_id',
  'attribute_value',
]);

export function isFieldKind(x: unknown): x is FieldKind {
  return typeof x === 'string' && (FIELD_KINDS as readonly string[]).includes(x);
}

// FieldId is generic over its field kind. The outer `kind: 'field_id'` is the
// top-level discriminant that distinguishes FieldId from TemplateId etc. The
// inner `fieldKind` is the second-level discriminant that keeps families apart
// (so a TextFieldId cannot be assigned where a DateFieldId is required).
export interface FieldId<K extends FieldKind = FieldKind> {
  readonly kind: 'field_id';
  readonly fieldKind: K;
  readonly iri: Iri;
}

// FieldReference is structurally identical to FieldId; the alias documents
// the role distinction (an identifier names a reusable artifact; a reference
// expresses the intention to embed it).
export type FieldReference<K extends FieldKind = FieldKind> = FieldId<K>;

// Convenience aliases for each field family.
export type TextFieldId            = FieldId<'text'>;
export type NumericFieldId         = FieldId<'numeric'>;
export type DateFieldId            = FieldId<'date'>;
export type TimeFieldId            = FieldId<'time'>;
export type DateTimeFieldId        = FieldId<'date_time'>;
export type ControlledTermFieldId  = FieldId<'controlled_term'>;
export type SingleChoiceFieldId    = FieldId<'single_choice'>;
export type MultipleChoiceFieldId  = FieldId<'multiple_choice'>;
export type LinkFieldId            = FieldId<'link'>;
export type EmailFieldId           = FieldId<'email'>;
export type PhoneNumberFieldId     = FieldId<'phone_number'>;
export type OrcidFieldId           = FieldId<'orcid'>;
export type RorFieldId             = FieldId<'ror'>;
export type DoiFieldId             = FieldId<'doi'>;
export type PubMedIdFieldId        = FieldId<'pub_med_id'>;
export type RridFieldId            = FieldId<'rrid'>;
export type NihGrantIdFieldId      = FieldId<'nih_grant_id'>;
export type AttributeValueFieldId  = FieldId<'attribute_value'>;

export type TextFieldReference            = TextFieldId;
export type NumericFieldReference         = NumericFieldId;
export type DateFieldReference            = DateFieldId;
export type TimeFieldReference            = TimeFieldId;
export type DateTimeFieldReference        = DateTimeFieldId;
export type ControlledTermFieldReference  = ControlledTermFieldId;
export type SingleChoiceFieldReference    = SingleChoiceFieldId;
export type MultipleChoiceFieldReference  = MultipleChoiceFieldId;
export type LinkFieldReference            = LinkFieldId;
export type EmailFieldReference           = EmailFieldId;
export type PhoneNumberFieldReference     = PhoneNumberFieldId;
export type OrcidFieldReference           = OrcidFieldId;
export type RorFieldReference             = RorFieldId;
export type DoiFieldReference             = DoiFieldId;
export type PubMedIdFieldReference        = PubMedIdFieldId;
export type RridFieldReference            = RridFieldId;
export type NihGrantIdFieldReference      = NihGrantIdFieldId;
export type AttributeValueFieldReference  = AttributeValueFieldId;

// Generic constructor. The field-kind-specific helpers below are convenience
// wrappers; either form yields the same shape.
export function fieldId<K extends FieldKind>(
  fieldKind: K,
  value: Iri | string,
): FieldId<K> {
  return {
    kind: 'field_id',
    fieldKind,
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const textFieldId            = (v: Iri | string): TextFieldId            => fieldId('text', v);
export const numericFieldId         = (v: Iri | string): NumericFieldId         => fieldId('numeric', v);
export const dateFieldId            = (v: Iri | string): DateFieldId            => fieldId('date', v);
export const timeFieldId            = (v: Iri | string): TimeFieldId            => fieldId('time', v);
export const dateTimeFieldId        = (v: Iri | string): DateTimeFieldId        => fieldId('date_time', v);
export const controlledTermFieldId  = (v: Iri | string): ControlledTermFieldId  => fieldId('controlled_term', v);
export const singleChoiceFieldId    = (v: Iri | string): SingleChoiceFieldId    => fieldId('single_choice', v);
export const multipleChoiceFieldId  = (v: Iri | string): MultipleChoiceFieldId  => fieldId('multiple_choice', v);
export const linkFieldId            = (v: Iri | string): LinkFieldId            => fieldId('link', v);
export const emailFieldId           = (v: Iri | string): EmailFieldId           => fieldId('email', v);
export const phoneNumberFieldId     = (v: Iri | string): PhoneNumberFieldId     => fieldId('phone_number', v);
export const orcidFieldId           = (v: Iri | string): OrcidFieldId           => fieldId('orcid', v);
export const rorFieldId             = (v: Iri | string): RorFieldId             => fieldId('ror', v);
export const doiFieldId             = (v: Iri | string): DoiFieldId             => fieldId('doi', v);
export const pubMedIdFieldId        = (v: Iri | string): PubMedIdFieldId        => fieldId('pub_med_id', v);
export const rridFieldId            = (v: Iri | string): RridFieldId            => fieldId('rrid', v);
export const nihGrantIdFieldId      = (v: Iri | string): NihGrantIdFieldId      => fieldId('nih_grant_id', v);
export const attributeValueFieldId  = (v: Iri | string): AttributeValueFieldId  => fieldId('attribute_value', v);

export function isFieldId(x: unknown): x is FieldId {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'field_id'
  );
}

export function isFieldIdOf<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is FieldId<K> {
  return isFieldId(x) && x.fieldKind === fieldKind;
}

// ----- Other artifact identifiers -----

export interface TemplateId {
  readonly kind: 'template_id';
  readonly iri: Iri;
}

export function templateId(value: Iri | string): TemplateId {
  return {
    kind: 'template_id',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateId = (x: unknown): x is TemplateId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'template_id';

export interface PresentationComponentId {
  readonly kind: 'presentation_component_id';
  readonly iri: Iri;
}

export function presentationComponentId(value: Iri | string): PresentationComponentId {
  return {
    kind: 'presentation_component_id',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isPresentationComponentId = (x: unknown): x is PresentationComponentId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'presentation_component_id';

export interface TemplateInstanceId {
  readonly kind: 'template_instance_id';
  readonly iri: Iri;
}

export function templateInstanceId(value: Iri | string): TemplateInstanceId {
  return {
    kind: 'template_instance_id',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateInstanceId = (x: unknown): x is TemplateInstanceId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'template_instance_id';

// References mirror their identifier shapes.
export type TemplateReference = TemplateId;
export type PresentationComponentReference = PresentationComponentId;

// Union of all artifact identifier shapes.
export type ArtifactIdentifier =
  | FieldId
  | TemplateId
  | PresentationComponentId
  | TemplateInstanceId;
