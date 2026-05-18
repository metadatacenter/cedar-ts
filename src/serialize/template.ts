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
  out['members'] = x.members.map((e) => serializeEmbeddedArtifact(e));
  return out;
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
    parseEmbeddedArtifact(e, `${where}.members[${i}]`),
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
