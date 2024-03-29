
declare const require: any;

export const environment = {
  production: true,
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
