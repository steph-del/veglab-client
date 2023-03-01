// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://${CLIENT_DEV_HOST}',
  apiBaseUrl: 'https://${API_HOST}',
  esAuthorizationPassword: '${ELASTIC_PASSWORD}',
  esBaseUrl: 'https://${ES_HOST}',
  esRepoAuthorizationPassword: '${ES_REPO_PASSWORD}',
  esBaseflorTraitsApi: 'http://51.38.37.216:9200/baseflor',
  pdfBaseUrl: 'https://${API_HOST}/media/veglab/pdf/',
  app : {
    title:           'VegLab',
    unsetTokenValue: 'unset',
    absoluteBaseUrl: '',
  },
  sso: {
    clientId:         '${SSO_CLIENT_ID}',
    baseUrl:          'https://${SSO_HOST}${SSO_URI}',
    loginEndpoint:    'https://${SSO_HOST}${SSO_URI}${SSO_LOGIN_ENDPOINT}',
    logoutEndpoint:   'https://${SSO_HOST}${SSO_URI}${SSO_LOGOUT_ENDPOINT}',
    identiteEndpoint: 'https://${SSO_HOST}${SSO_URI}${SSO_REFRESH_ENDPOINT}',
    refreshEndpoint:  'https://${SSO_HOST}${SSO_URI}${SSO_REFRESH_ENDPOINT}',
    refreshInterval:  '${SSO_REFRESH_INTERVAL}',
    roles: {
      admin: 'admin'
    }
  },
  mapQuestApiKey: 'ApIFfQWsb8jW6bkYDD2i0Sq5BD9moJ3l',
  repo: {
    defaultIdiotaxonRepository: 'bdtfx',
    defaultSyntaxonRepository: 'baseveg'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
