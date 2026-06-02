// =====================================================================
// template — wire-form serialize/parse for the Template artifact.
// =====================================================================
//
// Wire form (wire-grammar.md §12):
//
//   Template ::: object {
//     "kind": "Template"
//     id:        string
//     metadata:  SchemaArtifactMetadata
//     header?:   MultilingualString
//     footer?:   MultilingualString
//     members:   array<EmbeddedArtifact>
//   }
//
// Identifier wrappers collapse to plain strings; `header` / `footer` are
// MultilingualString arrays; `members` is an array of polymorphic
// EmbeddedArtifact objects (each tagged with its `kind`).

import { CedarConstructionError } from '../leaves/index.js';
import {
  type Template,
  type TemplateRenderingHint,
  type HelpDisplayMode,
  HELP_DISPLAY_MODES,
  template,
} from '../template.js';
import {
  expectObject,
  expectArray,
  expectString,
  expectStringEnum,
  expectKnownProperties,
  rejectNullProperty,
} from './parse-utils.js';
import {
  serializeTemplateId,
  parseTemplateId,
} from './collapsed-wrappers.js';
import {
  serializeMultilingualString,
  parseMultilingualString,
} from './multilingual.js';
import {
  serializeCatalogMetadata,
  parseCatalogMetadata,
  serializeSchemaArtifactVersioning,
  parseSchemaArtifactVersioning,
} from './metadata.js';
import {
  serializeEmbeddedArtifact,
  parseEmbeddedArtifact,
} from './embedded-fields.js';
import {
  type Section,
  type TemplateMember,
  type Collapsibility,
  COLLAPSIBILITIES,
  section,
  isSection,
} from '../embedded/index.js';

export function serializeTemplate(x: Template): unknown {
  const out: Record<string, unknown> = {
    kind: 'Template',
    id: serializeTemplateId(x.id),
    modelVersion: x.modelVersion,
    metadata: serializeCatalogMetadata(x.metadata),
    versioning: serializeSchemaArtifactVersioning(x.versioning),
    title: serializeMultilingualString(x.title),
  };
  if (x.renderingHint !== undefined)
    out['renderingHint'] = serializeTemplateRenderingHint(x.renderingHint);
  if (x.header !== undefined) out['header'] = serializeMultilingualString(x.header);
  if (x.footer !== undefined) out['footer'] = serializeMultilingualString(x.footer);
  out['members'] = x.members.map((m) => serializeTemplateMember(m));
  return out;
}

// A TemplateMember is either a Section (grouping) or an EmbeddedArtifact.
// Sections are serialized recursively; everything else falls through to the
// embedded-artifact serializer.
function serializeTemplateMember(m: TemplateMember): unknown {
  return isSection(m) ? serializeSection(m) : serializeEmbeddedArtifact(m);
}

function serializeSection(x: Section): unknown {
  const out: Record<string, unknown> = {
    kind: 'Section',
    label: serializeMultilingualString(x.label),
  };
  if (x.description !== undefined)
    out['description'] = serializeMultilingualString(x.description);
  if (x.collapsibility !== undefined) out['collapsibility'] = x.collapsibility;
  out['members'] = x.members.map((m) => serializeTemplateMember(m));
  return out;
}

function parseTemplateMember(x: unknown, where: string): TemplateMember {
  const o = expectObject(x, where);
  if (o['kind'] === 'Section') return parseSection(o, where);
  return parseEmbeddedArtifact(x, where);
}

function parseSection(o: { readonly [k: string]: unknown }, where: string): Section {
  expectKnownProperties(o, ['kind', 'label', 'description', 'collapsibility', 'members']);
  rejectNullProperty(o, 'description');
  rejectNullProperty(o, 'collapsibility');
  if (!('label' in o)) {
    throw new CedarConstructionError(`${where}: missing required "label"`);
  }
  if (!('members' in o)) {
    throw new CedarConstructionError(`${where}: missing required "members"`);
  }
  const init: {
    label: ReturnType<typeof parseMultilingualString>;
    description?: ReturnType<typeof parseMultilingualString>;
    collapsibility?: Collapsibility;
    members: readonly TemplateMember[];
  } = {
    label: parseMultilingualString(o['label'], `${where}.label`),
    members: expectArray(o['members'], `${where}.members`).map((m, i) =>
      parseTemplateMember(m, `${where}.members[${i}]`),
    ),
  };
  if ('description' in o)
    init.description = parseMultilingualString(o['description'], `${where}.description`);
  if ('collapsibility' in o)
    init.collapsibility = expectStringEnum<Collapsibility>(
      o['collapsibility'],
      COLLAPSIBILITIES,
      `${where}.collapsibility`,
    );
  return section(init);
}

function serializeTemplateRenderingHint(x: TemplateRenderingHint): unknown {
  const out: Record<string, unknown> = {};
  if (x.helpDisplayMode !== undefined) out['helpDisplayMode'] = x.helpDisplayMode;
  return out;
}

function parseTemplateRenderingHint(
  x: unknown,
  where: string,
): TemplateRenderingHint {
  const o = expectObject(x, where);
  expectKnownProperties(o, ['helpDisplayMode']);
  rejectNullProperty(o, 'helpDisplayMode');
  const out: { helpDisplayMode?: HelpDisplayMode } = {};
  if ('helpDisplayMode' in o)
    out.helpDisplayMode = expectStringEnum<HelpDisplayMode>(
      o['helpDisplayMode'],
      HELP_DISPLAY_MODES,
      `${where}.helpDisplayMode`,
    );
  return out;
}

export function parseTemplate(x: unknown, where = 'Template'): Template {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'id',
    'modelVersion',
    'metadata',
    'versioning',
    'title',
    'renderingHint',
    'header',
    'footer',
    'members',
  ]);
  rejectNullProperty(o, 'renderingHint');
  rejectNullProperty(o, 'header');
  rejectNullProperty(o, 'footer');
  if (o['kind'] !== 'Template') {
    throw new CedarConstructionError(
      `${where}: expected kind "Template"; got ${JSON.stringify(o['kind'])}`,
    );
  }
  for (const k of ['id', 'modelVersion', 'metadata', 'versioning', 'title', 'members']) {
    if (!(k in o)) {
      throw new CedarConstructionError(
        `${where}: missing required ${JSON.stringify(k)}`,
      );
    }
  }
  const id = parseTemplateId(
    expectString(o['id'], `${where}.id`),
    `${where}.id`,
  );
  const modelVersion = expectString(o['modelVersion'], `${where}.modelVersion`);
  const metadata = parseCatalogMetadata(o['metadata'], `${where}.metadata`);
  const versioning = parseSchemaArtifactVersioning(
    o['versioning'],
    `${where}.versioning`,
  );
  const title = parseMultilingualString(o['title'], `${where}.title`);
  const membersArr = expectArray(o['members'], `${where}.members`);
  const members = membersArr.map((e, i) =>
    parseTemplateMember(e, `${where}.members[${i}]`),
  );

  const init: {
    id: typeof id;
    modelVersion: string;
    metadata: typeof metadata;
    versioning: typeof versioning;
    title: typeof title;
    renderingHint?: TemplateRenderingHint;
    header?: ReturnType<typeof parseMultilingualString>;
    footer?: ReturnType<typeof parseMultilingualString>;
    members: typeof members;
  } = { id, modelVersion, metadata, versioning, title, members };
  if ('renderingHint' in o)
    init.renderingHint = parseTemplateRenderingHint(
      o['renderingHint'],
      `${where}.renderingHint`,
    );
  if ('header' in o)
    init.header = parseMultilingualString(o['header'], `${where}.header`);
  if ('footer' in o)
    init.footer = parseMultilingualString(o['footer'], `${where}.footer`);
  return template(init);
}
