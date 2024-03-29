// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
declare const require: any;

export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  hash: `${new Date().toISOString().replace(/\.|:|-/g,'')}`,
  firebase: {
    apiKey: "AIzaSyD23wCjWNRqRf2ZwEpF3upBbu0T9CpXe9s",
    authDomain: "jgs-car-fix-tracker.web.app",
    databaseURL: "https://jgs-car-fix-tracker-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "jgs-car-fix-tracker",
    storageBucket: "jgs-car-fix-tracker.appspot.com",
    messagingSenderId: "134382232327",
    appId: "1:134382232327:web:ede0ae36bb125ed53e9ba2"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
