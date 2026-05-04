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
import { type Template, template } from '../template.js';
import {
  expectObject,
  expectArray,
  expectString,
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
  serializeSchemaArtifactMetadata,
  parseSchemaArtifactMetadata,
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
    metadata: serializeSchemaArtifactMetadata(x.metadata),
  };
  if (x.header !== undefined) out['header'] = serializeMultilingualString(x.header);
  if (x.footer !== undefined) out['footer'] = serializeMultilingualString(x.footer);
  out['members'] = x.members.map((e) => serializeEmbeddedArtifact(e));
  return out;
}

export function parseTemplate(x: unknown, where = 'Template'): Template {
  const o = expectObject(x, where);
  expectKnownProperties(o, [
    'kind',
    'id',
    'modelVersion',
    'metadata',
    'header',
    'footer',
    'members',
  ]);
  rejectNullProperty(o, 'header');
  rejectNullProperty(o, 'footer');
  if (o['kind'] !== 'Template') {
    throw new CedarConstructionError(
      `${where}: expected kind "Template"; got ${JSON.stringify(o['kind'])}`,
    );
  }
  if (!('id' in o)) {
    throw new CedarConstructionError(`${where}: missing required "id"`);
  }
  if (!('modelVersion' in o)) {
    throw new CedarConstructionError(`${where}: missing required "modelVersion"`);
  }
  if (!('metadata' in o)) {
    throw new CedarConstructionError(`${where}: missing required "metadata"`);
  }
  if (!('members' in o)) {
    throw new CedarConstructionError(`${where}: missing required "members"`);
  }
  const id = parseTemplateId(
    expectString(o['id'], `${where}.id`),
    `${where}.id`,
  );
  const modelVersion = expectString(o['modelVersion'], `${where}.modelVersion`);
  const metadata = parseSchemaArtifactMetadata(
    o['metadata'],
    `${where}.metadata`,
  );
  const membersArr = expectArray(o['members'], `${where}.members`);
  const members = membersArr.map((e, i) =>
    parseEmbeddedArtifact(e, `${where}.members[${i}]`),
  );

  const init: {
    id: typeof id;
    modelVersion: string;
    metadata: typeof metadata;
    header?: ReturnType<typeof parseMultilingualString>;
    footer?: ReturnType<typeof parseMultilingualString>;
    members: typeof members;
  } = { id, modelVersion, metadata, members };
  if ('header' in o)
    init.header = parseMultilingualString(o['header'], `${where}.header`);
  if ('footer' in o)
    init.footer = parseMultilingualString(o['footer'], `${where}.footer`);
  return template(init);
}
