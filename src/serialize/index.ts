// =====================================================================
// serialize — public surface for the wire-form serializer / parser.
// =====================================================================
//
// Two complementary entry points:
//
//   1. Per-type helpers (primary). Each top-level type T has
//      `serializeT(x: T): unknown` and `parseT(x: unknown, where?: string): T`,
//      with tight static types. Prefer these when you know the target type.
//
//   2. Generic dispatchers (convenience).
//        serialize(x: KnownArtifact): unknown
//        parse(x: unknown, type: string, where?: string): KnownArtifact
//      `serialize` inspects `x.kind` to dispatch; `parse` takes a target
//      type-name string parameter so the parser knows the slot it is being
//      called at (top-down parse).
//
// The output of serialization is `unknown` (a JSON-compatible value).
// Callers do `JSON.stringify` themselves.
//
// Strict parse: the parsers reject malformed input by throwing
// CedarConstructionError. They also reject explicit `null` for optional
// properties (those MUST be omitted; per serialization.md §4.2).

import { CedarConstructionError } from '../leaves/index.js';

// ---- Re-export all per-type helpers ---------------------------------

export * from './parse-utils.js';
export * from './collapsed-wrappers.js';
export * from './multilingual.js';
export * from './metadata.js';
export * from './embedded-config.js';
export * from './values.js';
export * from './field-specs.js';
export * from './fields.js';
export * from './embedded-fields.js';
export * from './presentation.js';
export * from './template.js';
export * from './instances.js';

// ---- Imports for the generic dispatchers -----------------------------

import type { Field } from '../field-families/index.js';
import type { Template } from '../template.js';
import type { TemplateInstance } from '../instances/index.js';
import type { PresentationComponent } from '../presentation/index.js';

import { serializeField, parseField } from './fields.js';
import { serializeTemplate, parseTemplate } from './template.js';
import {
  serializeTemplateInstance,
  parseTemplateInstance,
} from './instances.js';
import {
  serializePresentationComponent,
  parsePresentationComponent,
} from './presentation.js';

// ---- Generic dispatchers --------------------------------------------

// `Artifact` here is the union of top-level kinds that appear at the
// document-root position: every Field family, Template, every
// PresentationComponent variant, and TemplateInstance. The instances
// barrel (src/instances/index.ts) re-exports an `Artifact` type and
// `isArtifact` predicate that match this set.
export type SerializableArtifact =
  | Field
  | Template
  | PresentationComponent
  | TemplateInstance;

// Generic serializer. Inspects `x.kind` to dispatch to the right
// per-type serializer. Returns a JSON-compatible value.
export function serialize(x: SerializableArtifact): unknown {
  const k = x.kind;
  switch (k) {
    case 'Template':
      return serializeTemplate(x);
    case 'TemplateInstance':
      return serializeTemplateInstance(x);
    case 'RichTextComponent':
    case 'ImageComponent':
    case 'YoutubeVideoComponent':
    case 'SectionBreakComponent':
    case 'PageBreakComponent':
      return serializePresentationComponent(x);
    case 'TextField':
    case 'IntegerNumberField':
    case 'RealNumberField':
    case 'BooleanField':
    case 'DateField':
    case 'TimeField':
    case 'DateTimeField':
    case 'ControlledTermField':
    case 'SingleChoiceField':
    case 'MultipleChoiceField':
    case 'LinkField':
    case 'EmailField':
    case 'PhoneNumberField':
    case 'OrcidField':
    case 'RorField':
    case 'DoiField':
    case 'PubMedIdField':
    case 'RridField':
    case 'NihGrantIdField':
    case 'AttributeValueField':
      return serializeField(x);
    default: {
      // Exhaustiveness check.
      const _exhaustive: never = k;
      void _exhaustive;
      throw new CedarConstructionError(
        `serialize: unsupported artifact kind ${JSON.stringify(
          (x as { kind?: unknown }).kind,
        )}`,
      );
    }
  }
}

// Generic parser. Takes a target-type string parameter so the parser
// knows the slot it is being called at (top-down parse). Reconstructs
// in-memory wrappers as appropriate at each slot.
//
// Recognized type names:
//   - "Template"
//   - "TemplateInstance"
//   - "PresentationComponent"
//   - "Field"  (the Field union — kind is on the wire)
//   - "Artifact"  (any top-level artifact — dispatches by `kind`)
export function parse(
  x: unknown,
  type:
    | 'Template'
    | 'TemplateInstance'
    | 'PresentationComponent'
    | 'Field'
    | 'Artifact',
  where?: string,
): SerializableArtifact {
  const w = where ?? type;
  switch (type) {
    case 'Template':
      return parseTemplate(x, w);
    case 'TemplateInstance':
      return parseTemplateInstance(x, w);
    case 'PresentationComponent':
      return parsePresentationComponent(x, w);
    case 'Field':
      return parseField(x, w);
    case 'Artifact':
      return parseArtifact(x, w);
  }
}

// Parses any of the document-root artifact kinds, dispatching by `kind`.
// Useful when consuming JSON whose top-level kind is not known up front.
export function parseArtifact(
  x: unknown,
  where = 'Artifact',
): SerializableArtifact {
  if (typeof x !== 'object' || x === null || Array.isArray(x)) {
    throw new CedarConstructionError(
      `Expected ${where} to be an object; got ${
        x === null ? 'null' : Array.isArray(x) ? 'array' : typeof x
      }`,
    );
  }
  const k = (x as { kind?: unknown }).kind;
  if (typeof k !== 'string') {
    throw new CedarConstructionError(
      `${where}: expected a string "kind" property to dispatch parse`,
    );
  }
  switch (k) {
    case 'Template':
      return parseTemplate(x, where);
    case 'TemplateInstance':
      return parseTemplateInstance(x, where);
    case 'RichTextComponent':
    case 'ImageComponent':
    case 'YoutubeVideoComponent':
    case 'SectionBreakComponent':
    case 'PageBreakComponent':
      return parsePresentationComponent(x, where);
    case 'TextField':
    case 'IntegerNumberField':
    case 'RealNumberField':
    case 'BooleanField':
    case 'DateField':
    case 'TimeField':
    case 'DateTimeField':
    case 'ControlledTermField':
    case 'SingleChoiceField':
    case 'MultipleChoiceField':
    case 'LinkField':
    case 'EmailField':
    case 'PhoneNumberField':
    case 'OrcidField':
    case 'RorField':
    case 'DoiField':
    case 'PubMedIdField':
    case 'RridField':
    case 'NihGrantIdField':
    case 'AttributeValueField':
      return parseField(x, where);
    default:
      throw new CedarConstructionError(
        `${where}: unsupported artifact kind ${JSON.stringify(k)}`,
      );
  }
}
