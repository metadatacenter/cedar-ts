import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  isFieldId,
  isFieldIdOf,
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
  type TextFieldId,
  type DateFieldId,
} from '../src/index.js';

describe('FieldId basics', () => {
  it('produces a tagged object with the requested fieldKind', () => {
    const id = textFieldId('https://example.org/fields/title');
    expect(id.kind).toBe('FieldId');
    expect(id.fieldKind).toBe('Text');
    expect(id.iri.value).toBe('https://example.org/fields/title');
    expect(isFieldId(id)).toBe(true);
  });

  it('throws on a malformed IRI string', () => {
    expect(() => textFieldId('not an iri')).toThrow(CedarConstructionError);
  });

  it('isFieldIdOf narrows by family', () => {
    const id = dateFieldId('https://example.org/fields/dob');
    expect(isFieldIdOf(id, 'Date')).toBe(true);
    expect(isFieldIdOf(id, 'Text')).toBe(false);
  });
});

describe('FieldId — convenience helpers', () => {
  const helpers: Array<[string, (v: string) => { fieldKind: string }]> = [
    ['Text', textFieldId],
    ['Numeric', numericFieldId],
    ['Date', dateFieldId],
    ['Time', timeFieldId],
    ['DateTime', dateTimeFieldId],
    ['ControlledTerm', controlledTermFieldId],
    ['SingleChoice', singleChoiceFieldId],
    ['MultipleChoice', multipleChoiceFieldId],
    ['Link', linkFieldId],
    ['Email', emailFieldId],
    ['PhoneNumber', phoneNumberFieldId],
    ['Orcid', orcidFieldId],
    ['Ror', rorFieldId],
    ['Doi', doiFieldId],
    ['PubMedId', pubMedIdFieldId],
    ['Rrid', rridFieldId],
    ['NihGrantId', nihGrantIdFieldId],
    ['AttributeValue', attributeValueFieldId],
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
    expect(t.fieldKind).toBe('Text');
  });
});

describe('Other artifact identifiers', () => {
  it('templateId / presentationComponentId / templateInstanceId have distinct kinds', () => {
    const t = templateId('https://example.org/t/1');
    const pc = presentationComponentId('https://example.org/pc/1');
    const ti = templateInstanceId('https://example.org/ti/1');
    expect(t.kind).toBe('TemplateId');
    expect(pc.kind).toBe('PresentationComponentId');
    expect(ti.kind).toBe('TemplateInstanceId');
    expect(isTemplateId(t)).toBe(true);
    expect(isPresentationComponentId(pc)).toBe(true);
    expect(isTemplateInstanceId(ti)).toBe(true);
    expect(isTemplateId(pc)).toBe(false);
    expect(isFieldId(t)).toBe(false);
  });
});
