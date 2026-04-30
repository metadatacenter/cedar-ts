import { type Iri, iri } from './leaves/index.js';

// FieldKind enumerates the 18 concrete field families. Used as the inner
// discriminant on FieldId and downstream structures (FieldSpec, EmbeddedField,
// DefaultValue) so the type system can keep families aligned without 18
// hand-written near-duplicate types per layer.
export type FieldKind =
  | 'Text'
  | 'Numeric'
  | 'Date'
  | 'Time'
  | 'DateTime'
  | 'ControlledTerm'
  | 'SingleChoice'
  | 'MultipleChoice'
  | 'Link'
  | 'Email'
  | 'PhoneNumber'
  | 'Orcid'
  | 'Ror'
  | 'Doi'
  | 'PubMedId'
  | 'Rrid'
  | 'NihGrantId'
  | 'AttributeValue';

export const FIELD_KINDS: readonly FieldKind[] = Object.freeze([
  'Text',
  'Numeric',
  'Date',
  'Time',
  'DateTime',
  'ControlledTerm',
  'SingleChoice',
  'MultipleChoice',
  'Link',
  'Email',
  'PhoneNumber',
  'Orcid',
  'Ror',
  'Doi',
  'PubMedId',
  'Rrid',
  'NihGrantId',
  'AttributeValue',
]);

export function isFieldKind(x: unknown): x is FieldKind {
  return typeof x === 'string' && (FIELD_KINDS as readonly string[]).includes(x);
}

// Each concrete FieldId interface carries the same outer `kind: 'FieldId'`
// discriminant (distinguishing FieldId from TemplateId, etc.) plus an inner
// `fieldKind` discriminant that keeps the eighteen families distinct (so a
// TextFieldId cannot be assigned where a DateFieldId is required). Writing
// the families out as concrete interfaces keeps IDE hovers fully resolved.

export interface TextFieldId            { readonly kind: 'FieldId'; readonly fieldKind: 'Text';            readonly iri: Iri; }
export interface NumericFieldId         { readonly kind: 'FieldId'; readonly fieldKind: 'Numeric';         readonly iri: Iri; }
export interface DateFieldId            { readonly kind: 'FieldId'; readonly fieldKind: 'Date';            readonly iri: Iri; }
export interface TimeFieldId            { readonly kind: 'FieldId'; readonly fieldKind: 'Time';            readonly iri: Iri; }
export interface DateTimeFieldId        { readonly kind: 'FieldId'; readonly fieldKind: 'DateTime';       readonly iri: Iri; }
export interface ControlledTermFieldId  { readonly kind: 'FieldId'; readonly fieldKind: 'ControlledTerm'; readonly iri: Iri; }
export interface SingleChoiceFieldId    { readonly kind: 'FieldId'; readonly fieldKind: 'SingleChoice';   readonly iri: Iri; }
export interface MultipleChoiceFieldId  { readonly kind: 'FieldId'; readonly fieldKind: 'MultipleChoice'; readonly iri: Iri; }
export interface LinkFieldId            { readonly kind: 'FieldId'; readonly fieldKind: 'Link';            readonly iri: Iri; }
export interface EmailFieldId           { readonly kind: 'FieldId'; readonly fieldKind: 'Email';           readonly iri: Iri; }
export interface PhoneNumberFieldId     { readonly kind: 'FieldId'; readonly fieldKind: 'PhoneNumber';    readonly iri: Iri; }
export interface OrcidFieldId           { readonly kind: 'FieldId'; readonly fieldKind: 'Orcid';           readonly iri: Iri; }
export interface RorFieldId             { readonly kind: 'FieldId'; readonly fieldKind: 'Ror';             readonly iri: Iri; }
export interface DoiFieldId             { readonly kind: 'FieldId'; readonly fieldKind: 'Doi';             readonly iri: Iri; }
export interface PubMedIdFieldId        { readonly kind: 'FieldId'; readonly fieldKind: 'PubMedId';      readonly iri: Iri; }
export interface RridFieldId            { readonly kind: 'FieldId'; readonly fieldKind: 'Rrid';            readonly iri: Iri; }
export interface NihGrantIdFieldId      { readonly kind: 'FieldId'; readonly fieldKind: 'NihGrantId';    readonly iri: Iri; }
export interface AttributeValueFieldId  { readonly kind: 'FieldId'; readonly fieldKind: 'AttributeValue'; readonly iri: Iri; }

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
const isAlreadyFieldId = (v: object): v is { kind: 'FieldId' } =>
  (v as { kind?: unknown }).kind === 'FieldId';

export const textFieldId            = (v: TextFieldId            | Iri | string): TextFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as TextFieldId)            : { kind: 'FieldId', fieldKind: 'Text',            iri: toIri(v) };
export const numericFieldId         = (v: NumericFieldId         | Iri | string): NumericFieldId         => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as NumericFieldId)         : { kind: 'FieldId', fieldKind: 'Numeric',         iri: toIri(v) };
export const dateFieldId            = (v: DateFieldId            | Iri | string): DateFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DateFieldId)            : { kind: 'FieldId', fieldKind: 'Date',            iri: toIri(v) };
export const timeFieldId            = (v: TimeFieldId            | Iri | string): TimeFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as TimeFieldId)            : { kind: 'FieldId', fieldKind: 'Time',            iri: toIri(v) };
export const dateTimeFieldId        = (v: DateTimeFieldId        | Iri | string): DateTimeFieldId        => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DateTimeFieldId)        : { kind: 'FieldId', fieldKind: 'DateTime',       iri: toIri(v) };
export const controlledTermFieldId  = (v: ControlledTermFieldId  | Iri | string): ControlledTermFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as ControlledTermFieldId)  : { kind: 'FieldId', fieldKind: 'ControlledTerm', iri: toIri(v) };
export const singleChoiceFieldId    = (v: SingleChoiceFieldId    | Iri | string): SingleChoiceFieldId    => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as SingleChoiceFieldId)    : { kind: 'FieldId', fieldKind: 'SingleChoice',   iri: toIri(v) };
export const multipleChoiceFieldId  = (v: MultipleChoiceFieldId  | Iri | string): MultipleChoiceFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as MultipleChoiceFieldId)  : { kind: 'FieldId', fieldKind: 'MultipleChoice', iri: toIri(v) };
export const linkFieldId            = (v: LinkFieldId            | Iri | string): LinkFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as LinkFieldId)            : { kind: 'FieldId', fieldKind: 'Link',            iri: toIri(v) };
export const emailFieldId           = (v: EmailFieldId           | Iri | string): EmailFieldId           => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as EmailFieldId)           : { kind: 'FieldId', fieldKind: 'Email',           iri: toIri(v) };
export const phoneNumberFieldId     = (v: PhoneNumberFieldId     | Iri | string): PhoneNumberFieldId     => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as PhoneNumberFieldId)     : { kind: 'FieldId', fieldKind: 'PhoneNumber',    iri: toIri(v) };
export const orcidFieldId           = (v: OrcidFieldId           | Iri | string): OrcidFieldId           => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as OrcidFieldId)           : { kind: 'FieldId', fieldKind: 'Orcid',           iri: toIri(v) };
export const rorFieldId             = (v: RorFieldId             | Iri | string): RorFieldId             => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as RorFieldId)             : { kind: 'FieldId', fieldKind: 'Ror',             iri: toIri(v) };
export const doiFieldId             = (v: DoiFieldId             | Iri | string): DoiFieldId             => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as DoiFieldId)             : { kind: 'FieldId', fieldKind: 'Doi',             iri: toIri(v) };
export const pubMedIdFieldId        = (v: PubMedIdFieldId        | Iri | string): PubMedIdFieldId        => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as PubMedIdFieldId)        : { kind: 'FieldId', fieldKind: 'PubMedId',      iri: toIri(v) };
export const rridFieldId            = (v: RridFieldId            | Iri | string): RridFieldId            => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as RridFieldId)            : { kind: 'FieldId', fieldKind: 'Rrid',            iri: toIri(v) };
export const nihGrantIdFieldId      = (v: NihGrantIdFieldId      | Iri | string): NihGrantIdFieldId      => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as NihGrantIdFieldId)      : { kind: 'FieldId', fieldKind: 'NihGrantId',    iri: toIri(v) };
export const attributeValueFieldId  = (v: AttributeValueFieldId  | Iri | string): AttributeValueFieldId  => typeof v !== 'string' && isAlreadyFieldId(v) ? (v as AttributeValueFieldId)  : { kind: 'FieldId', fieldKind: 'AttributeValue', iri: toIri(v) };

export function isFieldId(x: unknown): x is FieldId {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'FieldId'
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
  readonly kind: 'TemplateId';
  readonly iri: Iri;
}

export function templateId(value: Iri | string): TemplateId {
  return {
    kind: 'TemplateId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateId = (x: unknown): x is TemplateId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateId';

export interface PresentationComponentId {
  readonly kind: 'PresentationComponentId';
  readonly iri: Iri;
}

export function presentationComponentId(value: Iri | string): PresentationComponentId {
  return {
    kind: 'PresentationComponentId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isPresentationComponentId = (x: unknown): x is PresentationComponentId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'PresentationComponentId';

export interface TemplateInstanceId {
  readonly kind: 'TemplateInstanceId';
  readonly iri: Iri;
}

export function templateInstanceId(value: Iri | string): TemplateInstanceId {
  return {
    kind: 'TemplateInstanceId',
    iri: typeof value === 'string' ? iri(value) : value,
  };
}

export const isTemplateInstanceId = (x: unknown): x is TemplateInstanceId =>
  typeof x === 'object' && x !== null &&
  (x as { kind?: unknown }).kind === 'TemplateInstanceId';

// References mirror their identifier shapes.
export type TemplateReference = TemplateId;
export type PresentationComponentReference = PresentationComponentId;

// Union of all artifact identifier shapes.
export type ArtifactIdentifier =
  | FieldId
  | TemplateId
  | PresentationComponentId
  | TemplateInstanceId;
