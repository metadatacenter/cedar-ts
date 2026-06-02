// Tests for the advisory recommendedKey / recommendedProperty slots as they
// appear in the principal-investigator example. Unlike most test files, this
// one imports the actual example module — so it doubles as coverage that the
// example compiles, constructs without error, and demonstrates the slots with
// values that align with the embedding sites in the same template.
//
// Note: the recommended* slots live on the *reusable* Field artifact, not on
// the EmbeddedField (whose artifactRef is reduced to a FieldId). So we assert
// against the exported Field artifacts directly, and separately confirm that
// the embedding keys in the template adopt those recommendations.
import { describe, expect, it } from 'vitest';
import { parseArtifact, serialize } from '../src/index.js';
import {
  email,
  fieldSummary,
  fullName,
  orcid,
  principalInvestigatorTemplate,
} from '../examples/principal-investigator.js';
import { isEmbeddedField } from '../src/index.js';

describe('example principal-investigator — recommendedKey on Field artifacts', () => {
  it('fullName recommends the key its embedding uses', () => {
    expect(fullName.recommendedKey).toBe('full_name');
  });

  it('email recommends the key its embedding uses', () => {
    expect(email.recommendedKey).toBe('email');
  });

  it('orcid recommends the key its embedding uses', () => {
    expect(orcid.recommendedKey).toBe('orcid');
  });

  it('the recommendedKey is a valid ASCII identifier (survived construction)', () => {
    // Construction would have thrown otherwise; assert the shape is intact.
    for (const k of [fullName.recommendedKey, email.recommendedKey, orcid.recommendedKey]) {
      expect(k).toMatch(/^[A-Za-z_][A-Za-z0-9_]*$/);
    }
  });
});

describe('example principal-investigator — recommendedProperty on Field artifacts', () => {
  it('fullName recommends the property its embedding adopts', () => {
    expect(fullName.recommendedProperty?.iri.value).toBe('https://schema.org/name');
  });

  it('email recommends the property its embedding adopts (with a label)', () => {
    expect(email.recommendedProperty?.iri.value).toBe('https://schema.org/email');
    expect(email.recommendedProperty?.label).toBeDefined();
  });

  it('orcid recommends the property its embedding adopts', () => {
    expect(orcid.recommendedProperty?.iri.value).toBe('https://schema.org/identifier');
  });
});

describe('example principal-investigator — field recommends → embedding adopts', () => {
  // The whole point of the advisory slots: the reusable Field suggests a key
  // and property, and the embedding in this template adopts them. Cross-check
  // each recommendation against the corresponding entry in the exported
  // fieldSummary (derived from template.members).
  const summaryFor = (key: string) => fieldSummary.find((e) => e.key === key);

  it('every recommendedKey is used as an embedding key in the template', () => {
    for (const f of [fullName, email, orcid]) {
      expect(summaryFor(f.recommendedKey!)).toBeDefined();
    }
  });

  it('the embedding adopts the recommended property IRI', () => {
    expect(summaryFor('full_name')?.propertyIri).toBe(
      fullName.recommendedProperty?.iri.value,
    );
    expect(summaryFor('email')?.propertyIri).toBe(email.recommendedProperty?.iri.value);
    expect(summaryFor('orcid')?.propertyIri).toBe(orcid.recommendedProperty?.iri.value);
  });
});

describe('example principal-investigator — recommended slots round-trip', () => {
  it('fullName round-trips both advisory slots through serialize / parseArtifact', () => {
    const wire = serialize(fullName) as Record<string, unknown>;
    expect(wire['recommendedKey']).toBe('full_name');
    expect(wire['recommendedProperty']).toEqual({ iri: 'https://schema.org/name' });
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
  });

  it('email round-trips (recommendedProperty carries its label)', () => {
    const wire = serialize(email) as Record<string, unknown>;
    const rp = wire['recommendedProperty'] as Record<string, unknown>;
    expect(rp['iri']).toBe('https://schema.org/email');
    expect(rp['label']).toEqual([{ value: 'email', lang: 'en' }]);
    const back = parseArtifact(wire);
    expect(serialize(back)).toEqual(wire);
  });
});

describe('example principal-investigator — altPrompts / promptKey', () => {
  it('fullName curates a closed set of alternative wordings', () => {
    const keys = (fullName.altPrompts ?? []).map((a) => a.key);
    expect(keys).toEqual(['short', 'formal']);
  });

  it("the full_name embedding selects a curated wording the field offers", () => {
    const embedding = principalInvestigatorTemplate.members
      .filter(isEmbeddedField)
      .find((e) => e.key === 'full_name');
    expect(embedding?.promptKey).toBe('short');
    // The selected key MUST be one the referenced field actually curates.
    const offered = (fullName.altPrompts ?? []).map((a) => a.key);
    expect(offered).toContain(embedding?.promptKey);
  });

  it('the selecting template round-trips with the promptKey intact', () => {
    const wire = serialize(principalInvestigatorTemplate) as Record<string, unknown>;
    const members = wire['members'] as Record<string, unknown>[];
    const fn = members.find((m) => m['key'] === 'full_name');
    expect(fn?.['promptKey']).toBe('short');
    expect(serialize(parseArtifact(wire))).toEqual(wire);
  });
});
