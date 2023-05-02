import { UserModel } from './user.model';
import { VlUser } from './vl-user.model';

export interface IdentificationModel {
  id?:               number;
  validatedBy:       string;    // user id
  validatedAt:       Date;
  owner:              VlUser;
  updatedBy?:        string;     // user id
  updatedAt?:        Date;
  repository:        string;
  repositoryIdNomen: number;
  repositoryIdTaxo?: string;
  inputName:         string;
  validatedName:     string;
  validName:         string;
  userIdValidation?: string;    // Not in DB
  // isDiagnosis?:      boolean;
}
