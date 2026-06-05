// =====================================================================
// Principal Investigator details — example Template construction.
// =====================================================================
//
// Demonstrates the cedar-ts public API end-to-end:
//
//   1. Build reusable Field artifacts as top-level `const`s, each with its
//      own metadata, identity, and FieldSpec.
//   2. Build a Template that EMBEDS those reusable Fields — pinning each
//      embedding's contextual properties (requirement, cardinality, label
//      override, semantic property IRI) at the embedding site rather than
//      on the reusable Field itself.
//   3. Consume the Template — iterate `template.members`, narrow on kind,
//      and project to a small summary record.
//   4. Build a TemplateInstance whose values conform to the Template.
//
// The companion file `principal-investigator-inline.ts` constructs the same
// Template with each Field built inline at its embedding site. Pick that
// style for one-off, single-use templates and this style when reusable
// Fields are referenced (or could be referenced) from multiple places.
//
// All identifiers below use a single fictional `https://example.org/cedar/`
// IRI base, partitioned per artifact kind, to keep the example self-contained.

import {
  catalogMetadata,
  booleanField,
  booleanFieldSpec,
  booleanValue,
  cardinality,
  controlledTermField,
  controlledTermFieldSpec,
  controlledTermValue,
  dateField,
  dateFieldSpec,
  DEFAULT_VALUE_REQUIREMENT,
  embeddedBooleanField,
  embeddedControlledTermField,
  embeddedDateField,
  embeddedEmailField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedRorField,
  embeddedSingleValuedEnumField,
  embeddedTextField,
  emailField,
  emailFieldSpec,
  emailValue,
  enumValue,
  fieldEntry,
  fullDateValue,
  isEmbeddedField,
  meaning,
  multilingualString,
  ontologyDisplayHint,
  ontologyReference,
  ontologySource,
  orcidField,
  orcidFieldSpec,
  orcidValue,
  permissibleValue,
  phoneNumberField,
  phoneNumberFieldSpec,
  richTextComponent,
  rorField,
  rorFieldSpec,
  rorValue,
  schemaArtifactVersioning,
  serialize,
  singleValuedEnumField,
  singleValuedEnumFieldSpec,
  template,
  templateInstance,
  templateInstanceId,
  lifecycleMetadata,
  textField,
  textFieldSpec,
  textValue,
  type CatalogMetadata,
  type Template,
  type TemplateInstance,
  type ValueRequirement,
} from '../src/index.js';

// ---- IRI bases --------------------------------------------------------
//
// Reusable artifacts are identified by IRI. Conforming implementations
// require these to be absolute IRIs (grammar §Identifiers); the choice of
// IRI scheme and partitioning is otherwise unconstrained. The constants
// below partition the example's IRI space so each artifact kind lives under
// its own path segment.

const BASE = 'https://example.org/cedar/';
const TEMPLATES = `${BASE}templates/`;
const FIELDS = `${BASE}fields/`;
const COMPONENTS = `${BASE}components/`;

// Academic-rank terms drawn from the OBO Role Ontology (RoleO). Used by the
// controlled-term choice field below.
const ROLEO_FULL_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000677';
const ROLEO_ASSISTANT_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000678';
const ROLEO_ASSOCIATE_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000679';

// MeSH (Medical Subject Headings) ontology and an example term IRI used in
// the open-lookup controlled-term field below.
const MESH_ONTOLOGY_IRI = 'http://id.nlm.nih.gov/mesh/';
const MESH_MEDICAL_INFORMATICS_TERM_IRI = `${MESH_ONTOLOGY_IRI}D008490`;

// ---- Shared metadata --------------------------------------------------
//
// Every artifact carries metadata. The model distinguishes two flavors:
//
//   - ArtifactMetadata: descriptive metadata + lifecycle + annotations.
//     Carried by every Artifact (Field, Template, PresentationComponent,
//     TemplateInstance).
//
//   - SchemaArtifactMetadata: ArtifactMetadata + versioning information.
//     Carried by reusable schema artifacts only (Field and Template). The
//     versioning component records the artifact's own version, lifecycle
//     status, and the model version it was authored against.
//
// PresentationComponent and TemplateInstance are independently identifiable
// artifacts but are NOT versioned and so use the plain ArtifactMetadata
// flavor — see the `intro` PresentationComponent and `exampleInstance`
// below.

const author = 'https://orcid.org/0000-0002-1825-0097';
const lifecycleTimestamps = {
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
};

// Returns plain CatalogMetadata (no version / status / model-version).
function artifactMeta(preferredLabel: string, description: string): CatalogMetadata {
  return catalogMetadata({
    preferredLabel,
    description,
    lifecycle: lifecycleMetadata(lifecycleTimestamps),
  });
}

// Returns the three slots required by every Field artifact:
// CatalogMetadata, SchemaArtifactVersioning, and the rendered `label`.
// The same string is passed as both the catalog `preferredLabel` and
// the rendered `label` — typical for examples where the registry name
// and the rendered question text agree.
function fieldMeta(rendered: string, description: string): {
  metadata: CatalogMetadata;
  versioning: ReturnType<typeof schemaArtifactVersioning>;
  prompt: string;
} {
  return {
    metadata: artifactMeta(rendered, description),
    versioning: schemaArtifactVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
    prompt: rendered,
  };
}

// Returns the three slots required by Template: CatalogMetadata,
// SchemaArtifactVersioning, and the rendered `title`. Same pattern
// as fieldMeta, just renamed for clarity.
function templateMeta(rendered: string, description: string): {
  metadata: CatalogMetadata;
  versioning: ReturnType<typeof schemaArtifactVersioning>;
  title: string;
} {
  return {
    metadata: artifactMeta(rendered, description),
    versioning: schemaArtifactVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
    title: rendered,
  };
}

// Every concrete artifact (Field, Template, TemplateInstance,
// PresentationComponent) carries a top-level `modelVersion` recording the
// CEDAR structural model version it was authored against.
const MODEL_VERSION = '0.1.0';

// ---- Reusable Field artifacts -----------------------------------------
//
// Each `const` below is a self-contained reusable Field artifact: an
// identity (Field IRI), schema metadata, and a typed FieldSpec describing
// the family-specific shape. None of them mention how they will appear in
// a Template — that is decided per-embedding below.

// Plain text field with a minimum length of 1. `textFieldSpec()` accepts an
// optional init object (omit it to allow any non-empty string).
export const fullName = textField({
  id: `${FIELDS}full-name`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Full Name', 'Full legal name of the principal investigator.'),
  fieldSpec: textFieldSpec({
    minLength: 1,
  }),
  // `recommendedKey` and `recommendedProperty` are advisory hints from the
  // Field's owner: the embedding key and semantic property a Template SHOULD
  // use when embedding this field. Neither constrains anything — the
  // authoritative carriers are `EmbeddedField.key` and `EmbeddedField.property`
  // at the embedding site below, which here adopt exactly these recommendations
  // (key `full_name`, property schema.org/name). An embedding is free to
  // override or omit them; the validator ignores both advisory slots.
  // `recommendedKey` must be a valid ASCII identifier (it would be invalid as
  // an embedding key otherwise).
  recommendedKey: 'full_name',
  recommendedProperty: 'https://schema.org/name',
  // `altPrompts` is the field owner's curated, closed set of alternative
  // question wordings, each addressable by a stable PromptKey. A Template
  // embedding selects one of these by key (see `promptKey` on the embedding
  // below) instead of inventing its own wording via the free-form
  // `promptOverride` escape hatch — the two are mutually exclusive. The
  // field's preferred wording (`prompt`, above) is selected by omitting
  // `promptKey` on the embedding.
  altPrompts: [
    { key: 'short', prompt: { value: 'Name', lang: 'en' } },
    { key: 'formal', prompt: { value: 'Full legal name', lang: 'en' } },
  ],
});

// Single-valued enum field. PermissibleValue is the option type — each
// entry pairs a canonical Token with optional human-readable label/
// description and zero-or-more Meaning entries that bind the token to
// ontology terms. A spec-level `defaultValue` (a Token) marks the
// pre-selected option.
const academicTitle = singleValuedEnumField({
  id: `${FIELDS}academic-title`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Academic Title', 'Academic rank or position.'),
  fieldSpec: singleValuedEnumFieldSpec({
    permissibleValues: [
      permissibleValue({ value: 'professor', label: 'Professor' }),
      permissibleValue({
        value: 'associate-professor',
        label: 'Associate Professor',
      }),
      permissibleValue({
        value: 'assistant-professor',
        label: 'Assistant Professor',
      }),
      permissibleValue({ value: 'lecturer', label: 'Lecturer' }),
      permissibleValue({
        value: 'research-scientist',
        label: 'Research Scientist',
      }),
    ],
    defaultValue: 'associate-professor',
  }),
});

// Single-valued enum whose permissible values are bound, via Meaning
// entries, to terms in an external ontology — here the OBO Role Ontology
// (RoleO). RDF projection of an instance EnumValue follows the bound
// term IRIs rather than the bare token.
const academicRank = singleValuedEnumField({
  id: `${FIELDS}academic-rank`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta(
    'Academic Rank',
    'Academic rank backed by the OBO Role Ontology (RoleO).',
  ),
  fieldSpec: singleValuedEnumFieldSpec({
    permissibleValues: [
      permissibleValue({
        value: 'full-professor',
        label: {value: 'Full Professor', lang: 'en'},
        meanings: [meaning({ iri: ROLEO_FULL_PROFESSOR, label: 'Full Professor' })],
      }),
      permissibleValue({
        value: 'associate-professor',
        label: 'Associate Professor',
        meanings: [
          meaning({ iri: ROLEO_ASSOCIATE_PROFESSOR, label: 'Associate Professor' }),
        ],
      }),
      permissibleValue({
        value: 'assistant-professor',
        label: 'Assistant Professor',
        meanings: [
          meaning({ iri: ROLEO_ASSISTANT_PROFESSOR, label: 'Assistant Professor' }),
        ],
      }),
    ],
    defaultValue: 'associate-professor',
  }),
});

// Authority-style fields below carry no extra schema beyond their family.
// Their FieldSpec constructors are nullary because the family itself fixes
// the value shape (e.g., an EmailValue is a syntactically valid email).

export const email = emailField({
  id: `${FIELDS}email`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Email Address', 'Primary work email.'),
  fieldSpec: emailFieldSpec(),
  // Advisory: recommends key `email` and property schema.org/email; the
  // embedding adopts both.
  recommendedKey: 'email',
  recommendedProperty: {
    iri: 'https://schema.org/email',
    label: { value: 'email', lang: 'en' },
  },
});

const phone = phoneNumberField({
  id: `${FIELDS}phone`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Phone Number', 'Primary work phone, in international format.'),
  fieldSpec: phoneNumberFieldSpec(),
});

export const orcid = orcidField({
  id: `${FIELDS}orcid`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
  fieldSpec: orcidFieldSpec(),
  // Advisory: recommends key `orcid` and property schema.org/identifier,
  // matching the embedding below.
  recommendedKey: 'orcid',
  recommendedProperty: 'https://schema.org/identifier',
});

// Plain text again — no length constraint here, because the institution
// name field happens to have no validation requirement of its own.
const institutionName = textField({
  id: `${FIELDS}institution-name`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Institution Name', 'Name of the home institution.'),
  fieldSpec: textFieldSpec(),
});

const institutionRor = rorField({
  id: `${FIELDS}institution-ror`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta(
    'Institution ROR',
    'Research Organization Registry identifier for the home institution.',
  ),
  fieldSpec: rorFieldSpec(),
});

const department = textField({
  id: `${FIELDS}department`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Department', 'Department or division within the institution.'),
  fieldSpec: textFieldSpec(),
});

// Date field constrained to FULL dates (xsd:date). Other DateFieldSpec
// values can pin partial dates (year, year+month) — see grammar §Field Specs.
const appointmentDate = dateField({
  id: `${FIELDS}appointment-date`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Appointment Date', 'Start date of current appointment.'),
  fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
});

// Boolean field — true / false. The fieldSpec carries an optional
// rendering hint (`'checkbox'` or `'toggle'`) but no value-shaping slots:
// a boolean's domain is fixed at two values. Embeddings of a BooleanField
// also omit `cardinality` (booleans are inherently single-valued) — see
// the embedding below.
const acceptingNewStudents = booleanField({
  id: `${FIELDS}accepting-new-students`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta(
    'Accepting New Students',
    'Whether the PI is accepting new graduate students this cycle.',
  ),
  fieldSpec: booleanFieldSpec({ renderingHint: 'toggle' }),
});

// This single Field is embedded with min=0 / max=∞ cardinality below to
// produce a multi-valued embedding from a single-valued reusable Field.
const researchInterest = textField({
  id: `${FIELDS}research-interest`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta('Research Interest', 'A single research interest or keyword.'),
  fieldSpec: textFieldSpec(),
});

// Controlled-term FIELD (not single-choice) — the user looks up any term
// from a configured ontology source. Compare with `academicRank`
// above: there, the option set is enumerated up front; here, the option
// set IS the ontology, and the rendered widget typically offers
// type-ahead lookup against an ontology service.
//
// `controlledTermFieldSpec` accepts one or more sources. The source
// variants are: OntologySource (any term in the ontology), BranchSource
// (any term in a sub-branch), ClassSource (any term among an enumerated
// set of classes), and ValueSetSource (any term in a named value set).
// Here we use a single OntologySource over MeSH.
const primaryResearchArea = controlledTermField({
  id: `${FIELDS}primary-research-area`,
  modelVersion: MODEL_VERSION,
  ...fieldMeta(
    'Primary Research Area',
    "The PI's primary research area, looked up from MeSH.",
  ),
  fieldSpec: controlledTermFieldSpec(
    ontologySource(
      ontologyReference({
        iri: MESH_ONTOLOGY_IRI,
        // displayHint surfaces an acronym and/or human-readable name to
        // the rendering UI; at least one of acronym/name is required.
        displayHint: ontologyDisplayHint({
          acronym: 'MeSH',
          name: 'Medical Subject Headings',
        }),
      }),
    ),
  ),
});

// ---- Presentation component (rich-text intro) -------------------------
//
// PresentationComponents contribute presentational structure to a rendered
// Template without producing instance data — they appear in the Template's
// `embedded` sequence alongside EmbeddedFields and EmbeddedTemplates but
// have no corresponding entry in a TemplateInstance's `values`.
//
// Note the metadata flavor: `artifactMeta` (plain ArtifactMetadata), not
// `meta` (SchemaArtifactMetadata). PresentationComponents are Artifacts
// but NOT SchemaArtifacts — they have no version / status / model-version.

const intro = richTextComponent({
  id: `${COMPONENTS}pi-intro`,
  modelVersion: MODEL_VERSION,
  metadata: artifactMeta('PI Intro', 'Introductory text shown above the PI form.'),
  html:
    '<p>Please provide details for the <strong>principal investigator</strong> ' +
    'of this study. Fields marked as required must be supplied; ORCID and ROR ' +
    'identifiers are recommended for unambiguous attribution.</p>',
});

// ---- The Template -----------------------------------------------------
//
// `template()` packages an identity, metadata, optional header/footer
// strings, and an ordered sequence of EmbeddedArtifacts. The `embedded`
// order is significant: conforming implementations MUST preserve it
// (grammar §Embedded Artifacts).
//
// Each entry is one of:
//   - embeddedXxxField(...) — wraps a reusable Field reference and pins
//     embedding-specific properties (requirement, cardinality, default,
//     property IRI, label override).
//   - embeddedTemplate(...) — embeds a reusable Template; supports
//     multi-cardinality template instances.
//   - embeddedPresentationComponent(...) — wraps a reusable PresentationComponent.
//
// Embedded properties:
//   - `key`           Local ASCII identifier; unique within this Template.
//                     Used as the join key in TemplateInstance values.
//   - `artifactRef`   The reusable artifact (or its typed reference). When
//                     a full artifact is passed, the constructor projects
//                     out its `.id`.
//   - `valueRequirement`
//                     'required' | 'recommended' | 'optional'. Defaults to
//                     'optional' when omitted (grammar §Requirements).
//   - `cardinality`   Permitted value count. Default is min:1 max:1.
//   - `defaultValue`  Family-typed; only allowed where the grammar permits.
//   - `property`      Semantic property IRI (e.g., a schema.org term) used
//                     to project instance values onto an RDF graph.
//   - `labelOverride` Template-local override of the reusable Field's label.

export const principalInvestigatorTemplate: Template = template({
  id: `${TEMPLATES}principal-investigator`,
  modelVersion: MODEL_VERSION,
  ...templateMeta(
    'Principal Investigator Details',
    'Identity, contact information, and institutional affiliation of a study PI.',
  ),
  // Human-facing schema-metadata positions accept a `MultilingualString`.
  // Any input shape works: a bare string (lang defaults to 'und'), a
  // `(value, lang)` tuple, an explicit `{value, lang}` object, an array of
  // entries, or — as shown here — a `{ [lang]: value }` map for compact
  // two-language localization.
  header: { en: 'Principal Investigator Details', fr: 'Détails du chercheur principal' },
  footer: 'All personal data is handled per the study’s data-management plan.',
  members: [
    embeddedPresentationComponent({
      key: 'intro',
      artifactRef: intro,
    }),

    embeddedTextField({
      key: 'full_name',
      artifactRef: fullName,
      valueRequirement: 'required',
      property: 'https://schema.org/name',
      // Select the field owner's curated "short" wording by key, rather than
      // the preferred prompt (which would be selected by omitting promptKey)
      // or a free-form promptOverride.
      promptKey: 'short',
    }),

    // Single-valued enum — instance values are EnumValues carrying a Token
    // matching one of the spec's permissibleValues.
    embeddedSingleValuedEnumField({
      key: 'academic_title',
      artifactRef: academicTitle,
      valueRequirement: 'required',
      property: {
        iri: 'https://schema.org/jobTitle',
        label: 'job title',
      },
    }),

    // Single-valued enum whose permissibleValues bind to ontology terms via
    // Meaning entries. Instance values still carry a Token; RDF projection
    // resolves the bound term IRI.
    embeddedSingleValuedEnumField({
      key: 'academic_rank',
      artifactRef: academicRank,
      valueRequirement: 'recommended',
      property: 'https://schema.org/Role',
      promptOverride: multilingualString('Academic Rank'),
    }),

    embeddedEmailField({
      key: 'email',
      artifactRef: email,
      valueRequirement: 'required',
      property: 'https://schema.org/email',
    }),
    embeddedPhoneNumberField({
      key: 'phone',
      artifactRef: phone,
      valueRequirement: 'optional',
      property: 'https://schema.org/telephone',
    }),
    embeddedOrcidField({
      key: 'orcid',
      artifactRef: orcid,
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      // promptOverride supplies a template-local prompt that overrides
      // the reusable Field's Prompt in this embedding context only.
      // Accepts any MultilingualString input shape; here we use the map form.
      promptOverride: multilingualString({ en: 'ORCID iD', fr: 'iD ORCID' }),
    }),

    // `defaultValue` is only allowed where the grammar permits (e.g., not
    // on AttributeValueField). Here a bare string is widened to a
    // SimpleLiteral at construction time (the Text family's
    // family-specific underlying type for the defaultValue slot).
    embeddedTextField({
      key: 'institution_name',
      artifactRef: institutionName,
      valueRequirement: 'required',
      defaultValue: 'Stanford University',
      property: 'https://schema.org/affiliation',
    }),
    embeddedRorField({
      key: 'institution_ror',
      artifactRef: institutionRor,
      valueRequirement: 'recommended',
      property: {
        iri: 'https://schema.org/affiliation',
        label: 'institution ROR',
      },
    }),
    embeddedTextField({
      key: 'department',
      artifactRef: department,
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    embeddedDateField({
      key: 'appointment_date',
      artifactRef: appointmentDate,
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Boolean embedding. Note: no `cardinality` slot is permitted on
    // EmbeddedBooleanField — booleans are inherently single-valued. The
    // `defaultValue` accepts a BooleanValue or a bare boolean shortcut
    // (here the bare `false`, which the constructor wraps).
    embeddedBooleanField({
      key: 'accepting_new_students',
      artifactRef: acceptingNewStudents,
      valueRequirement: 'optional',
      defaultValue: false,
    }),

    // Open-lookup controlled-term field — instance values reference any
    // term in the configured ontology, not a curated list.
    embeddedControlledTermField({
      key: 'primary_research_area',
      artifactRef: primaryResearchArea,
      valueRequirement: 'recommended',
      property: 'http://purl.org/dc/terms/subject',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    // Cardinality.max omitted ⇒ unbounded (grammar §Cardinality).
    embeddedTextField({
      key: 'research_interests',
      artifactRef: researchInterest,
      valueRequirement: 'optional',
      cardinality: cardinality({ min: 0 }),
      promptOverride: 'Research Interests',
      property: 'https://schema.org/knowsAbout',
    }),
  ],
});

// ---- Consuming the Template -------------------------------------------
//
// Iterate `template.members`, narrow on kind, and project to a small
// summary record. `isEmbeddedField` is a type guard, so the array below
// has element type `EmbeddedField` (with `valueRequirement`, `property`,
// `cardinality`, etc. accessible without further narrowing).

export interface EmbeddedFieldSummary {
  readonly key: string;
  readonly requirement: ValueRequirement;
  readonly propertyIri?: string;
}

export const fieldSummary: readonly EmbeddedFieldSummary[] =
  principalInvestigatorTemplate.members
    .filter(isEmbeddedField)
    .map((e) => {
      const out: {
        key: string;
        requirement: ValueRequirement;
        propertyIri?: string;
      } = {
        key: e.key,
        // ValueRequirement defaults to 'optional' when absent (grammar §Requirements).
        requirement: e.valueRequirement ?? DEFAULT_VALUE_REQUIREMENT,
      };
      if (e.property) out.propertyIri = e.property.iri.value;
      return out;
    });

// ---- A conforming TemplateInstance ------------------------------------
//
// TemplateInstance carries ArtifactMetadata (NOT SchemaArtifactMetadata —
// instances are not independently versioned) and references its Template
// by IRI. Each `fieldEntry(...)` call collects one or more typed Values
// for a single embedded-field key; the varargs form lets multi-valued
// fields supply all values within one FieldEntry.
//
// Cross-template alignment (that the keys actually identify embeddings,
// that values match the referenced Field's FieldSpec, that cardinality
// constraints are satisfied) is enforced at validation, not by the
// constructor — the structural layer only enforces that keys are unique
// (or, for templates, that a key is not used as both a FieldEntry site
// and a TemplateEntry site).

export const exampleInstance: TemplateInstance = templateInstance({
  id: templateInstanceId('https://example.org/cedar/instances/pi/0001'),
  modelVersion: MODEL_VERSION,
  metadata: artifactMeta(
    'PI: Jane Smith',
    'Example PI details for study EX-2026-001.',
  ),
  templateRef: principalInvestigatorTemplate.id,
  entries: [
    fieldEntry(
      'full_name',
      textValue('Jane Smith'),
    ),
    // Enum value: a Token referring to one of the spec's permissibleValues.
    fieldEntry('academic_title', enumValue('associate-professor')),
    // Same shape for an ontology-backed enum — RDF projection follows the
    // spec's Meaning bindings.
    fieldEntry('academic_rank', enumValue('associate-professor')),
    fieldEntry(
      'email',
      emailValue('jane.smith@stanford.edu'),
    ),
    fieldEntry(
      'orcid',
      orcidValue('https://orcid.org/0000-0002-1234-5678'),
    ),
    fieldEntry(
      'institution_name',
      textValue('Stanford University'),
    ),
    fieldEntry(
      'institution_ror',
      rorValue('https://ror.org/00f54p054'),
    ),
    fieldEntry(
      'appointment_date',
      fullDateValue('2018-09-01'),
    ),
    // Boolean value — the PI is accepting new students. The
    // `booleanValue()` constructor accepts a bare JavaScript boolean and
    // wraps it as a BooleanValue.
    fieldEntry(
      'accepting_new_students',
      booleanValue(true),
    ),
    // Open-lookup controlled-term value: a MeSH descriptor IRI plus its
    // English label. The `term` IRI here is the MeSH descriptor for
    // "Medical Informatics".
    fieldEntry(
      'primary_research_area',
      controlledTermValue({
        term: MESH_MEDICAL_INFORMATICS_TERM_IRI,
        label: 'Medical Informatics',
      }),
    ),
    // Multi-valued field — three TextValues collected in one FieldEntry.
    fieldEntry(
      'research_interests',
      textValue('biomedical informatics'),
      textValue('metadata standards'),
      textValue('FAIR data'),
    ),
  ],
});

// ---- Runnable demo ----------------------------------------------------
//
// When this file is executed directly (e.g. via `npm run example`), the
// template, the projected field summary, and the example instance are
// printed as JSON to stdout. The exports above are also importable
// programmatically — the guard below keeps importers (e.g. tests) silent.

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== Template ===');
  console.log(JSON.stringify(serialize(principalInvestigatorTemplate), null, 2));
  console.log('\n=== Field summary ===');
  console.log(JSON.stringify(fieldSummary, null, 2));
  console.log('\n=== Example instance ===');
  console.log(JSON.stringify(serialize(exampleInstance), null, 2));
}
