export {
  type TextValue,
  type NumericValue,
  textValue,
  numericValue,
  isTextValue,
  isNumericValue,
} from './scalar.js';
export {
  type YearValue,
  type YearMonthValue,
  type FullDateValue,
  type DateValue,
  type TimeValue,
  type DateTimeValue,
  yearValue,
  yearMonthValue,
  fullDateValue,
  timeValue,
  dateTimeValue,
  dateValue,
  isYearValue,
  isYearMonthValue,
  isFullDateValue,
  isDateValue,
  isTimeValue,
  isDateTimeValue,
} from './temporal.js';
export {
  type ControlledTermValue,
  type ControlledTermValueInit,
  controlledTermValue,
  isControlledTermValue,
} from './controlled-term.js';
export {
  type LiteralChoiceValue,
  type ControlledTermChoiceValue,
  type ChoiceValue,
  literalChoiceValue,
  controlledTermChoiceValue,
  isLiteralChoiceValue,
  isControlledTermChoiceValue,
  isChoiceValue,
} from './choice.js';
export {
  type LinkValue,
  type LinkValueInit,
  linkValue,
  isLinkValue,
} from './link.js';
export {
  type EmailValue,
  type PhoneNumberValue,
  emailValue,
  phoneNumberValue,
  isEmailValue,
  isPhoneNumberValue,
} from './contact.js';
export {
  type OrcidIri,
  type RorIri,
  type DoiIri,
  type PubMedIri,
  type RridIri,
  type NihGrantIri,
  type OrcidValue,
  type RorValue,
  type DoiValue,
  type PubMedIdValue,
  type RridValue,
  type NihGrantIdValue,
  type ExternalAuthorityValue,
  orcidIri,
  rorIri,
  doiIri,
  pubMedIri,
  rridIri,
  nihGrantIri,
  orcidValue,
  rorValue,
  doiValue,
  pubMedIdValue,
  rridValue,
  nihGrantIdValue,
  isOrcidValue,
  isRorValue,
  isDoiValue,
  isPubMedIdValue,
  isRridValue,
  isNihGrantIdValue,
  isExternalAuthorityValue,
} from './external-authority.js';
export {
  type AttributeValue,
  attributeValue,
  isAttributeValue,
} from './attribute.js';

import type { TextValue, NumericValue } from './scalar.js';
import type { DateValue, TimeValue, DateTimeValue } from './temporal.js';
import type { ControlledTermValue } from './controlled-term.js';
import type { ChoiceValue } from './choice.js';
import type { LinkValue } from './link.js';
import type { EmailValue, PhoneNumberValue } from './contact.js';
import type { ExternalAuthorityValue } from './external-authority.js';
import type { AttributeValue } from './attribute.js';

import { isTextValue, isNumericValue } from './scalar.js';
import { isDateValue, isTimeValue, isDateTimeValue } from './temporal.js';
import { isControlledTermValue } from './controlled-term.js';
import { isChoiceValue } from './choice.js';
import { isLinkValue } from './link.js';
import { isEmailValue, isPhoneNumberValue } from './contact.js';
import { isExternalAuthorityValue } from './external-authority.js';
import { isAttributeValue } from './attribute.js';

export type Value =
  | TextValue
  | NumericValue
  | DateValue
  | TimeValue
  | DateTimeValue
  | ControlledTermValue
  | ChoiceValue
  | LinkValue
  | EmailValue
  | PhoneNumberValue
  | ExternalAuthorityValue
  | AttributeValue;

export function isValue(x: unknown): x is Value {
  return (
    isTextValue(x) ||
    isNumericValue(x) ||
    isDateValue(x) ||
    isTimeValue(x) ||
    isDateTimeValue(x) ||
    isControlledTermValue(x) ||
    isChoiceValue(x) ||
    isLinkValue(x) ||
    isEmailValue(x) ||
    isPhoneNumberValue(x) ||
    isExternalAuthorityValue(x) ||
    isAttributeValue(x)
  );
}
