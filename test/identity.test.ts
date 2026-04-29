import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  FIELD_KINDS,
  isFieldId,
  isFieldIdOf,
  isFieldKind,
  textFieldId,
  numericFieldId,
  dateFieldId,
  timeFieldId,
  dateTimeFieldId,
  controlledTermFieldId,
  singleChoiceFieldId,
  multipleChoiceFieldId,
  linkFieldId,
  emailFieldId,
  phoneNumberFieldId,
  orcidFieldId,
  rorFieldId,
  doiFieldId,
  pubMedIdFieldId,
  rridFieldId,
  nihGrantIdFieldId,
  attributeValueFieldId,
  templateId,
  presentationComponentId,
  templateInstanceId,
  isTemplateId,
  isPresentationComponentId,
  isTemplateInstanceId,
  type FieldKind,
  type TextFieldId,
  type DateFieldId,
} from '../src/index.js';

describe('FieldKind enumeration', () => {
  it('contains exactly 18 kinds', () => {
    expect(FIELD_KINDS).toHaveLength(18);
  });

  it('isFieldKind narrows from string', () => {
    expect(isFieldKind('text')).toBe(true);
    expect(isFieldKind('attribute_value')).toBe(true);
    expect(isFieldKind('not_a_kind')).toBe(false);
    expect(isFieldKind(42)).toBe(false);
  });
});

describe('FieldId basics', () => {
  it('produces a tagged object with the requested fieldKind', () => {
    const id = textFieldId('https://example.org/fields/title');
    expect(id.kind).toBe('field_id');
    expect(id.fieldKind).toBe('text');
    expect(id.iri.value).toBe('https://example.org/fields/title');
    expect(isFieldId(id)).toBe(true);
  });

  it('throws on a malformed IRI string', () => {
    expect(() => textFieldId('not an iri')).toThrow(CedarConstructionError);
  });

  it('isFieldIdOf narrows by family', () => {
    const id = dateFieldId('https://example.org/fields/dob');
    expect(isFieldIdOf(id, 'date')).toBe(true);
    expect(isFieldIdOf(id, 'text')).toBe(false);
  });
});

describe('FieldId — convenience helpers', () => {
  const helpers: Array<[FieldKind, (v: string) => { fieldKind: FieldKind }]> = [
    ['text', textFieldId],
    ['numeric', numericFieldId],
    ['date', dateFieldId],
    ['time', timeFieldId],
    ['date_time', dateTimeFieldId],
    ['controlled_term', controlledTermFieldId],
    ['single_choice', singleChoiceFieldId],
    ['multiple_choice', multipleChoiceFieldId],
    ['link', linkFieldId],
    ['email', emailFieldId],
    ['phone_number', phoneNumberFieldId],
    ['orcid', orcidFieldId],
    ['ror', rorFieldId],
    ['doi', doiFieldId],
    ['pub_med_id', pubMedIdFieldId],
    ['rrid', rridFieldId],
    ['nih_grant_id', nihGrantIdFieldId],
    ['attribute_value', attributeValueFieldId],
  ];

  it.each(helpers)('%s helper sets the right fieldKind', (kind, helper) => {
    const id = helper('https://example.org/x');
    expect(id.fieldKind).toBe(kind);
  });
});

describe('Type-system separation between field families', () => {
  it('a TextFieldId is structurally a FieldId<"text"> and not a FieldId<"date">', () => {
    const t: TextFieldId = textFieldId('https://example.org/t');
    // Compile-time check: assigning t to DateFieldId would error.
    // @ts-expect-error
    const d: DateFieldId = t;
    void d;
    expect(t.fieldKind).toBe('text');
  });
});

describe('Other artifact identifiers', () => {
  it('templateId / presentationComponentId / templateInstanceId have distinct kinds', () => {
    const t = templateId('https://example.org/t/1');
    const pc = presentationComponentId('https://example.org/pc/1');
    const ti = templateInstanceId('https://example.org/ti/1');
    expect(t.kind).toBe('template_id');
    expect(pc.kind).toBe('presentation_component_id');
    expect(ti.kind).toBe('template_instance_id');
    expect(isTemplateId(t)).toBe(true);
    expect(isPresentationComponentId(pc)).toBe(true);
    expect(isTemplateInstanceId(ti)).toBe(true);
    expect(isTemplateId(pc)).toBe(false);
    expect(isFieldId(t)).toBe(false);
  });
});
