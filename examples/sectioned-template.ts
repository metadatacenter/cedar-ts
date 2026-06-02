// =====================================================================
// Sectioned template example (issue #9)
// =====================================================================
//
// Demonstrates `Section` — the structural grouping member. Sections gather
// template members under a heading; they carry no key and no instance data,
// nest recursively, and are transparent to instance matching. The
// EmbeddedArtifactKey values must be unique across the WHOLE member tree, not
// just among siblings — moving a field between sections never migrates
// instance data.
//
// Run directly with `tsx examples/sectioned-template.ts`; importable too (the
// demo output is guarded so importers stay silent).

import {
  catalogMetadata,
  dateFieldId,
  embeddedDateField,
  embeddedTextField,
  lifecycleMetadata,
  parseArtifact,
  schemaArtifactVersioning,
  section,
  serialize,
  template,
  templateId,
  textFieldId,
  type Template,
} from '../src/index.js';

const FIELDS = 'https://example.org/fields/';

const tp = lifecycleMetadata({
  createdOn: '2026-01-15T09:30:00Z',
  createdBy: 'https://example.org/users/alice',
  modifiedOn: '2026-01-15T09:30:00Z',
  modifiedBy: 'https://example.org/users/alice',
});

const meta = catalogMetadata({ preferredLabel: 'Patient Intake', lifecycle: tp });
const versioning = schemaArtifactVersioning({ version: '1.0.0', status: 'draft' });

const ref = (slug: string) => textFieldId(`${FIELDS}${slug}`);

export const sectionedTemplate: Template = template({
  id: templateId('https://example.org/templates/patient-intake'),
  modelVersion: '2.0.0',
  metadata: meta,
  versioning,
  title: 'Patient Intake',
  members: [
    // A plain semantic group, with an intro description.
    section({
      label: 'Demographics',
      description: 'Basic information about the patient.',
      members: [
        embeddedTextField({ key: 'given_name', artifactRef: ref('given-name'), valueRequirement: 'required' }),
        embeddedTextField({ key: 'family_name', artifactRef: ref('family-name'), valueRequirement: 'required' }),
        embeddedDateField({ key: 'date_of_birth', artifactRef: dateFieldId(`${FIELDS}date-of-birth`), valueRequirement: 'required' }),
      ],
    }),
    // A collapsible "advanced" group, starting collapsed, with a nested
    // sub-section that starts expanded. Note `medication_name` is keyed
    // uniquely across the whole tree, not just within its section.
    section({
      label: 'Medical History',
      collapsibility: 'startsCollapsed',
      members: [
        embeddedTextField({ key: 'primary_diagnosis', artifactRef: ref('diagnosis'), valueRequirement: 'required' }),
        section({
          label: 'Current Medications',
          collapsibility: 'startsExpanded',
          members: [
            embeddedTextField({ key: 'medication_name', artifactRef: ref('medication-name'), valueRequirement: 'optional' }),
          ],
        }),
      ],
    }),
  ],
});

// ---- Runnable demo ----------------------------------------------------
// Guarded so importing this module (e.g. in tests) stays silent.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const wire = serialize(sectionedTemplate);
  console.log('=== Sectioned template ===');
  console.log(JSON.stringify(wire, null, 2));
  // Round-trips structurally; the matching instance (not shown) would be flat,
  // keyed only by EmbeddedArtifactKey with no record of section membership.
  const roundTrips =
    JSON.stringify(serialize(parseArtifact(wire))) === JSON.stringify(wire);
  console.log('\n=== Round-trips? ===');
  console.log(roundTrips ? 'yes' : 'no');
}
