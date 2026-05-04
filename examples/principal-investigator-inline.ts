// =====================================================================
// Principal Investigator details — inline-Field variant.
// =====================================================================
//
// Same Template as `principal-investigator.ts`, written with each reusable
// Field artifact constructed inline at its embedding site rather than via
// a top-level `const`. For a one-off, single-use template this is denser
// and keeps each embedding self-contained; for a template that reuses the
// same Field across multiple embeddings, the const-binding form is
// preferable because the Field artifact would otherwise be reconstructed
// each time.
//
// Comments here are intentionally lighter than in the const-binding
// variant — see that file for the per-construct rationale (metadata
// flavors, FieldSpec families, embedded-property semantics, etc.). This
// file only documents what is specific to the inline style.

import {
  artifactMetadata,
  type ArtifactMetadata,
  cardinality,
  controlledTermChoiceOption,
  controlledTermField,
  controlledTermFieldSpec,
  controlledTermSingleChoiceFieldSpec,
  controlledTermValue,
  dateField,
  dateFieldSpec,
  descriptiveMetadata,
  emailField,
  emailFieldSpec,
  embeddedControlledTermField,
  embeddedDateField,
  embeddedEmailField,
  embeddedOrcidField,
  embeddedPhoneNumberField,
  embeddedPresentationComponent,
  embeddedRorField,
  embeddedSingleChoiceField,
  embeddedTextField,
  labelOverride,
  literalChoiceOption,
  literalSingleChoiceFieldSpec,
  ontologyDisplayHint,
  ontologyReference,
  ontologySource,
  orcidField,
  orcidFieldSpec,
  phoneNumberField,
  phoneNumberFieldSpec,
  richTextComponent,
  rorField,
  rorFieldSpec,
  schemaArtifactMetadata,
  type SchemaArtifactMetadata,
  schemaVersioning,
  serialize,
  singleChoiceField,
  template,
  type Template,
  temporalProvenance,
  textField,
  textFieldSpec,
} from '../src/index.js';

// ---- IRI bases --------------------------------------------------------

const BASE = 'https://example.org/cedar/';
const TEMPLATES = `${BASE}templates/`;
const FIELDS = `${BASE}fields/`;
const COMPONENTS = `${BASE}components/`;

// Academic-rank terms drawn from the OBO Role Ontology (RoleO).
const ROLEO_FULL_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000677';
const ROLEO_ASSISTANT_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000678';
const ROLEO_ASSOCIATE_PROFESSOR = 'http://purl.obolibrary.org/obo/RoleO_0000679';

// MeSH ontology, used by the open-lookup controlled-term field below.
const MESH_ONTOLOGY = 'http://id.nlm.nih.gov/mesh/';

// ---- Shared metadata helpers ------------------------------------------
//
// Two helpers, mirroring the two metadata flavors in the model:
//
//   - artifactMeta: ArtifactMetadata (descriptive + provenance + annotations).
//                   Used by PresentationComponents and TemplateInstances —
//                   artifacts that carry no schema versioning.
//   - meta:         SchemaArtifactMetadata (artifact metadata + versioning).
//                   Required by Field and Template.

const author = 'https://orcid.org/0000-0002-1825-0097';
const provenanceTimestamps = {
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
};

function artifactMeta(name: string, description: string): ArtifactMetadata {
  return artifactMetadata({
    descriptiveMetadata: descriptiveMetadata({ name, description }),
    provenance: temporalProvenance(provenanceTimestamps),
  });
}

function meta(name: string, description: string): SchemaArtifactMetadata {
  return schemaArtifactMetadata({
    artifact: artifactMeta(name, description),
    versioning: schemaVersioning({
      version: '1.0.0',
      status: 'draft',
    }),
  });
}

// CEDAR structural-model version, recorded on every concrete artifact.
const MODEL_VERSION = '0.1.0';

// ---- The Template -----------------------------------------------------
//
// `template()` packages an identity, metadata, optional header/footer
// strings, and an ordered sequence of EmbeddedArtifacts. The order of
// `embedded` is significant: conforming implementations MUST preserve it
// (grammar §Embedded Artifacts).
//
// In this style each EmbeddedXxx is built directly around a freshly
// constructed reusable artifact. The reusable artifact is unnamed at the
// JavaScript level — it lives only as the value of `reference` — so it
// cannot be referenced from elsewhere in the file. Compare with the
// const-binding variant for cases where the same Field would otherwise be
// embedded more than once.

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
    // PresentationComponent — contributes structure to the rendered form
    // but produces no instance data.
    embeddedPresentationComponent({
      key: 'intro',
      reference: richTextComponent({
        id: `${COMPONENTS}pi-intro`,
        modelVersion: MODEL_VERSION,
        metadata: artifactMeta('PI Intro', 'Introductory text shown above the PI form.'),
        html:
          '<p>Please provide details for the <strong>principal investigator</strong> ' +
          'of this study. Fields marked as required must be supplied; ORCID and ROR ' +
          'identifiers are recommended for unambiguous attribution.</p>',
      }),
    }),

    // Plain text, with a minimum-length constraint.
    embeddedTextField({
      key: 'full_name',
      reference: textField({
        id: `${FIELDS}full-name`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Full Name', 'Full legal name of the principal investigator.'),
        fieldSpec: textFieldSpec({
          minLength: 1,
        }),
      }),
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),

    // Literal single-choice — option labels appear verbatim in instances
    // as langTaggedLiterals.
    embeddedSingleChoiceField({
      key: 'academic_title',
      reference: singleChoiceField({
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
      }),
      valueRequirement: 'required',
      // The (iri, label) object form for `property` adds an optional
      // human-readable label for the semantic property.
      property: {
        iri: 'https://schema.org/jobTitle',
        label: 'job title',
      },
    }),

    // Controlled-term single-choice — selecting an option yields a
    // ControlledTermValue (term IRI + optional label/notation/preferred
    // label) rather than a literal string. Term IRIs here resolve into
    // the OBO Role Ontology (RoleO).
    embeddedSingleChoiceField({
      key: 'academic_rank',
      reference: singleChoiceField({
        id: `${FIELDS}academic-rank`,
        modelVersion: MODEL_VERSION,
        metadata: meta(
          'Academic Rank',
          'Academic rank drawn from the OBO Role Ontology (RoleO).',
        ),
        fieldSpec: controlledTermSingleChoiceFieldSpec({
          options: [
            controlledTermChoiceOption(
              controlledTermValue({ term: ROLEO_FULL_PROFESSOR, label: 'Professor' }),
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
      }),
      valueRequirement: 'recommended',
      property: 'https://schema.org/Role',
      labelOverride: labelOverride({ label: 'Academic Rank' }),
    }),

    // Authority-style fields — their FieldSpec constructors are nullary
    // because the family itself fixes the value shape (e.g., an EmailValue
    // is a syntactically valid email).
    embeddedEmailField({
      key: 'email',
      reference: emailField({
        id: `${FIELDS}email`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Email Address', 'Primary work email.'),
        fieldSpec: emailFieldSpec(),
      }),
      valueRequirement: 'required',
      property: 'https://schema.org/email',
    }),

    embeddedPhoneNumberField({
      key: 'phone',
      reference: phoneNumberField({
        id: `${FIELDS}phone`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Phone Number', 'Primary work phone, in international format.'),
        fieldSpec: phoneNumberFieldSpec(),
      }),
      valueRequirement: 'optional',
      property: 'https://schema.org/telephone',
    }),

    embeddedOrcidField({
      key: 'orcid',
      reference: orcidField({
        id: `${FIELDS}orcid`,
        modelVersion: MODEL_VERSION,
        metadata: meta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
        fieldSpec: orcidFieldSpec(),
      }),
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      // Template-local label override; applies to this embedding only.
      // Each label position accepts any MultilingualString input shape;
      // here we use the map form for the primary label.
      labelOverride: labelOverride({
        label: { en: 'ORCID iD', fr: 'iD ORCID' },
        altLabels: [{ en: 'Open Researcher and Contributor iD' }],
      }),
    }),

    // `defaultValue` accepts a bare string here; the constructor widens
    // it into a SimpleLiteral (the family-specific underlying type for
    // Text fields' defaultValue slot).
    embeddedTextField({
      key: 'institution_name',
      reference: textField({
        id: `${FIELDS}institution-name`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Institution Name', 'Name of the home institution.'),
        fieldSpec: textFieldSpec(),
      }),
      valueRequirement: 'required',
      defaultValue: 'Stanford University',
      property: 'https://schema.org/affiliation',
    }),

    embeddedRorField({
      key: 'institution_ror',
      reference: rorField({
        id: `${FIELDS}institution-ror`,
        modelVersion: MODEL_VERSION,
        metadata: meta(
          'Institution ROR',
          'Research Organization Registry identifier for the home institution.',
        ),
        fieldSpec: rorFieldSpec(),
      }),
      valueRequirement: 'recommended',
      property: {
        iri: 'https://schema.org/affiliation',
        label: 'institution ROR',
      },
    }),

    embeddedTextField({
      key: 'department',
      reference: textField({
        id: `${FIELDS}department`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Department', 'Department or division within the institution.'),
        fieldSpec: textFieldSpec(),
      }),
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    // Date constrained to xsd:date (full date). DateFieldSpec also admits
    // partial-date values — see grammar §Field Specs.
    embeddedDateField({
      key: 'appointment_date',
      reference: dateField({
        id: `${FIELDS}appointment-date`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Appointment Date', 'Start date of current appointment.'),
        fieldSpec: dateFieldSpec({ dateValueType: 'fullDate' }),
      }),
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Open-lookup controlled-term field — instance values reference any
    // term in the configured ontology (here MeSH), not a curated list.
    // Compare with `academic_rank` above, which enumerates its options.
    embeddedControlledTermField({
      key: 'primary_research_area',
      reference: controlledTermField({
        id: `${FIELDS}primary-research-area`,
        modelVersion: MODEL_VERSION,
        metadata: meta(
            'Primary Research Area',
            "The PI's primary research area, looked up from MeSH.",
        ),
        fieldSpec: controlledTermFieldSpec(
            ontologySource(
                ontologyReference({
                  iri: MESH_ONTOLOGY,
                  displayHint: ontologyDisplayHint({
                    acronym: 'MeSH',
                    name: 'Medical Subject Headings',
                  }),
                }),
            ),
        ),
      }),
      valueRequirement: 'recommended',
      property: 'http://purl.org/dc/terms/subject',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    // Cardinality.max omitted ⇒ unbounded (grammar §Cardinality).
    embeddedTextField({
      key: 'research_interests',
      reference: textField({
        id: `${FIELDS}research-interest`,
        modelVersion: MODEL_VERSION,
        metadata: meta('Research Interest', 'A single research interest or keyword.'),
        fieldSpec: textFieldSpec(),
      }),
      valueRequirement: 'optional',
      cardinality: cardinality({ min: 0 }),
      labelOverride: labelOverride({ label: 'Research Interests' }),
      property: 'https://schema.org/knowsAbout',
    }),
  ],
});

// ---- Runnable demo ----------------------------------------------------
//
// When this file is executed directly (e.g. via `npm run example:inline`),
// the constructed Template is printed as JSON to stdout.

console.log(JSON.stringify(serialize(principalInvestigatorTemplate), null, 2));
