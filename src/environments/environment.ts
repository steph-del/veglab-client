// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost',
  apiBaseUrl: 'https://localhost:8443/api',
  esBaseUrl: 'http://localhost:9200',
  esBaseflorTraitsApi: 'http://localhost:9200/baseflor',
  app : {
    title:           'VegLab',
    unsetTokenValue: 'unset',
    absoluteBaseUrl: '',
  },
  sso: {
    baseUrl:          'http://localhost:8081/service:annuaire:auth',               // https://beta.tela-botanica.org/service:annuaire:auth
    loginEndpoint:    'http://localhost:8081/service:annuaire:auth/connexion',
    logoutEndpoint:   'http://localhost:8081/service:annuaire:auth/deconnexion',
    identiteEndpoint: 'http://localhost:8081/service:annuaire:auth/identite',
    refreshEndpoint:  'http://localhost:8081/service:annuaire:auth/rafraichir',
    refreshInterval:  600000
  },
  tbRepositoriesConfigVegetation: [
    {
      id: 'baseveg',
      label: 'Baseveg',
      levels: ['synusy', 'microcenosis'],
      apiUrl: 'https://api.tela-botanica.org/service:cel/NameSearch/baseveg/',
      apiUrl2: '',
      apiUrlValidOccurence: 'https://api.tela-botanica.org/service:eflore:0.1/baseveg/noms/',
      description_fr: ''
    }
  ],
  tbRepositoriesConfig: [
  ],

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
