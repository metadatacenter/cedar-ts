// =====================================================================
// fields — wire-form serialize/parse for the 18 Field artifacts + Field
// union dispatcher.
// =====================================================================

import { CedarConstructionError } from '../leaves/index.js';
import {
  type Field,
  type TextField,
  type NumericField,
  type DateField,
  type TimeField,
  type DateTimeField,
  type ControlledTermField,
  type SingleChoiceField,
  type MultipleChoiceField,
  type LinkField,
  type EmailField,
  type PhoneNumberField,
  type OrcidField,
  type RorField,
  type DoiField,
  type PubMedIdField,
  type RridField,
  type NihGrantIdField,
  type AttributeValueField,
  type SingleChoiceFieldSpec,
  type MultipleChoiceFieldSpec,
  textField,
  numericField,
  dateField,
  timeField,
  dateTimeField,
  controlledTermField,
  singleChoiceField,
  multipleChoiceField,
  linkField,
  emailField,
  phoneNumberField,
  orcidField,
  rorField,
  doiField,
  pubMedIdField,
  rridField,
  nihGrantIdField,
  attributeValueField,
} from '../field-families/index.js';
import {
  expectObject,
  expectString,
  expectKnownProperties,
  expectKindOneOf,
} from './parse-utils.js';
import {
  serializeTextFieldId,
  serializeNumericFieldId,
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
  parseTextFieldId,
  parseNumericFieldId,
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
} from './collapsed-wrappers.js';
import {
  serializeSchemaArtifactMetadata,
  parseSchemaArtifactMetadata,
} from './metadata.js';
import {
  serializeTextFieldSpec,
  serializeNumericFieldSpec,
  serializeDateFieldSpec,
  serializeTimeFieldSpec,
  serializeDateTimeFieldSpec,
  serializeControlledTermFieldSpec,
  serializeLiteralSingleChoiceFieldSpec,
  serializeControlledTermSingleChoiceFieldSpec,
  serializeLiteralMultipleChoiceFieldSpec,
  serializeControlledTermMultipleChoiceFieldSpec,
  serializeLinkFieldSpec,
  serializeEmailFieldSpec,
  serializePhoneNumberFieldSpec,
  serializeOrcidFieldSpec,
  serializeRorFieldSpec,
  serializeDoiFieldSpec,
  serializePubMedIdFieldSpec,
  serializeRridFieldSpec,
  serializeNihGrantIdFieldSpec,
  serializeAttributeValueFieldSpec,
  parseTextFieldSpec,
  parseNumericFieldSpec,
  parseDateFieldSpec,
  parseTimeFieldSpec,
  parseDateTimeFieldSpec,
  parseControlledTermFieldSpec,
  parseLiteralSingleChoiceFieldSpec,
  parseControlledTermSingleChoiceFieldSpec,
  parseLiteralMultipleChoiceFieldSpec,
  parseControlledTermMultipleChoiceFieldSpec,
  parseLinkFieldSpec,
  parseEmailFieldSpec,
  parsePhoneNumberFieldSpec,
  parseOrcidFieldSpec,
  parseRorFieldSpec,
  parseDoiFieldSpec,
  parsePubMedIdFieldSpec,
  parseRridFieldSpec,
  parseNihGrantIdFieldSpec,
  parseAttributeValueFieldSpec,
} from './field-specs.js';

// Helper for the per-family Field parser.
function parseFieldShell<T>(
  x: unknown,
  expectedKind: string,
  where: string,
): { id: unknown; modelVersion: string; metadata: unknown; fieldSpec: unknown } {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'id', 'modelVersion', 'metadata', 'fieldSpec']);
  if (o['kind'] !== expectedKind) {
    throw new CedarConstructionError(
      `${where}: expected kind ${JSON.stringify(expectedKind)}; got ${JSON.stringify(o['kind'])}`,
    );
  }
  for (const k of ['id', 'modelVersion', 'metadata', 'fieldSpec']) {
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
    fieldSpec: o['fieldSpec'],
  };
}

// ---- Per-family serializers / parsers --------------------------------

export const serializeTextField = (x: TextField): unknown => ({
  kind: 'TextField',
  id: serializeTextFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeTextFieldSpec(x.fieldSpec),
});

export function parseTextField(x: unknown, where = 'TextField'): TextField {
  const s = parseFieldShell<TextField>(x, 'TextField', where);
  return textField({
    id: parseTextFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseTextFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeNumericField = (x: NumericField): unknown => ({
  kind: 'NumericField',
  id: serializeNumericFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeNumericFieldSpec(x.fieldSpec),
});

export function parseNumericField(
  x: unknown,
  where = 'NumericField',
): NumericField {
  const s = parseFieldShell<NumericField>(x, 'NumericField', where);
  return numericField({
    id: parseNumericFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseNumericFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeDateField = (x: DateField): unknown => ({
  kind: 'DateField',
  id: serializeDateFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeDateFieldSpec(x.fieldSpec),
});

export function parseDateField(x: unknown, where = 'DateField'): DateField {
  const s = parseFieldShell<DateField>(x, 'DateField', where);
  return dateField({
    id: parseDateFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseDateFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeTimeField = (x: TimeField): unknown => ({
  kind: 'TimeField',
  id: serializeTimeFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeTimeFieldSpec(x.fieldSpec),
});

export function parseTimeField(x: unknown, where = 'TimeField'): TimeField {
  const s = parseFieldShell<TimeField>(x, 'TimeField', where);
  return timeField({
    id: parseTimeFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseTimeFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeDateTimeField = (x: DateTimeField): unknown => ({
  kind: 'DateTimeField',
  id: serializeDateTimeFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeDateTimeFieldSpec(x.fieldSpec),
});

export function parseDateTimeField(
  x: unknown,
  where = 'DateTimeField',
): DateTimeField {
  const s = parseFieldShell<DateTimeField>(x, 'DateTimeField', where);
  return dateTimeField({
    id: parseDateTimeFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseDateTimeFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeControlledTermField = (x: ControlledTermField): unknown => ({
  kind: 'ControlledTermField',
  id: serializeControlledTermFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeControlledTermFieldSpec(x.fieldSpec),
});

export function parseControlledTermField(
  x: unknown,
  where = 'ControlledTermField',
): ControlledTermField {
  const s = parseFieldShell<ControlledTermField>(x, 'ControlledTermField', where);
  return controlledTermField({
    id: parseControlledTermFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseControlledTermFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export function serializeSingleChoiceField(x: SingleChoiceField): unknown {
  const fieldSpec =
    x.fieldSpec.kind === 'LiteralSingleChoiceFieldSpec'
      ? serializeLiteralSingleChoiceFieldSpec(x.fieldSpec)
      : serializeControlledTermSingleChoiceFieldSpec(x.fieldSpec);
  return {
    kind: 'SingleChoiceField',
    id: serializeSingleChoiceFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeSchemaArtifactMetadata(x.metadata),
    fieldSpec,
  };
}

export function parseSingleChoiceField(
  x: unknown,
  where = 'SingleChoiceField',
): SingleChoiceField {
  const s = parseFieldShell<SingleChoiceField>(x, 'SingleChoiceField', where);
  const specObj = expectObject(s.fieldSpec, `${where}.fieldSpec`);
  const k = expectKindOneOf(
    specObj,
    ['LiteralSingleChoiceFieldSpec', 'ControlledTermSingleChoiceFieldSpec'] as const,
    `${where}.fieldSpec`,
  );
  const fieldSpec: SingleChoiceFieldSpec =
    k === 'LiteralSingleChoiceFieldSpec'
      ? parseLiteralSingleChoiceFieldSpec(s.fieldSpec, `${where}.fieldSpec`)
      : parseControlledTermSingleChoiceFieldSpec(s.fieldSpec, `${where}.fieldSpec`);
  return singleChoiceField({
    id: parseSingleChoiceFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec,
  });
}

export function serializeMultipleChoiceField(x: MultipleChoiceField): unknown {
  const fieldSpec =
    x.fieldSpec.kind === 'LiteralMultipleChoiceFieldSpec'
      ? serializeLiteralMultipleChoiceFieldSpec(x.fieldSpec)
      : serializeControlledTermMultipleChoiceFieldSpec(x.fieldSpec);
  return {
    kind: 'MultipleChoiceField',
    id: serializeMultipleChoiceFieldId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeSchemaArtifactMetadata(x.metadata),
    fieldSpec,
  };
}

export function parseMultipleChoiceField(
  x: unknown,
  where = 'MultipleChoiceField',
): MultipleChoiceField {
  const s = parseFieldShell<MultipleChoiceField>(x, 'MultipleChoiceField', where);
  const specObj = expectObject(s.fieldSpec, `${where}.fieldSpec`);
  const k = expectKindOneOf(
    specObj,
    ['LiteralMultipleChoiceFieldSpec', 'ControlledTermMultipleChoiceFieldSpec'] as const,
    `${where}.fieldSpec`,
  );
  const fieldSpec: MultipleChoiceFieldSpec =
    k === 'LiteralMultipleChoiceFieldSpec'
      ? parseLiteralMultipleChoiceFieldSpec(s.fieldSpec, `${where}.fieldSpec`)
      : parseControlledTermMultipleChoiceFieldSpec(s.fieldSpec, `${where}.fieldSpec`);
  return multipleChoiceField({
    id: parseMultipleChoiceFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec,
  });
}

export const serializeLinkField = (x: LinkField): unknown => ({
  kind: 'LinkField',
  id: serializeLinkFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeLinkFieldSpec(x.fieldSpec),
});

export function parseLinkField(x: unknown, where = 'LinkField'): LinkField {
  const s = parseFieldShell<LinkField>(x, 'LinkField', where);
  return linkField({
    id: parseLinkFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseLinkFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeEmailField = (x: EmailField): unknown => ({
  kind: 'EmailField',
  id: serializeEmailFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeEmailFieldSpec(x.fieldSpec),
});

export function parseEmailField(x: unknown, where = 'EmailField'): EmailField {
  const s = parseFieldShell<EmailField>(x, 'EmailField', where);
  return emailField({
    id: parseEmailFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseEmailFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializePhoneNumberField = (x: PhoneNumberField): unknown => ({
  kind: 'PhoneNumberField',
  id: serializePhoneNumberFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializePhoneNumberFieldSpec(x.fieldSpec),
});

export function parsePhoneNumberField(
  x: unknown,
  where = 'PhoneNumberField',
): PhoneNumberField {
  const s = parseFieldShell<PhoneNumberField>(x, 'PhoneNumberField', where);
  return phoneNumberField({
    id: parsePhoneNumberFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parsePhoneNumberFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeOrcidField = (x: OrcidField): unknown => ({
  kind: 'OrcidField',
  id: serializeOrcidFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeOrcidFieldSpec(x.fieldSpec),
});

export function parseOrcidField(x: unknown, where = 'OrcidField'): OrcidField {
  const s = parseFieldShell<OrcidField>(x, 'OrcidField', where);
  return orcidField({
    id: parseOrcidFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseOrcidFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeRorField = (x: RorField): unknown => ({
  kind: 'RorField',
  id: serializeRorFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeRorFieldSpec(x.fieldSpec),
});

export function parseRorField(x: unknown, where = 'RorField'): RorField {
  const s = parseFieldShell<RorField>(x, 'RorField', where);
  return rorField({
    id: parseRorFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseRorFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeDoiField = (x: DoiField): unknown => ({
  kind: 'DoiField',
  id: serializeDoiFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeDoiFieldSpec(x.fieldSpec),
});

export function parseDoiField(x: unknown, where = 'DoiField'): DoiField {
  const s = parseFieldShell<DoiField>(x, 'DoiField', where);
  return doiField({
    id: parseDoiFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseDoiFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializePubMedIdField = (x: PubMedIdField): unknown => ({
  kind: 'PubMedIdField',
  id: serializePubMedIdFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializePubMedIdFieldSpec(x.fieldSpec),
});

export function parsePubMedIdField(
  x: unknown,
  where = 'PubMedIdField',
): PubMedIdField {
  const s = parseFieldShell<PubMedIdField>(x, 'PubMedIdField', where);
  return pubMedIdField({
    id: parsePubMedIdFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parsePubMedIdFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeRridField = (x: RridField): unknown => ({
  kind: 'RridField',
  id: serializeRridFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeRridFieldSpec(x.fieldSpec),
});

export function parseRridField(x: unknown, where = 'RridField'): RridField {
  const s = parseFieldShell<RridField>(x, 'RridField', where);
  return rridField({
    id: parseRridFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseRridFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeNihGrantIdField = (x: NihGrantIdField): unknown => ({
  kind: 'NihGrantIdField',
  id: serializeNihGrantIdFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeNihGrantIdFieldSpec(x.fieldSpec),
});

export function parseNihGrantIdField(
  x: unknown,
  where = 'NihGrantIdField',
): NihGrantIdField {
  const s = parseFieldShell<NihGrantIdField>(x, 'NihGrantIdField', where);
  return nihGrantIdField({
    id: parseNihGrantIdFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseNihGrantIdFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

export const serializeAttributeValueField = (x: AttributeValueField): unknown => ({
  kind: 'AttributeValueField',
  id: serializeAttributeValueFieldId(x.id),
  modelVersion: x.modelVersion,
  metadata: serializeSchemaArtifactMetadata(x.metadata),
  fieldSpec: serializeAttributeValueFieldSpec(x.fieldSpec),
});

export function parseAttributeValueField(
  x: unknown,
  where = 'AttributeValueField',
): AttributeValueField {
  const s = parseFieldShell<AttributeValueField>(x, 'AttributeValueField', where);
  return attributeValueField({
    id: parseAttributeValueFieldId(s.id, `${where}.id`),
    modelVersion: s.modelVersion,
    metadata: parseSchemaArtifactMetadata(s.metadata, `${where}.metadata`),
    fieldSpec: parseAttributeValueFieldSpec(s.fieldSpec, `${where}.fieldSpec`),
  });
}

// ---- Field union dispatcher ------------------------------------------

const FIELD_KINDS = [
  'TextField',
  'NumericField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleChoiceField',
  'MultipleChoiceField',
  'LinkField',
  'EmailField',
  'PhoneNumberField',
  'OrcidField',
  'RorField',
  'DoiField',
  'PubMedIdField',
  'RridField',
  'NihGrantIdField',
  'AttributeValueField',
] as const;

export function serializeField(x: Field): unknown {
  switch (x.kind) {
    case 'TextField':
      return serializeTextField(x);
    case 'NumericField':
      return serializeNumericField(x);
    case 'DateField':
      return serializeDateField(x);
    case 'TimeField':
      return serializeTimeField(x);
    case 'DateTimeField':
      return serializeDateTimeField(x);
    case 'ControlledTermField':
      return serializeControlledTermField(x);
    case 'SingleChoiceField':
      return serializeSingleChoiceField(x);
    case 'MultipleChoiceField':
      return serializeMultipleChoiceField(x);
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
    case 'NumericField':
      return parseNumericField(x, where);
    case 'DateField':
      return parseDateField(x, where);
    case 'TimeField':
      return parseTimeField(x, where);
    case 'DateTimeField':
      return parseDateTimeField(x, where);
    case 'ControlledTermField':
      return parseControlledTermField(x, where);
    case 'SingleChoiceField':
      return parseSingleChoiceField(x, where);
    case 'MultipleChoiceField':
      return parseMultipleChoiceField(x, where);
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
    case 'AttributeValueField':
      return parseAttributeValueField(x, where);
  }
}
