import { Timestamp, Moment } from '../types';
import moment from 'moment';

export const convertTimestamp = (timestamp: Timestamp): Moment => {
  return moment(timestamp.toDate());
};
