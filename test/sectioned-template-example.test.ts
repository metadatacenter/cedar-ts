// Imports the sectioned-template example module — coverage that it compiles,
// constructs without error (incl. the template-global key-uniqueness check),
// and round-trips. The demo console output is guarded, so import stays silent.
import { describe, expect, it } from 'vitest';
import { isSection, parseArtifact, serialize } from '../src/index.js';
import { sectionedTemplate } from '../examples/sectioned-template.js';

describe('example sectioned-template', () => {
  it('top-level members are Sections', () => {
    expect(sectionedTemplate.members.every(isSection)).toBe(true);
    expect(sectionedTemplate.members).toHaveLength(2);
  });

  it('nests a sub-section under Medical History', () => {
    const medical = sectionedTemplate.members[1];
    if (!isSection(medical)) throw new Error('expected a Section');
    expect(medical.collapsibility).toBe('startsCollapsed');
    expect(medical.members.some(isSection)).toBe(true);
  });

  it('round-trips through serialize / parseArtifact', () => {
    const wire = serialize(sectionedTemplate);
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });
});
