// =====================================================================
// fields — wire-form serialize/parse for the 19 Field artifacts + Field
// union dispatcher.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  type Field,
  type TextField,
  type IntegerNumberField,
  type RealNumberField,
  type BooleanField,
  type DateField,
  type TimeField,
  type DateTimeField,
  type ControlledTermField,
  type SingleValuedEnumField,
  type MultiValuedEnumField,
  type LinkField,
  type EmailField,
  type PhoneNumberField,
  type OrcidField,
  type RorField,
  type DoiField,
  type PubMedIdField,
  type RridField,
  type NihGrantIdField,
  type LanguageField,
  type AttributeValueField,
  textField,
  integerNumberField,
  realNumberField,
  booleanField,
  dateField,
  timeField,
  dateTimeField,
  controlledTermField,
  singleValuedEnumField,
  multiValuedEnumField,
  linkField,
  emailField,
  phoneNumberField,
  orcidField,
  rorField,
  doiField,
  pubMedIdField,
  rridField,
  nihGrantIdField,
  languageField,
  attributeValueField,
} from '../field-families/index.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
} from './parse-utils.js';
import { serializeProperty, parseProperty } from './embedded-config.js';
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
} from './collapsed-wrappers.js';
import {
  serializeCatalogMetadata,
  serializeSchemaArtifactVersioning,
  parseCatalogMetadata,
  parseSchemaArtifactVersioning,
} from './metadata.js';
import {
  serializeTextFieldSpec,
  serializeIntegerNumberFieldSpec,
  serializeRealNumberFieldSpec,
  serializeBooleanFieldSpec,
  serializeDateFieldSpec,
  serializeTimeFieldSpec,
  serializeDateTimeFieldSpec,
  serializeControlledTermFieldSpec,
  serializeSingleValuedEnumFieldSpec,
  serializeMultiValuedEnumFieldSpec,
  serializeLinkFieldSpec,
  serializeEmailFieldSpec,
  serializePhoneNumberFieldSpec,
  serializeOrcidFieldSpec,
  serializeRorFieldSpec,
  serializeDoiFieldSpec,
  serializePubMedIdFieldSpec,
  serializeRridFieldSpec,
  serializeNihGrantIdFieldSpec,
  serializeLanguageFieldSpec,
  serializeAttributeValueFieldSpec,
  parseTextFieldSpec,
  parseIntegerNumberFieldSpec,
  parseRealNumberFieldSpec,
  parseBooleanFieldSpec,
  parseDateFieldSpec,
  parseTimeFieldSpec,
  parseDateTimeFieldSpec,
  parseControlledTermFieldSpec,
  parseSingleValuedEnumFieldSpec,
  parseMultiValuedEnumFieldSpec,
  parseLinkFieldSpec,
  parseEmailFieldSpec,
  parsePhoneNumberFieldSpec,
  parseOrcidFieldSpec,
  parseRorFieldSpec,
  parseDoiFieldSpec,
  parsePubMedIdFieldSpec,
  parseRridFieldSpec,
  parseNihGrantIdFieldSpec,
  parseLanguageFieldSpec,
  parseAttributeValueFieldSpec,
} from './field-specs.js';

// Helper for the per-family Field parser.
function parseFieldShell<T>(
  x: unknown,
  expectedKind: string,
  where: string,
): {
  id: unknown;
  modelVersion: string;
  metadata: unknown;
  versioning: unknown;
  fieldSpec: unknown;
  prompt: unknown;
  helpText: unknown;
  recommendedKey: unknown;
  recommendedProperty: unknown;
} {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind', 'id', 'modelVersion', 'metadata', 'versioning',
    'fieldSpec', 'prompt', 'helpText', 'recommendedKey', 'recommendedProperty',
  ]);
  if (o['kind'] !== expectedKind) {
    throw new CedarConstructionError(
      `${where}: expected kind ${JSON.stringify(expectedKind)}; got ${JSON.stringify(o['kind'])}`,
    );
  }
  for (const k of ['id', 'modelVersion', 'metadata', 'versioning', 'fieldSpec', 'prompt']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  void (null as unknown as T);
  return {
    id: o['id'],
    modelVersion: expectString(o['modelVersion'], `${where}.modelVersion`),
    metadata: o['metadata'],
    versioning: o['versioning'],
    fieldSpec: o['fieldSpec'],
    prompt: o['prompt'],
    helpText: 'helpText' in o ? o['helpText'] : undefined,
    recommendedKey: 'recommendedKey' in o ? o['recommendedKey'] : undefined,
    recommendedProperty:
      'recommendedProperty' in o ? o['recommendedProperty'] : undefined,
  };
}

// ---- Per-family serializers / parsers --------------------------------

export const serializeTextField = (x: TextField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'TextField',
    id: serializeTextFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeTextFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseTextField(x: unknown, where = 'TextField'): TextField {
  const s = parseFieldShell<TextField>(x, 'TextField', where);
  return textField({
    id: parseTextFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseTextFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeIntegerNumberField = (x: IntegerNumberField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'IntegerNumberField',
    id: serializeIntegerNumberFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeIntegerNumberFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseIntegerNumberField(
  x: unknown,
  where = 'IntegerNumberField',
): IntegerNumberField {
  const s = parseFieldShell<IntegerNumberField>(
    x,
    'IntegerNumberField',
    where,
  );
  return integerNumberField({
    id: parseIntegerNumberFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseIntegerNumberFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeRealNumberField = (x: RealNumberField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'RealNumberField',
    id: serializeRealNumberFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeRealNumberFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseRealNumberField(
  x: unknown,
  where = 'RealNumberField',
): RealNumberField {
  const s = parseFieldShell<RealNumberField>(x, 'RealNumberField', where);
  return realNumberField({
    id: parseRealNumberFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseRealNumberFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeBooleanField = (x: BooleanField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'BooleanField',
    id: serializeBooleanFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeBooleanFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseBooleanField(
  x: unknown,
  where = 'BooleanField',
): BooleanField {
  const s = parseFieldShell<BooleanField>(x, 'BooleanField', where);
  return booleanField({
    id: parseBooleanFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseBooleanFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeDateField = (x: DateField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'DateField',
    id: serializeDateFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeDateFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseDateField(x: unknown, where = 'DateField'): DateField {
  const s = parseFieldShell<DateField>(x, 'DateField', where);
  return dateField({
    id: parseDateFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseDateFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeTimeField = (x: TimeField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'TimeField',
    id: serializeTimeFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeTimeFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseTimeField(x: unknown, where = 'TimeField'): TimeField {
  const s = parseFieldShell<TimeField>(x, 'TimeField', where);
  return timeField({
    id: parseTimeFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseTimeFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeDateTimeField = (x: DateTimeField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'DateTimeField',
    id: serializeDateTimeFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeDateTimeFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseDateTimeField(
  x: unknown,
  where = 'DateTimeField',
): DateTimeField {
  const s = parseFieldShell<DateTimeField>(x, 'DateTimeField', where);
  return dateTimeField({
    id: parseDateTimeFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseDateTimeFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeControlledTermField = (x: ControlledTermField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'ControlledTermField',
    id: serializeControlledTermFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeControlledTermFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseControlledTermField(
  x: unknown,
  where = 'ControlledTermField',
): ControlledTermField {
  const s = parseFieldShell<ControlledTermField>(x, 'ControlledTermField', where);
  return controlledTermField({
    id: parseControlledTermFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseControlledTermFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeSingleValuedEnumField = (x: SingleValuedEnumField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'SingleValuedEnumField',
    id: serializeSingleValuedEnumFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeSingleValuedEnumFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseSingleValuedEnumField(
  x: unknown,
  where = 'SingleValuedEnumField',
): SingleValuedEnumField {
  const s = parseFieldShell<SingleValuedEnumField>(
    x,
    'SingleValuedEnumField',
    where,
  );
  return singleValuedEnumField({
    id: parseSingleValuedEnumFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseSingleValuedEnumFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeMultiValuedEnumField = (x: MultiValuedEnumField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'MultiValuedEnumField',
    id: serializeMultiValuedEnumFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeMultiValuedEnumFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseMultiValuedEnumField(
  x: unknown,
  where = 'MultiValuedEnumField',
): MultiValuedEnumField {
  const s = parseFieldShell<MultiValuedEnumField>(
    x,
    'MultiValuedEnumField',
    where,
  );
  return multiValuedEnumField({
    id: parseMultiValuedEnumFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseMultiValuedEnumFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeLinkField = (x: LinkField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'LinkField',
    id: serializeLinkFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeLinkFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseLinkField(x: unknown, where = 'LinkField'): LinkField {
  const s = parseFieldShell<LinkField>(x, 'LinkField', where);
  return linkField({
    id: parseLinkFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseLinkFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeEmailField = (x: EmailField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'EmailField',
    id: serializeEmailFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeEmailFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseEmailField(x: unknown, where = 'EmailField'): EmailField {
  const s = parseFieldShell<EmailField>(x, 'EmailField', where);
  return emailField({
    id: parseEmailFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseEmailFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializePhoneNumberField = (x: PhoneNumberField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'PhoneNumberField',
    id: serializePhoneNumberFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializePhoneNumberFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parsePhoneNumberField(
  x: unknown,
  where = 'PhoneNumberField',
): PhoneNumberField {
  const s = parseFieldShell<PhoneNumberField>(x, 'PhoneNumberField', where);
  return phoneNumberField({
    id: parsePhoneNumberFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parsePhoneNumberFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeOrcidField = (x: OrcidField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'OrcidField',
    id: serializeOrcidFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeOrcidFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseOrcidField(x: unknown, where = 'OrcidField'): OrcidField {
  const s = parseFieldShell<OrcidField>(x, 'OrcidField', where);
  return orcidField({
    id: parseOrcidFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseOrcidFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeRorField = (x: RorField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'RorField',
    id: serializeRorFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeRorFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseRorField(x: unknown, where = 'RorField'): RorField {
  const s = parseFieldShell<RorField>(x, 'RorField', where);
  return rorField({
    id: parseRorFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseRorFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeDoiField = (x: DoiField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'DoiField',
    id: serializeDoiFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeDoiFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseDoiField(x: unknown, where = 'DoiField'): DoiField {
  const s = parseFieldShell<DoiField>(x, 'DoiField', where);
  return doiField({
    id: parseDoiFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseDoiFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializePubMedIdField = (x: PubMedIdField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'PubMedIdField',
    id: serializePubMedIdFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializePubMedIdFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parsePubMedIdField(
  x: unknown,
  where = 'PubMedIdField',
): PubMedIdField {
  const s = parseFieldShell<PubMedIdField>(x, 'PubMedIdField', where);
  return pubMedIdField({
    id: parsePubMedIdFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parsePubMedIdFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeRridField = (x: RridField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'RridField',
    id: serializeRridFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeRridFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseRridField(x: unknown, where = 'RridField'): RridField {
  const s = parseFieldShell<RridField>(x, 'RridField', where);
  return rridField({
    id: parseRridFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseRridFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeNihGrantIdField = (x: NihGrantIdField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'NihGrantIdField',
    id: serializeNihGrantIdFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeNihGrantIdFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseNihGrantIdField(
  x: unknown,
  where = 'NihGrantIdField',
): NihGrantIdField {
  const s = parseFieldShell<NihGrantIdField>(x, 'NihGrantIdField', where);
  return nihGrantIdField({
    id: parseNihGrantIdFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseNihGrantIdFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeLanguageField = (x: LanguageField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'LanguageField',
    id: serializeLanguageFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeLanguageFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseLanguageField(
  x: unknown,
  where = 'LanguageField',
): LanguageField {
  const s = parseFieldShell<LanguageField>(x, 'LanguageField', where);
  return languageField({
    id: parseLanguageFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseLanguageFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

export const serializeAttributeValueField = (x: AttributeValueField): unknown => {
  const out: Record<string, unknown> = {
    kind: 'AttributeValueField',
    id: serializeAttributeValueFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    fieldSpec: serializeAttributeValueFieldSpec(x.fieldSpec),
    prompt: serializeMultilingualString(x.prompt),
  };
  if (x.helpText !== undefined)
    out['helpText'] = serializeMultilingualString(x.helpText);
  if (x.recommendedKey !== undefined)
    out['recommendedKey'] = x.recommendedKey;
  if (x.recommendedProperty !== undefined)
    out['recommendedProperty'] = serializeProperty(x.recommendedProperty);
  return out;
};

export function parseAttributeValueField(
  x: unknown,
  where = 'AttributeValueField',
): AttributeValueField {
  const s = parseFieldShell<AttributeValueField>(x, 'AttributeValueField', where);
  return attributeValueField({
    id: parseAttributeValueFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseCatalogMetadata(s.metadata, `${where}.metadata`),
    versioning: parseSchemaArtifactVersioning(s.versioning, `${where}.versioning`),
    fieldSpec: parseAttributeValueFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
    prompt: parseMultilingualString(s.prompt, `${where}.prompt`),
    ...(s.helpText !== undefined && {
      helpText: parseMultilingualString(s.helpText, `${where}.helpText`),
    }),
    ...(s.recommendedKey !== undefined && {
      recommendedKey: expectString(s.recommendedKey, `${where}.recommendedKey`),
    }),
    ...(s.recommendedProperty !== undefined && {
      recommendedProperty: parseProperty(s.recommendedProperty, `${where}.recommendedProperty`),
    }),
  });
}

// ---- Field union dispatcher ------------------------------------------

const FIELD_KINDS = [
  'TextField',
  'IntegerNumberField',
  'RealNumberField',
  'BooleanField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleValuedEnumField',
  'MultiValuedEnumField',
  'LinkField',
  'EmailField',
  'PhoneNumberField',
  'OrcidField',
  'RorField',
  'DoiField',
  'PubMedIdField',
  'RridField',
  'NihGrantIdField',
  'LanguageField',
  'AttributeValueField',
] as const;

export function serializeField(x: Field): unknown {
  switch (x.kind) {
    case 'TextField':
      return serializeTextField(x);
    case 'IntegerNumberField':
      return serializeIntegerNumberField(x);
    case 'RealNumberField':
      return serializeRealNumberField(x);
    case 'BooleanField':
      return serializeBooleanField(x);
    case 'DateField':
      return serializeDateField(x);
    case 'TimeField':
      return serializeTimeField(x);
    case 'DateTimeField':
      return serializeDateTimeField(x);
    case 'ControlledTermField':
      return serializeControlledTermField(x);
    case 'SingleValuedEnumField':
      return serializeSingleValuedEnumField(x);
    case 'MultiValuedEnumField':
      return serializeMultiValuedEnumField(x);
    case 'LinkField':
      return serializeLinkField(x);
    case 'EmailField':
      return serializeEmailField(x);
    case 'PhoneNumberField':
      return serializePhoneNumberField(x);
    case 'OrcidField':
      return serializeOrcidField(x);
    case 'RorField':
      return serializeRorField(x);
    case 'DoiField':
      return serializeDoiField(x);
    case 'PubMedIdField':
      return serializePubMedIdField(x);
    case 'RridField':
      return serializeRridField(x);
    case 'NihGrantIdField':
      return serializeNihGrantIdField(x);
    case 'LanguageField':
      return serializeLanguageField(x);
    case 'AttributeValueField':
      return serializeAttributeValueField(x);
  }
}

export function parseField(x: unknown, where = 'Field'): Field {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, FIELD_KINDS, where);
  switch (k) {
    case 'TextField':
      return parseTextField(x, where);
    case 'IntegerNumberField':
      return parseIntegerNumberField(x, where);
    case 'RealNumberField':
      return parseRealNumberField(x, where);
    case 'BooleanField':
      return parseBooleanField(x, where);
    case 'DateField':
      return parseDateField(x, where);
    case 'TimeField':
      return parseTimeField(x, where);
    case 'DateTimeField':
      return parseDateTimeField(x, where);
    case 'ControlledTermField':
      return parseControlledTermField(x, where);
    case 'SingleValuedEnumField':
      return parseSingleValuedEnumField(x, where);
    case 'MultiValuedEnumField':
      return parseMultiValuedEnumField(x, where);
    case 'LinkField':
      return parseLinkField(x, where);
    case 'EmailField':
      return parseEmailField(x, where);
    case 'PhoneNumberField':
      return parsePhoneNumberField(x, where);
    case 'OrcidField':
      return parseOrcidField(x, where);
    case 'RorField':
      return parseRorField(x, where);
    case 'DoiField':
      return parseDoiField(x, where);
    case 'PubMedIdField':
      return parsePubMedIdField(x, where);
    case 'RridField':
      return parseRridField(x, where);
    case 'NihGrantIdField':
      return parseNihGrantIdField(x, where);
    case 'LanguageField':
      return parseLanguageField(x, where);
    case 'AttributeValueField':
      return parseAttributeValueField(x, where);
  }
}
