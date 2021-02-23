import * as firebasePkg from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/functions';
import 'firebase/remote-config';
// import FirebaseFirestoreTypes from '@firebase/firestore-types';

const firebase = firebasePkg.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export type { User as FbUser } from 'firebase/app';
export const analytics = firebase.analytics;
export const auth = firebase.auth;
// export FirebaseFirestoreTypes;
// export const FirestoreModule = firebase.firestore.Query;
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
export type Query = firebase.firestore.Query;
export type DocumentData = firebase.firestore.DocumentData;
export const firestore = firebase.firestore();
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export default firebase;
