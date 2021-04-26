import firebase from 'firebase/app';
import { FieldValue } from '../types';

export const increment = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : 1);
};
