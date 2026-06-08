// =====================================================================
// field-specs — wire-form serialize/parse for every FieldSpec variant +
// the FieldSpec union dispatcher.
// =====================================================================
//
// Includes the supporting types only used in FieldSpec positions:
//   - Unit
//   - OntologyReference / OntologyDisplayHint / ControlledTermClass
//   - ControlledTermSource (Ontology / Branch / Class / ValueSet)
//   - PermissibleValue / Meaning
//   - the temporal RenderingHint variants and the flat-string rendering
//     hint enums

import {
  CedarConstructionError,
  type LanguageTag,
  type Iri,
} from '../leaves/index.js';
import {
  type TextFieldSpec,
  type IntegerFieldSpec,
  type DecimalFieldSpec,
  type FloatFieldSpec,
  type DoubleFieldSpec,
  type IntegerValue,
  type DecimalValue,
  type FloatValue,
  type DoubleValue,
  type BooleanValue,
  type BooleanFieldSpec,
  type DateFieldSpec,
  type TimeFieldSpec,
  type DateTimeFieldSpec,
  type ControlledTermFieldSpec,
  type SingleValuedEnumFieldSpec,
  type MultiValuedEnumFieldSpec,
  type LinkFieldSpec,
  type EmailFieldSpec,
  type PhoneNumberFieldSpec,
  type OrcidFieldSpec,
  type RorFieldSpec,
  type DoiFieldSpec,
  type PubMedIdFieldSpec,
  type RridFieldSpec,
  type NihGrantIdFieldSpec,
  type LanguageFieldSpec,
  type LanguageValue,
  type LanguageRenderingHint,
  type AttributeValueFieldSpec,
  type FieldSpec,
  type Unit,
  type OntologyReference,
  type OntologyDisplayHint,
  type ControlledTermClass,
  type ControlledTermSource,
  type OntologySource,
  type BranchSource,
  type ClassSource,
  type ValueSetSource,
  type PermissibleValue,
  type Meaning,
  type EnumValue,
  type DateValueType,
  type TimePrecision,
  type TimezoneRequirement,
  type LangTagRequirement,
  type DateTimeValueType,
  type DateRenderingHint,
  type TimeRenderingHint,
  type DateTimeRenderingHint,
  type TextRenderingHint,
  type TextLineMode,
  type NumericRenderingHint,
  type BooleanRenderingHint,
  type SingleValuedEnumRenderingHint,
  type MultiValuedEnumRenderingHint,
  type ControlledTermRenderingHint,
  type EmailRenderingHint,
  type PhoneNumberRenderingHint,
  type LinkRenderingHint,
  type OrcidRenderingHint,
  type RorRenderingHint,
  type DoiRenderingHint,
  type PubMedIdRenderingHint,
  type RridRenderingHint,
  type NihGrantIdRenderingHint,
  LANGUAGE_RENDERING_HINTS,
  type DateComponentOrder,
  type TimeFormat,
  textFieldSpec,
  integerFieldSpec,
  decimalFieldSpec,
  floatFieldSpec,
  doubleFieldSpec,
  booleanFieldSpec,
  dateFieldSpec,
  timeFieldSpec,
  dateTimeFieldSpec,
  controlledTermFieldSpec,
  singleValuedEnumFieldSpec,
  multiValuedEnumFieldSpec,
  linkFieldSpec,
  emailFieldSpec,
  phoneNumberFieldSpec,
  orcidFieldSpec,
  rorFieldSpec,
  doiFieldSpec,
  pubMedIdFieldSpec,
  rridFieldSpec,
  nihGrantIdFieldSpec,
  languageFieldSpec,
  attributeValueFieldSpec,
  unit,
  ontologyReference,
  ontologyDisplayHint,
  controlledTermClass,
  ontologySource,
  branchSource,
  classSource,
  valueSetSource,
  permissibleValue,
  meaning,
  DATE_VALUE_TYPES,
  TIME_PRECISIONS,
  TIMEZONE_REQUIREMENTS,
  LANG_TAG_REQUIREMENTS,
  DATE_TIME_VALUE_TYPES,
  TEXT_LINE_MODES,
  SINGLE_VALUED_ENUM_RENDERING_HINTS,
  MULTI_VALUED_ENUM_RENDERING_HINTS,
  BOOLEAN_RENDERING_HINTS,
  DATE_COMPONENT_ORDERS,
  TIME_FORMATS,
  dateRenderingHint,
  timeRenderingHint,
  dateTimeRenderingHint,
} from '../field-families/index.js';
import {
  expectObject,
  expectArray,
  expectNonEmptyArray,
  expectString,
  expectNumber,
  expectKnownProperties,
  expectKindOneOf,
  expectStringEnum,
  rejectNullProperty,
} from './parse-utils.js';
import { serializeIri } from './collapsed-wrappers.js';
import type { MultilingualString } from '../multilingual.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  serializeIntegerValue,
  parseIntegerValue,
  serializeDecimalValue,
  parseDecimalValue,
  serializeFloatValue,
  parseFloatValue,
  serializeDoubleValue,
  parseDoubleValue,
  serializeBooleanValue,
  parseBooleanValue,
  serializeTextValue,
  parseTextValue,
  serializeEnumValue,
  parseEnumValue,
  serializeDateValue,
  parseDateValue,
  serializeTimeValue,
  parseTimeValue,
  serializeDateTimeValue,
  parseDateTimeValue,
  serializeControlledTermValue,
  parseControlledTermValue,
  serializeLinkValue,
  parseLinkValue,
  serializeEmailValue,
  parseEmailValue,
  serializePhoneNumberValue,
  parsePhoneNumberValue,
  serializeOrcidValue,
  parseOrcidValue,
  serializeRorValue,
  parseRorValue,
  serializeDoiValue,
  parseDoiValue,
  serializePubMedIdValue,
  parsePubMedIdValue,
  serializeRridValue,
  parseRridValue,
  serializeNihGrantIdValue,
  parseNihGrantIdValue,
  serializeLanguageValue,
  parseLanguageValue,
} from './values.js';
import type {
  TextValue,
  DateValue,
  TimeValue,
  DateTimeValue,
  ControlledTermValue,
  LinkValue,
  EmailValue,
  PhoneNumberValue,
  OrcidValue,
  RorValue,
  DoiValue,
  PubMedIdValue,
  RridValue,
  NihGrantIdValue,
} from '../field-families/index.js';


// ---- Rendering hints --------------------------------------------------

// TextRenderingHint — structured object carrying optional lineMode and
// optional placeholder. The bare-string form ("singleLine" | "multiLine")
// from prior cedar-ts revisions no longer decodes.

export function serializeTextRenderingHint(x: TextRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.lineMode !== undefined) out['lineMode'] = x.lineMode;
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

export function parseTextRenderingHint(
  x: unknown,
  where = 'TextRenderingHint',
): TextRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['lineMode', 'placeholder']);
  rejectNullProperty(o, 'lineMode');
  rejectNullProperty(o, 'placeholder');
  const out: { lineMode?: TextLineMode; placeholder?: MultilingualString } = {};
  if ('lineMode' in o)
    out.lineMode = expectStringEnum<TextLineMode>(
      o['lineMode'],
      TEXT_LINE_MODES,
      `${where}.lineMode`,
    );
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${where}.placeholder`,
    );
  return out;
}

export function serializeNumericRenderingHint(x: NumericRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.decimalPlaces !== undefined) out['decimalPlaces'] = x.decimalPlaces;
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

export function parseNumericRenderingHint(
  x: unknown,
  w = 'NumericRenderingHint',
): NumericRenderingHint {
  const o = expectObject(x, w);
  expectKnownProperties(o, ['decimalPlaces', 'placeholder']);
  rejectNullProperty(o, 'decimalPlaces');
  rejectNullProperty(o, 'placeholder');
  const out: { decimalPlaces?: number; placeholder?: MultilingualString } = {};
  if ('decimalPlaces' in o)
    out.decimalPlaces = expectNumber(o['decimalPlaces'], `${w}.decimalPlaces`);
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${w}.placeholder`,
    );
  return out;
}

export const serializeBooleanRenderingHint = (x: BooleanRenderingHint): string => x;
export const parseBooleanRenderingHint = (
  x: unknown,
  w = 'BooleanRenderingHint',
): BooleanRenderingHint => expectStringEnum(x, BOOLEAN_RENDERING_HINTS, w);

export const serializeLanguageRenderingHint = (x: LanguageRenderingHint): string => x;
export const parseLanguageRenderingHint = (
  x: unknown,
  w = 'LanguageRenderingHint',
): LanguageRenderingHint => expectStringEnum(x, LANGUAGE_RENDERING_HINTS, w);

export const serializeSingleValuedEnumRenderingHint = (
  x: SingleValuedEnumRenderingHint,
): string => x;
export const parseSingleValuedEnumRenderingHint = (
  x: unknown,
  w = 'SingleValuedEnumRenderingHint',
): SingleValuedEnumRenderingHint =>
  expectStringEnum(x, SINGLE_VALUED_ENUM_RENDERING_HINTS, w);

export const serializeMultiValuedEnumRenderingHint = (
  x: MultiValuedEnumRenderingHint,
): string => x;
export const parseMultiValuedEnumRenderingHint = (
  x: unknown,
  w = 'MultiValuedEnumRenderingHint',
): MultiValuedEnumRenderingHint =>
  expectStringEnum(x, MULTI_VALUED_ENUM_RENDERING_HINTS, w);

export function serializeDateRenderingHint(x: DateRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.componentOrder !== undefined) out['componentOrder'] = x.componentOrder;
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

export function parseDateRenderingHint(
  x: unknown,
  where = 'DateRenderingHint',
): DateRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['componentOrder', 'placeholder']);
  rejectNullProperty(o, 'componentOrder');
  rejectNullProperty(o, 'placeholder');
  const out: {
    componentOrder?: DateComponentOrder;
    placeholder?: MultilingualString;
  } = {};
  if ('componentOrder' in o)
    out.componentOrder = expectStringEnum<DateComponentOrder>(
      o['componentOrder'],
      DATE_COMPONENT_ORDERS,
      `${where}.componentOrder`,
    );
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${where}.placeholder`,
    );
  return out;
}

export function serializeTimeRenderingHint(x: TimeRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.timeFormat !== undefined) out['timeFormat'] = x.timeFormat;
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

export function parseTimeRenderingHint(
  x: unknown,
  where = 'TimeRenderingHint',
): TimeRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['timeFormat', 'placeholder']);
  rejectNullProperty(o, 'timeFormat');
  rejectNullProperty(o, 'placeholder');
  const out: { timeFormat?: TimeFormat; placeholder?: MultilingualString } = {};
  if ('timeFormat' in o)
    out.timeFormat = expectStringEnum<TimeFormat>(
      o['timeFormat'],
      TIME_FORMATS,
      `${where}.timeFormat`,
    );
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${where}.placeholder`,
    );
  return out;
}

export function serializeDateTimeRenderingHint(x: DateTimeRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.timeFormat !== undefined) out['timeFormat'] = x.timeFormat;
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

export function parseDateTimeRenderingHint(
  x: unknown,
  where = 'DateTimeRenderingHint',
): DateTimeRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['timeFormat', 'placeholder']);
  rejectNullProperty(o, 'timeFormat');
  rejectNullProperty(o, 'placeholder');
  const out: { timeFormat?: TimeFormat; placeholder?: MultilingualString } = {};
  if ('timeFormat' in o)
    out.timeFormat = expectStringEnum<TimeFormat>(
      o['timeFormat'],
      TIME_FORMATS,
      `${where}.timeFormat`,
    );
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${where}.placeholder`,
    );
  return out;
}

// ---- Single-slot rendering hints (placeholder-only) ------------------
//
// One serialize/parse pair per previously-hint-less family. Each
// emits/accepts a single optional `placeholder` slot.

function serializePlaceholderOnlyHint(
  x: { readonly placeholder?: MultilingualString },
): unknown {
  const out: Record<string, unknown> = {};
  if (x.placeholder !== undefined)
    out['placeholder'] = serializeMultilingualString(x.placeholder);
  return out;
}

function parsePlaceholderOnlyHint(
  x: unknown,
  where: string,
): { placeholder?: MultilingualString } {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['placeholder']);
  rejectNullProperty(o, 'placeholder');
  const out: { placeholder?: MultilingualString } = {};
  if ('placeholder' in o)
    out.placeholder = parseMultilingualString(
      o['placeholder'],
      `${where}.placeholder`,
    );
  return out;
}

export const serializeControlledTermRenderingHint = (
  x: ControlledTermRenderingHint,
): unknown => serializePlaceholderOnlyHint(x);
export const parseControlledTermRenderingHint = (
  x: unknown,
  w = 'ControlledTermRenderingHint',
): ControlledTermRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeEmailRenderingHint = (x: EmailRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseEmailRenderingHint = (
  x: unknown,
  w = 'EmailRenderingHint',
): EmailRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializePhoneNumberRenderingHint = (
  x: PhoneNumberRenderingHint,
): unknown => serializePlaceholderOnlyHint(x);
export const parsePhoneNumberRenderingHint = (
  x: unknown,
  w = 'PhoneNumberRenderingHint',
): PhoneNumberRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeLinkRenderingHint = (x: LinkRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseLinkRenderingHint = (
  x: unknown,
  w = 'LinkRenderingHint',
): LinkRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeOrcidRenderingHint = (x: OrcidRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseOrcidRenderingHint = (
  x: unknown,
  w = 'OrcidRenderingHint',
): OrcidRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeRorRenderingHint = (x: RorRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseRorRenderingHint = (
  x: unknown,
  w = 'RorRenderingHint',
): RorRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeDoiRenderingHint = (x: DoiRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseDoiRenderingHint = (
  x: unknown,
  w = 'DoiRenderingHint',
): DoiRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializePubMedIdRenderingHint = (
  x: PubMedIdRenderingHint,
): unknown => serializePlaceholderOnlyHint(x);
export const parsePubMedIdRenderingHint = (
  x: unknown,
  w = 'PubMedIdRenderingHint',
): PubMedIdRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeRridRenderingHint = (x: RridRenderingHint): unknown =>
  serializePlaceholderOnlyHint(x);
export const parseRridRenderingHint = (
  x: unknown,
  w = 'RridRenderingHint',
): RridRenderingHint => parsePlaceholderOnlyHint(x, w);

export const serializeNihGrantIdRenderingHint = (
  x: NihGrantIdRenderingHint,
): unknown => serializePlaceholderOnlyHint(x);
export const parseNihGrantIdRenderingHint = (
  x: unknown,
  w = 'NihGrantIdRenderingHint',
): NihGrantIdRenderingHint => parsePlaceholderOnlyHint(x, w);

// ---- Unit ------------------------------------------------------------

export function serializeUnit(x: Unit): unknown {
  const out: Record<string, unknown> = { iri: serializeIri(x.iri) };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  return out;
}

export function parseUnit(x: unknown, where = 'Unit'): Unit {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['iri', 'label']);
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: { iri: string; label?: ReturnType<typeof parseMultilingualString> } = {
    iri: expectString(o['iri'], `${where}.iri`),
  };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  return unit(init);
}

// ---- OntologyDisplayHint / OntologyReference / ControlledTermClass --

export function serializeOntologyDisplayHint(x: OntologyDisplayHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.acronym !== undefined) out['acronym'] = x.acronym;
  if (x.name !== undefined) out['name'] = serializeMultilingualString(x.name);
  return out;
}

export function parseOntologyDisplayHint(
  x: unknown,
  where = 'OntologyDisplayHint',
): OntologyDisplayHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['acronym', 'name']);
  rejectNullProperty(o, 'acronym');
  rejectNullProperty(o, 'name');
  const init: {
    acronym?: string;
    name?: ReturnType<typeof parseMultilingualString>;
  } = {};
  if ('acronym' in o)
    init.acronym = expectString(o['acronym'], `${where}.acronym`);
  if ('name' in o)
    init.name = parseMultilingualString(o['name'], `${where}.name`);
  return ontologyDisplayHint(init);
}

export function serializeOntologyReference(x: OntologyReference): unknown {
  const out: Record<string, unknown> = { iri: serializeIri(x.iri) };
  if (x.displayHint !== undefined)
    out['displayHint'] = serializeOntologyDisplayHint(x.displayHint);
  return out;
}

export function parseOntologyReference(
  x: unknown,
  where = 'OntologyReference',
): OntologyReference {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['iri', 'displayHint']);
  rejectNullProperty(o, 'displayHint');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: {
    iri: string;
    displayHint?: OntologyDisplayHint;
  } = { iri: expectString(o['iri'], `${where}.iri`) };
  if ('displayHint' in o)
    init.displayHint = parseOntologyDisplayHint(
      o['displayHint'],
      `${where}.displayHint`,
    );
  return ontologyReference(init);
}

export function serializeControlledTermClass(x: ControlledTermClass): unknown {
  const out: Record<string, unknown> = {
    term: serializeIri(x.term),
    ontology: serializeOntologyReference(x.ontology),
  };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  return out;
}

export function parseControlledTermClass(
  x: unknown,
  where = 'ControlledTermClass',
): ControlledTermClass {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['term', 'label', 'ontology']);
  rejectNullProperty(o, 'label');
  if (!('term' in o)) {
    throw new CedarConstructionError(`${where}: missing required "term"`);
  }
  if (!('ontology' in o)) {
    throw new CedarConstructionError(`${where}: missing required "ontology"`);
  }
  const init: {
    term: string;
    label?: ReturnType<typeof parseMultilingualString>;
    ontology: OntologyReference;
  } = {
    term: expectString(o['term'], `${where}.term`),
    ontology: parseOntologyReference(o['ontology'], `${where}.ontology`),
  };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  return controlledTermClass(init);
}

// ---- ControlledTermSource (union) -----------------------------------

export function serializeOntologySource(x: OntologySource): unknown {
  return {
    kind: 'OntologySource',
    ontology: serializeOntologyReference(x.ontology),
  };
}

export function parseOntologySource(
  x: unknown,
  where = 'OntologySource',
): OntologySource {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'ontology']);
  if (o['kind'] !== 'OntologySource') {
    throw new CedarConstructionError(`${where}: expected kind "OntologySource"`);
  }
  if (!('ontology' in o)) {
    throw new CedarConstructionError(`${where}: missing required "ontology"`);
  }
  return ontologySource(parseOntologyReference(o['ontology'], `${where}.ontology`));
}

export function serializeBranchSource(x: BranchSource): unknown {
  const out: Record<string, unknown> = {
    kind: 'BranchSource',
    ontology: serializeOntologyReference(x.ontology),
    rootTermIri: serializeIri(x.rootTermIri),
  };
  if (x.rootTermLabel !== undefined)
    out['rootTermLabel'] = serializeMultilingualString(x.rootTermLabel);
  if (x.maxTraversalDepth !== undefined)
    out['maxTraversalDepth'] = x.maxTraversalDepth;
  return out;
}

export function parseBranchSource(x: unknown, where = 'BranchSource'): BranchSource {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'ontology',
    'rootTermIri',
    'rootTermLabel',
    'maxTraversalDepth',
  ]);
  rejectNullProperty(o, 'rootTermLabel');
  rejectNullProperty(o, 'maxTraversalDepth');
  if (o['kind'] !== 'BranchSource') {
    throw new CedarConstructionError(`${where}: expected kind "BranchSource"`);
  }
  if (!('ontology' in o)) {
    throw new CedarConstructionError(`${where}: missing required "ontology"`);
  }
  if (!('rootTermIri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "rootTermIri"`);
  }
  const init: {
    ontology: OntologyReference;
    rootTermIri: string;
    rootTermLabel?: ReturnType<typeof parseMultilingualString>;
    maxTraversalDepth?: number;
  } = {
    ontology: parseOntologyReference(o['ontology'], `${where}.ontology`),
    rootTermIri: expectString(o['rootTermIri'], `${where}.rootTermIri`),
  };
  if ('rootTermLabel' in o)
    init.rootTermLabel = parseMultilingualString(
      o['rootTermLabel'],
      `${where}.rootTermLabel`,
    );
  if ('maxTraversalDepth' in o)
    init.maxTraversalDepth = expectNumber(
      o['maxTraversalDepth'],
      `${where}.maxTraversalDepth`,
    );
  return branchSource(init);
}

export function serializeClassSource(x: ClassSource): unknown {
  return {
    kind: 'ClassSource',
    classes: x.classes.map(serializeControlledTermClass),
  };
}

export function parseClassSource(x: unknown, where = 'ClassSource'): ClassSource {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'classes']);
  if (o['kind'] !== 'ClassSource') {
    throw new CedarConstructionError(`${where}: expected kind "ClassSource"`);
  }
  if (!('classes' in o)) {
    throw new CedarConstructionError(`${where}: missing required "classes"`);
  }
  const arr = expectNonEmptyArray(o['classes'], `${where}.classes`);
  const classes = arr.map((e, i) =>
    parseControlledTermClass(e, `${where}.classes[${i}]`),
  );
  return classSource(
    ...(classes as [ControlledTermClass, ...ControlledTermClass[]]),
  );
}

export function serializeValueSetSource(x: ValueSetSource): unknown {
  const out: Record<string, unknown> = {
    kind: 'ValueSetSource',
    identifier: x.identifier,
  };
  if (x.name !== undefined) out['name'] = serializeMultilingualString(x.name);
  if (x.iri !== undefined) out['iri'] = serializeIri(x.iri);
  return out;
}

export function parseValueSetSource(
  x: unknown,
  where = 'ValueSetSource',
): ValueSetSource {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'identifier', 'name', 'iri']);
  rejectNullProperty(o, 'name');
  rejectNullProperty(o, 'iri');
  if (o['kind'] !== 'ValueSetSource') {
    throw new CedarConstructionError(`${where}: expected kind "ValueSetSource"`);
  }
  if (!('identifier' in o)) {
    throw new CedarConstructionError(`${where}: missing required "identifier"`);
  }
  const init: {
    identifier: string;
    name?: ReturnType<typeof parseMultilingualString>;
    iri?: string;
  } = { identifier: expectString(o['identifier'], `${where}.identifier`) };
  if ('name' in o)
    init.name = parseMultilingualString(o['name'], `${where}.name`);
  if ('iri' in o) init.iri = expectString(o['iri'], `${where}.iri`);
  return valueSetSource(init);
}

const CONTROLLED_TERM_SOURCE_KINDS = [
  'OntologySource',
  'BranchSource',
  'ClassSource',
  'ValueSetSource',
] as const;

export function serializeControlledTermSource(
  x: ControlledTermSource,
): unknown {
  switch (x.kind) {
    case 'OntologySource':
      return serializeOntologySource(x);
    case 'BranchSource':
      return serializeBranchSource(x);
    case 'ClassSource':
      return serializeClassSource(x);
    case 'ValueSetSource':
      return serializeValueSetSource(x);
  }
}

export function parseControlledTermSource(
  x: unknown,
  where = 'ControlledTermSource',
): ControlledTermSource {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, CONTROLLED_TERM_SOURCE_KINDS, where);
  switch (k) {
    case 'OntologySource':
      return parseOntologySource(x, where);
    case 'BranchSource':
      return parseBranchSource(x, where);
    case 'ClassSource':
      return parseClassSource(x, where);
    case 'ValueSetSource':
      return parseValueSetSource(x, where);
  }
}

// ---- Meaning / PermissibleValue --------------------------------------

export function serializeMeaning(x: Meaning): unknown {
  const out: Record<string, unknown> = { iri: serializeIri(x.iri) };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  return out;
}

export function parseMeaning(x: unknown, where = 'Meaning'): Meaning {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['iri', 'label']);
  rejectNullProperty(o, 'label');
  if (!('iri' in o)) {
    throw new CedarConstructionError(`${where}: missing required "iri"`);
  }
  const init: {
    iri: string;
    label?: ReturnType<typeof parseMultilingualString>;
  } = { iri: expectString(o['iri'], `${where}.iri`) };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  return meaning(init);
}

export function serializePermissibleValue(x: PermissibleValue): unknown {
  const out: Record<string, unknown> = { value: x.value };
  if (x.label !== undefined) out['label'] = serializeMultilingualString(x.label);
  if (x.description !== undefined)
    out['description'] = serializeMultilingualString(x.description);
  if (x.meanings.length > 0) out['meanings'] = x.meanings.map(serializeMeaning);
  return out;
}

export function parsePermissibleValue(
  x: unknown,
  where = 'PermissibleValue',
): PermissibleValue {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'label', 'description', 'meanings']);
  rejectNullProperty(o, 'label');
  rejectNullProperty(o, 'description');
  rejectNullProperty(o, 'meanings');
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  const init: {
    value: string;
    label?: ReturnType<typeof parseMultilingualString>;
    description?: ReturnType<typeof parseMultilingualString>;
    meanings?: readonly Meaning[];
  } = { value: expectString(o['value'], `${where}.value`) };
  if ('label' in o)
    init.label = parseMultilingualString(o['label'], `${where}.label`);
  if ('description' in o)
    init.description = parseMultilingualString(
      o['description'],
      `${where}.description`,
    );
  if ('meanings' in o) {
    const arr = expectArray(o['meanings'], `${where}.meanings`);
    init.meanings = arr.map((e, i) => parseMeaning(e, `${where}.meanings[${i}]`));
  }
  return permissibleValue(init);
}

// ---- TextFieldSpec ---------------------------------------------------

export function serializeTextFieldSpec(x: TextFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'TextFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeTextValue(x.defaultValue);
  if (x.minLength !== undefined) out['minLength'] = x.minLength;
  if (x.maxLength !== undefined) out['maxLength'] = x.maxLength;
  if (x.validationRegex !== undefined)
    out['validationRegex'] = x.validationRegex;
  if (x.langTagRequirement !== undefined)
    out['langTagRequirement'] = x.langTagRequirement;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeTextRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeTextValue(e));

  return out;
}

export function parseTextFieldSpec(
  x: unknown,
  where = 'TextFieldSpec',
): TextFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'minLength',
    'maxLength',
    'validationRegex',
    'langTagRequirement',
    'renderingHint',
  'examples',
  ]);
  for (const k of [
    'defaultValue',
    'minLength',
    'maxLength',
    'validationRegex',
    'langTagRequirement',
    'renderingHint',
  ]) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'TextFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "TextFieldSpec"`);
  }
  const init: {
    defaultValue?: TextValue;
    minLength?: number;
    maxLength?: number;
    validationRegex?: string;
    langTagRequirement?: LangTagRequirement;
    renderingHint?: TextRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseTextValue(
      o['defaultValue'],
      `${where}.defaultValue`,
    );
  if ('minLength' in o)
    init.minLength = expectNumber(o['minLength'], `${where}.minLength`);
  if ('maxLength' in o)
    init.maxLength = expectNumber(o['maxLength'], `${where}.maxLength`);
  if ('validationRegex' in o)
    init.validationRegex = expectString(
      o['validationRegex'],
      `${where}.validationRegex`,
    );
  if ('langTagRequirement' in o)
    init.langTagRequirement = expectStringEnum<LangTagRequirement>(
      o['langTagRequirement'],
      LANG_TAG_REQUIREMENTS,
      `${where}.langTagRequirement`,
    );
  if ('renderingHint' in o)
    init.renderingHint = parseTextRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly TextValue[] }).examples = arr.map(
      (entry, i) => parseTextValue(entry, `${where}.examples[${i}]`),
    );
  }
  return textFieldSpec(init);
}

// ---- IntegerFieldSpec ---------------------------------

export function serializeIntegerFieldSpec(x: IntegerFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'IntegerFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeIntegerValue(x.defaultValue);
  if (x.unit !== undefined) out['unit'] = serializeUnit(x.unit);
  if (x.minValue !== undefined)
    out['minValue'] = serializeIntegerValue(x.minValue);
  if (x.maxValue !== undefined)
    out['maxValue'] = serializeIntegerValue(x.maxValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeNumericRenderingHint(x.renderingHint);
  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeIntegerValue(e));
  return out;
}

export function parseIntegerFieldSpec(
  x: unknown,
  where = 'IntegerFieldSpec',
): IntegerFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'unit',
    'minValue',
    'maxValue',
    'renderingHint',
    'examples',
  ]);
  for (const k of ['defaultValue', 'unit', 'minValue', 'maxValue', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'IntegerFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "IntegerFieldSpec"`);
  }
  const init: {
    defaultValue?: IntegerValue;
    unit?: Unit;
    minValue?: IntegerValue;
    maxValue?: IntegerValue;
    renderingHint?: NumericRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseIntegerValue(o['defaultValue'], `${where}.defaultValue`);
  if ('unit' in o) init.unit = parseUnit(o['unit'], `${where}.unit`);
  if ('minValue' in o)
    init.minValue = parseIntegerValue(o['minValue'], `${where}.minValue`);
  if ('maxValue' in o)
    init.maxValue = parseIntegerValue(o['maxValue'], `${where}.maxValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseNumericRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly IntegerValue[] }).examples = arr.map(
      (entry, i) => parseIntegerValue(entry, `${where}.examples[${i}]`),
    );
  }
  return integerFieldSpec(init);
}

// ---- DecimalFieldSpec ---------------------------------

export function serializeDecimalFieldSpec(x: DecimalFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'DecimalFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDecimalValue(x.defaultValue);
  if (x.unit !== undefined) out['unit'] = serializeUnit(x.unit);
  if (x.minValue !== undefined)
    out['minValue'] = serializeDecimalValue(x.minValue);
  if (x.maxValue !== undefined)
    out['maxValue'] = serializeDecimalValue(x.maxValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeNumericRenderingHint(x.renderingHint);
  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeDecimalValue(e));
  return out;
}

export function parseDecimalFieldSpec(
  x: unknown,
  where = 'DecimalFieldSpec',
): DecimalFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'unit',
    'minValue',
    'maxValue',
    'renderingHint',
    'examples',
  ]);
  for (const k of ['defaultValue', 'unit', 'minValue', 'maxValue', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'DecimalFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "DecimalFieldSpec"`);
  }
  const init: {
    defaultValue?: DecimalValue;
    unit?: Unit;
    minValue?: DecimalValue;
    maxValue?: DecimalValue;
    renderingHint?: NumericRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseDecimalValue(o['defaultValue'], `${where}.defaultValue`);
  if ('unit' in o) init.unit = parseUnit(o['unit'], `${where}.unit`);
  if ('minValue' in o)
    init.minValue = parseDecimalValue(o['minValue'], `${where}.minValue`);
  if ('maxValue' in o)
    init.maxValue = parseDecimalValue(o['maxValue'], `${where}.maxValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseNumericRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly DecimalValue[] }).examples = arr.map(
      (entry, i) => parseDecimalValue(entry, `${where}.examples[${i}]`),
    );
  }
  return decimalFieldSpec(init);
}

// ---- FloatFieldSpec -----------------------------------

export function serializeFloatFieldSpec(x: FloatFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'FloatFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeFloatValue(x.defaultValue);
  if (x.unit !== undefined) out['unit'] = serializeUnit(x.unit);
  if (x.minValue !== undefined)
    out['minValue'] = serializeFloatValue(x.minValue);
  if (x.maxValue !== undefined)
    out['maxValue'] = serializeFloatValue(x.maxValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeNumericRenderingHint(x.renderingHint);
  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeFloatValue(e));
  return out;
}

export function parseFloatFieldSpec(
  x: unknown,
  where = 'FloatFieldSpec',
): FloatFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'unit',
    'minValue',
    'maxValue',
    'renderingHint',
    'examples',
  ]);
  for (const k of ['defaultValue', 'unit', 'minValue', 'maxValue', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'FloatFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "FloatFieldSpec"`);
  }
  const init: {
    defaultValue?: FloatValue;
    unit?: Unit;
    minValue?: FloatValue;
    maxValue?: FloatValue;
    renderingHint?: NumericRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseFloatValue(o['defaultValue'], `${where}.defaultValue`);
  if ('unit' in o) init.unit = parseUnit(o['unit'], `${where}.unit`);
  if ('minValue' in o)
    init.minValue = parseFloatValue(o['minValue'], `${where}.minValue`);
  if ('maxValue' in o)
    init.maxValue = parseFloatValue(o['maxValue'], `${where}.maxValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseNumericRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly FloatValue[] }).examples = arr.map(
      (entry, i) => parseFloatValue(entry, `${where}.examples[${i}]`),
    );
  }
  return floatFieldSpec(init);
}

// ---- DoubleFieldSpec ----------------------------------

export function serializeDoubleFieldSpec(x: DoubleFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'DoubleFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDoubleValue(x.defaultValue);
  if (x.unit !== undefined) out['unit'] = serializeUnit(x.unit);
  if (x.minValue !== undefined)
    out['minValue'] = serializeDoubleValue(x.minValue);
  if (x.maxValue !== undefined)
    out['maxValue'] = serializeDoubleValue(x.maxValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeNumericRenderingHint(x.renderingHint);
  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeDoubleValue(e));
  return out;
}

export function parseDoubleFieldSpec(
  x: unknown,
  where = 'DoubleFieldSpec',
): DoubleFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'unit',
    'minValue',
    'maxValue',
    'renderingHint',
    'examples',
  ]);
  for (const k of ['defaultValue', 'unit', 'minValue', 'maxValue', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'DoubleFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "DoubleFieldSpec"`);
  }
  const init: {
    defaultValue?: DoubleValue;
    unit?: Unit;
    minValue?: DoubleValue;
    maxValue?: DoubleValue;
    renderingHint?: NumericRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseDoubleValue(o['defaultValue'], `${where}.defaultValue`);
  if ('unit' in o) init.unit = parseUnit(o['unit'], `${where}.unit`);
  if ('minValue' in o)
    init.minValue = parseDoubleValue(o['minValue'], `${where}.minValue`);
  if ('maxValue' in o)
    init.maxValue = parseDoubleValue(o['maxValue'], `${where}.maxValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseNumericRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly DoubleValue[] }).examples = arr.map(
      (entry, i) => parseDoubleValue(entry, `${where}.examples[${i}]`),
    );
  }
  return doubleFieldSpec(init);
}

// ---- BooleanFieldSpec ------------------------------------------------

export function serializeBooleanFieldSpec(x: BooleanFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'BooleanFieldSpec',
  };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeBooleanValue(x.defaultValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeBooleanRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeBooleanValue(e));

  return out;
}

export function parseBooleanFieldSpec(
  x: unknown,
  where = 'BooleanFieldSpec',
): BooleanFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'defaultValue', 'renderingHint', 'examples']);
  rejectNullProperty(o, 'defaultValue');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'BooleanFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "BooleanFieldSpec"`);
  }
  const init: {
    defaultValue?: BooleanValue;
    renderingHint?: BooleanRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseBooleanValue(o['defaultValue'], `${where}.defaultValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseBooleanRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly BooleanValue[] }).examples = arr.map(
      (entry, i) => parseBooleanValue(entry, `${where}.examples[${i}]`),
    );
  }
  return booleanFieldSpec(init);
}

// ---- Date/Time/DateTime FieldSpec ------------------------------------

export function serializeDateFieldSpec(x: DateFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'DateFieldSpec',
    dateValueType: x.dateValueType,
  };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDateValue(x.defaultValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeDateRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeDateValue(e));

  return out;
}

export function parseDateFieldSpec(
  x: unknown,
  where = 'DateFieldSpec',
): DateFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'dateValueType',
    'defaultValue',
    'renderingHint',
  'examples',
  ]);
  rejectNullProperty(o, 'defaultValue');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'DateFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "DateFieldSpec"`);
  }
  if (!('dateValueType' in o)) {
    throw new CedarConstructionError(`${where}: missing required "dateValueType"`);
  }
  const init: {
    dateValueType: DateValueType;
    defaultValue?: DateValue;
    renderingHint?: DateRenderingHint;
  } = {
    dateValueType: expectStringEnum<DateValueType>(
      o['dateValueType'],
      DATE_VALUE_TYPES,
      `${where}.dateValueType`,
    ),
  };
  if ('defaultValue' in o)
    init.defaultValue = parseDateValue(o['defaultValue'], `${where}.defaultValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseDateRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly DateValue[] }).examples = arr.map(
      (entry, i) => parseDateValue(entry, `${where}.examples[${i}]`),
    );
  }
  return dateFieldSpec(init);
}

export function serializeTimeFieldSpec(x: TimeFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'TimeFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeTimeValue(x.defaultValue);
  if (x.timePrecision !== undefined) out['timePrecision'] = x.timePrecision;
  if (x.timezoneRequirement !== undefined)
    out['timezoneRequirement'] = x.timezoneRequirement;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeTimeRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeTimeValue(e));

  return out;
}

export function parseTimeFieldSpec(
  x: unknown,
  where = 'TimeFieldSpec',
): TimeFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'defaultValue',
    'timePrecision',
    'timezoneRequirement',
    'renderingHint',
  'examples',
  ]);
  for (const k of [
    'defaultValue',
    'timePrecision',
    'timezoneRequirement',
    'renderingHint',
  ]) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'TimeFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "TimeFieldSpec"`);
  }
  const init: {
    defaultValue?: TimeValue;
    timePrecision?: TimePrecision;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: TimeRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseTimeValue(o['defaultValue'], `${where}.defaultValue`);
  if ('timePrecision' in o)
    init.timePrecision = expectStringEnum<TimePrecision>(
      o['timePrecision'],
      TIME_PRECISIONS,
      `${where}.timePrecision`,
    );
  if ('timezoneRequirement' in o)
    init.timezoneRequirement = expectStringEnum<TimezoneRequirement>(
      o['timezoneRequirement'],
      TIMEZONE_REQUIREMENTS,
      `${where}.timezoneRequirement`,
    );
  if ('renderingHint' in o)
    init.renderingHint = parseTimeRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly TimeValue[] }).examples = arr.map(
      (entry, i) => parseTimeValue(entry, `${where}.examples[${i}]`),
    );
  }
  return timeFieldSpec(init);
}

export function serializeDateTimeFieldSpec(x: DateTimeFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'DateTimeFieldSpec',
    dateTimeValueType: x.dateTimeValueType,
  };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeDateTimeValue(x.defaultValue);
  if (x.timezoneRequirement !== undefined)
    out['timezoneRequirement'] = x.timezoneRequirement;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeDateTimeRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeDateTimeValue(e));

  return out;
}

export function parseDateTimeFieldSpec(
  x: unknown,
  where = 'DateTimeFieldSpec',
): DateTimeFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'dateTimeValueType',
    'defaultValue',
    'timezoneRequirement',
    'renderingHint',
  'examples',
  ]);
  for (const k of ['defaultValue', 'timezoneRequirement', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'DateTimeFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "DateTimeFieldSpec"`);
  }
  if (!('dateTimeValueType' in o)) {
    throw new CedarConstructionError(
      `${where}: missing required "dateTimeValueType"`,
    );
  }
  const init: {
    dateTimeValueType: DateTimeValueType;
    defaultValue?: DateTimeValue;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: DateTimeRenderingHint;
  } = {
    dateTimeValueType: expectStringEnum<DateTimeValueType>(
      o['dateTimeValueType'],
      DATE_TIME_VALUE_TYPES,
      `${where}.dateTimeValueType`,
    ),
  };
  if ('defaultValue' in o)
    init.defaultValue = parseDateTimeValue(
      o['defaultValue'],
      `${where}.defaultValue`,
    );
  if ('timezoneRequirement' in o)
    init.timezoneRequirement = expectStringEnum<TimezoneRequirement>(
      o['timezoneRequirement'],
      TIMEZONE_REQUIREMENTS,
      `${where}.timezoneRequirement`,
    );
  if ('renderingHint' in o)
    init.renderingHint = parseDateTimeRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly DateTimeValue[] }).examples = arr.map(
      (entry, i) => parseDateTimeValue(entry, `${where}.examples[${i}]`),
    );
  }
  return dateTimeFieldSpec(init);
}

// ---- ControlledTermFieldSpec -----------------------------------------

export function serializeControlledTermFieldSpec(
  x: ControlledTermFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'ControlledTermFieldSpec',
    sources: x.sources.map(serializeControlledTermSource),
  };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeControlledTermValue(x.defaultValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeControlledTermRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeControlledTermValue(e));

  return out;
}

export function parseControlledTermFieldSpec(
  x: unknown,
  where = 'ControlledTermFieldSpec',
): ControlledTermFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'sources', 'defaultValue', 'renderingHint', 'examples']);
  rejectNullProperty(o, 'defaultValue');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'ControlledTermFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "ControlledTermFieldSpec"`,
    );
  }
  if (!('sources' in o)) {
    throw new CedarConstructionError(`${where}: missing required "sources"`);
  }
  const arr = expectNonEmptyArray(o['sources'], `${where}.sources`);
  const sources = arr.map((e, i) =>
    parseControlledTermSource(e, `${where}.sources[${i}]`),
  );
  const init: {
    sources: readonly [ControlledTermSource, ...ControlledTermSource[]];
    defaultValue?: ControlledTermValue;
    renderingHint?: ControlledTermRenderingHint;
  } = {
    sources: sources as [ControlledTermSource, ...ControlledTermSource[]],
  };
  if ('defaultValue' in o)
    init.defaultValue = parseControlledTermValue(
      o['defaultValue'],
      `${where}.defaultValue`,
    );
  if ('renderingHint' in o)
    init.renderingHint = parseControlledTermRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly ControlledTermValue[] }).examples = arr.map(
      (entry, i) => parseControlledTermValue(entry, `${where}.examples[${i}]`),
    );
  }
  return controlledTermFieldSpec(init);
}

// ---- Enum FieldSpecs -------------------------------------------------

export function serializeSingleValuedEnumFieldSpec(
  x: SingleValuedEnumFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'SingleValuedEnumFieldSpec',
    permissibleValues: x.permissibleValues.map(serializePermissibleValue),
  };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeEnumValue(x.defaultValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeSingleValuedEnumRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeEnumValue(e));

  return out;
}

export function parseSingleValuedEnumFieldSpec(
  x: unknown,
  where = 'SingleValuedEnumFieldSpec',
): SingleValuedEnumFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'permissibleValues',
    'defaultValue',
    'renderingHint',
  'examples',
  ]);
  rejectNullProperty(o, 'defaultValue');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'SingleValuedEnumFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "SingleValuedEnumFieldSpec"`,
    );
  }
  if (!('permissibleValues' in o)) {
    throw new CedarConstructionError(
      `${where}: missing required "permissibleValues"`,
    );
  }
  const arr = expectNonEmptyArray(o['permissibleValues'], `${where}.permissibleValues`);
  const permissibleValues = arr.map((e, i) =>
    parsePermissibleValue(e, `${where}.permissibleValues[${i}]`),
  );
  const init: {
    permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
    defaultValue?: EnumValue;
    renderingHint?: SingleValuedEnumRenderingHint;
  } = {
    permissibleValues: permissibleValues as [PermissibleValue, ...PermissibleValue[]],
  };
  if ('defaultValue' in o)
    init.defaultValue = parseEnumValue(o['defaultValue'], `${where}.defaultValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseSingleValuedEnumRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly EnumValue[] }).examples = arr.map(
      (entry, i) => parseEnumValue(entry, `${where}.examples[${i}]`),
    );
  }
  return singleValuedEnumFieldSpec(init);
}

export function serializeMultiValuedEnumFieldSpec(
  x: MultiValuedEnumFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'MultiValuedEnumFieldSpec',
    permissibleValues: x.permissibleValues.map(serializePermissibleValue),
  };
  if (x.defaultValues.length > 0)
    out['defaultValues'] = x.defaultValues.map(serializeEnumValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeMultiValuedEnumRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeEnumValue(e));

  return out;
}

export function parseMultiValuedEnumFieldSpec(
  x: unknown,
  where = 'MultiValuedEnumFieldSpec',
): MultiValuedEnumFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'permissibleValues',
    'defaultValues',
    'renderingHint',
  'examples',
  ]);
  rejectNullProperty(o, 'defaultValues');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'MultiValuedEnumFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "MultiValuedEnumFieldSpec"`,
    );
  }
  if (!('permissibleValues' in o)) {
    throw new CedarConstructionError(
      `${where}: missing required "permissibleValues"`,
    );
  }
  const arr = expectNonEmptyArray(o['permissibleValues'], `${where}.permissibleValues`);
  const permissibleValues = arr.map((e, i) =>
    parsePermissibleValue(e, `${where}.permissibleValues[${i}]`),
  );
  const init: {
    permissibleValues: readonly [PermissibleValue, ...PermissibleValue[]];
    defaultValues?: readonly EnumValue[];
    renderingHint?: MultiValuedEnumRenderingHint;
  } = {
    permissibleValues: permissibleValues as [PermissibleValue, ...PermissibleValue[]],
  };
  if ('defaultValues' in o) {
    const dvArr = expectArray(o['defaultValues'], `${where}.defaultValues`);
    init.defaultValues = dvArr.map((e, i) =>
      parseEnumValue(e, `${where}.defaultValues[${i}]`),
    );
  }
  if ('renderingHint' in o)
    init.renderingHint = parseMultiValuedEnumRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly EnumValue[] }).examples = arr.map(
      (entry, i) => parseEnumValue(entry, `${where}.examples[${i}]`),
    );
  }
  return multiValuedEnumFieldSpec(init);
}

// ---- Default-only FieldSpec families ---------------------------------
//
// Nine families have only an optional `defaultValue` slot at the model
// level (Link, Email, PhoneNumber, plus the 6 external authority
// families). Each is round-tripped through a small generic helper that
// captures its Value type and tagged-value (de)serializer pair.

function defaultOnlySpec<
  T extends { kind: string; defaultValue?: V; renderingHint?: H; examples?: readonly V[] },
  V,
  H,
>(
  expectedKind: T['kind'],
  ctor: (init?: { defaultValue?: V; renderingHint?: H; examples?: readonly V[] }) => T,
  serializeValue: (v: V) => unknown,
  parseValueFn: (x: unknown, where?: string) => V,
  serializeHint: (h: H) => unknown,
  parseHintFn: (x: unknown, where?: string) => H,
): {
  serialize: (x: T) => unknown;
  parse: (x: unknown, where?: string) => T;
} {
  return {
    serialize: (x: T): unknown => {
      const out: Record<string, unknown> = { kind: x.kind };
      if (x.defaultValue !== undefined)
        out['defaultValue'] = serializeValue(x.defaultValue);
      if (x.renderingHint !== undefined)
        out['renderingHint'] = serializeHint(x.renderingHint);
      if (x.examples !== undefined && x.examples.length > 0)
        out['examples'] = x.examples.map((e) => serializeValue(e));
      return out;
    },
    parse: (x: unknown, where: string = expectedKind): T => {
      const o = expectObject(x, where);
      expectKnownProperties(o, ['kind', 'defaultValue', 'renderingHint', 'examples']);
      rejectNullProperty(o, 'defaultValue');
      rejectNullProperty(o, 'renderingHint');
      rejectNullProperty(o, 'examples');
      if (o['kind'] !== expectedKind) {
        throw new CedarConstructionError(
          `${where}: expected kind ${JSON.stringify(expectedKind)}`,
        );
      }
      const init: { defaultValue?: V; renderingHint?: H; examples?: readonly V[] } = {};
      if ('defaultValue' in o)
        init.defaultValue = parseValueFn(o['defaultValue'], `${where}.defaultValue`);
      if ('renderingHint' in o)
        init.renderingHint = parseHintFn(
          o['renderingHint'],
          `${where}.renderingHint`,
        );
      if ('examples' in o) {
        const arr = o['examples'];
        if (!Array.isArray(arr)) {
          throw new CedarConstructionError(
            `${where}.examples: expected array`,
          );
        }
        init.examples = arr.map((entry, i) =>
          parseValueFn(entry, `${where}.examples[${i}]`),
        );
      }
      return ctor(init);
    },
  };
}

const linkSpecHelpers = defaultOnlySpec<LinkFieldSpec, LinkValue, LinkRenderingHint>(
  'LinkFieldSpec',
  linkFieldSpec,
  serializeLinkValue,
  parseLinkValue,
  serializeLinkRenderingHint,
  parseLinkRenderingHint,
);
export const serializeLinkFieldSpec = linkSpecHelpers.serialize;
export const parseLinkFieldSpec = linkSpecHelpers.parse;

const emailSpecHelpers = defaultOnlySpec<EmailFieldSpec, EmailValue, EmailRenderingHint>(
  'EmailFieldSpec',
  emailFieldSpec,
  serializeEmailValue,
  parseEmailValue,
  serializeEmailRenderingHint,
  parseEmailRenderingHint,
);
export const serializeEmailFieldSpec = emailSpecHelpers.serialize;
export const parseEmailFieldSpec = emailSpecHelpers.parse;

const phoneSpecHelpers = defaultOnlySpec<PhoneNumberFieldSpec, PhoneNumberValue, PhoneNumberRenderingHint>(
  'PhoneNumberFieldSpec',
  phoneNumberFieldSpec,
  serializePhoneNumberValue,
  parsePhoneNumberValue,
  serializePhoneNumberRenderingHint,
  parsePhoneNumberRenderingHint,
);
export const serializePhoneNumberFieldSpec = phoneSpecHelpers.serialize;
export const parsePhoneNumberFieldSpec = phoneSpecHelpers.parse;

const orcidSpecHelpers = defaultOnlySpec<OrcidFieldSpec, OrcidValue, OrcidRenderingHint>(
  'OrcidFieldSpec',
  orcidFieldSpec,
  serializeOrcidValue,
  parseOrcidValue,
  serializeOrcidRenderingHint,
  parseOrcidRenderingHint,
);
export const serializeOrcidFieldSpec = orcidSpecHelpers.serialize;
export const parseOrcidFieldSpec = orcidSpecHelpers.parse;

const rorSpecHelpers = defaultOnlySpec<RorFieldSpec, RorValue, RorRenderingHint>(
  'RorFieldSpec',
  rorFieldSpec,
  serializeRorValue,
  parseRorValue,
  serializeRorRenderingHint,
  parseRorRenderingHint,
);
export const serializeRorFieldSpec = rorSpecHelpers.serialize;
export const parseRorFieldSpec = rorSpecHelpers.parse;

const doiSpecHelpers = defaultOnlySpec<DoiFieldSpec, DoiValue, DoiRenderingHint>(
  'DoiFieldSpec',
  doiFieldSpec,
  serializeDoiValue,
  parseDoiValue,
  serializeDoiRenderingHint,
  parseDoiRenderingHint,
);
export const serializeDoiFieldSpec = doiSpecHelpers.serialize;
export const parseDoiFieldSpec = doiSpecHelpers.parse;

const pubMedIdSpecHelpers = defaultOnlySpec<PubMedIdFieldSpec, PubMedIdValue, PubMedIdRenderingHint>(
  'PubMedIdFieldSpec',
  pubMedIdFieldSpec,
  serializePubMedIdValue,
  parsePubMedIdValue,
  serializePubMedIdRenderingHint,
  parsePubMedIdRenderingHint,
);
export const serializePubMedIdFieldSpec = pubMedIdSpecHelpers.serialize;
export const parsePubMedIdFieldSpec = pubMedIdSpecHelpers.parse;

const rridSpecHelpers = defaultOnlySpec<RridFieldSpec, RridValue, RridRenderingHint>(
  'RridFieldSpec',
  rridFieldSpec,
  serializeRridValue,
  parseRridValue,
  serializeRridRenderingHint,
  parseRridRenderingHint,
);
export const serializeRridFieldSpec = rridSpecHelpers.serialize;
export const parseRridFieldSpec = rridSpecHelpers.parse;

const nihGrantIdSpecHelpers = defaultOnlySpec<NihGrantIdFieldSpec, NihGrantIdValue, NihGrantIdRenderingHint>(
  'NihGrantIdFieldSpec',
  nihGrantIdFieldSpec,
  serializeNihGrantIdValue,
  parseNihGrantIdValue,
  serializeNihGrantIdRenderingHint,
  parseNihGrantIdRenderingHint,
);
export const serializeNihGrantIdFieldSpec = nihGrantIdSpecHelpers.serialize;
export const parseNihGrantIdFieldSpec = nihGrantIdSpecHelpers.parse;

// LanguageFieldSpec carries an additional `permittedLanguages` slot
// not covered by the default-only helper, so it's hand-written.
export function serializeLanguageFieldSpec(x: LanguageFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'LanguageFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeLanguageValue(x.defaultValue);
  if (x.permittedLanguages !== undefined)
    out['permittedLanguages'] = x.permittedLanguages.slice();
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeLanguageRenderingHint(x.renderingHint);  if (x.examples !== undefined && x.examples.length > 0)
    out['examples'] = x.examples.map((e) => serializeLanguageValue(e));

  return out;
}

export function parseLanguageFieldSpec(
  x: unknown,
  where = 'LanguageFieldSpec',
): LanguageFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'defaultValue', 'permittedLanguages', 'renderingHint', 'examples']);
  rejectNullProperty(o, 'defaultValue');
  rejectNullProperty(o, 'permittedLanguages');
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'examples');
  if (o['kind'] !== 'LanguageFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "LanguageFieldSpec"`);
  }
  const init: {
    defaultValue?: LanguageValue;
    permittedLanguages?: readonly string[];
    renderingHint?: LanguageRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseLanguageValue(o['defaultValue'], `${where}.defaultValue`);
  if ('permittedLanguages' in o) {
    const arr = o['permittedLanguages'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(
        `${where}.permittedLanguages: expected array of strings`,
      );
    }
    init.permittedLanguages = arr.map((t, i) =>
      expectString(t, `${where}.permittedLanguages[${i}]`),
    );
  }
  if ('renderingHint' in o)
    init.renderingHint = parseLanguageRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('examples' in o) {
    const arr = o['examples'];
    if (!Array.isArray(arr)) {
      throw new CedarConstructionError(`${where}.examples: expected array`);
    }
    (init as { examples?: readonly LanguageValue[] }).examples = arr.map(
      (entry, i) => parseLanguageValue(entry, `${where}.examples[${i}]`),
    );
  }
  return languageFieldSpec(init);
}

// AttributeValueFieldSpec has no defaultValue slot — serialize as
// { kind } only.
export function serializeAttributeValueFieldSpec(
  x: AttributeValueFieldSpec,
): unknown {
  return { kind: x.kind };
}

export function parseAttributeValueFieldSpec(
  x: unknown,
  where = 'AttributeValueFieldSpec',
): AttributeValueFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind']);
  if (o['kind'] !== 'AttributeValueFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "AttributeValueFieldSpec"`,
    );
  }
  return attributeValueFieldSpec();
}

// ---- FieldSpec union -------------------------------------------------

const FIELD_SPEC_KINDS = [
  'TextFieldSpec',
  'IntegerFieldSpec',
  'DecimalFieldSpec',
  'FloatFieldSpec',
  'DoubleFieldSpec',
  'BooleanFieldSpec',
  'DateFieldSpec',
  'TimeFieldSpec',
  'DateTimeFieldSpec',
  'ControlledTermFieldSpec',
  'SingleValuedEnumFieldSpec',
  'MultiValuedEnumFieldSpec',
  'LinkFieldSpec',
  'EmailFieldSpec',
  'PhoneNumberFieldSpec',
  'OrcidFieldSpec',
  'RorFieldSpec',
  'DoiFieldSpec',
  'PubMedIdFieldSpec',
  'RridFieldSpec',
  'NihGrantIdFieldSpec',
  'LanguageFieldSpec',
  'AttributeValueFieldSpec',
] as const;

export function serializeFieldSpec(x: FieldSpec): unknown {
  switch (x.kind) {
    case 'TextFieldSpec':
      return serializeTextFieldSpec(x);
    case 'IntegerFieldSpec':
      return serializeIntegerFieldSpec(x);
    case 'DecimalFieldSpec':
      return serializeDecimalFieldSpec(x);
    case 'FloatFieldSpec':
      return serializeFloatFieldSpec(x);
    case 'DoubleFieldSpec':
      return serializeDoubleFieldSpec(x);
    case 'BooleanFieldSpec':
      return serializeBooleanFieldSpec(x);
    case 'DateFieldSpec':
      return serializeDateFieldSpec(x);
    case 'TimeFieldSpec':
      return serializeTimeFieldSpec(x);
    case 'DateTimeFieldSpec':
      return serializeDateTimeFieldSpec(x);
    case 'ControlledTermFieldSpec':
      return serializeControlledTermFieldSpec(x);
    case 'SingleValuedEnumFieldSpec':
      return serializeSingleValuedEnumFieldSpec(x);
    case 'MultiValuedEnumFieldSpec':
      return serializeMultiValuedEnumFieldSpec(x);
    case 'LinkFieldSpec':
      return serializeLinkFieldSpec(x);
    case 'EmailFieldSpec':
      return serializeEmailFieldSpec(x);
    case 'PhoneNumberFieldSpec':
      return serializePhoneNumberFieldSpec(x);
    case 'OrcidFieldSpec':
      return serializeOrcidFieldSpec(x);
    case 'RorFieldSpec':
      return serializeRorFieldSpec(x);
    case 'DoiFieldSpec':
      return serializeDoiFieldSpec(x);
    case 'PubMedIdFieldSpec':
      return serializePubMedIdFieldSpec(x);
    case 'RridFieldSpec':
      return serializeRridFieldSpec(x);
    case 'NihGrantIdFieldSpec':
      return serializeNihGrantIdFieldSpec(x);
    case 'LanguageFieldSpec':
      return serializeLanguageFieldSpec(x);
    case 'AttributeValueFieldSpec':
      return serializeAttributeValueFieldSpec(x);
  }
}

export function parseFieldSpec(x: unknown, where = 'FieldSpec'): FieldSpec {
  const o = expectObject(x, where);
  const k = expectKindOneOf(o, FIELD_SPEC_KINDS, where);
  switch (k) {
    case 'TextFieldSpec':
      return parseTextFieldSpec(x, where);
    case 'IntegerFieldSpec':
      return parseIntegerFieldSpec(x, where);
    case 'DecimalFieldSpec':
      return parseDecimalFieldSpec(x, where);
    case 'FloatFieldSpec':
      return parseFloatFieldSpec(x, where);
    case 'DoubleFieldSpec':
      return parseDoubleFieldSpec(x, where);
    case 'BooleanFieldSpec':
      return parseBooleanFieldSpec(x, where);
    case 'DateFieldSpec':
      return parseDateFieldSpec(x, where);
    case 'TimeFieldSpec':
      return parseTimeFieldSpec(x, where);
    case 'DateTimeFieldSpec':
      return parseDateTimeFieldSpec(x, where);
    case 'ControlledTermFieldSpec':
      return parseControlledTermFieldSpec(x, where);
    case 'SingleValuedEnumFieldSpec':
      return parseSingleValuedEnumFieldSpec(x, where);
    case 'MultiValuedEnumFieldSpec':
      return parseMultiValuedEnumFieldSpec(x, where);
    case 'LinkFieldSpec':
      return parseLinkFieldSpec(x, where);
    case 'EmailFieldSpec':
      return parseEmailFieldSpec(x, where);
    case 'PhoneNumberFieldSpec':
      return parsePhoneNumberFieldSpec(x, where);
    case 'OrcidFieldSpec':
      return parseOrcidFieldSpec(x, where);
    case 'RorFieldSpec':
      return parseRorFieldSpec(x, where);
    case 'DoiFieldSpec':
      return parseDoiFieldSpec(x, where);
    case 'PubMedIdFieldSpec':
      return parsePubMedIdFieldSpec(x, where);
    case 'RridFieldSpec':
      return parseRridFieldSpec(x, where);
    case 'NihGrantIdFieldSpec':
      return parseNihGrantIdFieldSpec(x, where);
    case 'LanguageFieldSpec':
      return parseLanguageFieldSpec(x, where);
    case 'AttributeValueFieldSpec':
      return parseAttributeValueFieldSpec(x, where);
  }
}

