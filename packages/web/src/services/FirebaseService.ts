import firebase from '../base';
// import FirebaseFirestoreTypes from '@firebase/firestore-types';

export function buildFirestore(): any {
  //FirebaseFirestoreTypes.FirebaseFirestore
  return firebase.firestore();
}
