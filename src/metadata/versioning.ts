import { type Iri, iri, parseSemanticVersion } from '../leaves/index.js';

// Status is a closed set of two values per grammar §Schema Versioning. We
// model it as a string-literal union rather than two nullary constructors —
// it is cheaper to compare and serialize.
export type Status = 'draft' | 'published';

export const STATUSES: readonly Status[] = Object.freeze(['draft', 'published']);

export function isStatus(x: unknown): x is Status {
  return x === 'draft' || x === 'published';
}

export interface SchemaVersioning {
  readonly version: string;
  readonly status: Status;
  readonly modelVersion: string;
  readonly previousVersion?: Iri;
  readonly derivedFrom?: Iri;
}

export interface SchemaVersioningInit {
  readonly version: string;
  readonly status: Status;
  readonly modelVersion: string;
  readonly previousVersion?: Iri | string;
  readonly derivedFrom?: Iri | string;
}

export function schemaVersioning(init: SchemaVersioningInit): SchemaVersioning {
  const out: {
    version: string;
    status: Status;
    modelVersion: string;
    previousVersion?: Iri;
    derivedFrom?: Iri;
  } = {
    version: parseSemanticVersion(init.version),
    status: init.status,
    modelVersion: parseSemanticVersion(init.modelVersion),
  };
  if (init.previousVersion !== undefined) {
    out.previousVersion =
      typeof init.previousVersion === 'string' ? iri(init.previousVersion) : init.previousVersion;
  }
  if (init.derivedFrom !== undefined) {
    out.derivedFrom =
      typeof init.derivedFrom === 'string' ? iri(init.derivedFrom) : init.derivedFrom;
  }
  return out;
}
