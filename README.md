# cedar-ts

TypeScript implementation of the CEDAR Structural Model — the abstract grammar
that describes Templates, Fields, instances, and supporting types as immutable
TypeScript values.

`cedar-ts` is the reference TypeScript binding for the spec defined at
[`metadatacenter/cedar-structural-spec`](https://github.com/metadatacenter/cedar-structural-spec).

## Status

Pre-1.0. The model surface is settled but minor changes can still happen as the
spec stabilizes. Public API is exposed via the package root; nothing is
re-exported from internal subpaths.

## Install

```bash
npm install @metadatacenter/cedar-model
```

## Example

Build a small reusable Field, embed it in a Template, and produce a conforming
instance:

```ts
import {
  artifactMetadata,
  embeddedTextField,
  fieldValue,
  schemaArtifactMetadata,
  schemaVersioning,
  template,
  templateInstance,
  templateInstanceId,
  lifecycleMetadata,
  textField,
  textFieldSpec,
  textValue,
} from '@metadatacenter/cedar-model';

const author = 'https://orcid.org/0000-0001-2345-6789';
const lifecycle = lifecycleMetadata({
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
});

const MODEL_VERSION = '0.1.0';

const fullName = textField({
  id: 'https://example.org/cedar/fields/full-name',
  modelVersion: MODEL_VERSION,
  metadata: schemaArtifactMetadata({
    artifact: artifactMetadata({
      name: 'Full Name',
      description: 'Full legal name of the person.',
      lifecycle,
    }),
    versioning: schemaVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
  }),
  fieldSpec: textFieldSpec({ minLength: 1 }),
});

const tpl = template({
  id: 'https://example.org/cedar/templates/person',
  modelVersion: MODEL_VERSION,
  metadata: schemaArtifactMetadata({
    artifact: artifactMetadata({ name: 'Person', lifecycle }),
    versioning: schemaVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
  }),
  members: [
    embeddedTextField({
      key: 'full_name',
      reference: fullName,
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),
  ],
});

const inst = templateInstance({
  id: templateInstanceId('https://example.org/instances/person/1'),
  modelVersion: MODEL_VERSION,
  metadata: artifactMetadata({ name: 'Jane Smith', lifecycle }),
  templateRef: tpl.id,
  values: [fieldValue('full_name', textValue('Jane Smith'))],
});

console.log(JSON.stringify(inst, null, 2));
```

Two end-to-end examples in [`examples/`](examples/) build a Principal
Investigator template with most of the model exercised, in two equivalent
styles (top-level Field constants vs. inline Field construction).

## Source layout

```
src/
  leaves/             string-syntax validators (IRI, BCP-47, ASCII id,
                      ISO-8601 date-time, integer, semver), datatype IRI
                      constants, leaf types (Iri, LanguageTag,
                      IsoDateTimeStamp), CedarConstructionError
  multilingual.ts     LangString and MultilingualString
  literals/           the three RDF literal forms (Simple / LangTagged /
                      Typed) plus typed-literal aliases
  identifiers.ts      top-level artifact identifiers (TemplateId,
                      TemplateInstanceId, PresentationComponentId)
  metadata/           descriptive / lifecycle-metadata / schema-versioning /
                      annotations / artifact-metadata
  field-families/     18 per-family vertical slices (text-field.ts,
                      numeric-field.ts, …, attribute-value-field.ts),
                      cross-family unions (Field, EmbeddedField, Value,
                      FieldSpec, DefaultValue), shared helpers for choice
                      and external-authority families, rendering hints
  presentation/       presentation components (RichText / Image /
                      YoutubeVideo / SectionBreak / PageBreak)
  embedded/           per-embedding configuration (Cardinality, Property,
                      LabelOverride, ValueRequirement, Visibility) and
                      non-field embedded artifacts (EmbeddedTemplate,
                      EmbeddedPresentationComponent)
  template.ts         Template artifact and SchemaArtifact union
  instances/          TemplateInstance, FieldValue, NestedTemplateInstance,
                      and the Artifact union
  index.ts            public package surface (barrel)
```

Each `*-field.ts` file under `field-families/` is a complete vertical slice for
one of the 18 field families: identifier, value, field-spec, field artifact,
default value, and embedded-field type, all in one file.

## Adding a new field family

Field families are a closed set in the current spec, but if you're prototyping
a new one:

1. Create `src/field-families/{kind}-field.ts` mirroring an existing slice (the
   header comment in any family file lists the slot inventory).
2. Register the new variants in `src/field-families/index.ts`: add to the
   `Field`, `EmbeddedField`, `Value`, `FieldSpec`, `DefaultValue`, and
   `FieldId` unions plus the corresponding kind Sets used by `isField`,
   `isEmbeddedField`, etc.

## Build, test, typecheck

```bash
npm install        # install deps
npm run typecheck
npm run build
npm test           # vitest, single run
npm run test:watch
npm run example    # run the principal-investigator example (tsx)
npm run example:inline  # run the inline-Field variant
```

The published package (under `dist/`) is built from `src/` via
`tsc -p tsconfig.build.json`.

## Design notes

- **Interfaces, not classes.** Every type in cedar-ts is a structural interface
  with `readonly` fields. Construction goes through factory functions
  (`textField(...)`, `embeddedTextField(...)`, etc.). This keeps the model
  round-trippable through `JSON.stringify` / `JSON.parse` without hydration,
  keeps discriminated-union narrowing native (no `instanceof`), and keeps the
  in-memory shape parallel to the wire form.
- **Single per-variant `kind` discriminator.** Every artifact carries
  `kind: '...'` matching its grammar production name. There is no shared
  outer-discriminator pattern; standard discriminated-union narrowing
  (`x.kind === 'TextField'`) works directly, and bindings in any language can
  use their idiomatic discriminated-union machinery without custom dispatch.
- **Property-set discrimination for literals and annotation values.** The
  three RDF literal forms (`SimpleLiteral`, `LangTaggedLiteral`,
  `TypedLiteral`) are distinguished by which properties are present
  (`value` only / `value`+`lang` / `value`+`datatype`) rather than a `kind`
  tag. Same for `AnnotationValue`. See the spec's serialization document for
  why.
- **Multilingual schema metadata.** Human-display fields (Template
  header/footer, descriptive name/description/labels, label overrides,
  property labels, ontology names, controlled-term labels) are
  `MultilingualString` — a non-empty list of `(value, lang)` pairs with
  unique BCP-47 lang tags. A bare string is accepted at every multilingual
  slot and wraps with `lang: 'und'` (RFC 5646 "undetermined").

## Relationship to the spec

The spec lives at
[`metadatacenter/cedar-structural-spec`](https://github.com/metadatacenter/cedar-structural-spec)
and consists of four documents:

- **`grammar.md`** — abstract grammar (EBNF productions, what the model is)
- **`wire-grammar.md`** — formal JSON shape for every grammar production
- **`serialization.md`** — encoding rules and worked examples
- **`bindings.md`** — host-language binding guidance (TypeScript, Java,
  Python)

Where the grammar specifies a production, cedar-ts has a corresponding type
and constructor. Where the wire grammar specifies a JSON shape, cedar-ts
preserves it on construction so `JSON.stringify(value)` produces the
spec-conformant wire form directly.

## License

BSD 2-Clause.
