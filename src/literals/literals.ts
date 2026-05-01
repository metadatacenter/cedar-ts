import {
  type Iri,
  type LanguageTag,
  iri,
  languageTag,
  XsdStringDatatypeIri,
  RdfLangStringDatatypeIri,
} from '../leaves/index.js';

// TypedLiteral pairs a lexical form with an explicit datatype IRI.
export interface TypedLiteral {
  readonly kind: 'TypedLiteral';
  readonly lexicalForm: string;
  readonly datatype: Iri;
}

export function typedLiteral(
  lexicalForm: string,
  datatype: Iri | string,
): TypedLiteral {
  return {
    kind: 'TypedLiteral',
    lexicalForm,
    datatype: typeof datatype === 'string' ? iri(datatype) : datatype,
  };
}

// LangTaggedLiteral pairs a lexical form with a non-empty BCP 47 language tag.
export interface LangTaggedLiteral {
  readonly kind: 'LangTaggedLiteral';
  readonly lexicalForm: string;
  readonly lang: LanguageTag;
}

export function langTaggedLiteral(
  lexicalForm: string,
  tag: LanguageTag | string,
): LangTaggedLiteral {
  return {
    kind: 'LangTaggedLiteral',
    lexicalForm,
    lang: typeof tag === 'string' ? languageTag(tag) : tag,
  };
}

// SimpleLiteral is a TypedLiteral with implicit datatype xsd:string.
// Modeled here as its own kind for ergonomics; convertible to a TypedLiteral
// via simpleLiteralToTypedLiteral.
export interface SimpleLiteral {
  readonly kind: 'SimpleLiteral';
  readonly lexicalForm: string;
}

export function simpleLiteral(lexicalForm: string): SimpleLiteral {
  return { kind: 'SimpleLiteral', lexicalForm };
}

export function simpleLiteralToTypedLiteral(s: SimpleLiteral): TypedLiteral {
  return {
    kind: 'TypedLiteral',
    lexicalForm: s.lexicalForm,
    datatype: { kind: 'Iri', value: XsdStringDatatypeIri },
  };
}

// TextLiteral is the union admitted in TextValue: plain strings and
// language-tagged strings, but NOT arbitrarily-typed literals.
export type TextLiteral = SimpleLiteral | LangTaggedLiteral;

// Literal is the base category for all RDF literals: SimpleLiteral
// (implicit xsd:string), LangTaggedLiteral (implicit rdf:langString),
// and TypedLiteral (explicit datatype). At any Literal position a
// plain string MAY be expressed as a SimpleLiteral or as a TypedLiteral
// with datatype xsd:string; both denote the same RDF literal but the
// abstract syntax preserves the distinction so authorial intent
// round-trips.
export type Literal = SimpleLiteral | LangTaggedLiteral | TypedLiteral;

// Implicit datatype IRI for a LangTaggedLiteral.
// Encodes the W3C-defined IRI rdf:langString (normative RDF terminology).
export const LANG_STRING_DATATYPE_IRI = RdfLangStringDatatypeIri;

// Type guards.
export function isTypedLiteral(x: unknown): x is TypedLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'TypedLiteral'
  );
}
export function isLangTaggedLiteral(x: unknown): x is LangTaggedLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'LangTaggedLiteral'
  );
}
export function isSimpleLiteral(x: unknown): x is SimpleLiteral {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'SimpleLiteral'
  );
}
export function isTextLiteral(x: unknown): x is TextLiteral {
  return isSimpleLiteral(x) || isLangTaggedLiteral(x);
}
export function isLiteral(x: unknown): x is Literal {
  return isSimpleLiteral(x) || isLangTaggedLiteral(x) || isTypedLiteral(x);
}

// Term equality per grammar §Literal Value Semantics.
export function literalsTermEqual(a: Literal, b: Literal): boolean {
  if (isLangTaggedLiteral(a) && isLangTaggedLiteral(b)) {
    return a.lexicalForm === b.lexicalForm && a.lang.value === b.lang.value;
  }
  if (isLangTaggedLiteral(a) || isLangTaggedLiteral(b)) return false;
  // Both are non-lang literals (SimpleLiteral or TypedLiteral). Normalize a
  // SimpleLiteral to its implicit datatype xsd:string for comparison.
  const aDt = isSimpleLiteral(a) ? XsdStringDatatypeIri : a.datatype.value;
  const bDt = isSimpleLiteral(b) ? XsdStringDatatypeIri : b.datatype.value;
  return a.lexicalForm === b.lexicalForm && aDt === bDt;
}
