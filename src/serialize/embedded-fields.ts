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
  type EmbeddedSingleChoiceField,
  type EmbeddedMultipleChoiceField,
  type EmbeddedLinkField,
  type EmbeddedEmailField,
  type EmbeddedPhoneNumberField,
  type EmbeddedOrcidField,
  type EmbeddedRorField,
  type EmbeddedDoiField,
  type EmbeddedPubMedIdField,
  type EmbeddedRridField,
  type EmbeddedNihGrantIdField,
  type EmbeddedAttributeValueField,
  embeddedTextField,
  embeddedIntegerNumberField,
  embeddedRealNumberField,
  embeddedBooleanField,
  embeddedDateField,
  embeddedTimeField,
  embeddedDateTimeField,
  embeddedControlledTermField,
  embeddedSingleChoiceField,
  embeddedMultipleChoiceField,
  embeddedLinkField,
  embeddedEmailField,
  embeddedPhoneNumberField,
  embeddedOrcidField,
  embeddedRorField,
  embeddedDoiField,
  embeddedPubMedIdField,
  embeddedRridField,
  embeddedNihGrantIdField,
  embeddedAttributeValueField,
} from '../field-families/index.js';
import {
  type EmbeddedTemplate,
  type EmbeddedPresentationComponent,
  type ValueRequirement,
  type Cardinality,
  type Visibility,
  type LabelOverride,
  type Property,
  embeddedTemplate,
  embeddedPresentationComponent,
} from '../embedded/index.js';
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
  serializeSingleChoiceFieldId,
  serializeMultipleChoiceFieldId,
  serializeLinkFieldId,
  serializeEmailFieldId,
  serializePhoneNumberFieldId,
  serializeOrcidFieldId,
  serializeRorFieldId,
  serializeDoiFieldId,
  serializePubMedIdFieldId,
  serializeRridFieldId,
  serializeNihGrantIdFieldId,
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
  parseSingleChoiceFieldId,
  parseMultipleChoiceFieldId,
  parseLinkFieldId,
  parseEmailFieldId,
  parsePhoneNumberFieldId,
  parseOrcidFieldId,
  parseRorFieldId,
  parseDoiFieldId,
  parsePubMedIdFieldId,
  parseRridFieldId,
  parseNihGrantIdFieldId,
  parseAttributeValueFieldId,
  parseTemplateId,
  parsePresentationComponentId,
} from './collapsed-wrappers.js';
import {
  serializeCardinality,
  serializeProperty,
  serializeLabelOverride,
  serializeValueRequirement,
  serializeVisibility,
  parseCardinality,
  parseProperty,
  parseLabelOverride,
  parseValueRequirement,
  parseVisibility,
} from './embedded-config.js';
import {
  serializeTextValueUntagged,
  parseTextValueUntagged,
  serializeIntegerNumberValueUntagged,
  parseIntegerNumberValueUntagged,
  serializeRealNumberValueUntagged,
  parseRealNumberValueUntagged,
  serializeBooleanValueUntagged,
  parseBooleanValueUntagged,
  serializeDateValue,
  parseDateValue,
  serializeTimeValueUntagged,
  parseTimeValueUntagged,
  serializeDateTimeValueUntagged,
  parseDateTimeValueUntagged,
  serializeChoiceValue,
  parseChoiceValue,
  serializeControlledTermValueUntagged,
  parseControlledTermValueUntagged,
  serializeLinkValueUntagged,
  parseLinkValueUntagged,
  serializeEmailValueUntagged,
  parseEmailValueUntagged,
  serializePhoneNumberValueUntagged,
  parsePhoneNumberValueUntagged,
  serializeOrcidValueUntagged,
  serializeRorValueUntagged,
  serializeDoiValueUntagged,
  serializePubMedIdValueUntagged,
  serializeRridValueUntagged,
  serializeNihGrantIdValueUntagged,
  parseOrcidValueUntagged,
  parseRorValueUntagged,
  parseDoiValueUntagged,
  parsePubMedIdValueUntagged,
  parseRridValueUntagged,
  parseNihGrantIdValueUntagged,
} from './values.js';

// ---- Common per-embedding properties ---------------------------------

interface CommonOut {
  valueRequirement?: ValueRequirement;
  cardinality?: Cardinality;
  visibility?: Visibility;
  labelOverride?: LabelOverride;
  property?: Property;
}

function serializeCommonProps(
  x: {
    readonly valueRequirement?: ValueRequirement;
    readonly cardinality?: Cardinality;
    readonly visibility?: Visibility;
    readonly labelOverride?: LabelOverride;
    readonly property?: Property;
  },
  out: Record<string, unknown>,
): void {
  if (x.valueRequirement !== undefined)
    out['valueRequirement'] = serializeValueRequirement(x.valueRequirement);
  if (x.cardinality !== undefined)
    out['cardinality'] = serializeCardinality(x.cardinality);
  if (x.visibility !== undefined)
    out['visibility'] = serializeVisibility(x.visibility);
  if (x.labelOverride !== undefined)
    out['labelOverride'] = serializeLabelOverride(x.labelOverride);
  if (x.property !== undefined) out['property'] = serializeProperty(x.property);
}

function parseCommonProps(
  o: { readonly [k: string]: unknown },
  where: string,
): CommonOut {
  rejectNullProperty(o, 'valueRequirement');
  rejectNullProperty(o, 'cardinality');
  rejectNullProperty(o, 'visibility');
  rejectNullProperty(o, 'labelOverride');
  rejectNullProperty(o, 'property');
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
  if ('labelOverride' in o)
    out.labelOverride = parseLabelOverride(
      o['labelOverride'],
      `${where}.labelOverride`,
    );
  if ('property' in o)
    out.property = parseProperty(o['property'], `${where}.property`);
  return out;
}

const COMMON_FIELD_PROPS = [
  'kind',
  'key',
  'artifactRef',
  'valueRequirement',
  'cardinality',
  'visibility',
  'labelOverride',
  'property',
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
    out['defaultValue'] = serializeTextValueUntagged(x.defaultValue);
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
      defaultValue: parseTextValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeIntegerNumberValueUntagged(x.defaultValue);
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
      defaultValue: parseIntegerNumberValueUntagged(
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
    out['defaultValue'] = serializeRealNumberValueUntagged(x.defaultValue);
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
      defaultValue: parseRealNumberValueUntagged(
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
  'labelOverride',
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
  if (x.labelOverride !== undefined)
    out['labelOverride'] = serializeLabelOverride(x.labelOverride);
  if (x.property !== undefined) out['property'] = serializeProperty(x.property);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeBooleanValueUntagged(x.defaultValue);
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
  rejectNullProperty(o, 'labelOverride');
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
  if ('labelOverride' in o)
    (init as { labelOverride?: LabelOverride }).labelOverride = parseLabelOverride(
      o['labelOverride'],
      `${where}.labelOverride`,
    );
  if ('property' in o)
    (init as { property?: Property }).property = parseProperty(
      o['property'],
      `${where}.property`,
    );
  if ('defaultValue' in o)
    (init as { defaultValue?: unknown }).defaultValue = parseBooleanValueUntagged(
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
    out['defaultValue'] = serializeTimeValueUntagged(x.defaultValue);
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
      defaultValue: parseTimeValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeDateTimeValueUntagged(x.defaultValue);
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
      defaultValue: parseDateTimeValueUntagged(
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
    out['defaultValue'] = serializeControlledTermValueUntagged(x.defaultValue);
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
      defaultValue: parseControlledTermValueUntagged(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
    }),
  });
}

export function serializeEmbeddedSingleChoiceField(
  x: EmbeddedSingleChoiceField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedSingleChoiceField',
    key: x.key,
    artifactRef: serializeSingleChoiceFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeChoiceValue(x.defaultValue);
  return out;
}

export function parseEmbeddedSingleChoiceField(
  x: unknown,
  where = 'EmbeddedSingleChoiceField',
): EmbeddedSingleChoiceField {
  const s = readShell(x, 'EmbeddedSingleChoiceField', where, true);
  return embeddedSingleChoiceField({
    key: s.key,
    artifactRef: parseSingleChoiceFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseChoiceValue(s.defaultRaw, `${where}.defaultValue`),
    }),
  });
}

export function serializeEmbeddedMultipleChoiceField(
  x: EmbeddedMultipleChoiceField,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'EmbeddedMultipleChoiceField',
    key: x.key,
    artifactRef: serializeMultipleChoiceFieldId(x.artifactRef),
  };
  serializeCommonProps(x, out);
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeChoiceValue(x.defaultValue);
  return out;
}

export function parseEmbeddedMultipleChoiceField(
  x: unknown,
  where = 'EmbeddedMultipleChoiceField',
): EmbeddedMultipleChoiceField {
  const s = readShell(x, 'EmbeddedMultipleChoiceField', where, true);
  return embeddedMultipleChoiceField({
    key: s.key,
    artifactRef: parseMultipleChoiceFieldId(s.artifactRef, `${where}.artifactRef`),
    ...s.common,
    ...(s.defaultRaw !== undefined && {
      defaultValue: parseChoiceValue(s.defaultRaw, `${where}.defaultValue`),
    }),
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
    out['defaultValue'] = serializeLinkValueUntagged(x.defaultValue);
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
      defaultValue: parseLinkValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeEmailValueUntagged(x.defaultValue);
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
      defaultValue: parseEmailValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializePhoneNumberValueUntagged(x.defaultValue);
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
      defaultValue: parsePhoneNumberValueUntagged(
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
    out['defaultValue'] = serializeOrcidValueUntagged(x.defaultValue);
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
      defaultValue: parseOrcidValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeRorValueUntagged(x.defaultValue);
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
      defaultValue: parseRorValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeDoiValueUntagged(x.defaultValue);
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
      defaultValue: parseDoiValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializePubMedIdValueUntagged(x.defaultValue);
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
      defaultValue: parsePubMedIdValueUntagged(
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
    out['defaultValue'] = serializeRridValueUntagged(x.defaultValue);
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
      defaultValue: parseRridValueUntagged(s.defaultRaw, `${where}.defaultValue`),
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
    out['defaultValue'] = serializeNihGrantIdValueUntagged(x.defaultValue);
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
      defaultValue: parseNihGrantIdValueUntagged(
        s.defaultRaw,
        `${where}.defaultValue`,
      ),
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
  if (x.labelOverride !== undefined)
    out['labelOverride'] = serializeLabelOverride(x.labelOverride);
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
    'labelOverride',
  ]);
  rejectNullProperty(o, 'visibility');
  rejectNullProperty(o, 'labelOverride');
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
    labelOverride?: LabelOverride;
  } = {
    key: expectString(o['key'], `${where}.key`),
    artifactRef: parsePresentationComponentId(
      o['artifactRef'],
      `${where}.artifactRef`,
    ),
  };
  if ('visibility' in o)
    init.visibility = parseVisibility(o['visibility'], `${where}.visibility`);
  if ('labelOverride' in o)
    init.labelOverride = parseLabelOverride(
      o['labelOverride'],
      `${where}.labelOverride`,
    );
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
  'EmbeddedSingleChoiceField',
  'EmbeddedMultipleChoiceField',
  'EmbeddedLinkField',
  'EmbeddedEmailField',
  'EmbeddedPhoneNumberField',
  'EmbeddedOrcidField',
  'EmbeddedRorField',
  'EmbeddedDoiField',
  'EmbeddedPubMedIdField',
  'EmbeddedRridField',
  'EmbeddedNihGrantIdField',
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
    case 'EmbeddedSingleChoiceField':
      return serializeEmbeddedSingleChoiceField(x);
    case 'EmbeddedMultipleChoiceField':
      return serializeEmbeddedMultipleChoiceField(x);
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
    case 'EmbeddedSingleChoiceField':
      return parseEmbeddedSingleChoiceField(x, where);
    case 'EmbeddedMultipleChoiceField':
      return parseEmbeddedMultipleChoiceField(x, where);
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
