export {
  type TextValue,
  type NumericValue,
  textValue,
  numericValue,
  isTextValue,
  isNumericValue,
} from './scalar-values.js';
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
} from './temporal-values.js';
export {
  type ControlledTermValue,
  type ControlledTermValueInit,
  controlledTermValue,
  isControlledTermValue,
} from './controlled-term-values.js';
export {
  type LiteralChoiceValue,
  type ControlledTermChoiceValue,
  type ChoiceValue,
  literalChoiceValue,
  controlledTermChoiceValue,
  isLiteralChoiceValue,
  isControlledTermChoiceValue,
  isChoiceValue,
} from './choice-values.js';
export {
  type LinkValue,
  type LinkValueInit,
  linkValue,
  isLinkValue,
} from './link-values.js';
export {
  type EmailValue,
  type PhoneNumberValue,
  emailValue,
  phoneNumberValue,
  isEmailValue,
  isPhoneNumberValue,
} from './contact-values.js';
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
} from './external-authority-values.js';
export {
  type AttributeValue,
  attributeValue,
  isAttributeValue,
} from './attribute-values.js';

import type { TextValue, NumericValue } from './scalar-values.js';
import type { DateValue, TimeValue, DateTimeValue } from './temporal-values.js';
import type { ControlledTermValue } from './controlled-term-values.js';
import type { ChoiceValue } from './choice-values.js';
import type { LinkValue } from './link-values.js';
import type { EmailValue, PhoneNumberValue } from './contact-values.js';
import type { ExternalAuthorityValue } from './external-authority-values.js';
import type { AttributeValue } from './attribute-values.js';

import { isTextValue, isNumericValue } from './scalar-values.js';
import { isDateValue, isTimeValue, isDateTimeValue } from './temporal-values.js';
import { isControlledTermValue } from './controlled-term-values.js';
import { isChoiceValue } from './choice-values.js';
import { isLinkValue } from './link-values.js';
import { isEmailValue, isPhoneNumberValue } from './contact-values.js';
import { isExternalAuthorityValue } from './external-authority-values.js';
import { isAttributeValue } from './attribute-values.js';

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
