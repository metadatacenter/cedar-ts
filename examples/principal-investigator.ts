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
//   3. Consume the Template — iterate `template.embedded`, narrow on kind,
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
  artifactMetadata,
  cardinality,
  controlledTermChoiceOption,
  controlledTermField,
  controlledTermFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  controlledTermValue,
  dateField,
  dateFieldSpec,
  DEFAULT_VALUE_REQUIREMENT,
  embeddedControlledTermField,
  embeddedDateField,
  embeddedEmailField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedRorField,
  embeddedSingleChoiceField,
  embeddedTextField,
  emailField,
  emailFieldSpec,
  emailValue,
  fieldValue,
  fullDateValue,
  isEmbeddedField,
  labelOverride,
  literalChoiceOption,
  literalChoiceValue,
  literalSingleChoiceFieldSpec,
  ontologyDisplayHint,
  ontologyReference,
  ontologySource,
  orcidField,
  orcidFieldSpec,
  orcidValue,
  phoneNumberField,
  phoneNumberFieldSpec,
  richTextComponent,
  rorField,
  rorFieldSpec,
  rorValue,
  schemaArtifactMetadata,
  schemaVersioning,
  serialize,
  singleChoiceField,
  template,
  templateInstance,
  templateInstanceId,
  temporalProvenance,
  textField,
  textFieldSpec,
  textValue,
  type ArtifactMetadata,
  type SchemaArtifactMetadata,
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
//   - ArtifactMetadata: descriptive metadata + provenance + annotations.
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
const provenanceTimestamps = {
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
};

// Returns plain ArtifactMetadata (no version / status / model-version).
function artifactMeta(name: string, description: string): ArtifactMetadata {
  return artifactMetadata({
    name,
    description,
    provenance: temporalProvenance(provenanceTimestamps),
  });
}

// Returns SchemaArtifactMetadata. Required by every Field and Template.
function meta(name: string, description: string): SchemaArtifactMetadata {
  return schemaArtifactMetadata({
    artifact: artifactMeta(name, description),
    versioning: schemaVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
  });
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
const fullName = textField({
  id: `${FIELDS}full-name`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Full Name', 'Full legal name of the principal investigator.'),
  fieldSpec: textFieldSpec({
    minLength: 1,
  }),
});

// Single-choice field whose options are LITERAL strings. `literalChoiceOption`
// accepts a (text, lang) shortcut that wraps as a langTaggedLiteral; pass a
// fully-built Literal directly for typed-string options. The `default: true`
// flag marks the entry preselected when the field is rendered.
//
// Use literal-choice when the option set is small, ad-hoc, and not drawn
// from a published vocabulary. Compare with `academicRank` below,
// which is backed by an ontology.
const academicTitle = singleChoiceField({
  id: `${FIELDS}academic-title`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Academic Title', 'Academic rank or position (literal label).'),
  fieldSpec: literalSingleChoiceFieldSpec({
    options: [
      literalChoiceOption('Professor', 'en'),
      literalChoiceOption('Associate Professor', 'en', { default: true }),
      literalChoiceOption('Assistant Professor', 'en'),
      literalChoiceOption('Lecturer', 'en'),
      literalChoiceOption('Research Scientist', 'en'),
    ],
  }),
});

// Single-choice field whose options are CONTROLLED-TERM values drawn from a
// published vocabulary. Each option pairs an IRI (the term identifier) with
// a human-readable label. Selecting an option yields a ControlledTermValue
// at the instance, not a plain string — see `exampleInstance` below.
//
// The IRIs here resolve to terms in the OBO Role Ontology (RoleO).
const academicRank = singleChoiceField({
  id: `${FIELDS}academic-rank`,
  modelVersion: MODEL_VERSION,
  metadata: meta(
    'Academic Rank',
    'Academic rank drawn from the OBO Role Ontology (RoleO).',
  ),
  fieldSpec: controlledTermSingleChoiceFieldSpec({
    options: [
      controlledTermChoiceOption(
        controlledTermValue(
            {
              term: ROLEO_FULL_PROFESSOR,
              label: 'Full Professor'
            }),
      ),
      controlledTermChoiceOption(
        controlledTermValue({
          term: ROLEO_ASSOCIATE_PROFESSOR,
          label: 'Associate Professor',
        }),
        { default: true },
      ),
      controlledTermChoiceOption(
        controlledTermValue({
          term: ROLEO_ASSISTANT_PROFESSOR,
          label: 'Assistant Professor',
        }),
      ),
    ],
  }),
});

// Authority-style fields below carry no extra schema beyond their family.
// Their FieldSpec constructors are nullary because the family itself fixes
// the value shape (e.g., an EmailValue is a syntactically valid email).

const email = emailField({
  id: `${FIELDS}email`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Email Address', 'Primary work email.'),
  fieldSpec: emailFieldSpec(),
});

const phone = phoneNumberField({
  id: `${FIELDS}phone`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Phone Number', 'Primary work phone, in international format.'),
  fieldSpec: phoneNumberFieldSpec(),
});

const orcid = orcidField({
  id: `${FIELDS}orcid`,
  modelVersion: MODEL_VERSION,
  metadata: meta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
  fieldSpec: orcidFieldSpec(),
});

// Plain text again — no length constraint here, because the institution
// name field happens to have no validation requirement of its own.
const institutionName = textField({
  id: `${FIELDS}institution-name`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Institution Name', 'Name of the home institution.'),
  fieldSpec: textFieldSpec(),
});

const institutionRor = rorField({
  id: `${FIELDS}institution-ror`,
  modelVersion: MODEL_VERSION,
  metadata: meta(
    'Institution ROR',
    'Research Organization Registry identifier for the home institution.',
  ),
  fieldSpec: rorFieldSpec(),
});

const department = textField({
  id: `${FIELDS}department`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Department', 'Department or division within the institution.'),
  fieldSpec: textFieldSpec(),
});

// Date field constrained to FULL dates (xsd:date). Other DateFieldSpec
// values can pin partial dates (year, year+month) — see grammar §Field Specs.
const appointmentDate = dateField({
  id: `${FIELDS}appointment-date`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Appointment Date', 'Start date of current appointment.'),
  fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
});

// This single Field is embedded with min=0 / max=∞ cardinality below to
// produce a multi-valued embedding from a single-valued reusable Field.
const researchInterest = textField({
  id: `${FIELDS}research-interest`,
  modelVersion: MODEL_VERSION,
  metadata: meta('Research Interest', 'A single research interest or keyword.'),
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
  metadata: meta(
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
//   - `reference`     The reusable artifact (or its typed reference). When
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
  metadata: meta(
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
  embedded: [
    embeddedPresentationComponent({
      key: 'intro',
      reference: intro,
    }),

    embeddedTextField({
      key: 'full_name',
      reference: fullName,
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),

    // Literal single-choice — the option labels appear verbatim in instance
    // values as langTaggedLiterals.
    embeddedSingleChoiceField({
      key: 'academic_title',
      reference: academicTitle,
      valueRequirement: 'required',
      // The `property` slot accepts a bare-string IRI; the (iri, label)
      // object form below adds an optional human-readable label for the
      // semantic property — useful for renderers that surface RDF predicate
      // information in the UI.
      property: {
        iri: 'https://schema.org/jobTitle',
        label: 'job title',
      },
    }),

    // Controlled-term single-choice — the selected option is encoded as a
    // ControlledTermValue (term IRI plus optional label/notation/preferred
    // label) rather than a literal string.
    embeddedSingleChoiceField({
      key: 'academic_rank',
      reference: academicRank,
      valueRequirement: 'recommended',
      property: 'https://schema.org/Role',
      labelOverride: labelOverride({ label: 'Academic Rank' }),
    }),

    embeddedEmailField({
      key: 'email',
      reference: email,
      valueRequirement: 'required',
      property: 'https://schema.org/email',
    }),
    embeddedPhoneNumberField({
      key: 'phone',
      reference: phone,
      valueRequirement: 'optional',
      property: 'https://schema.org/telephone',
    }),
    embeddedOrcidField({
      key: 'orcid',
      reference: orcid,
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      // labelOverride supplies template-local labels that override the
      // reusable Field's metadata.name in this embedding context only.
      // Each label position accepts any MultilingualString input shape;
      // here we use the map form for the primary label.
      labelOverride: labelOverride({
        label: { en: 'ORCID iD', fr: 'iD ORCID' },
        altLabels: [{ en: 'Open Researcher and Contributor iD' }],
      }),
    }),

    // `defaultValue` is only allowed where the grammar permits (e.g., not
    // on AttributeValueField). Here a bare string is widened to a
    // SimpleLiteral at construction time (the Text family's
    // family-specific underlying type for the defaultValue slot).
    embeddedTextField({
      key: 'institution_name',
      reference: institutionName,
      valueRequirement: 'required',
      defaultValue: 'Stanford University',
      property: 'https://schema.org/affiliation',
    }),
    embeddedRorField({
      key: 'institution_ror',
      reference: institutionRor,
      valueRequirement: 'recommended',
      property: {
        iri: 'https://schema.org/affiliation',
        label: 'institution ROR',
      },
    }),
    embeddedTextField({
      key: 'department',
      reference: department,
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    embeddedDateField({
      key: 'appointment_date',
      reference: appointmentDate,
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Open-lookup controlled-term field — instance values reference any
    // term in the configured ontology, not a curated list.
    embeddedControlledTermField({
      key: 'primary_research_area',
      reference: primaryResearchArea,
      valueRequirement: 'recommended',
      property: 'http://purl.org/dc/terms/subject',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    // Cardinality.max omitted ⇒ unbounded (grammar §Cardinality).
    embeddedTextField({
      key: 'research_interests',
      reference: researchInterest,
      valueRequirement: 'optional',
      cardinality: cardinality({ min: 0 }),
      labelOverride: labelOverride({ label: 'Research Interests' }),
      property: 'https://schema.org/knowsAbout',
    }),
  ],
});

// ---- Consuming the Template -------------------------------------------
//
// Iterate `template.embedded`, narrow on kind, and project to a small
// summary record. `isEmbeddedField` is a type guard, so the array below
// has element type `EmbeddedField` (with `valueRequirement`, `property`,
// `cardinality`, etc. accessible without further narrowing).

export interface EmbeddedFieldSummary {
  readonly key: string;
  readonly requirement: ValueRequirement;
  readonly propertyIri?: string;
}

export const fieldSummary: readonly EmbeddedFieldSummary[] =
  principalInvestigatorTemplate.embedded
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
// by IRI. Each `fieldValue(...)` call collects one or more typed Values
// for a single embedded-field key; the varargs form lets multi-valued
// fields supply all values within one FieldValue.
//
// Cross-template alignment (that the keys actually identify embeddings,
// that values match the referenced Field's FieldSpec, that cardinality
// constraints are satisfied) is enforced at validation, not by the
// constructor — the structural layer only enforces that keys are unique
// (or, for templates, that a key is not used as both a FieldValue site
// and a NestedTemplateInstance site).

export const exampleInstance: TemplateInstance = templateInstance({
  id: templateInstanceId('https://example.org/cedar/instances/pi/0001'),
  modelVersion: MODEL_VERSION,
  metadata: artifactMeta(
    'PI: Jane Smith',
    'Example PI details for study EX-2026-001.',
  ),
  templateRef: principalInvestigatorTemplate.id,
  values: [
    fieldValue(
      'full_name',
      textValue('Jane Smith'),
    ),
    // Literal-choice value: a langTaggedLiteral matching one of the option
    // labels. The (text, lang) shortcut wraps to a LangTaggedLiteral.
    fieldValue(
      'academic_title',
      literalChoiceValue('Associate Professor', 'en'),
    ),
    // Controlled-term value: an IRI from the academic-rank ontology, plus
    // an optional human-readable label.
    fieldValue(
      'academic_rank',
      controlledTermValue({
        term: ROLEO_ASSOCIATE_PROFESSOR,
        label: 'Associate Professor',
      }),
    ),
    fieldValue(
      'email',
      emailValue('jane.smith@stanford.edu'),
    ),
    fieldValue(
      'orcid',
      orcidValue('https://orcid.org/0000-0002-1234-5678'),
    ),
    fieldValue(
      'institution_name',
      textValue('Stanford University'),
    ),
    fieldValue(
      'institution_ror',
      rorValue('https://ror.org/00f54p054'),
    ),
    fieldValue(
      'appointment_date',
      fullDateValue('2018-09-01'),
    ),
    // Open-lookup controlled-term value: a MeSH descriptor IRI plus its
    // English label. The `term` IRI here is the MeSH descriptor for
    // "Medical Informatics".
    fieldValue(
      'primary_research_area',
      controlledTermValue({
        term: MESH_MEDICAL_INFORMATICS_TERM_IRI,
        label: 'Medical Informatics',
      }),
    ),
    // Multi-valued field — three TextValues collected in one FieldValue.
    fieldValue(
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
// programmatically.

console.log('=== Template ===');
console.log(JSON.stringify(serialize(principalInvestigatorTemplate), null, 2));
console.log('\n=== Field summary ===');
console.log(JSON.stringify(fieldSummary, null, 2));
console.log('\n=== Example instance ===');
console.log(JSON.stringify(serialize(exampleInstance), null, 2));
