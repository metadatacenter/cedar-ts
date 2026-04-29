// Principal Investigator details — inline-Field variant.
//
// Same template as principal-investigator.ts, written with each reusable
// Field artifact constructed inline at its embedding site rather than via a
// top-level `const`. For a one-off, single-use template this is denser and
// keeps each embedding self-contained; for a template that reuses the same
// Field across multiple embeddings, the const-binding form is preferable
// because the Field artifact would otherwise be reconstructed each time.

import {
  artifactMetadata,
  cardinality,
  dateField,
  dateFieldSpec,
  descriptiveMetadata,
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
  labelOverride,
  literalChoiceOption,
  literalSingleChoiceFieldSpec,
  orcidField,
  orcidFieldSpec,
  phoneNumberField,
  phoneNumberFieldSpec,
  richTextComponent,
  rorField,
  rorFieldSpec,
  schemaArtifactMetadata,
  schemaVersioning,
  singleChoiceField,
  template,
  temporalProvenance,
  textField,
  textFieldSpec,
  unboundedCardinality,
  type ArtifactMetadata,
  type SchemaArtifactMetadata,
  type Template,
} from '../src/index.js';

// ---- IRI bases --------------------------------------------------------

const BASE = 'https://example.org/cedar/';
const TEMPLATES = `${BASE}templates/`;
const FIELDS = `${BASE}fields/`;
const COMPONENTS = `${BASE}components/`;

// ---- Shared metadata --------------------------------------------------

const author = 'https://orcid.org/0000-0001-2345-6789';
const provenanceTimestamps = {
  createdOn: '2026-04-29T10:00:00Z',
  createdBy: author,
  modifiedOn: '2026-04-29T10:00:00Z',
  modifiedBy: author,
};

function artifactMeta(name: string, description: string): ArtifactMetadata {
  return artifactMetadata({
    descriptive: descriptiveMetadata({ name, description }),
    provenance: temporalProvenance(provenanceTimestamps),
  });
}

// SchemaArtifactMetadata: required by Field and Template (reusable schema
// artifacts carry version, status, and model version).
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

// ---- The Template -----------------------------------------------------

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
      reference: richTextComponent({
        id: `${COMPONENTS}pi-intro`,
        metadata: artifactMeta('PI Intro', 'Introductory text shown above the PI form.'),
        htmlContent:
          '<p>Please provide details for the <strong>principal investigator</strong> ' +
          'of this study. Fields marked as required must be supplied; ORCID and ROR ' +
          'identifiers are recommended for unambiguous attribution.</p>',
      }),
    }),

    embeddedTextField({
      key: 'full_name',
      reference: textField({
        id: `${FIELDS}full-name`,
        metadata: meta('Full Name', 'Full legal name of the principal investigator.'),
        fieldSpec: textFieldSpec({
          minLength: { kind: 'non_negative_integer', value: '1' },
        }),
      }),
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),

    embeddedSingleChoiceField({
      key: 'academic_title',
      reference: singleChoiceField({
        id: `${FIELDS}academic-title`,
        metadata: meta('Academic Title', 'Academic rank or position.'),
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
      property: {
        propertyIri: 'https://schema.org/jobTitle',
        propertyLabel: 'job title',
      },
    }),

    embeddedEmailField({
      key: 'email',
      reference: emailField({
        id: `${FIELDS}email`,
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
        metadata: meta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
        fieldSpec: orcidFieldSpec(),
      }),
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      labelOverride: labelOverride({
        label: 'ORCID iD',
        alternativeLabels: ['Open Researcher and Contributor iD'],
      }),
    }),

    embeddedTextField({
      key: 'institution_name',
      reference: textField({
        id: `${FIELDS}institution-name`,
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
        metadata: meta(
          'Institution ROR',
          'Research Organization Registry identifier for the home institution.',
        ),
        fieldSpec: rorFieldSpec(),
      }),
      valueRequirement: 'recommended',
      property: {
        propertyIri: 'https://schema.org/affiliation',
        propertyLabel: 'institution ROR',
      },
    }),

    embeddedTextField({
      key: 'department',
      reference: textField({
        id: `${FIELDS}department`,
        metadata: meta('Department', 'Department or division within the institution.'),
        fieldSpec: textFieldSpec(),
      }),
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    embeddedDateField({
      key: 'appointment_date',
      reference: dateField({
        id: `${FIELDS}appointment-date`,
        metadata: meta('Appointment Date', 'Start date of current appointment.'),
        fieldSpec: dateFieldSpec({ dateValueType: 'full_date' }),
      }),
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    embeddedTextField({
      key: 'research_interests',
      reference: textField({
        id: `${FIELDS}research-interest`,
        metadata: meta('Research Interest', 'A single research interest or keyword.'),
        fieldSpec: textFieldSpec(),
      }),
      valueRequirement: 'optional',
      cardinality: cardinality({ min: 0, max: unboundedCardinality }),
      labelOverride: labelOverride({ label: 'Research Interests' }),
      property: 'https://schema.org/knowsAbout',
    }),
  ],
});
