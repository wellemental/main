import firebase from '@react-native-firebase/app';
import { Timestamp, FieldValue } from '../types';
import moment from 'moment';

export const increment = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : 1);
};

export const convertTimestamp = (timestamp: Timestamp): moment.Moment => {
  return moment(timestamp.toDate());
};
