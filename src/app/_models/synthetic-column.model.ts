import { IdentificationModel } from './identification.model';
import { SyntheticItem } from './synthetic-item.model';
import { Sye } from './sye.model';
import { Biblio } from './biblio.model';
import { VlUser } from './vl-user.model';
import { ExtendedFieldOccurrence } from './extended-field-occurrence';

export interface SyntheticColumn {
  '@id'?:          string;
  id:              number;

  userId:          string;  // not mandatory in backend but we force mandatory in front
  userEmail:       string;  // mandatory in backend
  userPseudo:      string;  // not mandatory in backend but we force mandatory in front
  owner:            VlUser;

  sye:             Sye;
  identifications:     Array<IdentificationModel>;
  items:           Array<SyntheticItem>;
  vlBiblioSource?: Biblio;
  vlWorkspace:     string;
  extendedFieldOccurrences?: Array<ExtendedFieldOccurrence>;
}
