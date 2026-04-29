import { type Iri, iri } from '../leaves/index.js';

export interface LinkValue {
  readonly kind: 'link_value';
  readonly iri: Iri;
  readonly label?: string;
}

export interface LinkValueInit {
  readonly iri: Iri | string;
  readonly label?: string;
}

export function linkValue(init: LinkValueInit): LinkValue {
  const out: { kind: 'link_value'; iri: Iri; label?: string } = {
    kind: 'link_value',
    iri: typeof init.iri === 'string' ? iri(init.iri) : init.iri,
  };
  if (init.label !== undefined) out.label = init.label;
  return out;
}

export function isLinkValue(x: unknown): x is LinkValue {
  return (
    typeof x === 'object' && x !== null &&
    (x as { kind?: unknown }).kind === 'link_value'
  );
}
