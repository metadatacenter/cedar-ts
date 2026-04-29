// Lexical-form helpers. All lexical forms are plain Unicode strings; SHOULD
// be in Unicode Normalization Form C per the spec. NFC normalization is
// exposed as an opt-in helper rather than applied implicitly.

export function toNfc(value: string): string {
  return value.normalize('NFC');
}
