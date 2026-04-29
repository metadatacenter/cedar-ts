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

// Each concrete FieldId interface carries the same outer `kind: 'field_id'`
// discriminant (distinguishing FieldId from TemplateId, etc.) plus an inner
// `fieldKind` discriminant that keeps the eighteen families distinct (so a
// TextFieldId cannot be assigned where a DateFieldId is required). Writing
// the families out as concrete interfaces keeps IDE hovers fully resolved.

export interface TextFieldId            { readonly kind: 'field_id'; readonly fieldKind: 'text';            readonly iri: Iri; }
export interface NumericFieldId         { readonly kind: 'field_id'; readonly fieldKind: 'numeric';         readonly iri: Iri; }
export interface DateFieldId            { readonly kind: 'field_id'; readonly fieldKind: 'date';            readonly iri: Iri; }
export interface TimeFieldId            { readonly kind: 'field_id'; readonly fieldKind: 'time';            readonly iri: Iri; }
export interface DateTimeFieldId        { readonly kind: 'field_id'; readonly fieldKind: 'date_time';       readonly iri: Iri; }
export interface ControlledTermFieldId  { readonly kind: 'field_id'; readonly fieldKind: 'controlled_term'; readonly iri: Iri; }
export interface SingleChoiceFieldId    { readonly kind: 'field_id'; readonly fieldKind: 'single_choice';   readonly iri: Iri; }
export interface MultipleChoiceFieldId  { readonly kind: 'field_id'; readonly fieldKind: 'multiple_choice'; readonly iri: Iri; }
export interface LinkFieldId            { readonly kind: 'field_id'; readonly fieldKind: 'link';            readonly iri: Iri; }
export interface EmailFieldId           { readonly kind: 'field_id'; readonly fieldKind: 'email';           readonly iri: Iri; }
export interface PhoneNumberFieldId     { readonly kind: 'field_id'; readonly fieldKind: 'phone_number';    readonly iri: Iri; }
export interface OrcidFieldId           { readonly kind: 'field_id'; readonly fieldKind: 'orcid';           readonly iri: Iri; }
export interface RorFieldId             { readonly kind: 'field_id'; readonly fieldKind: 'ror';             readonly iri: Iri; }
export interface DoiFieldId             { readonly kind: 'field_id'; readonly fieldKind: 'doi';             readonly iri: Iri; }
export interface PubMedIdFieldId        { readonly kind: 'field_id'; readonly fieldKind: 'pub_med_id';      readonly iri: Iri; }
export interface RridFieldId            { readonly kind: 'field_id'; readonly fieldKind: 'rrid';            readonly iri: Iri; }
export interface NihGrantIdFieldId      { readonly kind: 'field_id'; readonly fieldKind: 'nih_grant_id';    readonly iri: Iri; }
export interface AttributeValueFieldId  { readonly kind: 'field_id'; readonly fieldKind: 'attribute_value'; readonly iri: Iri; }

export type FieldId =
  | TextFieldId
  | NumericFieldId
  | DateFieldId
  | TimeFieldId
  | DateTimeFieldId
  | ControlledTermFieldId
  | SingleChoiceFieldId
  | MultipleChoiceFieldId
  | LinkFieldId
  | EmailFieldId
  | PhoneNumberFieldId
  | OrcidFieldId
  | RorFieldId
  | DoiFieldId
  | PubMedIdFieldId
  | RridFieldId
  | NihGrantIdFieldId
  | AttributeValueFieldId;

// FieldReference is structurally identical to FieldId; the alias family
// documents the role distinction (an identifier names a reusable artifact;
// a reference expresses the intention to embed it).
export type FieldReference = FieldId;
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

// Per-family constructors. Each is idempotent: accepts its own output type,
// an Iri, or a bare string IRI. The own-output passthrough lets downstream
// constructors (xxxField, embedded* helpers) call these unconditionally on
// inputs that may already be a typed FieldId.

const toIri = (v: Iri | string): Iri => (typeof v === 'string' ? iri(v) : v);
const isAlreadyFieldId = (v: object): v is { kind: 'field_id' } =>
  (v as { kind?: unknown }).kind === 'field_id';

export const textFieldId            = (v: TextFieldId            | Iri | string): TextFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as TextFieldId)            : { kind: 'field_id', fieldKind: 'text',            iri: toIri(v) };
export const numericFieldId         = (v: NumericFieldId         | Iri | string): NumericFieldId         => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as NumericFieldId)         : { kind: 'field_id', fieldKind: 'numeric',         iri: toIri(v) };
export const dateFieldId            = (v: DateFieldId            | Iri | string): DateFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DateFieldId)            : { kind: 'field_id', fieldKind: 'date',            iri: toIri(v) };
export const timeFieldId            = (v: TimeFieldId            | Iri | string): TimeFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as TimeFieldId)            : { kind: 'field_id', fieldKind: 'time',            iri: toIri(v) };
export const dateTimeFieldId        = (v: DateTimeFieldId        | Iri | string): DateTimeFieldId        => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DateTimeFieldId)        : { kind: 'field_id', fieldKind: 'date_time',       iri: toIri(v) };
export const controlledTermFieldId  = (v: ControlledTermFieldId  | Iri | string): ControlledTermFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as ControlledTermFieldId)  : { kind: 'field_id', fieldKind: 'controlled_term', iri: toIri(v) };
export const singleChoiceFieldId    = (v: SingleChoiceFieldId    | Iri | string): SingleChoiceFieldId    => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as SingleChoiceFieldId)    : { kind: 'field_id', fieldKind: 'single_choice',   iri: toIri(v) };
export const multipleChoiceFieldId  = (v: MultipleChoiceFieldId  | Iri | string): MultipleChoiceFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as MultipleChoiceFieldId)  : { kind: 'field_id', fieldKind: 'multiple_choice', iri: toIri(v) };
export const linkFieldId            = (v: LinkFieldId            | Iri | string): LinkFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as LinkFieldId)            : { kind: 'field_id', fieldKind: 'link',            iri: toIri(v) };
export const emailFieldId           = (v: EmailFieldId           | Iri | string): EmailFieldId           => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as EmailFieldId)           : { kind: 'field_id', fieldKind: 'email',           iri: toIri(v) };
export const phoneNumberFieldId     = (v: PhoneNumberFieldId     | Iri | string): PhoneNumberFieldId     => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as PhoneNumberFieldId)     : { kind: 'field_id', fieldKind: 'phone_number',    iri: toIri(v) };
export const orcidFieldId           = (v: OrcidFieldId           | Iri | string): OrcidFieldId           => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as OrcidFieldId)           : { kind: 'field_id', fieldKind: 'orcid',           iri: toIri(v) };
export const rorFieldId             = (v: RorFieldId             | Iri | string): RorFieldId             => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as RorFieldId)             : { kind: 'field_id', fieldKind: 'ror',             iri: toIri(v) };
export const doiFieldId             = (v: DoiFieldId             | Iri | string): DoiFieldId             => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DoiFieldId)             : { kind: 'field_id', fieldKind: 'doi',             iri: toIri(v) };
export const pubMedIdFieldId        = (v: PubMedIdFieldId        | Iri | string): PubMedIdFieldId        => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as PubMedIdFieldId)        : { kind: 'field_id', fieldKind: 'pub_med_id',      iri: toIri(v) };
export const rridFieldId            = (v: RridFieldId            | Iri | string): RridFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as RridFieldId)            : { kind: 'field_id', fieldKind: 'rrid',            iri: toIri(v) };
export const nihGrantIdFieldId      = (v: NihGrantIdFieldId      | Iri | string): NihGrantIdFieldId      => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as NihGrantIdFieldId)      : { kind: 'field_id', fieldKind: 'nih_grant_id',    iri: toIri(v) };
export const attributeValueFieldId  = (v: AttributeValueFieldId  | Iri | string): AttributeValueFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as AttributeValueFieldId)  : { kind: 'field_id', fieldKind: 'attribute_value', iri: toIri(v) };

export function isFieldId(x: unknown): x is FieldId {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'field_id'
  );
}

// Narrows a FieldId to the concrete family identified by `fieldKind`.
export function isFieldIdOf<K extends FieldKind>(
  x: unknown,
  fieldKind: K,
): x is Extract<FieldId, { fieldKind: K }> {
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
