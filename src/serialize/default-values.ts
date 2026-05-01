// =====================================================================
// default-values — wire-form serialize/parse for the per-family
// DefaultValue variants and the DefaultValue union dispatcher.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  type TextDefaultValue,
  type NumericDefaultValue,
  type DateDefaultValue,
  type TimeDefaultValue,
  type DateTimeDefaultValue,
  type ControlledTermDefaultValue,
  type ChoiceDefaultValue,
  type LinkDefaultValue,
  type EmailDefaultValue,
  type PhoneNumberDefaultValue,
  type OrcidDefaultValue,
  type RorDefaultValue,
  type DoiDefaultValue,
  type PubMedIdDefaultValue,
  type RridDefaultValue,
  type NihGrantIdDefaultValue,
  type DefaultValue,
  type ChoiceValue,
  textDefaultValue,
  numericDefaultValue,
  dateDefaultValue,
  timeDefaultValue,
  dateTimeDefaultValue,
  controlledTermDefaultValue,
  choiceDefaultValue,
  linkDefaultValue,
  emailDefaultValue,
  phoneNumberDefaultValue,
  orcidDefaultValue,
  rorDefaultValue,
  doiDefaultValue,
  pubMedIdDefaultValue,
  rridDefaultValue,
  nihGrantIdDefaultValue,
} from '../field-families/index.js';
import {
  serializeTextValue,
  serializeNumericValue,
  serializeDateValue,
  serializeTimeValue,
  serializeDateTimeValue,
  serializeControlledTermValue,
  serializeLinkValue,
  serializeEmailValue,
  serializePhoneNumberValue,
  serializeOrcidValue,
  serializeRorValue,
  serializeDoiValue,
  serializePubMedIdValue,
  serializeRridValue,
  serializeNihGrantIdValue,
  serializeChoiceValue,
  parseTextValue,
  parseNumericValue,
  parseDateValue,
  parseTimeValue,
  parseDateTimeValue,
  parseControlledTermValue,
  parseLinkValue,
  parseEmailValue,
  parsePhoneNumberValue,
  parseOrcidValue,
  parseRorValue,
  parseDoiValue,
  parsePubMedIdValue,
  parseRridValue,
  parseNihGrantIdValue,
  parseChoiceValue,
} from './values.js';
import {
  expectObject,
  expectKnownProperties,
  expectKindOneOf,
  expectNonEmptyArray,
} from './parse-utils.js';

// ---- TextDefaultValue ------------------------------------------------

export function serializeTextDefaultValue(x: TextDefaultValue): unknown {
  return { kind: 'TextDefaultValue', value: serializeTextValue(x.value) };
}

export function parseTextDefaultValue(
  x: unknown,
  where = 'TextDefaultValue',
): TextDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'TextDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "TextDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return textDefaultValue(parseTextValue(o['value'], `${where}.value`));
}

// ---- NumericDefaultValue ---------------------------------------------

export function serializeNumericDefaultValue(x: NumericDefaultValue): unknown {
  return { kind: 'NumericDefaultValue', value: serializeNumericValue(x.value) };
}

export function parseNumericDefaultValue(
  x: unknown,
  where = 'NumericDefaultValue',
): NumericDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'NumericDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "NumericDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return numericDefaultValue(parseNumericValue(o['value'], `${where}.value`));
}

// ---- DateDefaultValue ------------------------------------------------

export function serializeDateDefaultValue(x: DateDefaultValue): unknown {
  return { kind: 'DateDefaultValue', value: serializeDateValue(x.value) };
}

export function parseDateDefaultValue(
  x: unknown,
  where = 'DateDefaultValue',
): DateDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'DateDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "DateDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return dateDefaultValue(parseDateValue(o['value'], `${where}.value`));
}

// ---- TimeDefaultValue ------------------------------------------------

export function serializeTimeDefaultValue(x: TimeDefaultValue): unknown {
  return { kind: 'TimeDefaultValue', value: serializeTimeValue(x.value) };
}

export function parseTimeDefaultValue(
  x: unknown,
  where = 'TimeDefaultValue',
): TimeDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'TimeDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "TimeDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return timeDefaultValue(parseTimeValue(o['value'], `${where}.value`));
}

// ---- DateTimeDefaultValue --------------------------------------------

export function serializeDateTimeDefaultValue(x: DateTimeDefaultValue): unknown {
  return { kind: 'DateTimeDefaultValue', value: serializeDateTimeValue(x.value) };
}

export function parseDateTimeDefaultValue(
  x: unknown,
  where = 'DateTimeDefaultValue',
): DateTimeDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'DateTimeDefaultValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "DateTimeDefaultValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return dateTimeDefaultValue(parseDateTimeValue(o['value'], `${where}.value`));
}

// ---- ControlledTermDefaultValue --------------------------------------

export function serializeControlledTermDefaultValue(
  x: ControlledTermDefaultValue,
): unknown {
  return {
    kind: 'ControlledTermDefaultValue',
    value: serializeControlledTermValue(x.value),
  };
}

export function parseControlledTermDefaultValue(
  x: unknown,
  where = 'ControlledTermDefaultValue',
): ControlledTermDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'ControlledTermDefaultValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "ControlledTermDefaultValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return controlledTermDefaultValue(
    parseControlledTermValue(o['value'], `${where}.value`),
  );
}

// ---- ChoiceDefaultValue ----------------------------------------------

export function serializeChoiceDefaultValue(x: ChoiceDefaultValue): unknown {
  return {
    kind: 'ChoiceDefaultValue',
    values: x.values.map(serializeChoiceValue),
  };
}

export function parseChoiceDefaultValue(
  x: unknown,
  where = 'ChoiceDefaultValue',
): ChoiceDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'values']);
  if (o['kind'] !== 'ChoiceDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "ChoiceDefaultValue"`);
  }
  if (!('values' in o)) {
    throw new CedarConstructionError(`${where}: missing required "values"`);
  }
  const arr = expectNonEmptyArray(o['values'], `${where}.values`);
  const values = arr.map((e, i) => parseChoiceValue(e, `${where}.values[${i}]`));
  return choiceDefaultValue(...(values as [ChoiceValue, ...ChoiceValue[]]));
}

// ---- LinkDefaultValue ------------------------------------------------

export function serializeLinkDefaultValue(x: LinkDefaultValue): unknown {
  return { kind: 'LinkDefaultValue', value: serializeLinkValue(x.value) };
}

export function parseLinkDefaultValue(
  x: unknown,
  where = 'LinkDefaultValue',
): LinkDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'LinkDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "LinkDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return linkDefaultValue(parseLinkValue(o['value'], `${where}.value`));
}

// ---- EmailDefaultValue / PhoneNumberDefaultValue --------------------

export function serializeEmailDefaultValue(x: EmailDefaultValue): unknown {
  return { kind: 'EmailDefaultValue', value: serializeEmailValue(x.value) };
}

export function parseEmailDefaultValue(
  x: unknown,
  where = 'EmailDefaultValue',
): EmailDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'EmailDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "EmailDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return emailDefaultValue(parseEmailValue(o['value'], `${where}.value`));
}

export function serializePhoneNumberDefaultValue(
  x: PhoneNumberDefaultValue,
): unknown {
  return {
    kind: 'PhoneNumberDefaultValue',
    value: serializePhoneNumberValue(x.value),
  };
}

export function parsePhoneNumberDefaultValue(
  x: unknown,
  where = 'PhoneNumberDefaultValue',
): PhoneNumberDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'PhoneNumberDefaultValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "PhoneNumberDefaultValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return phoneNumberDefaultValue(
    parsePhoneNumberValue(o['value'], `${where}.value`),
  );
}

// ---- External-authority defaults -------------------------------------

export function serializeOrcidDefaultValue(x: OrcidDefaultValue): unknown {
  return { kind: 'OrcidDefaultValue', value: serializeOrcidValue(x.value) };
}

export function parseOrcidDefaultValue(
  x: unknown,
  where = 'OrcidDefaultValue',
): OrcidDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'OrcidDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "OrcidDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return orcidDefaultValue(parseOrcidValue(o['value'], `${where}.value`));
}

export function serializeRorDefaultValue(x: RorDefaultValue): unknown {
  return { kind: 'RorDefaultValue', value: serializeRorValue(x.value) };
}

export function parseRorDefaultValue(
  x: unknown,
  where = 'RorDefaultValue',
): RorDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'RorDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "RorDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return rorDefaultValue(parseRorValue(o['value'], `${where}.value`));
}

export function serializeDoiDefaultValue(x: DoiDefaultValue): unknown {
  return { kind: 'DoiDefaultValue', value: serializeDoiValue(x.value) };
}

export function parseDoiDefaultValue(
  x: unknown,
  where = 'DoiDefaultValue',
): DoiDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'DoiDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "DoiDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return doiDefaultValue(parseDoiValue(o['value'], `${where}.value`));
}

export function serializePubMedIdDefaultValue(x: PubMedIdDefaultValue): unknown {
  return { kind: 'PubMedIdDefaultValue', value: serializePubMedIdValue(x.value) };
}

export function parsePubMedIdDefaultValue(
  x: unknown,
  where = 'PubMedIdDefaultValue',
): PubMedIdDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'PubMedIdDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "PubMedIdDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return pubMedIdDefaultValue(parsePubMedIdValue(o['value'], `${where}.value`));
}

export function serializeRridDefaultValue(x: RridDefaultValue): unknown {
  return { kind: 'RridDefaultValue', value: serializeRridValue(x.value) };
}

export function parseRridDefaultValue(
  x: unknown,
  where = 'RridDefaultValue',
): RridDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'RridDefaultValue') {
    throw new CedarConstructionError(`${where}: expected kind "RridDefaultValue"`);
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return rridDefaultValue(parseRridValue(o['value'], `${where}.value`));
}

export function serializeNihGrantIdDefaultValue(
  x: NihGrantIdDefaultValue,
): unknown {
  return {
    kind: 'NihGrantIdDefaultValue',
    value: serializeNihGrantIdValue(x.value),
  };
}

export function parseNihGrantIdDefaultValue(
  x: unknown,
  where = 'NihGrantIdDefaultValue',
): NihGrantIdDefaultValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'value']);
  if (o['kind'] !== 'NihGrantIdDefaultValue') {
    throw new CedarConstructionError(
      `${where}: expected kind "NihGrantIdDefaultValue"`,
    );
  }
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  return nihGrantIdDefaultValue(
    parseNihGrantIdValue(o['value'], `${where}.value`),
  );
}

// ---- DefaultValue union dispatcher -----------------------------------

const DEFAULT_VALUE_KINDS = [
  'TextDefaultValue',
  'NumericDefaultValue',
  'DateDefaultValue',
  'TimeDefaultValue',
  'DateTimeDefaultValue',
  'ControlledTermDefaultValue',
  'ChoiceDefaultValue',
  'LinkDefaultValue',
  'EmailDefaultValue',
  'PhoneNumberDefaultValue',
  'OrcidDefaultValue',
  'RorDefaultValue',
  'DoiDefaultValue',
  'PubMedIdDefaultValue',
  'RridDefaultValue',
  'NihGrantIdDefaultValue',
] as const;

export function serializeDefaultValue(x: DefaultValue): unknown {
  switch (x.kind) {
    case 'TextDefaultValue':
      return serializeTextDefaultValue(x);
    case 'NumericDefaultValue':
      return serializeNumericDefaultValue(x);
    case 'DateDefaultValue':
      return serializeDateDefaultValue(x);
    case 'TimeDefaultValue':
      return serializeTimeDefaultValue(x);
    case 'DateTimeDefaultValue':
      return serializeDateTimeDefaultValue(x);
    case 'ControlledTermDefaultValue':
      return serializeControlledTermDefaultValue(x);
    case 'ChoiceDefaultValue':
      return serializeChoiceDefaultValue(x);
    case 'LinkDefaultValue':
      return serializeLinkDefaultValue(x);
    case 'EmailDefaultValue':
      return serializeEmailDefaultValue(x);
    case 'PhoneNumberDefaultValue':
      return serializePhoneNumberDefaultValue(x);
    case 'OrcidDefaultValue':
      return serializeOrcidDefaultValue(x);
    case 'RorDefaultValue':
      return serializeRorDefaultValue(x);
    case 'DoiDefaultValue':
      return serializeDoiDefaultValue(x);
    case 'PubMedIdDefaultValue':
      return serializePubMedIdDefaultValue(x);
    case 'RridDefaultValue':
      return serializeRridDefaultValue(x);
    case 'NihGrantIdDefaultValue':
      return serializeNihGrantIdDefaultValue(x);
  }
}

export function parseDefaultValue(
  x: unknown,
  where = 'DefaultValue',
): DefaultValue {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, DEFAULT_VALUE_KINDS, where);
  switch (k) {
    case 'TextDefaultValue':
      return parseTextDefaultValue(x, where);
    case 'NumericDefaultValue':
      return parseNumericDefaultValue(x, where);
    case 'DateDefaultValue':
      return parseDateDefaultValue(x, where);
    case 'TimeDefaultValue':
      return parseTimeDefaultValue(x, where);
    case 'DateTimeDefaultValue':
      return parseDateTimeDefaultValue(x, where);
    case 'ControlledTermDefaultValue':
      return parseControlledTermDefaultValue(x, where);
    case 'ChoiceDefaultValue':
      return parseChoiceDefaultValue(x, where);
    case 'LinkDefaultValue':
      return parseLinkDefaultValue(x, where);
    case 'EmailDefaultValue':
      return parseEmailDefaultValue(x, where);
    case 'PhoneNumberDefaultValue':
      return parsePhoneNumberDefaultValue(x, where);
    case 'OrcidDefaultValue':
      return parseOrcidDefaultValue(x, where);
    case 'RorDefaultValue':
      return parseRorDefaultValue(x, where);
    case 'DoiDefaultValue':
      return parseDoiDefaultValue(x, where);
    case 'PubMedIdDefaultValue':
      return parsePubMedIdDefaultValue(x, where);
    case 'RridDefaultValue':
      return parseRridDefaultValue(x, where);
    case 'NihGrantIdDefaultValue':
      return parseNihGrantIdDefaultValue(x, where);
  }
}
