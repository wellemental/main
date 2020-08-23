import * as firebasePkg from 'firebase/app';
import { config } from '../config';
import 'firebase/auth';
import 'firebase/firestore';
// import 'firebase/analytics';
// import 'firebase/functions';
// import 'firebase/remote-config';

const firebase = firebasePkg.initializeApp({
  apiKey: config.REACT_APP_FIREBASE_KEY,
  authDomain: config.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: config.REACT_APP_FIREBASE_DATABASE,
  projectId: config.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: config.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.REACT_APP_FIREBASE_SENDER_ID,
  //   measurementId: config.REACT_APP_FIREBASE_MEASUREMENT_ID,
  appId: config.REACT_APP_FIREBASE_APP_ID,
});

export default firebase;
