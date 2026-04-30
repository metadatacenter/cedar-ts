import {
  type Iri,
  type IsoDateTimeStamp,
  iri,
  isoDateTimeStamp,
} from '../leaves/index.js';

// TemporalProvenance identifies when an artifact was created/modified and the
// agents responsible.
export interface TemporalProvenance {
  readonly createdOn: IsoDateTimeStamp;
  readonly createdBy: Iri;
  readonly modifiedOn: IsoDateTimeStamp;
  readonly modifiedBy: Iri;
}

export interface TemporalProvenanceInit {
  readonly createdOn: IsoDateTimeStamp | string;
  readonly createdBy: Iri | string;
  readonly modifiedOn: IsoDateTimeStamp | string;
  readonly modifiedBy: Iri | string;
}

export function temporalProvenance(init: TemporalProvenanceInit): TemporalProvenance {
  return {
    createdOn: typeof init.createdOn === 'string' ? isoDateTimeStamp(init.createdOn) : init.createdOn,
    createdBy: typeof init.createdBy === 'string' ? iri(init.createdBy) : init.createdBy,
    modifiedOn: typeof init.modifiedOn === 'string' ? isoDateTimeStamp(init.modifiedOn) : init.modifiedOn,
    modifiedBy: typeof init.modifiedBy === 'string' ? iri(init.modifiedBy) : init.modifiedBy,
  };
}
