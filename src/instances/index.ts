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

import type { Field } from '../field-artifacts.js';
import type { Template } from '../template.js';
import type { PresentationComponent } from '../presentation/index.js';
import type { TemplateInstance } from './template-instance.js';
import { isField } from '../field-artifacts.js';
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
