import { CedarConstructionError, parseSemanticVersion } from './leaves/index.js';
import { type TemplateId, templateId } from './identifiers.js';
import type { SchemaArtifactMetadata } from './metadata/index.js';
import type { EmbeddedArtifact } from './embedded/index.js';
import { type Field, isField } from './field-families/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from './multilingual.js';

// =====================================================================
// Template — see grammar.md §Core Structure.
// =====================================================================
//
// A Template is the central container of the CEDAR Template Model. It
// declares a schema that TemplateInstance documents conform to, by
// assembling an ordered sequence of EmbeddedArtifact constructs (each of
// which contextualises a reusable Field, embeds a sub-Template, or places
// a PresentationComponent into the rendered form).
//
// Identity, metadata, and reuse
// -----------------------------
// A Template is a SchemaArtifact: it has a stable IRI identity (TemplateId),
// carries SchemaArtifactMetadata (descriptive metadata + lifecycle +
// versioning + status), and is independently versionable. The same
// reusable Field may be embedded in multiple Templates, and the same
// reusable Template may be embedded as a sub-Template in another
// Template. The act of embedding is decoupled from the reusable
// artifact: per-embedding properties (value requirement, cardinality,
// label override, semantic property IRI, default value) are pinned at
// the embedding site, not on the reusable artifact itself.
//
// Header and footer
// -----------------
// `header` and `footer` are optional MultilingualStrings shown above and
// below the rendered form (see src/multilingual.ts). Each carries a
// non-empty set of language-tagged localizations.
//
// Order of `embedded`
// -------------------
// The grammar requires that conforming implementations preserve the
// declared order of embedded artifacts (grammar §Embedded Artifacts).
// The constructor takes care to assemble the result with `embedded`
// untouched.
//
// `kind: 'Template'`
// ------------------
// Template is polymorphic: it appears in `SchemaArtifact = Field |
// Template` (grammar §Core Structure) and at the document-root position
// alongside Field, PresentationComponent, and TemplateInstance.
// `kind: 'Template'` discriminates it at both positions and is therefore
// retained per the polymorphic-only rule (serialization.md §4.5).

export interface Template {
  readonly kind: 'Template';
  readonly id: TemplateId;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly header?: MultilingualString;
  readonly footer?: MultilingualString;
  readonly members: readonly EmbeddedArtifact[];
}

// Init type for `template()`. Accepts a bare-string IRI at `id` (widened
// via `templateId()`); `members` is optional and defaults to an empty
// sequence. `header` and `footer` accept any MultilingualStringInput
// (bare string, lang map, etc. — see src/multilingual.ts).
export interface TemplateInit {
  readonly id: TemplateId | string;
  readonly modelVersion: string;
  readonly metadata: SchemaArtifactMetadata;
  readonly header?: MultilingualStringInput;
  readonly footer?: MultilingualStringInput;
  readonly members?: readonly EmbeddedArtifact[];
}

// Constructor.
//
// Enforces the structural invariants that hold across every Template,
// regardless of the reusable artifacts being referenced:
//
//   1. EmbeddedArtifactKey values are unique within a Template (grammar
//      §Embedded Artifact Key). Each `key` slot identifies one embedding
//      site within this Template, and a TemplateInstance joins its
//      values to embeddings by key. Allowing duplicate keys would make
//      the join ambiguous.
//
//   2. The order of `members` is preserved as supplied (grammar
//      §Embedded Artifacts).
//
// Cross-template alignment is NOT validated here — e.g., this constructor
// does not verify that the IRI at each `reference` resolves to a Field
// (or Template / PresentationComponent) of the right family, nor that
// any default values match the referenced FieldSpec. Such checks belong
// at the validation layer, not the structural layer.
export function template(init: TemplateInit): Template {
  const members = init.members ?? [];
  assertUniqueEmbeddedArtifactKeys(members);
  const out: {
    kind: 'Template';
    id: TemplateId;
    modelVersion: string;
    metadata: SchemaArtifactMetadata;
    header?: MultilingualString;
    footer?: MultilingualString;
    members: readonly EmbeddedArtifact[];
  } = {
    kind: 'Template',
    id: typeof init.id === 'string' ? templateId(init.id) : init.id,
    modelVersion: parseSemanticVersion(init.modelVersion),
    metadata: init.metadata,
    members,
  };
  if (init.header !== undefined) out.header = multilingualString(init.header);
  if (init.footer !== undefined) out.footer = multilingualString(init.footer);
  return out;
}

// Walks the embedded sequence once and throws on the first duplicate
// key. Keys are plain strings (validated at the embedded-artifact
// constructor site against the ASCII-identifier pattern).
function assertUniqueEmbeddedArtifactKeys(
  members: readonly EmbeddedArtifact[],
): void {
  const seen = new Set<string>();
  for (const e of members) {
    const k = e.key;
    if (seen.has(k)) {
      throw new CedarConstructionError(
        `Duplicate EmbeddedArtifactKey within Template: ${JSON.stringify(k)}`,
      );
    }
    seen.add(k);
  }
}

// Runtime type guard for Template. Useful when narrowing within a
// SchemaArtifact union, or when receiving an untyped artifact at a
// document-root-style position (mixed Field / Template / TemplateInstance
// / PresentationComponent).
export function isTemplate(x: unknown): x is Template {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'Template'
  );
}

// =====================================================================
// SchemaArtifact — grammar §Core Structure.
// =====================================================================
//
// Union of the two reusable schema-artifact kinds: Field and Template.
// PresentationComponent is an Artifact but NOT a SchemaArtifact (it has
// no version / status / model-version), and TemplateInstance is a
// non-schema instance-bearing artifact, so neither participates in this
// union. Use `Artifact` (where defined elsewhere) for the broader
// "anything with an identity and metadata" notion.

export type SchemaArtifact = Field | Template;

export const isSchemaArtifact = (x: unknown): x is SchemaArtifact =>
  isField(x) || isTemplate(x);
