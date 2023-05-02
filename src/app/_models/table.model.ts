import { IdentificationModel } from './identification.model';
import { Sye } from './sye.model';
import { TableRowDefinition } from './table-row-definition.model';
import { SyntheticColumn } from './synthetic-column.model';
import { PdfFile } from './pdf-file.model';
import { Biblio } from './biblio.model';
import { VlUser } from './vl-user.model';

export interface Table {
  id:              number;

  userId:          string;  // not mandatory in backend but we force mandatory in front
  userEmail:       string;  // mandatory in backend
  userPseudo:      string;  // not mandatory in backend but we force mandatory in front
  owner:            VlUser;
  ownedByCurrentUser: boolean;  // not included in the database ; this field is populated at GET Table (table service)

  isDiagnosis?:    boolean;
  identifications?:    Array<IdentificationModel>;

  createdBy:       string;
  createdAt:       Date;
  updatedBy?:      string;
  updatedAt?:      Date;

  title?:          string;
  description?:    string;

  rowsDefinition:  Array<TableRowDefinition>;

  sye:             Array<Sye>;
  syeOrder:        string;
  syntheticColumn: SyntheticColumn;

  pdf?:            PdfFile;

  vlBiblioSource?: Biblio;

  vlWorkspace:   string;
}
