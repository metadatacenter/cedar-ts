import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  isFieldId,
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
  it('produces a tagged object with the per-variant kind', () => {
    const id = textFieldId('https://example.org/fields/title');
    expect(id.kind).toBe('TextFieldId');
    expect(id.iri.value).toBe('https://example.org/fields/title');
    expect(isFieldId(id)).toBe(true);
  });

  it('throws on a malformed IRI string', () => {
    expect(() => textFieldId('not an iri')).toThrow(CedarConstructionError);
  });

  it('narrows by per-variant kind', () => {
    const id = dateFieldId('https://example.org/fields/dob');
    expect(id.kind === 'DateFieldId').toBe(true);
    expect((id.kind as string) === 'TextFieldId').toBe(false);
  });
});

describe('FieldId — convenience helpers', () => {
  const helpers: Array<[string, (v: string) => { kind: string }]> = [
    ['TextFieldId', textFieldId],
    ['NumericFieldId', numericFieldId],
    ['DateFieldId', dateFieldId],
    ['TimeFieldId', timeFieldId],
    ['DateTimeFieldId', dateTimeFieldId],
    ['ControlledTermFieldId', controlledTermFieldId],
    ['SingleChoiceFieldId', singleChoiceFieldId],
    ['MultipleChoiceFieldId', multipleChoiceFieldId],
    ['LinkFieldId', linkFieldId],
    ['EmailFieldId', emailFieldId],
    ['PhoneNumberFieldId', phoneNumberFieldId],
    ['OrcidFieldId', orcidFieldId],
    ['RorFieldId', rorFieldId],
    ['DoiFieldId', doiFieldId],
    ['PubMedIdFieldId', pubMedIdFieldId],
    ['RridFieldId', rridFieldId],
    ['NihGrantIdFieldId', nihGrantIdFieldId],
    ['AttributeValueFieldId', attributeValueFieldId],
  ];

  it.each(helpers)('%s helper sets the right kind', (kind, helper) => {
    const id = helper('https://example.org/x');
    expect(id.kind).toBe(kind);
  });
});

describe('Type-system separation between field families', () => {
  it('a TextFieldId is structurally distinct from a DateFieldId', () => {
    const t: TextFieldId = textFieldId('https://example.org/t');
    // Compile-time check: assigning t to DateFieldId would error.
    // @ts-expect-error
    const d: DateFieldId = t;
    void d;
    expect(t.kind).toBe('TextFieldId');
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
