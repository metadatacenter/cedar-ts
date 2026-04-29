// Principal Investigator details — example Template construction.
//
// Composes the public API from leaves up to a complete Template, then shows
// how to consume the result: iterate the embedded artifacts, and build a
// conforming TemplateInstance against the schema.

import {
  artifactMetadata,
  cardinality,
  dateField,
  dateFieldId,
  dateFieldSpec,
  DEFAULT_VALUE_REQUIREMENT,
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
  emailFieldId,
  emailFieldSpec,
  emailValue,
  fieldValue,
  fullDateValue,
  isEmbeddedField,
  labelOverride,
  literalChoiceOption,
  literalChoiceValue,
  literalSingleChoiceFieldSpec,
  orcidField,
  orcidFieldId,
  orcidFieldSpec,
  orcidValue,
  phoneNumberField,
  phoneNumberFieldId,
  phoneNumberFieldSpec,
  presentationComponentId,
  richTextComponent,
  rorField,
  rorFieldId,
  rorFieldSpec,
  rorValue,
  schemaArtifactMetadata,
  schemaVersioning,
  singleChoiceField,
  singleChoiceFieldId,
  template,
  templateId,
  templateInstance,
  templateInstanceId,
  temporalProvenance,
  textField,
  textFieldId,
  textFieldSpec,
  textValue,
  unboundedCardinality,
  type ArtifactMetadata,
  type SchemaArtifactMetadata,
  type Template,
  type TemplateInstance,
  type ValueRequirement,
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

// ---- Reusable Field artifacts -----------------------------------------

const fullName = textField({
  id: textFieldId(`${FIELDS}full-name`),
  metadata: meta('Full Name', 'Full legal name of the principal investigator.'),
  fieldSpec: textFieldSpec({
    minLength: { kind: 'non_negative_integer', value: '1' },
  }),
});

// literalChoiceOption accepts a (text, lang) pair as a shortcut for a
// langStringLiteral; pass a Literal directly for typed-string options.
const academicTitle = singleChoiceField({
  id: singleChoiceFieldId(`${FIELDS}academic-title`),
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
});

const email = emailField({
  id: emailFieldId(`${FIELDS}email`),
  metadata: meta('Email Address', 'Primary work email.'),
  fieldSpec: emailFieldSpec(),
});

const phone = phoneNumberField({
  id: phoneNumberFieldId(`${FIELDS}phone`),
  metadata: meta('Phone Number', 'Primary work phone, in international format.'),
  fieldSpec: phoneNumberFieldSpec(),
});

const orcid = orcidField({
  id: orcidFieldId(`${FIELDS}orcid`),
  metadata: meta('ORCID iD', 'ORCID identifier (https://orcid.org/...).'),
  fieldSpec: orcidFieldSpec(),
});

const institutionName = textField({
  id: textFieldId(`${FIELDS}institution-name`),
  metadata: meta('Institution Name', 'Name of the home institution.'),
  fieldSpec: textFieldSpec(),
});

const institutionRor = rorField({
  id: rorFieldId(`${FIELDS}institution-ror`),
  metadata: meta(
    'Institution ROR',
    'Research Organization Registry identifier for the home institution.',
  ),
  fieldSpec: rorFieldSpec(),
});

const department = textField({
  id: textFieldId(`${FIELDS}department`),
  metadata: meta('Department', 'Department or division within the institution.'),
  fieldSpec: textFieldSpec(),
});

const appointmentDate = dateField({
  id: dateFieldId(`${FIELDS}appointment-date`),
  metadata: meta('Appointment Date', 'Start date of current appointment.'),
  fieldSpec: dateFieldSpec({ dateValueType: 'full_date' }),
});

const researchInterest = textField({
  id: textFieldId(`${FIELDS}research-interest`),
  metadata: meta('Research Interest', 'A single research interest or keyword.'),
  fieldSpec: textFieldSpec(),
});

// ---- Presentation component (rich-text intro) -------------------------

// PresentationComponent carries plain ArtifactMetadata — it is an Artifact but
// not a SchemaArtifact, so it has no version / status / model-version.
const intro = richTextComponent({
  id: presentationComponentId(`${COMPONENTS}pi-intro`),
  metadata: artifactMeta('PI Intro', 'Introductory text shown above the PI form.'),
  htmlContent:
    '<p>Please provide details for the <strong>principal investigator</strong> ' +
    'of this study. Fields marked as required must be supplied; ORCID and ROR ' +
    'identifiers are recommended for unambiguous attribution.</p>',
});

// ---- The Template -----------------------------------------------------

export const principalInvestigatorTemplate: Template = template({
  id: templateId(`${TEMPLATES}principal-investigator`),
  metadata: meta(
    'Principal Investigator Details',
    'Identity, contact information, and institutional affiliation of a study PI.',
  ),
  header: 'Principal Investigator Details',
  footer: 'All personal data is handled per the study’s data-management plan.',
  embedded: [
    embeddedPresentationComponent({
      key: 'intro',
      reference: intro.id,
    }),

    embeddedTextField({
      key: 'full_name',
      reference: fullName.id,
      valueRequirement: 'required',
      property: 'https://schema.org/name',
    }),
    embeddedSingleChoiceField({
      key: 'academic_title',
      reference: academicTitle.id,
      valueRequirement: 'required',
      property: {
        propertyIri: 'https://schema.org/jobTitle',
        propertyLabel: 'job title',
      },
    }),

    embeddedEmailField({
      key: 'email',
      reference: email.id,
      valueRequirement: 'required',
      property: 'https://schema.org/email',
    }),
    embeddedPhoneNumberField({
      key: 'phone',
      reference: phone.id,
      valueRequirement: 'optional',
      property: 'https://schema.org/telephone',
    }),
    embeddedOrcidField({
      key: 'orcid',
      reference: orcid.id,
      valueRequirement: 'recommended',
      property: 'https://schema.org/identifier',
      labelOverride: labelOverride({
        label: 'ORCID iD',
        alternativeLabels: ['Open Researcher and Contributor iD'],
      }),
    }),

    embeddedTextField({
      key: 'institution_name',
      reference: institutionName.id,
      valueRequirement: 'required',
      defaultValue: 'Stanford University',
      property: 'https://schema.org/affiliation',
    }),
    embeddedRorField({
      key: 'institution_ror',
      reference: institutionRor.id,
      valueRequirement: 'recommended',
      property: {
        propertyIri: 'https://schema.org/affiliation',
        propertyLabel: 'institution ROR',
      },
    }),
    embeddedTextField({
      key: 'department',
      reference: department.id,
      valueRequirement: 'optional',
      property: 'https://schema.org/department',
    }),

    embeddedDateField({
      key: 'appointment_date',
      reference: appointmentDate.id,
      valueRequirement: 'optional',
      property: 'https://schema.org/startDate',
    }),

    // Multi-valued: zero or more research interests, no upper bound.
    embeddedTextField({
      key: 'research_interests',
      reference: researchInterest.id,
      valueRequirement: 'optional',
      cardinality: cardinality({ min: 0, max: unboundedCardinality }),
      labelOverride: labelOverride({ label: 'Research Interests' }),
      property: 'https://schema.org/knowsAbout',
    }),
  ],
});

// ---- Consuming the Template -------------------------------------------

// 1) Iterate `template.embedded`, narrow on kind, project to a summary.
//    isEmbeddedField acts as a type guard so the result element is typed
//    EmbeddedField (with valueRequirement, property, etc. accessible).

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
        key: e.key.identifier.value,
        // ValueRequirement defaults to 'optional' when absent (grammar §Requirements).
        requirement: e.valueRequirement ?? DEFAULT_VALUE_REQUIREMENT,
      };
      if (e.property) out.propertyIri = e.property.propertyIri.value;
      return out;
    });

// 2) A conforming TemplateInstance. Carries plain ArtifactMetadata (instances
//    are not versioned) and references the Template by its TemplateId. A
//    multi-valued field collects all values within one FieldValue (varargs).

export const exampleInstance: TemplateInstance = templateInstance({
  id: templateInstanceId('https://example.org/cedar/instances/pi/0001'),
  metadata: artifactMeta(
    'PI: Jane Smith',
    'Example PI details for study EX-2026-001.',
  ),
  templateReference: principalInvestigatorTemplate.id,
  values: [
    fieldValue(
      'full_name',
      textValue('Jane Smith'),
    ),
    fieldValue(
      'academic_title',
      literalChoiceValue('Associate Professor', 'en'),
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
    fieldValue(
      'research_interests',
      textValue('biomedical informatics'),
      textValue('metadata standards'),
      textValue('FAIR data'),
    ),
  ],
});
