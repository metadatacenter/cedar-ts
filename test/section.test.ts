import { describe, expect, it } from 'vitest';
import {
  CedarConstructionError,
  catalogMetadata,
  embeddedTextField,
  isSection,
  lifecycleMetadata,
  parseArtifact,
  schemaArtifactVersioning,
  section,
  serialize,
  template,
  templateId,
  textFieldId,
} from '../src/index.js';

const tp = lifecycleMetadata({
  createdOn: '2024-01-01T00:00:00Z',
  createdBy: 'https://example.org/u',
  modifiedOn: '2024-01-01T00:00:00Z',
  modifiedBy: 'https://example.org/u',
});

const meta = {
  metadata: catalogMetadata({ preferredLabel: 'Section test', lifecycle: tp }),
  versioning: schemaArtifactVersioning({ version: '1.0.0', status: 'draft' as const }),
};

const MV = '2.0.0';
const ref = (n: string) => textFieldId(`https://example.org/fields/${n}`);
const field = (key: string) => embeddedTextField({ key, artifactRef: ref(key) });

const tmpl = (members: readonly unknown[]) =>
  template({
    id: templateId('https://example.org/templates/t'),
    modelVersion: MV,
    ...meta,
    title: 'T',
    members: members as never,
  });

describe('Section construction', () => {
  it('builds with a label and members; absent slots stay absent', () => {
    const s = section({ label: 'Demographics', members: [field('given_name')] });
    expect(s.kind).toBe('Section');
    expect(s.label).toEqual([{ value: 'Demographics', lang: 'und' }]);
    expect('description' in s).toBe(false);
    expect('collapsibility' in s).toBe(false);
    expect(s.members).toHaveLength(1);
  });

  it('carries description and collapsibility when supplied', () => {
    const s = section({
      label: 'Medical History',
      description: 'History of present illness.',
      collapsibility: 'startsCollapsed',
      members: [],
    });
    expect(s.description).toEqual([{ value: 'History of present illness.', lang: 'und' }]);
    expect(s.collapsibility).toBe('startsCollapsed');
  });

  it('permits an empty body', () => {
    const s = section({ label: 'Empty' });
    expect(s.members).toEqual([]);
  });

  it('nests sections', () => {
    const inner = section({ label: 'Current Medications', members: [field('med')] });
    const outer = section({ label: 'Medical History', members: [field('dx'), inner] });
    expect(isSection(outer.members[1])).toBe(true);
  });

  it('isSection distinguishes sections from embedded fields', () => {
    expect(isSection(section({ label: 'X' }))).toBe(true);
    expect(isSection(field('y'))).toBe(false);
  });
});

describe('Section key uniqueness (template-global across the tree)', () => {
  it('accepts distinct keys spread across nested sections', () => {
    expect(() =>
      tmpl([
        section({ label: 'A', members: [field('one')] }),
        section({
          label: 'B',
          members: [field('two'), section({ label: 'B1', members: [field('three')] })],
        }),
      ]),
    ).not.toThrow();
  });

  it('rejects a duplicate key across two sibling sections', () => {
    expect(() =>
      tmpl([
        section({ label: 'A', members: [field('notes')] }),
        section({ label: 'B', members: [field('notes')] }),
      ]),
    ).toThrow(CedarConstructionError);
  });

  it('rejects a duplicate key between a top-level member and a nested section', () => {
    expect(() =>
      tmpl([
        field('dob'),
        section({ label: 'Nested', members: [section({ label: 'Deep', members: [field('dob')] })] }),
      ]),
    ).toThrow(CedarConstructionError);
  });
});

describe('Section wire form', () => {
  it('round-trips a template with nested sections', () => {
    const t = tmpl([
      section({
        label: 'Demographics',
        description: 'Basic info.',
        members: [field('given_name'), field('family_name')],
      }),
      section({
        label: 'Medical History',
        collapsibility: 'startsCollapsed',
        members: [
          field('primary_diagnosis'),
          section({ label: 'Meds', collapsibility: 'startsExpanded', members: [field('med')] }),
        ],
      }),
    ]);
    const wire = serialize(t) as Record<string, unknown>;
    const members = wire['members'] as Record<string, unknown>[];
    expect(members[0]?.['kind']).toBe('Section');
    expect(members[0]?.['description']).toEqual([{ value: 'Basic info.', lang: 'und' }]);
    expect(members[1]?.['collapsibility']).toBe('startsCollapsed');
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });

  it('omits absent description/collapsibility on the wire', () => {
    const t = tmpl([section({ label: 'Plain', members: [field('f')] })]);
    const wire = serialize(t) as Record<string, unknown>;
    const sec = (wire['members'] as Record<string, unknown>[])[0]!;
    expect('description' in sec).toBe(false);
    expect('collapsibility' in sec).toBe(false);
  });

  it('rejects an unknown collapsibility value on parse', () => {
    const t = tmpl([section({ label: 'S', members: [field('f')] })]);
    const wire = serialize(t) as Record<string, unknown>;
    (wire['members'] as Record<string, unknown>[])[0]!['collapsibility'] = 'sometimes';
    expect(() => parseArtifact(wire)).toThrow(CedarConstructionError);
  });
});
