export {
  type TextRenderingHint,
  TEXT_RENDERING_HINTS,
  type SingleChoiceRenderingHint,
  SINGLE_CHOICE_RENDERING_HINTS,
  type MultipleChoiceRenderingHint,
  MULTIPLE_CHOICE_RENDERING_HINTS,
  type NumericRenderingHint,
  type DateComponentOrder,
  DATE_COMPONENT_ORDERS,
  type TimeFormat,
  TIME_FORMATS,
  type DateRenderingHint,
  type TimeRenderingHint,
  type DateTimeRenderingHint,
  type RenderingHint,
  dateRenderingHint,
  timeRenderingHint,
  dateTimeRenderingHint,
} from './rendering-hints.js';

export {
  type TextFieldSpec,
  type TextFieldSpecInit,
  textFieldSpec,
  isTextFieldSpec,
} from './text.js';

export {
  type Unit,
  type UnitInit,
  unit,
  type NumericFieldSpec,
  type NumericFieldSpecInit,
  numericFieldSpec,
  isNumericFieldSpec,
} from './numeric.js';

export {
  type DateValueType,
  DATE_VALUE_TYPES,
  type TimePrecision,
  TIME_PRECISIONS,
  type DateTimeValueType,
  DATE_TIME_VALUE_TYPES,
  type TimezoneRequirement,
  TIMEZONE_REQUIREMENTS,
  type DateFieldSpec,
  type DateFieldSpecInit,
  dateFieldSpec,
  isDateFieldSpec,
  type TimeFieldSpec,
  type TimeFieldSpecInit,
  timeFieldSpec,
  isTimeFieldSpec,
  type DateTimeFieldSpec,
  type DateTimeFieldSpecInit,
  dateTimeFieldSpec,
  isDateTimeFieldSpec,
  type TemporalFieldSpec,
} from './temporal.js';

export {
  type OntologyDisplayHint,
  type OntologyDisplayHintInit,
  ontologyDisplayHint,
  type OntologyReference,
  type OntologyReferenceInit,
  ontologyReference,
  type OntologySource,
  ontologySource,
  type BranchSource,
  type BranchSourceInit,
  branchSource,
  type ControlledTermClass,
  type ControlledTermClassInit,
  controlledTermClass,
  type ClassSource,
  classSource,
  type ValueSetSource,
  type ValueSetSourceInit,
  valueSetSource,
  type ControlledTermSource,
  type ControlledTermFieldSpec,
  controlledTermFieldSpec,
  isControlledTermFieldSpec,
} from './controlled-term.js';

export {
  type LiteralChoiceOption,
  literalChoiceOption,
  type ControlledTermChoiceOption,
  controlledTermChoiceOption,
  type LiteralSingleChoiceFieldSpec,
  literalSingleChoiceFieldSpec,
  type ControlledTermSingleChoiceFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  type LiteralMultipleChoiceFieldSpec,
  literalMultipleChoiceFieldSpec,
  type ControlledTermMultipleChoiceFieldSpec,
  controlledTermMultipleChoiceFieldSpec,
  type SingleChoiceFieldSpec,
  type MultipleChoiceFieldSpec,
  type ChoiceFieldSpec,
  isLiteralSingleChoiceFieldSpec,
  isControlledTermSingleChoiceFieldSpec,
  isLiteralMultipleChoiceFieldSpec,
  isControlledTermMultipleChoiceFieldSpec,
  isSingleChoiceFieldSpec,
  isMultipleChoiceFieldSpec,
  isChoiceFieldSpec,
} from './choice.js';

export {
  type LinkFieldSpec,
  linkFieldSpec,
  isLinkFieldSpec,
} from './link.js';

export {
  type EmailFieldSpec,
  emailFieldSpec,
  isEmailFieldSpec,
  type PhoneNumberFieldSpec,
  phoneNumberFieldSpec,
  isPhoneNumberFieldSpec,
  type ContactFieldSpec,
} from './contact.js';

export {
  type OrcidFieldSpec,
  orcidFieldSpec,
  isOrcidFieldSpec,
  type RorFieldSpec,
  rorFieldSpec,
  isRorFieldSpec,
  type DoiFieldSpec,
  doiFieldSpec,
  isDoiFieldSpec,
  type PubMedIdFieldSpec,
  pubMedIdFieldSpec,
  isPubMedIdFieldSpec,
  type RridFieldSpec,
  rridFieldSpec,
  isRridFieldSpec,
  type NihGrantIdFieldSpec,
  nihGrantIdFieldSpec,
  isNihGrantIdFieldSpec,
  type ExternalAuthorityFieldSpec,
  isExternalAuthorityFieldSpec,
} from './external-authority.js';

export {
  type AttributeValueFieldSpec,
  attributeValueFieldSpec,
  isAttributeValueFieldSpec,
} from './attribute.js';

import type { TextFieldSpec } from './text.js';
import type { NumericFieldSpec } from './numeric.js';
import type {
  DateFieldSpec,
  TimeFieldSpec,
  DateTimeFieldSpec,
} from './temporal.js';
import type { ControlledTermFieldSpec } from './controlled-term.js';
import type {
  LiteralSingleChoiceFieldSpec,
  ControlledTermSingleChoiceFieldSpec,
  LiteralMultipleChoiceFieldSpec,
  ControlledTermMultipleChoiceFieldSpec,
} from './choice.js';
import type { LinkFieldSpec } from './link.js';
import type { EmailFieldSpec, PhoneNumberFieldSpec } from './contact.js';
import type {
  OrcidFieldSpec,
  RorFieldSpec,
  DoiFieldSpec,
  PubMedIdFieldSpec,
  RridFieldSpec,
  NihGrantIdFieldSpec,
} from './external-authority.js';
import type { AttributeValueFieldSpec } from './attribute.js';

// FieldSpec union — every concrete spec discriminated on `kind`.
// SingleChoiceFieldSpec and MultipleChoiceFieldSpec each hold two concrete
// variants; we list those variants directly so each member of FieldSpec has
// a unique top-level `kind` discriminant.
export type FieldSpec =
  | TextFieldSpec
  | NumericFieldSpec
  | DateFieldSpec
  | TimeFieldSpec
  | DateTimeFieldSpec
  | ControlledTermFieldSpec
  | LiteralSingleChoiceFieldSpec
  | ControlledTermSingleChoiceFieldSpec
  | LiteralMultipleChoiceFieldSpec
  | ControlledTermMultipleChoiceFieldSpec
  | LinkFieldSpec
  | EmailFieldSpec
  | PhoneNumberFieldSpec
  | OrcidFieldSpec
  | RorFieldSpec
  | DoiFieldSpec
  | PubMedIdFieldSpec
  | RridFieldSpec
  | NihGrantIdFieldSpec
  | AttributeValueFieldSpec;

const FIELD_SPEC_KINDS = new Set<string>([
  'TextFieldSpec',
  'NumericFieldSpec',
  'DateFieldSpec',
  'TimeFieldSpec',
  'DateTimeFieldSpec',
  'ControlledTermFieldSpec',
  'LiteralSingleChoiceFieldSpec',
  'ControlledTermSingleChoiceFieldSpec',
  'LiteralMultipleChoiceFieldSpec',
  'ControlledTermMultipleChoiceFieldSpec',
  'LinkFieldSpec',
  'EmailFieldSpec',
  'PhoneNumberFieldSpec',
  'OrcidFieldSpec',
  'RorFieldSpec',
  'DoiFieldSpec',
  'PubMedIdFieldSpec',
  'RridFieldSpec',
  'NihGrantIdFieldSpec',
  'AttributeValueFieldSpec',
]);

export function isFieldSpec(x: unknown): x is FieldSpec {
  if (typeof x !== 'object' || x === null) return false;
  const k = (x as { kind?: unknown }).kind;
  return typeof k === 'string' && FIELD_SPEC_KINDS.has(k);
}
