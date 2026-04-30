import {
  type Iri,
  type LanguageTag,
  iri,
  languageTag,
  XsdStringDatatypeIri,
  RdfLangStringDatatypeIri,
} from '../leaves/index.js';

// DatatypeIriLiteral pairs a lexical form with an explicit datatype IRI.
export interface DatatypeIriLiteral {
  readonly kind: 'DatatypeIriLiteral';
  readonly lexicalForm: string;
  readonly datatype: Iri;
}

export function datatypeIriLiteral(
  lexicalForm: string,
  datatype: Iri | string,
): DatatypeIriLiteral {
  return {
    kind: 'DatatypeIriLiteral',
    lexicalForm,
    datatype: typeof datatype === 'string' ? iri(datatype) : datatype,
  };
}

// LangStringLiteral pairs a lexical form with a non-empty BCP 47 language tag.
export interface LangStringLiteral {
  readonly kind: 'LangStringLiteral';
  readonly lexicalForm: string;
  readonly lang: LanguageTag;
}

export function langStringLiteral(
  lexicalForm: string,
  tag: LanguageTag | string,
): LangStringLiteral {
  return {
    kind: 'LangStringLiteral',
    lexicalForm,
    lang: typeof tag === 'string' ? languageTag(tag) : tag,
  };
}

// StringLiteral is a DatatypeIriLiteral with implicit datatype xsd:string.
// Modeled here as its own kind for ergonomics; convertible to a DatatypeIriLiteral
// via stringLiteralToDatatypeIriLiteral.
export interface StringLiteral {
  readonly kind: 'StringLiteral';
  readonly lexicalForm: string;
}

export function stringLiteral(lexicalForm: string): StringLiteral {
  return { kind: 'StringLiteral', lexicalForm };
}

export function stringLiteralToDatatypeIriLiteral(s: StringLiteral): DatatypeIriLiteral {
  return {
    kind: 'DatatypeIriLiteral',
    lexicalForm: s.lexicalForm,
    datatype: { kind: 'Iri', value: XsdStringDatatypeIri },
  };
}

// TextLiteral is the union admitted in TextValue.
export type TextLiteral = StringLiteral | LangStringLiteral;

// Literal is the base RDF literal category.
export type Literal = DatatypeIriLiteral | LangStringLiteral;

// Implicit datatype IRI for a LangStringLiteral.
export const LANG_STRING_DATATYPE_IRI = RdfLangStringDatatypeIri;

// Type guards.
export function isDatatypeIriLiteral(x: unknown): x is DatatypeIriLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'DatatypeIriLiteral'
  );
}
export function isLangStringLiteral(x: unknown): x is LangStringLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LangStringLiteral'
  );
}
export function isStringLiteral(x: unknown): x is StringLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'StringLiteral'
  );
}
export function isTextLiteral(x: unknown): x is TextLiteral {
  return isStringLiteral(x) || isLangStringLiteral(x);
}
export function isLiteral(x: unknown): x is Literal {
  return isDatatypeIriLiteral(x) || isLangStringLiteral(x);
}

// Term equality per grammar §Literal Value Semantics.
export function literalsTermEqual(
  a: Literal | StringLiteral,
  b: Literal | StringLiteral,
): boolean {
  if (isLangStringLiteral(a) && isLangStringLiteral(b)) {
    return a.lexicalForm === b.lexicalForm && a.lang.value === b.lang.value;
  }
  if (isLangStringLiteral(a) || isLangStringLiteral(b)) return false;
  // Both are typed string literals. Normalize StringLiteral to xsd:string.
  const aDt = isStringLiteral(a) ? XsdStringDatatypeIri : a.datatype.value;
  const bDt = isStringLiteral(b) ? XsdStringDatatypeIri : b.datatype.value;
  return a.lexicalForm === b.lexicalForm && aDt === bDt;
}
