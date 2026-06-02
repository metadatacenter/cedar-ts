// =====================================================================
// Embedded-field common helpers — internal-only support for the 21
// EmbeddedXxxField constructors
// =====================================================================
//
// Holds:
//
//   - EmbeddedFieldInitCommon — the shared init-object shape for the 19
//     EmbeddedXxxFieldInit interfaces that carry a [Cardinality] slot.
//     EmbeddedBooleanField is the one exception: it omits cardinality
//     and uses a slimmer init-common defined locally in boolean-field.ts.
//   - assembleCommon() — assembles the per-embedding properties (key,
//     valueRequirement, cardinality, visibility, promptOverride,
//     property) shared by the 19 cardinality-carrying EmbeddedField
//     variants. Called by their `embeddedXxxField` constructors.
//   - fieldRef() — extracts the FieldId from a Field artifact, or
//     passes through a typed FieldId. Called by every
//     `embeddedXxxField` constructor (all 20 variants).
//
// Not re-exported from `index.ts`; consumed only by the family files
// in this folder.

import { parseAsciiIdentifier, CedarConstructionError } from '../leaves/index.js';
import {
  type MultilingualString,
  type MultilingualStringInput,
  multilingualString,
} from '../multilingual.js';
import type { ValueRequirement } from '../embedded/requirement.js';
import type { Cardinality } from '../embedded/cardinality.js';
import type { Visibility } from '../embedded/visibility.js';
import type { Editability } from '../embedded/editability.js';
import { type Property, type PropertyInput, property } from '../embedded/property.js';

// Internal helper module for the 18 EmbeddedField family constructors.
// Centralizes the common-property assembly and the Field-to-FieldId
// extraction so each family file can stay focused on its own concrete shape.
// Not exported from the package barrel.

export interface EmbeddedFieldInitCommon {
  readonly key: string;
  readonly valueRequirement?: ValueRequirement;
  readonly cardinality?: Cardinality;
  readonly visibility?: Visibility;
  readonly promptOverride?: MultilingualStringInput;
  readonly helpTextOverride?: MultilingualStringInput;
  readonly property?: PropertyInput;
  readonly promptKey?: string;
  readonly editability?: Editability;
}

export interface AssembledCommon {
  key: string;
  valueRequirement?: ValueRequirement;
  cardinality?: Cardinality;
  visibility?: Visibility;
  promptOverride?: MultilingualString;
  helpTextOverride?: MultilingualString;
  property?: Property;
  promptKey?: string;
  editability?: Editability;
}

// Enforces the spec rule (grammar.md §Alternative Prompts, validation.md):
// an embedding MUST NOT carry both promptKey (a keyed selection from the
// referenced field's curated alternatives) and promptOverride (a free-form
// override). Shared by assembleCommon and the two families that bypass it.
export function assertPromptSlotsExclusive(init: {
  promptKey?: unknown;
  promptOverride?: unknown;
}): void {
  if (init.promptKey !== undefined && init.promptOverride !== undefined) {
    throw new CedarConstructionError(
      'an embedding MUST NOT carry both promptKey and promptOverride',
    );
  }
}

// Enforces the spec rule (grammar.md §Editability, validation.md): a readOnly
// embedding that is also `required` MUST carry a defaultValue, since the user
// cannot supply the value and there is no default to stand in. Only the
// embedding-level default is observable at construction (the referenced
// Field's field-level default would require resolving artifactRef); the spec
// rule covers the field-level default too, so this is the constructor-checkable
// subset. `hasDefault` is the presence of the embedding's defaultValue.
export function assertReadOnlyRequiredHasDefault(
  init: { editability?: unknown; valueRequirement?: unknown },
  hasDefault: boolean,
): void {
  if (
    init.editability === 'readOnly' &&
    init.valueRequirement === 'required' &&
    !hasDefault
  ) {
    throw new CedarConstructionError(
      'a readOnly required embedding MUST carry a defaultValue',
    );
  }
}

export function assembleCommon(init: EmbeddedFieldInitCommon): AssembledCommon {
  assertPromptSlotsExclusive(init);
  // `defaultValue` is family-specific (not on EmbeddedFieldInitCommon) but is
  // present on the init objects of the 19 families that route through here;
  // its mere presence is what the readOnly-required rule needs.
  assertReadOnlyRequiredHasDefault(
    init,
    (init as { defaultValue?: unknown }).defaultValue !== undefined,
  );
  const out: AssembledCommon = {
    key: parseAsciiIdentifier(init.key),
  };
  if (init.valueRequirement !== undefined) out.valueRequirement = init.valueRequirement;
  if (init.cardinality !== undefined) out.cardinality = init.cardinality;
  if (init.visibility !== undefined) out.visibility = init.visibility;
  if (init.promptOverride !== undefined)
    out.promptOverride = multilingualString(init.promptOverride);
  if (init.helpTextOverride !== undefined)
    out.helpTextOverride = multilingualString(init.helpTextOverride);
  if (init.property !== undefined) out.property = property(init.property);
  if (init.promptKey !== undefined) out.promptKey = parseAsciiIdentifier(init.promptKey);
  if (init.editability !== undefined) out.editability = init.editability;
  return out;
}

// Set of every Field-family `kind` discriminant. Used by `fieldRef` to
// decide whether `input` is a reusable Field artifact (in which case its
// `.id` is extracted) or already a FieldId (in which case it is
// returned as-is).
const FIELD_VARIANT_KINDS: ReadonlySet<string> = new Set([
  'TextField',
  'IntegerNumberField',
  'RealNumberField',
  'BooleanField',
  'DateField',
  'TimeField',
  'DateTimeField',
  'ControlledTermField',
  'SingleValuedEnumField',
  'MultiValuedEnumField',
  'LinkField',
  'EmailField',
  'PhoneNumberField',
  'OrcidField',
  'RorField',
  'DoiField',
  'PubMedIdField',
  'RridField',
  'NihGrantIdField',
  'LanguageField',
  'AttributeValueField',
]);

// Extracts the .id from a Field artifact, or passes through if input is
// already a FieldId. Used by the per-family constructors so callers
// can write `artifactRef: fullName` instead of `artifactRef: fullName.id`. The
// conditional return type carries the per-family precision through to the
// caller (e.g. fieldRef(TextField | TextFieldId) → TextFieldId).
//
// A reusable Field artifact is recognized by a `kind` matching the
// `${Name}Field` pattern excluding the `Embedded${Name}Field` family — but
// EmbeddedField shapes never reach this helper (input is always a Field
// artifact or a FieldId), so the simpler `${string}Field` test is enough.
type FieldRefOf<T> = T extends { kind: infer K; id: infer R }
  ? K extends `${string}Field`
    ? R
    : T
  : T;

export function fieldRef<T extends { readonly kind: string }>(input: T): FieldRefOf<T> {
  if (FIELD_VARIANT_KINDS.has(input.kind)) {
    return (input as unknown as { id: unknown }).id as FieldRefOf<T>;
  }
  return input as unknown as FieldRefOf<T>;
}
