import { OccurrenceModel } from './occurrence.model';
import { SyntheticColumn } from './synthetic-column.model';
import { OccurrenceValidationModel } from './occurrence-validation.model';
import { Biblio } from './biblio.model';
import { VlUser } from './vl-user.model';

export interface Sye {
  id:                 number;

  userId:             string;  // not mandatory in backend but we force mandatory in front
  userEmail:          string;  // mandatory in backend
  userPseudo:         string;  // not mandatory in backend but we force mandatory in front
  owner:               VlUser;

  originalReference?: string; // needed for table import
  syePosition:        number;
  occurrencesCount:   number;
  occurrences:        Array<OccurrenceModel>;
  occurrencesOrder?:  string;
  syntheticColumn:    SyntheticColumn;
  syntheticSye?: boolean;
  onlyShowSyntheticColumn: boolean;
  validations?:       Array<OccurrenceValidationModel>;
  vlBiblioSource?:    Biblio;
  vlWorkspace:        string;
}
