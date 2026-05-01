// =====================================================================
// Instances — public surface for instance-side artifact types
// =====================================================================
//
// Re-exports:
//
//   - FieldValue                          (field-value.ts):
//       carries one or more typed Values for an embedded-field key
//   - NestedTemplateInstance + InstanceValue union
//                                         (nested-template-instance.ts):
//       recursive instance-side construct for embedded sub-templates;
//       InstanceValue is the FieldValue | NestedTemplateInstance union
//   - TemplateInstance                    (template-instance.ts):
//       top-level instance-side artifact; conforms to a Template
//   - isInstanceValue (this file)         predicate over the InstanceValue
//                                         union
//   - Artifact union and isArtifact (this file):
//       top-level union of every artifact kind:
//       Field | Template | PresentationComponent | TemplateInstance.
//       Defined here, alongside TemplateInstance, because it is the
//       last layer needed to express the union.

export {
  type FieldValue,
  fieldValue,
  isFieldValue,
} from './field-value.js';

export {
  type InstanceValue,
  type NestedTemplateInstance,
  nestedTemplateInstance,
  isNestedTemplateInstance,
} from './nested-template-instance.js';

export {
  type TemplateInstance,
  type TemplateInstanceInit,
  templateInstance,
  isTemplateInstance,
} from './template-instance.js';

import { isFieldValue } from './field-value.js';
import {
  isNestedTemplateInstance,
  type InstanceValue,
} from './nested-template-instance.js';

export const isInstanceValue = (x: unknown): x is InstanceValue =>
  isFieldValue(x) || isNestedTemplateInstance(x);

// Artifact — see grammar.md §Core Structure.
// Top-level union of all artifact kinds: SchemaArtifact (Field | Template),
// PresentationComponent, and TemplateInstance. Defined here, alongside
// TemplateInstance, because it is the last layer needed to express the union.

import type { Field } from '../field-families/index.js';
import type { Template } from '../template.js';
import type { PresentationComponent } from '../presentation/index.js';
import type { TemplateInstance } from './template-instance.js';
import { isField } from '../field-families/index.js';
import { isTemplate } from '../template.js';
import { isPresentationComponent } from '../presentation/index.js';
import { isTemplateInstance } from './template-instance.js';

export type Artifact =
  | Field
  | Template
  | PresentationComponent
  | TemplateInstance;

export const isArtifact = (x: unknown): x is Artifact =>
  isField(x) ||
  isTemplate(x) ||
  isPresentationComponent(x) ||
  isTemplateInstance(x);
