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
  descriptiveMetadata,
  embeddedControlledTermField,
  embeddedDateField,
  embeddedEmailField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedRorField,
  embeddedSingleChoiceField,
  embeddedTextField,
  emailField as makeEmailField,
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
  orcidField as makeOrcidField,
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

// `emailField` and `orcidField` are imported under aliases because, with the
// "Field"-suffixed variable convention used below, the local Field-artifact
// constants would otherwise shadow the constructor functions of the same name.

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

const author = 'https://orcid.org/0000-0001-2345-6789';
const provenanceTimestamps = {
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
};

// Returns plain ArtifactMetadata (no version / status / model-version).
function artifactMeta(name: string, description: string): ArtifactMetadata {
  return artifactMetadata({
    descriptiveMetadata: descriptiveMetadata({ name, description }),
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
      modelVersion: '0.1.0',
    }),
  });
}

// ---- Reusable Field artifacts -----------------------------------------
//
// Each `const` below is a self-contained reusable Field artifact: an
// identity (Field IRI), schema metadata, and a typed FieldSpec describing
// the family-specific shape. None of them mention how they will appear in
// a Template — that is decided per-embedding below.

// Plain text field with a minimum length of 1. `textFieldSpec()` accepts an
// optional init object (omit it to allow any non-empty string).
const fullNameField = textField({
  id: `${FIELDS}full-name`,
  metadata: meta('Full Name', 'Full legal name of the principal investigator.'),
  fieldSpec: textFieldSpec({
    minLength: 1,
  }),
});

// Single-choice field whose options are LITERAL strings. `literalChoiceOption`
// accepts a (text, lang) shortcut that wraps as a langStringLiteral; pass a
// fully-built Literal directly for typed-string options. The `default: true`
// flag marks the entry preselected when the field is rendered.
//
// Use literal-choice when the option set is small, ad-hoc, and not drawn
// from a published vocabulary. Compare with `academicRankField` below,
// which is backed by an ontology.
const academicTitleField = singleChoiceField({
  id: `${FIELDS}academic-title`,
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
const academicRankField = singleChoiceField({
  id: `${FIELDS}academic-rank`,
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

const emailField = makeEmailField({
  id: `${FIELDS}email`,
  metadata: meta('Email Address', 'Primary work email.'),
  fieldSpec: emailFieldSpec(),
});

const phoneField = phoneNumberField({
  id: `${FIELDS}phone`,
  metadata: meta('Phone Number', 'Primary work phone, in international format.'),
  fieldSpec: phoneNumberFieldSpec(),
});

const orcidField = makeOrcidField({
  id: `${FIELDS}orcid`,
  metadata: meta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
  fieldSpec: orcidFieldSpec(),
});

// Plain text again — no length constraint here, because the institution
// name field happens to have no validation requirement of its own.
const institutionNameField = textField({
  id: `${FIELDS}institution-name`,
  metadata: meta('Institution Name', 'Name of the home institution.'),
  fieldSpec: textFieldSpec(),
});

const institutionRorField = rorField({
  id: `${FIELDS}institution-ror`,
  metadata: meta(
    'Institution ROR',
    'Research Organization Registry identifier for the home institution.',
  ),
  fieldSpec: rorFieldSpec(),
});

const departmentField = textField({
  id: `${FIELDS}department`,
  metadata: meta('Department', 'Department or division within the institution.'),
  fieldSpec: textFieldSpec(),
});

// Date field constrained to FULL dates (xsd:date). Other DateFieldSpec
// values can pin partial dates (year, year+month) — see grammar §Field Specs.
const appointmentDateField = dateField({
  id: `${FIELDS}appointment-date`,
  metadata: meta('Appointment Date', 'Start date of current appointment.'),
  fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
});

// This single Field is embedded with min=0 / max=∞ cardinality below to
// produce a multi-valued embedding from a single-valued reusable Field.
const researchInterestField = textField({
  id: `${FIELDS}research-interest`,
  metadata: meta('Research Interest', 'A single research interest or keyword.'),
  fieldSpec: textFieldSpec(),
});

// Controlled-term FIELD (not single-choice) — the user looks up any term
// from a configured ontology source. Compare with `academicRankField`
// above: there, the option set is enumerated up front; here, the option
// set IS the ontology, and the rendered widget typically offers
// type-ahead lookup against an ontology service.
//
// `controlledTermFieldSpec` accepts one or more sources. The source
// variants are: OntologySource (any term in the ontology), BranchSource
// (any term in a sub-branch), ClassSource (any term among an enumerated
// set of classes), and ValueSetSource (any term in a named value set).
// Here we use a single OntologySource over MeSH.
const primaryResearchAreaField = controlledTermField({
  id: `${FIELDS}primary-research-area`,
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

const introComponent = richTextComponent({
  id: `${COMPONENTS}pi-intro`,
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
  metadata: meta(
    'Principal Investigator Details',
    'Identity, contact information, and institutional affiliation of a study PI.',
  ),
  header: 'Principal Investigator Details',
  footer: 'All personal data is handled per the study’s data-management plan.',
  embedded: [
    embeddedPresentationComponent({
      key: 'intro',
      reference: introComponent,
    }),

    embeddedTextField({
      key: 'full_name',
      reference: fullNameField,
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),

    // Literal single-choice — the option labels appear verbatim in instance
    // values as langStringLiterals.
    embeddedSingleChoiceField({
      key: 'academic_title',
      reference: academicTitleField,
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
      reference: academicRankField,
      valueRequirement: 'recommended',
      property: 'https://schema.org/Role',
      labelOverride: labelOverride({ label: 'Academic Rank' }),
    }),

    embeddedEmailField({
      key: 'email',
      reference: emailField,
      valueRequirement: 'required',
      property: 'https://schema.org/email',
    }),
    embeddedPhoneNumberField({
      key: 'phone',
      reference: phoneField,
      valueRequirement: 'optional',
      property: 'https://schema.org/telephone',
    }),
    embeddedOrcidField({
      key: 'orcid',
      reference: orcidField,
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      // labelOverride supplies template-local labels that override the
      // reusable Field's metadata.name in this embedding context only.
      labelOverride: labelOverride({
        label: 'ORCID iD',
        altLabels: ['Open Researcher and Contributor iD'],
      }),
    }),

    // `defaultValue` is only allowed where the grammar permits (e.g., not
    // on AttributeValueField). Here a bare string is widened to a
    // TextDefaultValue at construction time.
    embeddedTextField({
      key: 'institution_name',
      reference: institutionNameField,
      valueRequirement: 'required',
      defaultValue: 'Stanford University',
      property: 'https://schema.org/affiliation',
    }),
    embeddedRorField({
      key: 'institution_ror',
      reference: institutionRorField,
      valueRequirement: 'recommended',
      property: {
        iri: 'https://schema.org/affiliation',
        label: 'institution ROR',
      },
    }),
    embeddedTextField({
      key: 'department',
      reference: departmentField,
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    embeddedDateField({
      key: 'appointment_date',
      reference: appointmentDateField,
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Open-lookup controlled-term field — instance values reference any
    // term in the configured ontology, not a curated list.
    embeddedControlledTermField({
      key: 'primary_research_area',
      reference: primaryResearchAreaField,
      valueRequirement: 'recommended',
      property: 'http://purl.org/dc/terms/subject',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    // Cardinality.max omitted ⇒ unbounded (grammar §Cardinality).
    embeddedTextField({
      key: 'research_interests',
      reference: researchInterestField,
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
    // Literal-choice value: a langStringLiteral matching one of the option
    // labels. The (text, lang) shortcut wraps to a LangStringLiteral.
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
