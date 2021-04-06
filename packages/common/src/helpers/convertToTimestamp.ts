import { firestore } from 'firebase/app';
import { Timestamp } from '../types';

export const convertToTimestamp = (date: Date): Timestamp => {
  return firestore.Timestamp.fromDate(new Date());
};
