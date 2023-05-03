/**
 * SSO User Model
 */
export interface UserModel {
  id: string;
  acr: string;
  'allowed-origin': Array<string>;
  azp: string;
  email: string;
  email_verified: boolean;
  given_name: string;           // e.g. Stéphane
  family_name: string;          // e.g. Delplanque
  name: string;                 // e.g. Stéphane Delplanque
  preferred_username: string;   // e.g. stephane

  ressource_access: {           // e.g. ressource_access {
    [key: string]: {            //        "veglab-web": {
      roles: Array<string>      //          roles: ["ROLE_VEGLAB_USER", "ROLE_VEGLAB_ADMIN"]
    }                           //        }
  };                            //      }

  scope: string;                // e.g. "email_profile"
  session_state: string;
  sub: string;
  typ: string;                 // e.g. "Bearer"
  exp: number;
  iat: number;
  iss: string;
  jti: string;
}
