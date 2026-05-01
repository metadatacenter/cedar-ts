// =====================================================================
// field-specs — wire-form serialize/parse for every FieldSpec variant +
// the FieldSpec union dispatcher.
// =====================================================================
//
// Includes the supporting types only used in FieldSpec positions:
//   - Unit
//   - OntologyReference / OntologyDisplayHint / ControlledTermClass
//   - ControlledTermSource (Ontology / Branch / Class / ValueSet)
//   - LiteralChoiceOption / ControlledTermChoiceOption
//   - the temporal RenderingHint variants and the flat-string rendering
//     hint enums

import { CedarConstructionError } from '../leaves/index.js';
import {
  type Literal,
} from '../literals/index.js';
import {
  type TextFieldSpec,
  type NumericFieldSpec,
  type DateFieldSpec,
  type TimeFieldSpec,
  type DateTimeFieldSpec,
  type ControlledTermFieldSpec,
  type LiteralSingleChoiceFieldSpec,
  type ControlledTermSingleChoiceFieldSpec,
  type LiteralMultipleChoiceFieldSpec,
  type ControlledTermMultipleChoiceFieldSpec,
  type LinkFieldSpec,
  type EmailFieldSpec,
  type PhoneNumberFieldSpec,
  type OrcidFieldSpec,
  type RorFieldSpec,
  type DoiFieldSpec,
  type PubMedIdFieldSpec,
  type RridFieldSpec,
  type NihGrantIdFieldSpec,
  type AttributeValueFieldSpec,
  type FieldSpec,
  type ControlledTermValue,
  type Unit,
  type OntologyReference,
  type OntologyDisplayHint,
  type ControlledTermClass,
  type ControlledTermSource,
  type OntologySource,
  type BranchSource,
  type ClassSource,
  type ValueSetSource,
  type LiteralChoiceOption,
  type ControlledTermChoiceOption,
  type DateValueType,
  type TimePrecision,
  type TimezoneRequirement,
  type DateTimeValueType,
  type DateRenderingHint,
  type TimeRenderingHint,
  type DateTimeRenderingHint,
  type TextRenderingHint,
  type NumericRenderingHint,
  type SingleChoiceRenderingHint,
  type MultipleChoiceRenderingHint,
  type DateComponentOrder,
  type TimeFormat,
  textFieldSpec,
  numericFieldSpec,
  dateFieldSpec,
  timeFieldSpec,
  dateTimeFieldSpec,
  controlledTermFieldSpec,
  literalSingleChoiceFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  literalMultipleChoiceFieldSpec,
  controlledTermMultipleChoiceFieldSpec,
  linkFieldSpec,
  emailFieldSpec,
  phoneNumberFieldSpec,
  orcidFieldSpec,
  rorFieldSpec,
  doiFieldSpec,
  pubMedIdFieldSpec,
  rridFieldSpec,
  nihGrantIdFieldSpec,
  attributeValueFieldSpec,
  unit,
  ontologyReference,
  ontologyDisplayHint,
  controlledTermClass,
  ontologySource,
  branchSource,
  classSource,
  valueSetSource,
  literalChoiceOption,
  controlledTermChoiceOption,
  literalChoiceValue,
  DATE_VALUE_TYPES,
  TIME_PRECISIONS,
  TIMEZONE_REQUIREMENTS,
  DATE_TIME_VALUE_TYPES,
  TEXT_RENDERING_HINTS,
  SINGLE_CHOICE_RENDERING_HINTS,
  MULTIPLE_CHOICE_RENDERING_HINTS,
  DATE_COMPONENT_ORDERS,
  TIME_FORMATS,
  dateRenderingHint,
  timeRenderingHint,
  dateTimeRenderingHint,
} from '../field-families/index.js';
import {
  expectObject,
  expectNonEmptyArray,
  expectString,
  expectNumber,
  expectKnownProperties,
  expectKindOneOf,
  expectStringEnum,
  expectTrue,
  rejectNullProperty,
} from './parse-utils.js';
import { serializeIri } from './collapsed-wrappers.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  serializeNumericValue,
  parseNumericValue,
  serializeControlledTermValueUntagged,
  parseControlledTermValueUntagged,
} from './values.js';
import {
  serializeTextDefaultValue,
  parseTextDefaultValue,
} from './default-values.js';
import {
  serializeLiteral,
  parseLiteral,
  parseNumericDatatypeKind,
} from './literals.js';

// ---- Rendering hints (flat string enums + temporal objects) ----------

export const serializeTextRenderingHint = (x: TextRenderingHint): string => x;
export const parseTextRenderingHint = (
  x: unknown,
  w = 'TextRenderingHint',
): TextRenderingHint => expectStringEnum(x, TEXT_RENDERING_HINTS, w);

export const serializeNumericRenderingHint = (x: NumericRenderingHint): string => x;
export const parseNumericRenderingHint = (
  x: unknown,
  w = 'NumericRenderingHint',
): NumericRenderingHint => expectStringEnum(x, ['numericInput'] as const, w);

export const serializeSingleChoiceRenderingHint = (
  x: SingleChoiceRenderingHint,
): string => x;
export const parseSingleChoiceRenderingHint = (
  x: unknown,
  w = 'SingleChoiceRenderingHint',
): SingleChoiceRenderingHint =>
  expectStringEnum(x, SINGLE_CHOICE_RENDERING_HINTS, w);

export const serializeMultipleChoiceRenderingHint = (
  x: MultipleChoiceRenderingHint,
): string => x;
export const parseMultipleChoiceRenderingHint = (
  x: unknown,
  w = 'MultipleChoiceRenderingHint',
): MultipleChoiceRenderingHint =>
  expectStringEnum(x, MULTIPLE_CHOICE_RENDERING_HINTS, w);

export function serializeDateRenderingHint(x: DateRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.componentOrder !== undefined) out['componentOrder'] = x.componentOrder;
  return out;
}

export function parseDateRenderingHint(
  x: unknown,
  where = 'DateRenderingHint',
): DateRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['componentOrder']);
  rejectNullProperty(o, 'componentOrder');
  if ('componentOrder' in o) {
    const co = expectStringEnum<DateComponentOrder>(
      o['componentOrder'],
      DATE_COMPONENT_ORDERS,
      `${where}.componentOrder`,
    );
    return dateRenderingHint(co);
  }
  return dateRenderingHint();
}

export function serializeTimeRenderingHint(x: TimeRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.timeFormat !== undefined) out['timeFormat'] = x.timeFormat;
  return out;
}

export function parseTimeRenderingHint(
  x: unknown,
  where = 'TimeRenderingHint',
): TimeRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['timeFormat']);
  rejectNullProperty(o, 'timeFormat');
  if ('timeFormat' in o) {
    const tf = expectStringEnum<TimeFormat>(
      o['timeFormat'],
      TIME_FORMATS,
      `${where}.timeFormat`,
    );
    return timeRenderingHint(tf);
  }
  return timeRenderingHint();
}

export function serializeDateTimeRenderingHint(x: DateTimeRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.timeFormat !== undefined) out['timeFormat'] = x.timeFormat;
  return out;
}

export function parseDateTimeRenderingHint(
  x: unknown,
  where = 'DateTimeRenderingHint',
): DateTimeRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['timeFormat']);
  rejectNullProperty(o, 'timeFormat');
  if ('timeFormat' in o) {
    const tf = expectStringEnum<TimeFormat>(
      o['timeFormat'],
      TIME_FORMATS,
      `${where}.timeFormat`,
    );
    return dateTimeRenderingHint(tf);
  }
  return dateTimeRenderingHint();
}

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
  return {
    term: serializeIri(x.term),
    label: serializeMultilingualString(x.label),
    ontology: serializeOntologyReference(x.ontology),
  };
}

export function parseControlledTermClass(
  x: unknown,
  where = 'ControlledTermClass',
): ControlledTermClass {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['term', 'label', 'ontology']);
  if (!('term' in o)) {
    throw new CedarConstructionError(`${where}: missing required "term"`);
  }
  if (!('label' in o)) {
    throw new CedarConstructionError(`${where}: missing required "label"`);
  }
  if (!('ontology' in o)) {
    throw new CedarConstructionError(`${where}: missing required "ontology"`);
  }
  return controlledTermClass({
    term: expectString(o['term'], `${where}.term`),
    label: parseMultilingualString(o['label'], `${where}.label`),
    ontology: parseOntologyReference(o['ontology'], `${where}.ontology`),
  });
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
    rootTermLabel: serializeMultilingualString(x.rootTermLabel),
  };
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
  if (!('rootTermLabel' in o)) {
    throw new CedarConstructionError(`${where}: missing required "rootTermLabel"`);
  }
  const init: {
    ontology: OntologyReference;
    rootTermIri: string;
    rootTermLabel: ReturnType<typeof parseMultilingualString>;
    maxTraversalDepth?: number;
  } = {
    ontology: parseOntologyReference(o['ontology'], `${where}.ontology`),
    rootTermIri: expectString(o['rootTermIri'], `${where}.rootTermIri`),
    rootTermLabel: parseMultilingualString(
      o['rootTermLabel'],
      `${where}.rootTermLabel`,
    ),
  };
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

// ---- Choice options --------------------------------------------------

export function serializeLiteralChoiceOption(x: LiteralChoiceOption): unknown {
  const out: Record<string, unknown> = { literal: serializeLiteral(x.literal) };
  if (x.default === true) out['default'] = true;
  return out;
}

export function parseLiteralChoiceOption(
  x: unknown,
  where = 'LiteralChoiceOption',
): LiteralChoiceOption {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['literal', 'default']);
  rejectNullProperty(o, 'default');
  if (!('literal' in o)) {
    throw new CedarConstructionError(`${where}: missing required "literal"`);
  }
  const lit: Literal = parseLiteral(o['literal'], `${where}.literal`);
  if ('default' in o) {
    expectTrue(o['default'], `${where}.default`);
    return literalChoiceOption(lit, { default: true });
  }
  return literalChoiceOption(lit);
}

export function serializeControlledTermChoiceOption(
  x: ControlledTermChoiceOption,
): unknown {
  const out: Record<string, unknown> = {
    value: serializeControlledTermValueUntagged(x.value),
  };
  if (x.default === true) out['default'] = true;
  return out;
}

export function parseControlledTermChoiceOption(
  x: unknown,
  where = 'ControlledTermChoiceOption',
): ControlledTermChoiceOption {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['value', 'default']);
  rejectNullProperty(o, 'default');
  if (!('value' in o)) {
    throw new CedarConstructionError(`${where}: missing required "value"`);
  }
  const v: ControlledTermValue = parseControlledTermValueUntagged(
    o['value'],
    `${where}.value`,
  );
  return controlledTermChoiceOption(v, {
    default: 'default' in o ? expectTrue(o['default'], `${where}.default`) : false,
  });
}

// ---- TextFieldSpec ---------------------------------------------------

export function serializeTextFieldSpec(x: TextFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'TextFieldSpec' };
  if (x.defaultValue !== undefined)
    out['defaultValue'] = serializeTextDefaultValue(x.defaultValue);
  if (x.minLength !== undefined) out['minLength'] = x.minLength;
  if (x.maxLength !== undefined) out['maxLength'] = x.maxLength;
  if (x.validationRegex !== undefined)
    out['validationRegex'] = x.validationRegex;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeTextRenderingHint(x.renderingHint);
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
    'renderingHint',
  ]);
  for (const k of ['defaultValue', 'minLength', 'maxLength', 'validationRegex', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'TextFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "TextFieldSpec"`);
  }
  const init: {
    defaultValue?: ReturnType<typeof parseTextDefaultValue>;
    minLength?: number;
    maxLength?: number;
    validationRegex?: string;
    renderingHint?: TextRenderingHint;
  } = {};
  if ('defaultValue' in o)
    init.defaultValue = parseTextDefaultValue(
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
  if ('renderingHint' in o)
    init.renderingHint = parseTextRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return textFieldSpec(init);
}

// ---- NumericFieldSpec ------------------------------------------------

export function serializeNumericFieldSpec(x: NumericFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'NumericFieldSpec',
    datatype: x.datatype,
  };
  if (x.unit !== undefined) out['unit'] = serializeUnit(x.unit);
  if (x.numericPrecision !== undefined)
    out['numericPrecision'] = x.numericPrecision;
  if (x.minValue !== undefined) out['minValue'] = serializeNumericValue(x.minValue);
  if (x.maxValue !== undefined) out['maxValue'] = serializeNumericValue(x.maxValue);
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeNumericRenderingHint(x.renderingHint);
  return out;
}

export function parseNumericFieldSpec(
  x: unknown,
  where = 'NumericFieldSpec',
): NumericFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'datatype',
    'unit',
    'numericPrecision',
    'minValue',
    'maxValue',
    'renderingHint',
  ]);
  for (const k of ['unit', 'numericPrecision', 'minValue', 'maxValue', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'NumericFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "NumericFieldSpec"`);
  }
  if (!('datatype' in o)) {
    throw new CedarConstructionError(`${where}: missing required "datatype"`);
  }
  const init: {
    datatype: ReturnType<typeof parseNumericDatatypeKind>;
    unit?: Unit;
    numericPrecision?: number;
    minValue?: ReturnType<typeof parseNumericValue>;
    maxValue?: ReturnType<typeof parseNumericValue>;
    renderingHint?: NumericRenderingHint;
  } = {
    datatype: parseNumericDatatypeKind(o['datatype'], `${where}.datatype`),
  };
  if ('unit' in o) init.unit = parseUnit(o['unit'], `${where}.unit`);
  if ('numericPrecision' in o)
    init.numericPrecision = expectNumber(
      o['numericPrecision'],
      `${where}.numericPrecision`,
    );
  if ('minValue' in o)
    init.minValue = parseNumericValue(o['minValue'], `${where}.minValue`);
  if ('maxValue' in o)
    init.maxValue = parseNumericValue(o['maxValue'], `${where}.maxValue`);
  if ('renderingHint' in o)
    init.renderingHint = parseNumericRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return numericFieldSpec(init);
}

// ---- Date/Time/DateTime FieldSpec ------------------------------------

export function serializeDateFieldSpec(x: DateFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'DateFieldSpec',
    dateValueType: x.dateValueType,
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeDateRenderingHint(x.renderingHint);
  return out;
}

export function parseDateFieldSpec(
  x: unknown,
  where = 'DateFieldSpec',
): DateFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'dateValueType', 'renderingHint']);
  rejectNullProperty(o, 'renderingHint');
  if (o['kind'] !== 'DateFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "DateFieldSpec"`);
  }
  if (!('dateValueType' in o)) {
    throw new CedarConstructionError(`${where}: missing required "dateValueType"`);
  }
  const init: { dateValueType: DateValueType; renderingHint?: DateRenderingHint } = {
    dateValueType: expectStringEnum<DateValueType>(
      o['dateValueType'],
      DATE_VALUE_TYPES,
      `${where}.dateValueType`,
    ),
  };
  if ('renderingHint' in o)
    init.renderingHint = parseDateRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return dateFieldSpec(init);
}

export function serializeTimeFieldSpec(x: TimeFieldSpec): unknown {
  const out: Record<string, unknown> = { kind: 'TimeFieldSpec' };
  if (x.timePrecision !== undefined) out['timePrecision'] = x.timePrecision;
  if (x.timezoneRequirement !== undefined)
    out['timezoneRequirement'] = x.timezoneRequirement;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeTimeRenderingHint(x.renderingHint);
  return out;
}

export function parseTimeFieldSpec(
  x: unknown,
  where = 'TimeFieldSpec',
): TimeFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'timePrecision',
    'timezoneRequirement',
    'renderingHint',
  ]);
  for (const k of ['timePrecision', 'timezoneRequirement', 'renderingHint']) {
    rejectNullProperty(o, k);
  }
  if (o['kind'] !== 'TimeFieldSpec') {
    throw new CedarConstructionError(`${where}: expected kind "TimeFieldSpec"`);
  }
  const init: {
    timePrecision?: TimePrecision;
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: TimeRenderingHint;
  } = {};
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
  return timeFieldSpec(init);
}

export function serializeDateTimeFieldSpec(x: DateTimeFieldSpec): unknown {
  const out: Record<string, unknown> = {
    kind: 'DateTimeFieldSpec',
    dateTimeValueType: x.dateTimeValueType,
  };
  if (x.timezoneRequirement !== undefined)
    out['timezoneRequirement'] = x.timezoneRequirement;
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeDateTimeRenderingHint(x.renderingHint);
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
    'timezoneRequirement',
    'renderingHint',
  ]);
  for (const k of ['timezoneRequirement', 'renderingHint']) {
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
    timezoneRequirement?: TimezoneRequirement;
    renderingHint?: DateTimeRenderingHint;
  } = {
    dateTimeValueType: expectStringEnum<DateTimeValueType>(
      o['dateTimeValueType'],
      DATE_TIME_VALUE_TYPES,
      `${where}.dateTimeValueType`,
    ),
  };
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
  return dateTimeFieldSpec(init);
}

// ---- ControlledTermFieldSpec -----------------------------------------

export function serializeControlledTermFieldSpec(
  x: ControlledTermFieldSpec,
): unknown {
  return {
    kind: 'ControlledTermFieldSpec',
    sources: x.sources.map(serializeControlledTermSource),
  };
}

export function parseControlledTermFieldSpec(
  x: unknown,
  where = 'ControlledTermFieldSpec',
): ControlledTermFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'sources']);
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
  return controlledTermFieldSpec(
    ...(sources as [ControlledTermSource, ...ControlledTermSource[]]),
  );
}

// ---- Choice FieldSpecs ----------------------------------------------

export function serializeLiteralSingleChoiceFieldSpec(
  x: LiteralSingleChoiceFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'LiteralSingleChoiceFieldSpec',
    options: x.options.map(serializeLiteralChoiceOption),
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeSingleChoiceRenderingHint(x.renderingHint);
  return out;
}

export function parseLiteralSingleChoiceFieldSpec(
  x: unknown,
  where = 'LiteralSingleChoiceFieldSpec',
): LiteralSingleChoiceFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'options', 'renderingHint']);
  rejectNullProperty(o, 'renderingHint');
  if (o['kind'] !== 'LiteralSingleChoiceFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "LiteralSingleChoiceFieldSpec"`,
    );
  }
  if (!('options' in o)) {
    throw new CedarConstructionError(`${where}: missing required "options"`);
  }
  const arr = expectNonEmptyArray(o['options'], `${where}.options`);
  const options = arr.map((e, i) =>
    parseLiteralChoiceOption(e, `${where}.options[${i}]`),
  );
  const init: {
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: SingleChoiceRenderingHint;
  } = { options: options as [LiteralChoiceOption, ...LiteralChoiceOption[]] };
  if ('renderingHint' in o)
    init.renderingHint = parseSingleChoiceRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return literalSingleChoiceFieldSpec(init);
}

export function serializeControlledTermSingleChoiceFieldSpec(
  x: ControlledTermSingleChoiceFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'ControlledTermSingleChoiceFieldSpec',
    options: x.options.map(serializeControlledTermChoiceOption),
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeSingleChoiceRenderingHint(x.renderingHint);
  return out;
}

export function parseControlledTermSingleChoiceFieldSpec(
  x: unknown,
  where = 'ControlledTermSingleChoiceFieldSpec',
): ControlledTermSingleChoiceFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'options', 'renderingHint']);
  rejectNullProperty(o, 'renderingHint');
  if (o['kind'] !== 'ControlledTermSingleChoiceFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "ControlledTermSingleChoiceFieldSpec"`,
    );
  }
  if (!('options' in o)) {
    throw new CedarConstructionError(`${where}: missing required "options"`);
  }
  const arr = expectNonEmptyArray(o['options'], `${where}.options`);
  const options = arr.map((e, i) =>
    parseControlledTermChoiceOption(e, `${where}.options[${i}]`),
  );
  const init: {
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: SingleChoiceRenderingHint;
  } = {
    options: options as [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ],
  };
  if ('renderingHint' in o)
    init.renderingHint = parseSingleChoiceRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return controlledTermSingleChoiceFieldSpec(init);
}

export function serializeLiteralMultipleChoiceFieldSpec(
  x: LiteralMultipleChoiceFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'LiteralMultipleChoiceFieldSpec',
    options: x.options.map(serializeLiteralChoiceOption),
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeMultipleChoiceRenderingHint(x.renderingHint);
  return out;
}

export function parseLiteralMultipleChoiceFieldSpec(
  x: unknown,
  where = 'LiteralMultipleChoiceFieldSpec',
): LiteralMultipleChoiceFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'options', 'renderingHint']);
  rejectNullProperty(o, 'renderingHint');
  if (o['kind'] !== 'LiteralMultipleChoiceFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "LiteralMultipleChoiceFieldSpec"`,
    );
  }
  if (!('options' in o)) {
    throw new CedarConstructionError(`${where}: missing required "options"`);
  }
  const arr = expectNonEmptyArray(o['options'], `${where}.options`);
  const options = arr.map((e, i) =>
    parseLiteralChoiceOption(e, `${where}.options[${i}]`),
  );
  const init: {
    options: readonly [LiteralChoiceOption, ...LiteralChoiceOption[]];
    renderingHint?: MultipleChoiceRenderingHint;
  } = { options: options as [LiteralChoiceOption, ...LiteralChoiceOption[]] };
  if ('renderingHint' in o)
    init.renderingHint = parseMultipleChoiceRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return literalMultipleChoiceFieldSpec(init);
}

export function serializeControlledTermMultipleChoiceFieldSpec(
  x: ControlledTermMultipleChoiceFieldSpec,
): unknown {
  const out: Record<string, unknown> = {
    kind: 'ControlledTermMultipleChoiceFieldSpec',
    options: x.options.map(serializeControlledTermChoiceOption),
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeMultipleChoiceRenderingHint(x.renderingHint);
  return out;
}

export function parseControlledTermMultipleChoiceFieldSpec(
  x: unknown,
  where = 'ControlledTermMultipleChoiceFieldSpec',
): ControlledTermMultipleChoiceFieldSpec {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['kind', 'options', 'renderingHint']);
  rejectNullProperty(o, 'renderingHint');
  if (o['kind'] !== 'ControlledTermMultipleChoiceFieldSpec') {
    throw new CedarConstructionError(
      `${where}: expected kind "ControlledTermMultipleChoiceFieldSpec"`,
    );
  }
  if (!('options' in o)) {
    throw new CedarConstructionError(`${where}: missing required "options"`);
  }
  const arr = expectNonEmptyArray(o['options'], `${where}.options`);
  const options = arr.map((e, i) =>
    parseControlledTermChoiceOption(e, `${where}.options[${i}]`),
  );
  const init: {
    options: readonly [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ];
    renderingHint?: MultipleChoiceRenderingHint;
  } = {
    options: options as [
      ControlledTermChoiceOption,
      ...ControlledTermChoiceOption[],
    ],
  };
  if ('renderingHint' in o)
    init.renderingHint = parseMultipleChoiceRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  return controlledTermMultipleChoiceFieldSpec(init);
}

// ---- Empty FieldSpec families ----------------------------------------

function emptySpec<T extends { kind: string }>(
  expectedKind: T['kind'],
  ctor: () => T,
): {
  serialize: (x: T) => unknown;
  parse: (x: unknown, where?: string) => T;
} {
  return {
    serialize: (x: T) => ({ kind: x.kind }),
    parse: (x: unknown, where: string = expectedKind): T => {
      const o = expectObject(x, where);
      expectKnownProperties(o, ['kind']);
      if (o['kind'] !== expectedKind) {
        throw new CedarConstructionError(
          `${where}: expected kind ${JSON.stringify(expectedKind)}`,
        );
      }
      return ctor();
    },
  };
}

const linkSpecHelpers = emptySpec<LinkFieldSpec>('LinkFieldSpec', linkFieldSpec);
export const serializeLinkFieldSpec = linkSpecHelpers.serialize;
export const parseLinkFieldSpec = linkSpecHelpers.parse;

const emailSpecHelpers = emptySpec<EmailFieldSpec>('EmailFieldSpec', emailFieldSpec);
export const serializeEmailFieldSpec = emailSpecHelpers.serialize;
export const parseEmailFieldSpec = emailSpecHelpers.parse;

const phoneSpecHelpers = emptySpec<PhoneNumberFieldSpec>(
  'PhoneNumberFieldSpec',
  phoneNumberFieldSpec,
);
export const serializePhoneNumberFieldSpec = phoneSpecHelpers.serialize;
export const parsePhoneNumberFieldSpec = phoneSpecHelpers.parse;

const orcidSpecHelpers = emptySpec<OrcidFieldSpec>('OrcidFieldSpec', orcidFieldSpec);
export const serializeOrcidFieldSpec = orcidSpecHelpers.serialize;
export const parseOrcidFieldSpec = orcidSpecHelpers.parse;

const rorSpecHelpers = emptySpec<RorFieldSpec>('RorFieldSpec', rorFieldSpec);
export const serializeRorFieldSpec = rorSpecHelpers.serialize;
export const parseRorFieldSpec = rorSpecHelpers.parse;

const doiSpecHelpers = emptySpec<DoiFieldSpec>('DoiFieldSpec', doiFieldSpec);
export const serializeDoiFieldSpec = doiSpecHelpers.serialize;
export const parseDoiFieldSpec = doiSpecHelpers.parse;

const pubMedIdSpecHelpers = emptySpec<PubMedIdFieldSpec>(
  'PubMedIdFieldSpec',
  pubMedIdFieldSpec,
);
export const serializePubMedIdFieldSpec = pubMedIdSpecHelpers.serialize;
export const parsePubMedIdFieldSpec = pubMedIdSpecHelpers.parse;

const rridSpecHelpers = emptySpec<RridFieldSpec>('RridFieldSpec', rridFieldSpec);
export const serializeRridFieldSpec = rridSpecHelpers.serialize;
export const parseRridFieldSpec = rridSpecHelpers.parse;

const nihGrantIdSpecHelpers = emptySpec<NihGrantIdFieldSpec>(
  'NihGrantIdFieldSpec',
  nihGrantIdFieldSpec,
);
export const serializeNihGrantIdFieldSpec = nihGrantIdSpecHelpers.serialize;
export const parseNihGrantIdFieldSpec = nihGrantIdSpecHelpers.parse;

const attrValSpecHelpers = emptySpec<AttributeValueFieldSpec>(
  'AttributeValueFieldSpec',
  attributeValueFieldSpec,
);
export const serializeAttributeValueFieldSpec = attrValSpecHelpers.serialize;
export const parseAttributeValueFieldSpec = attrValSpecHelpers.parse;

// ---- FieldSpec union -------------------------------------------------

const FIELD_SPEC_KINDS = [
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
] as const;

export function serializeFieldSpec(x: FieldSpec): unknown {
  switch (x.kind) {
    case 'TextFieldSpec':
      return serializeTextFieldSpec(x);
    case 'NumericFieldSpec':
      return serializeNumericFieldSpec(x);
    case 'DateFieldSpec':
      return serializeDateFieldSpec(x);
    case 'TimeFieldSpec':
      return serializeTimeFieldSpec(x);
    case 'DateTimeFieldSpec':
      return serializeDateTimeFieldSpec(x);
    case 'ControlledTermFieldSpec':
      return serializeControlledTermFieldSpec(x);
    case 'LiteralSingleChoiceFieldSpec':
      return serializeLiteralSingleChoiceFieldSpec(x);
    case 'ControlledTermSingleChoiceFieldSpec':
      return serializeControlledTermSingleChoiceFieldSpec(x);
    case 'LiteralMultipleChoiceFieldSpec':
      return serializeLiteralMultipleChoiceFieldSpec(x);
    case 'ControlledTermMultipleChoiceFieldSpec':
      return serializeControlledTermMultipleChoiceFieldSpec(x);
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
    case 'NumericFieldSpec':
      return parseNumericFieldSpec(x, where);
    case 'DateFieldSpec':
      return parseDateFieldSpec(x, where);
    case 'TimeFieldSpec':
      return parseTimeFieldSpec(x, where);
    case 'DateTimeFieldSpec':
      return parseDateTimeFieldSpec(x, where);
    case 'ControlledTermFieldSpec':
      return parseControlledTermFieldSpec(x, where);
    case 'LiteralSingleChoiceFieldSpec':
      return parseLiteralSingleChoiceFieldSpec(x, where);
    case 'ControlledTermSingleChoiceFieldSpec':
      return parseControlledTermSingleChoiceFieldSpec(x, where);
    case 'LiteralMultipleChoiceFieldSpec':
      return parseLiteralMultipleChoiceFieldSpec(x, where);
    case 'ControlledTermMultipleChoiceFieldSpec':
      return parseControlledTermMultipleChoiceFieldSpec(x, where);
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
    case 'AttributeValueFieldSpec':
      return parseAttributeValueFieldSpec(x, where);
  }
}

// Suppress unused-import warning — `literalChoiceValue` is exposed so the
// re-export pattern is consistent with other shared types but is not used
// in this module's body.
void literalChoiceValue;
