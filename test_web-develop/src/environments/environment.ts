// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    appConfig: {
      apiKey: "AIzaSyDwrAwEFF6sCDaUAhoj2OoHtIa4XmQuJ4U",
      authDomain: "gcctoken.firebaseapp.com",
      databaseURL: "https://gcctoken.firebaseio.com",
      projectId: "gcctoken",
      storageBucket: "gcctoken.appspot.com",
      messagingSenderId: "903879673923"
    }
  },
  encodeDecode: {
    clientKey: 'Sa5Juy4Gag14OTAIgG9RYTN21g1swQA0VVYY2o3nHtdZIQ4FKePZMufE5WEVVlO3YKyJxBe0TRywoAt8IjfNquqgaVYGzMlfYHpTwbyy2z2XeYfJ4s1560516420025CCHp6Wj0zBVqrndEimuk4XoN5wCRAyQeDG9v3S8fJZPc7F2TIhLstagYUx1OKlMbE',
    },
  routerLoginAdmin: "abc",
  // host: "http://127.0.0.1:8017",
  host: "http://127.0.0.1:8019",
  hostConversation: "http://127.0.0.1:7020",
  apiKeyChat : "01c0a67b-b6e9-4f6a-89ed-07d03681df4e",
  host_image: "https://well.websy-test.com",
  google_API: "https://translation.googleapis.com/language/translate/v2",
  google_API_KEY : "AIzaSyC5_5R7U9OrXn478uXviYcSRELdkeP3QMI"
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import "zone.js/dist/zone-error";  // Included with Angular CLI.
