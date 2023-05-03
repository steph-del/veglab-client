/**
 * API User Model
 * Differs from SSO user model : only few properties exists in API User Model
 */
export interface VlUser {
  '@context'?:   string;
  '@id'?:        string;
  '@type'?:      string;
  id:            string;
  firstname:     string;
  lastname:      string;
  email:         string;
  acronym:       string;
  roles:         Array<string>;
}
