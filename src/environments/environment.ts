// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBdo33SThPU1avpGmcZALK3TQhD1Jk8Urg',
    authDomain: 'mycrypto-web-wallet.firebaseapp.com',
    databaseURL: 'https://mycrypto-web-wallet.firebaseio.com',
    projectId: 'mycrypto-web-wallet',
    storageBucket: 'mycrypto-web-wallet.appspot.com',
    messagingSenderId: '972262680456'
  }
};
