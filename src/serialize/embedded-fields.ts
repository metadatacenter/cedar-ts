// =====================================================================
// embedded-fields — wire-form serialize/parse for EmbeddedField (19
// variants), EmbeddedTemplate, EmbeddedPresentationComponent, plus the
// EmbeddedArtifact union dispatcher.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  type EmbeddedField,
  type EmbeddedTextField,
  type EmbeddedIntegerNumberField,
  type EmbeddedRealNumberField,
  type EmbeddedBooleanField,
  type EmbeddedDateField,
  type EmbeddedTimeField,
  type EmbeddedDateTimeField,
  type EmbeddedControlledTermField,
  type EmbeddedSingleValuedEnumField,
  type EmbeddedMultiValuedEnumField,
  type EmbeddedLinkField,
  type EmbeddedEmailField,
  type EmbeddedPhoneNumberField,
  type EmbeddedOrcidField,
  type EmbeddedRorField,
  type EmbeddedDoiField,
  type EmbeddedPubMedIdField,
  type EmbeddedRridField,
  type EmbeddedNihGrantIdField,
  type EmbeddedLanguageField,
  type EmbeddedAttributeValueField,
  embeddedTextField,
  embeddedIntegerNumberField,
  embeddedRealNumberField,
  embeddedBooleanField,
  embeddedDateField,
  embeddedTimeField,
  embeddedDateTimeField,
  embeddedControlledTermField,
  embeddedSingleValuedEnumField,
  embeddedMultiValuedEnumField,
  embeddedLinkField,
  embeddedEmailField,
  embeddedPhoneNumberField,
  embeddedOrcidField,
  embeddedRorField,
  embeddedDoiField,
  embeddedPubMedIdField,
  embeddedRridField,
  embeddedNihGrantIdField,
  embeddedLanguageField,
  embeddedAttributeValueField,
} from '../field-families/index.js';
import {
  type EmbeddedTemplate,
  type EmbeddedPresentationComponent,
  type ValueRequirement,
  type Cardinality,
  type Visibility,
  type Property,
  type Editability,
  embeddedTemplate,
  embeddedPresentationComponent,
} from '../embedded/index.js';
import type { MultilingualString } from '../multilingual.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
  rejectNullProperty,
} from './parse-utils.js';
import {
  serializeTextFieldId,
  serializeIntegerNumberFieldId,
  serializeRealNumberFieldId,
  serializeBooleanFieldId,
  serializeDateFieldId,
  serializeTimeFieldId,
  serializeDateTimeFieldId,
  serializeControlledTermFieldId,
  serializeSingleValuedEnumFieldId,
  serializeMultiValuedEnumFieldId,
  serializeLinkFieldId,
  serializeEmailFieldId,
  serializePhoneNumberFieldId,
  serializeOrcidFieldId,
  serializeRorFieldId,
  serializeDoiFieldId,
  serializePubMedIdFieldId,
  serializeRridFieldId,
  serializeNihGrantIdFieldId,
  serializeLanguageFieldId,
  serializeAttributeValueFieldId,
  serializeTemplateId,
  serializePresentationComponentId,
  parseTextFieldId,
  parseIntegerNumberFieldId,
  parseRealNumberFieldId,
  parseBooleanFieldId,
  parseDateFieldId,
  parseTimeFieldId,
  parseDateTimeFieldId,
  parseControlledTermFieldId,
  parseSingleValuedEnumFieldId,
  parseMultiValuedEnumFieldId,
  parseLinkFieldId,
  parseEmailFieldId,
  parsePhoneNumberFieldId,
  parseOrcidFieldId,
  parseRorFieldId,
  parseDoiFieldId,
  parsePubMedIdFieldId,
  parseRridFieldId,
  parseNihGrantIdFieldId,
  parseLanguageFieldId,
  parseAttributeValueFieldId,
  parseTemplateId,
  parsePresentationComponentId,
} from './collapsed-wrappers.js';
import {
  serializeCardinality,
  serializeProperty,
  serializeValueRequirement,
  serializeVisibility,
  serializeEditability,
  parseEditability,
  parseCardinality,
  parseProperty,
  parseValueRequirement,
  parseVisibility,
} from './embedded-config.js';
import {
  serializeTextValue,
  parseTextValue,
  serializeIntegerNumberValue,
  parseIntegerNumberValue,
  serializeRealNumberValue,
  parseRealNumberValue,
  serializeBooleanValue,
  parseBooleanValue,
  serializeDateValue,
  parseDateValue,
  serializeTimeValue,
  parseTimeValue,
  serializeDateTimeValue,
  parseDateTimeValue,
  serializeEnumValue,
  parseEnumValue,
  serializeControlledTermValue,
  parseControlledTermValue,
  serializeLinkValue,
  parseLinkValue,
  serializeEmailValue,
  parseEmailValue,
  serializePhoneNumberValue,
  parsePhoneNumberValue,
  serializeOrcidValue,
  serializeRorValue,
  serializeDoiValue,
  serializePubMedIdValue,
  serializeRridValue,
  serializeNihGrantIdValue,
  serializeLanguageValue,
  parseOrcidValue,
  parseRorValue,
  parseDoiValue,
  parsePubMedIdValue,
  parseRridValue,
  parseNihGrantIdValue,
  parseLanguageValue,
} from './values.js';

// ---- Common per-embedding properties ---------------------------------

interface CommonOut {
  valueRequirement?: ValueRequirement;
  cardinality?: Cardinality;
  visibility?: Visibility;
  promptOverride?: MultilingualString;
  helpTextOverride?: MultilingualString;
  property?: Property;
  promptKey?: string;
  editability?: Editability;
}

function serializeCommonProps(
  x: {
    readonly valueRequirement?: ValueRequirement;
    readonly cardinality?: Cardinality;
    readonly visibility?: Visibility;
    readonly promptOverride?: MultilingualString;
    readonly helpTextOverride?: MultilingualString;
    readonly property?: Property;
    readonly promptKey?: string;
    readonly editability?: Editability;
  },
  out: Record<string, unknown>,
): void {
  if (x.valueRequirement !== undefined)
    out['valueRequirement'] = serializeValueRequirement(x.valueRequirement);
  if (x.cardinality !== undefined)
    out['cardinality'] = serializeCardinality(x.cardinality);
  if (x.visibility !== undefined)
    out['visibility'] = serializeVisibility(x.visibility);
  if (x.promptOverride !== undefined)
    out['promptOverride'] = serializeMultilingualString(x.promptOverride);
  if (x.helpTextOverride !== undefined)
    out['helpTextOverride'] = serializeMultilingualString(x.helpTextOverride);
  if (x.property !== undefined) out['property'] = serializeProperty(x.property);
  if (x.promptKey !== undefined) out['promptKey'] = x.promptKey;
  if (x.editability !== undefined)
    out['editability'] = serializeEditability(x.editability);
}

function parseCommonProps(
  o: { readonly [k: string]: unknown },
  where: string,
): CommonOut {
  rejectNullProperty(o, 'valueRequirement');
  rejectNullProperty(o, 'cardinality');
  rejectNullProperty(o, 'visibility');
  rejectNullProperty(o, 'promptOverride');
  rejectNullProperty(o, 'helpTextOverride');
  rejectNullProperty(o, 'property');
  rejectNullProperty(o, 'promptKey');
  rejectNullProperty(o, 'editability');
  const out: CommonOut = {};
  if ('valueRequirement' in o)
    out.valueRequirement = parseValueRequirement(
      o['valueRequirement'],
      `${where}.valueRequirement`,
    );
  if ('cardinality' in o)
    out.cardinality = parseCardinality(o['cardinality'], `${where}.cardinality`);
  if ('visibility' in o)
    out.visibility = parseVisibility(o['visibility'], `${where}.visibility`);
  if ('promptOverride' in o)
    out.promptOverride = parseMultilingualString(
      o['promptOverride'],
      `${where}.promptOverride`,
    );
  if ('helpTextOverride' in o)
    out.helpTextOverride = parseMultilingualString(
      o['helpTextOverride'],
      `${where}.helpTextOverride`,
    );
  if ('property' in o)
    out.property = parseProperty(o['property'], `${where}.property`);
  if ('promptKey' in o)
    out.promptKey = expectString(o['promptKey'], `${where}.promptKey`);
  if ('editability' in o)
    out.editability = parseEditability(o['editability'], `${where}.editability`);
  return out;
}

const COMMON_FIELD_PROPS = [
  'kind',
  'key',
  'artifactRef',
  'valueRequirement',
  'cardinality',
  'visibility',
  'promptOverride',
  'helpTextOverride',
  'property',
  'promptKey',
  'editability',
];
const COMMON_FIELD_PROPS_WITH_DEFAULT = [...COMMON_FIELD_PROPS, 'defaultValue'];

function readShell(
  x: unknown,
  expectedKind: string,
  where: string,
  allowDefault: boolean,
): {
  o: { readonly [k: string]: unknown };
  key: string;
  artifactRef: unknown;
  defaultRaw?: unknown;
  common: CommonOut;
} {
  const o = expectObject(x, where);
  expectKnownProperties(
    o,
    allowDefault ? COMMON_FIELD_PROPS_WITH_DEFAULT : COMMON_FIELD_PROPS,
  );
  if (allowDefault) rejectNullProperty(o, 'defaultValue');
  if (o['kind'] !== expectedKind) {
    throw new CedarConstructionError(
      `${where}: expected kind ${JSON.stringify(expectedKind)}; got ${JSON.stringify(o['kind'])}`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('artifactRef' in o)) {
    throw new CedarConstructionError(`${where}: missing required "artifactRef"`);
  }
  const out: {
    o: { readonly [k: string]: unknown };
    key: string;
    artifactRef: unknown;
    defaultRaw?: unknown;
    common: CommonOut;
  } = {
    o,
    key: expectString(o['key'], `${where}.key`),
    artifactRef: o['artifactRef'],
    common: parseCommonProps(o, where),
  };
  if (allowDefault && 'defaultValue' in o) out.defaultRaw = o['defaultValue'];
  return out;
}

// ---- Per-family EmbeddedField serializers ---------------------------

export function serializeEmbeddedTextField(x: EmbeddedTextField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedTextField',
    key: x.key,
    artifactRef: serializeTextFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeTextValue(x.defaultValue);
  return out;
}

export function parseEmbeddedTextField(
  x: unknown,
  where = 'EmbeddedTextField',
): EmbeddedTextField {
  const s = readShell(x, 'EmbeddedTextField', where, true);
  return embeddedTextField({
    key: s.key,
    artifactRef: parseTextFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseTextValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedIntegerNumberField(x: EmbeddedIntegerNumberField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedIntegerNumberField',
    key: x.key,
    artifactRef: serializeIntegerNumberFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeIntegerNumberValue(x.defaultValue);
  return out;
}

export function parseEmbeddedIntegerNumberField(
  x: unknown,
  where = 'EmbeddedIntegerNumberField',
): EmbeddedIntegerNumberField {
  const s = readShell(x, 'EmbeddedIntegerNumberField', where, true);
  return embeddedIntegerNumberField({
    key: s.key,
    artifactRef: parseIntegerNumberFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseIntegerNumberValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedRealNumberField(x: EmbeddedRealNumberField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedRealNumberField',
    key: x.key,
    artifactRef: serializeRealNumberFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeRealNumberValue(x.defaultValue);
  return out;
}

export function parseEmbeddedRealNumberField(
  x: unknown,
  where = 'EmbeddedRealNumberField',
): EmbeddedRealNumberField {
  const s = readShell(x, 'EmbeddedRealNumberField', where, true);
  return embeddedRealNumberField({
    key: s.key,
    artifactRef: parseRealNumberFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseRealNumberValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

// EmbeddedBooleanField is the one EmbeddedField variant that omits the
// `cardinality` slot.
const BOOLEAN_FIELD_PROPS = [
  'kind',
  'key',
  'artifactRef',
  'valueRequirement',
  'visibility',
  'defaultValue',
  'promptOverride',
  'helpTextOverride',
  'property',
];

export function serializeEmbeddedBooleanField(
  x: EmbeddedBooleanField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedBooleanField',
    key: x.key,
    artifactRef: serializeBooleanFieldId(x.artifactRef),
  };
  if (x.valueRequirement !== undefined)
    out['valueRequirement'] = serializeValueRequirement(x.valueRequirement);
  if (x.visibility !== undefined)
    out['visibility'] = serializeVisibility(x.visibility);
  if (x.promptOverride !== undefined)
    out['promptOverride'] = serializeMultilingualString(x.promptOverride);
  if (x.helpTextOverride !== undefined)
    out['helpTextOverride'] = serializeMultilingualString(x.helpTextOverride);
  if (x.property !== undefined) out['property'] = serializeProperty(x.property);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeBooleanValue(x.defaultValue);
  return out;
}

export function parseEmbeddedBooleanField(
  x: unknown,
  where = 'EmbeddedBooleanField',
): EmbeddedBooleanField {
  const o = expectObject(x, where);
  expectKnownProperties(o, BOOLEAN_FIELD_PROPS);
  rejectNullProperty(o, 'valueRequirement');
  rejectNullProperty(o, 'visibility');
  rejectNullProperty(o, 'promptOverride');
  rejectNullProperty(o, 'helpTextOverride');
  rejectNullProperty(o, 'property');
  rejectNullProperty(o, 'defaultValue');
  if (o['kind'] !== 'EmbeddedBooleanField') {
    throw new CedarConstructionError(
      `${where}: expected kind "EmbeddedBooleanField"; got ${JSON.stringify(o['kind'])}`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('artifactRef' in o)) {
    throw new CedarConstructionError(`${where}: missing required "artifactRef"`);
  }
  const init: Parameters<typeof embeddedBooleanField>[0] = {
    key: expectString(o['key'], `${where}.key`),
    artifactRef: parseBooleanFieldId(o['artifactRef'], `${where}.artifactRef`),
  };
  if ('valueRequirement' in o)
    (init as { valueRequirement?: ValueRequirement }).valueRequirement =
      parseValueRequirement(o['valueRequirement'], `${where}.valueRequirement`);
  if ('visibility' in o)
    (init as { visibility?: Visibility }).visibility = parseVisibility(
      o['visibility'],
      `${where}.visibility`,
    );
  if ('promptOverride' in o)
    (init as { promptOverride?: MultilingualString }).promptOverride = parseMultilingualString(
      o['promptOverride'],
      `${where}.promptOverride`,
    );
  if ('helpTextOverride' in o)
    (init as { helpTextOverride?: MultilingualString }).helpTextOverride =
      parseMultilingualString(o['helpTextOverride'], `${where}.helpTextOverride`);
  if ('property' in o)
    (init as { property?: Property }).property = parseProperty(
      o['property'],
      `${where}.property`,
    );
  if ('defaultValue' in o)
    (init as { defaultValue?: unknown }).defaultValue = parseBooleanValue(
      o['defaultValue'],
      `${where}.defaultValue`,
    );
  return embeddedBooleanField(init);
}

export function serializeEmbeddedDateField(x: EmbeddedDateField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedDateField',
    key: x.key,
    artifactRef: serializeDateFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDateValue(x.defaultValue);
  return out;
}

export function parseEmbeddedDateField(
  x: unknown,
  where = 'EmbeddedDateField',
): EmbeddedDateField {
  const s = readShell(x, 'EmbeddedDateField', where, true);
  return embeddedDateField({
    key: s.key,
    artifactRef: parseDateFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseDateValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedTimeField(x: EmbeddedTimeField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedTimeField',
    key: x.key,
    artifactRef: serializeTimeFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeTimeValue(x.defaultValue);
  return out;
}

export function parseEmbeddedTimeField(
  x: unknown,
  where = 'EmbeddedTimeField',
): EmbeddedTimeField {
  const s = readShell(x, 'EmbeddedTimeField', where, true);
  return embeddedTimeField({
    key: s.key,
    artifactRef: parseTimeFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseTimeValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedDateTimeField(
  x: EmbeddedDateTimeField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedDateTimeField',
    key: x.key,
    artifactRef: serializeDateTimeFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDateTimeValue(x.defaultValue);
  return out;
}

export function parseEmbeddedDateTimeField(
  x: unknown,
  where = 'EmbeddedDateTimeField',
): EmbeddedDateTimeField {
  const s = readShell(x, 'EmbeddedDateTimeField', where, true);
  return embeddedDateTimeField({
    key: s.key,
    artifactRef: parseDateTimeFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseDateTimeValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedControlledTermField(
  x: EmbeddedControlledTermField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedControlledTermField',
    key: x.key,
    artifactRef: serializeControlledTermFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeControlledTermValue(x.defaultValue);
  return out;
}

export function parseEmbeddedControlledTermField(
  x: unknown,
  where = 'EmbeddedControlledTermField',
): EmbeddedControlledTermField {
  const s = readShell(x, 'EmbeddedControlledTermField', where, true);
  return embeddedControlledTermField({
    key: s.key,
    artifactRef: parseControlledTermFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseControlledTermValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

// EmbeddedSingleValuedEnumField — no cardinality slot.
const SINGLE_VALUED_ENUM_FIELD_PROPS = [
  'kind',
  'key',
  'artifactRef',
  'valueRequirement',
  'visibility',
  'defaultValue',
  'promptOverride',
  'helpTextOverride',
  'property',
];

export function serializeEmbeddedSingleValuedEnumField(
  x: EmbeddedSingleValuedEnumField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedSingleValuedEnumField',
    key: x.key,
    artifactRef: serializeSingleValuedEnumFieldId(x.artifactRef),
  };
  if (x.valueRequirement !== undefined)
    out['valueRequirement'] = serializeValueRequirement(x.valueRequirement);
  if (x.visibility !== undefined)
    out['visibility'] = serializeVisibility(x.visibility);
  if (x.promptOverride !== undefined)
    out['promptOverride'] = serializeMultilingualString(x.promptOverride);
  if (x.helpTextOverride !== undefined)
    out['helpTextOverride'] = serializeMultilingualString(x.helpTextOverride);
  if (x.property !== undefined) out['property'] = serializeProperty(x.property);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeEnumValue(x.defaultValue);
  return out;
}

export function parseEmbeddedSingleValuedEnumField(
  x: unknown,
  where = 'EmbeddedSingleValuedEnumField',
): EmbeddedSingleValuedEnumField {
  const o = expectObject(x, where);
  expectKnownProperties(o, SINGLE_VALUED_ENUM_FIELD_PROPS);
  rejectNullProperty(o, 'valueRequirement');
  rejectNullProperty(o, 'visibility');
  rejectNullProperty(o, 'promptOverride');
  rejectNullProperty(o, 'helpTextOverride');
  rejectNullProperty(o, 'property');
  rejectNullProperty(o, 'defaultValue');
  if (o['kind'] !== 'EmbeddedSingleValuedEnumField') {
    throw new CedarConstructionError(
      `${where}: expected kind "EmbeddedSingleValuedEnumField"; got ${JSON.stringify(o['kind'])}`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('artifactRef' in o)) {
    throw new CedarConstructionError(`${where}: missing required "artifactRef"`);
  }
  const init: Parameters<typeof embeddedSingleValuedEnumField>[0] = {
    key: expectString(o['key'], `${where}.key`),
    artifactRef: parseSingleValuedEnumFieldId(
      o['artifactRef'],
      `${where}.artifactRef`,
    ),
  };
  if ('valueRequirement' in o)
    (init as { valueRequirement?: ValueRequirement }).valueRequirement =
      parseValueRequirement(o['valueRequirement'], `${where}.valueRequirement`);
  if ('visibility' in o)
    (init as { visibility?: Visibility }).visibility = parseVisibility(
      o['visibility'],
      `${where}.visibility`,
    );
  if ('promptOverride' in o)
    (init as { promptOverride?: MultilingualString }).promptOverride = parseMultilingualString(
      o['promptOverride'],
      `${where}.promptOverride`,
    );
  if ('helpTextOverride' in o)
    (init as { helpTextOverride?: MultilingualString }).helpTextOverride =
      parseMultilingualString(o['helpTextOverride'], `${where}.helpTextOverride`);
  if ('property' in o)
    (init as { property?: Property }).property = parseProperty(
      o['property'],
      `${where}.property`,
    );
  if ('defaultValue' in o)
    (init as { defaultValue?: unknown }).defaultValue = parseEnumValue(
      o['defaultValue'],
      `${where}.defaultValue`,
    );
  return embeddedSingleValuedEnumField(init);
}

export function serializeEmbeddedMultiValuedEnumField(
  x: EmbeddedMultiValuedEnumField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedMultiValuedEnumField',
    key: x.key,
    artifactRef: serializeMultiValuedEnumFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = x.defaultValue.map(serializeEnumValue);
  return out;
}

export function parseEmbeddedMultiValuedEnumField(
  x: unknown,
  where = 'EmbeddedMultiValuedEnumField',
): EmbeddedMultiValuedEnumField {
  const s = readShell(x, 'EmbeddedMultiValuedEnumField', where, true);
  let defaultValue: readonly import('../field-families/index.js').EnumValue[] | undefined;
  if (s.defaultRaw !== undefined) {
    if (!Array.isArray(s.defaultRaw)) {
      throw new CedarConstructionError(
        `${where}.defaultValue: expected an array of EnumValue`,
      );
    }
    defaultValue = (s.defaultRaw as readonly unknown[]).map((e, i) =>
      parseEnumValue(e, `${where}.defaultValue[${i}]`),
    );
  }
  return embeddedMultiValuedEnumField({
    key: s.key,
    artifactRef: parseMultiValuedEnumFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(defaultValue !== undefined && { defaultValue }),
  });
}

export function serializeEmbeddedLinkField(x: EmbeddedLinkField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedLinkField',
    key: x.key,
    artifactRef: serializeLinkFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeLinkValue(x.defaultValue);
  return out;
}

export function parseEmbeddedLinkField(
  x: unknown,
  where = 'EmbeddedLinkField',
): EmbeddedLinkField {
  const s = readShell(x, 'EmbeddedLinkField', where, true);
  return embeddedLinkField({
    key: s.key,
    artifactRef: parseLinkFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseLinkValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedEmailField(x: EmbeddedEmailField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedEmailField',
    key: x.key,
    artifactRef: serializeEmailFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeEmailValue(x.defaultValue);
  return out;
}

export function parseEmbeddedEmailField(
  x: unknown,
  where = 'EmbeddedEmailField',
): EmbeddedEmailField {
  const s = readShell(x, 'EmbeddedEmailField', where, true);
  return embeddedEmailField({
    key: s.key,
    artifactRef: parseEmailFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseEmailValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedPhoneNumberField(
  x: EmbeddedPhoneNumberField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedPhoneNumberField',
    key: x.key,
    artifactRef: serializePhoneNumberFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializePhoneNumberValue(x.defaultValue);
  return out;
}

export function parseEmbeddedPhoneNumberField(
  x: unknown,
  where = 'EmbeddedPhoneNumberField',
): EmbeddedPhoneNumberField {
  const s = readShell(x, 'EmbeddedPhoneNumberField', where, true);
  return embeddedPhoneNumberField({
    key: s.key,
    artifactRef: parsePhoneNumberFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parsePhoneNumberValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedOrcidField(x: EmbeddedOrcidField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedOrcidField',
    key: x.key,
    artifactRef: serializeOrcidFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeOrcidValue(x.defaultValue);
  return out;
}

export function parseEmbeddedOrcidField(
  x: unknown,
  where = 'EmbeddedOrcidField',
): EmbeddedOrcidField {
  const s = readShell(x, 'EmbeddedOrcidField', where, true);
  return embeddedOrcidField({
    key: s.key,
    artifactRef: parseOrcidFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseOrcidValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedRorField(x: EmbeddedRorField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedRorField',
    key: x.key,
    artifactRef: serializeRorFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeRorValue(x.defaultValue);
  return out;
}

export function parseEmbeddedRorField(
  x: unknown,
  where = 'EmbeddedRorField',
): EmbeddedRorField {
  const s = readShell(x, 'EmbeddedRorField', where, true);
  return embeddedRorField({
    key: s.key,
    artifactRef: parseRorFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseRorValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedDoiField(x: EmbeddedDoiField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedDoiField',
    key: x.key,
    artifactRef: serializeDoiFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDoiValue(x.defaultValue);
  return out;
}

export function parseEmbeddedDoiField(
  x: unknown,
  where = 'EmbeddedDoiField',
): EmbeddedDoiField {
  const s = readShell(x, 'EmbeddedDoiField', where, true);
  return embeddedDoiField({
    key: s.key,
    artifactRef: parseDoiFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseDoiValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedPubMedIdField(
  x: EmbeddedPubMedIdField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedPubMedIdField',
    key: x.key,
    artifactRef: serializePubMedIdFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializePubMedIdValue(x.defaultValue);
  return out;
}

export function parseEmbeddedPubMedIdField(
  x: unknown,
  where = 'EmbeddedPubMedIdField',
): EmbeddedPubMedIdField {
  const s = readShell(x, 'EmbeddedPubMedIdField', where, true);
  return embeddedPubMedIdField({
    key: s.key,
    artifactRef: parsePubMedIdFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parsePubMedIdValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedRridField(x: EmbeddedRridField): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedRridField',
    key: x.key,
    artifactRef: serializeRridFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeRridValue(x.defaultValue);
  return out;
}

export function parseEmbeddedRridField(
  x: unknown,
  where = 'EmbeddedRridField',
): EmbeddedRridField {
  const s = readShell(x, 'EmbeddedRridField', where, true);
  return embeddedRridField({
    key: s.key,
    artifactRef: parseRridFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseRridValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedNihGrantIdField(
  x: EmbeddedNihGrantIdField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedNihGrantIdField',
    key: x.key,
    artifactRef: serializeNihGrantIdFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeNihGrantIdValue(x.defaultValue);
  return out;
}

export function parseEmbeddedNihGrantIdField(
  x: unknown,
  where = 'EmbeddedNihGrantIdField',
): EmbeddedNihGrantIdField {
  const s = readShell(x, 'EmbeddedNihGrantIdField', where, true);
  return embeddedNihGrantIdField({
    key: s.key,
    artifactRef: parseNihGrantIdFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseNihGrantIdValue(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedLanguageField(
  x: EmbeddedLanguageField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedLanguageField',
    key: x.key,
    artifactRef: serializeLanguageFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeLanguageValue(x.defaultValue);
  return out;
}

export function parseEmbeddedLanguageField(
  x: unknown,
  where = 'EmbeddedLanguageField',
): EmbeddedLanguageField {
  const s = readShell(x, 'EmbeddedLanguageField', where, true);
  return embeddedLanguageField({
    key: s.key,
    artifactRef: parseLanguageFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseLanguageValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedAttributeValueField(
  x: EmbeddedAttributeValueField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedAttributeValueField',
    key: x.key,
    artifactRef: serializeAttributeValueFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  return out;
}

export function parseEmbeddedAttributeValueField(
  x: unknown,
  where = 'EmbeddedAttributeValueField',
): EmbeddedAttributeValueField {
  const s = readShell(x, 'EmbeddedAttributeValueField', where, false);
  return embeddedAttributeValueField({
    key: s.key,
    artifactRef: parseAttributeValueFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
  });
}

// ---- EmbeddedTemplate / EmbeddedPresentationComponent ---------------

export function serializeEmbeddedTemplate(x: EmbeddedTemplate): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedTemplate',
    key: x.key,
    artifactRef: serializeTemplateId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  return out;
}

export function parseEmbeddedTemplate(
  x: unknown,
  where = 'EmbeddedTemplate',
): EmbeddedTemplate {
  const s = readShell(x, 'EmbeddedTemplate', where, false);
  return embeddedTemplate({
    key: s.key,
    artifactRef: parseTemplateId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
  });
}

export function serializeEmbeddedPresentationComponent(
  x: EmbeddedPresentationComponent,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedPresentationComponent',
    key: x.key,
    artifactRef: serializePresentationComponentId(x.artifactRef),
  };
  if (x.visibility !== undefined)
    out['visibility'] = serializeVisibility(x.visibility);
  return out;
}

export function parseEmbeddedPresentationComponent(
  x: unknown,
  where = 'EmbeddedPresentationComponent',
): EmbeddedPresentationComponent {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'key',
    'artifactRef',
    'visibility',
  ]);
  rejectNullProperty(o, 'visibility');
  if (o['kind'] !== 'EmbeddedPresentationComponent') {
    throw new CedarConstructionError(
      `${where}: expected kind "EmbeddedPresentationComponent"`,
    );
  }
  if (!('key' in o)) {
    throw new CedarConstructionError(`${where}: missing required "key"`);
  }
  if (!('artifactRef' in o)) {
    throw new CedarConstructionError(`${where}: missing required "artifactRef"`);
  }
  const init: {
    key: string;
    artifactRef: ReturnType<typeof parsePresentationComponentId>;
    visibility?: Visibility;
  } = {
    key: expectString(o['key'], `${where}.key`),
    artifactRef: parsePresentationComponentId(
      o['artifactRef'],
      `${where}.artifactRef`,
    ),
  };
  if ('visibility' in o)
    init.visibility = parseVisibility(o['visibility'], `${where}.visibility`);
  return embeddedPresentationComponent(init);
}

// ---- EmbeddedField union --------------------------------------------

const EMBEDDED_FIELD_KINDS = [
  'EmbeddedTextField',
  'EmbeddedIntegerNumberField',
  'EmbeddedRealNumberField',
  'EmbeddedBooleanField',
  'EmbeddedDateField',
  'EmbeddedTimeField',
  'EmbeddedDateTimeField',
  'EmbeddedControlledTermField',
  'EmbeddedSingleValuedEnumField',
  'EmbeddedMultiValuedEnumField',
  'EmbeddedLinkField',
  'EmbeddedEmailField',
  'EmbeddedPhoneNumberField',
  'EmbeddedOrcidField',
  'EmbeddedRorField',
  'EmbeddedDoiField',
  'EmbeddedPubMedIdField',
  'EmbeddedRridField',
  'EmbeddedNihGrantIdField',
  'EmbeddedLanguageField',
  'EmbeddedAttributeValueField',
] as const;

export function serializeEmbeddedField(x: EmbeddedField): unknown {
  switch (x.kind) {
    case 'EmbeddedTextField':
      return serializeEmbeddedTextField(x);
    case 'EmbeddedIntegerNumberField':
      return serializeEmbeddedIntegerNumberField(x);
    case 'EmbeddedRealNumberField':
      return serializeEmbeddedRealNumberField(x);
    case 'EmbeddedBooleanField':
      return serializeEmbeddedBooleanField(x);
    case 'EmbeddedDateField':
      return serializeEmbeddedDateField(x);
    case 'EmbeddedTimeField':
      return serializeEmbeddedTimeField(x);
    case 'EmbeddedDateTimeField':
      return serializeEmbeddedDateTimeField(x);
    case 'EmbeddedControlledTermField':
      return serializeEmbeddedControlledTermField(x);
    case 'EmbeddedSingleValuedEnumField':
      return serializeEmbeddedSingleValuedEnumField(x);
    case 'EmbeddedMultiValuedEnumField':
      return serializeEmbeddedMultiValuedEnumField(x);
    case 'EmbeddedLinkField':
      return serializeEmbeddedLinkField(x);
    case 'EmbeddedEmailField':
      return serializeEmbeddedEmailField(x);
    case 'EmbeddedPhoneNumberField':
      return serializeEmbeddedPhoneNumberField(x);
    case 'EmbeddedOrcidField':
      return serializeEmbeddedOrcidField(x);
    case 'EmbeddedRorField':
      return serializeEmbeddedRorField(x);
    case 'EmbeddedDoiField':
      return serializeEmbeddedDoiField(x);
    case 'EmbeddedPubMedIdField':
      return serializeEmbeddedPubMedIdField(x);
    case 'EmbeddedRridField':
      return serializeEmbeddedRridField(x);
    case 'EmbeddedNihGrantIdField':
      return serializeEmbeddedNihGrantIdField(x);
    case 'EmbeddedLanguageField':
      return serializeEmbeddedLanguageField(x);
    case 'EmbeddedAttributeValueField':
      return serializeEmbeddedAttributeValueField(x);
  }
}

export function parseEmbeddedField(
  x: unknown,
  where = 'EmbeddedField',
): EmbeddedField {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, EMBEDDED_FIELD_KINDS, where);
  switch (k) {
    case 'EmbeddedTextField':
      return parseEmbeddedTextField(x, where);
    case 'EmbeddedIntegerNumberField':
      return parseEmbeddedIntegerNumberField(x, where);
    case 'EmbeddedRealNumberField':
      return parseEmbeddedRealNumberField(x, where);
    case 'EmbeddedBooleanField':
      return parseEmbeddedBooleanField(x, where);
    case 'EmbeddedDateField':
      return parseEmbeddedDateField(x, where);
    case 'EmbeddedTimeField':
      return parseEmbeddedTimeField(x, where);
    case 'EmbeddedDateTimeField':
      return parseEmbeddedDateTimeField(x, where);
    case 'EmbeddedControlledTermField':
      return parseEmbeddedControlledTermField(x, where);
    case 'EmbeddedSingleValuedEnumField':
      return parseEmbeddedSingleValuedEnumField(x, where);
    case 'EmbeddedMultiValuedEnumField':
      return parseEmbeddedMultiValuedEnumField(x, where);
    case 'EmbeddedLinkField':
      return parseEmbeddedLinkField(x, where);
    case 'EmbeddedEmailField':
      return parseEmbeddedEmailField(x, where);
    case 'EmbeddedPhoneNumberField':
      return parseEmbeddedPhoneNumberField(x, where);
    case 'EmbeddedOrcidField':
      return parseEmbeddedOrcidField(x, where);
    case 'EmbeddedRorField':
      return parseEmbeddedRorField(x, where);
    case 'EmbeddedDoiField':
      return parseEmbeddedDoiField(x, where);
    case 'EmbeddedPubMedIdField':
      return parseEmbeddedPubMedIdField(x, where);
    case 'EmbeddedRridField':
      return parseEmbeddedRridField(x, where);
    case 'EmbeddedNihGrantIdField':
      return parseEmbeddedNihGrantIdField(x, where);
    case 'EmbeddedLanguageField':
      return parseEmbeddedLanguageField(x, where);
    case 'EmbeddedAttributeValueField':
      return parseEmbeddedAttributeValueField(x, where);
  }
}

// ---- EmbeddedArtifact union -----------------------------------------

const EMBEDDED_ARTIFACT_KINDS = [
  ...EMBEDDED_FIELD_KINDS,
  'EmbeddedTemplate',
  'EmbeddedPresentationComponent',
] as const;

import type { EmbeddedArtifact } from '../embedded/index.js';

export function serializeEmbeddedArtifact(x: EmbeddedArtifact): unknown {
  if (x.kind === 'EmbeddedTemplate') return serializeEmbeddedTemplate(x);
  if (x.kind === 'EmbeddedPresentationComponent')
    return serializeEmbeddedPresentationComponent(x);
  return serializeEmbeddedField(x);
}

export function parseEmbeddedArtifact(
  x: unknown,
  where = 'EmbeddedArtifact',
): EmbeddedArtifact {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, EMBEDDED_ARTIFACT_KINDS, where);
  if (k === 'EmbeddedTemplate') return parseEmbeddedTemplate(x, where);
  if (k === 'EmbeddedPresentationComponent')
    return parseEmbeddedPresentationComponent(x, where);
  return parseEmbeddedField(x, where);
}
