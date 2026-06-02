import { parseAsciiIdentifier, CedarConstructionError } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';

// AlternativePrompt — see grammar.md §Alternative Prompts.
// One of a Field's curated alternative question wordings: a stable PromptKey
// paired with a MultilingualString wording. A Template embedding selects one
// of these by key via EmbeddedField.promptKey rather than inventing its own
// wording (the free-form promptOverride escape hatch).
//
// `key` is a PromptKey — a stable, opaque local ASCII identifier the field
// owner chooses. `prompt` is the alternative's MultilingualString wording,
// the same kind of localized rendered text as Field.prompt.

export interface AlternativePrompt {
  readonly key: string;
  readonly prompt: MultilingualString;
}

export interface AlternativePromptInit {
  readonly key: string;
  readonly prompt: MultilingualStringInput;
}

export type AlternativePromptInput = AlternativePrompt | AlternativePromptInit;

// Builds an AlternativePrompt, validating the key as an AsciiIdentifier (it
// would be invalid as a PromptKey otherwise) and normalising the wording to a
// MultilingualString. Passing an existing AlternativePrompt re-validates and
// re-normalises (idempotent in practice).
export function alternativePrompt(input: AlternativePromptInput): AlternativePrompt {
  return {
    key: parseAsciiIdentifier(input.key),
    prompt: multilingualString(input.prompt),
  };
}

// Builds a Field's curated AlternativePrompt set, validating each entry and
// enforcing the spec rule (validation.md §Alternative Prompts) that PromptKey
// values are unique within a field's altPrompts. Used by every concrete
// Field constructor.
export function assembleAltPrompts(
  inputs: readonly AlternativePromptInput[],
): readonly AlternativePrompt[] {
  const out: AlternativePrompt[] = [];
  const seen = new Set<string>();
  for (const input of inputs) {
    const ap = alternativePrompt(input);
    if (seen.has(ap.key)) {
      throw new CedarConstructionError(
        `PromptKey values within a field's altPrompts MUST be unique: duplicate ${JSON.stringify(ap.key)}`,
      );
    }
    seen.add(ap.key);
    out.push(ap);
  }
  return out;
}
