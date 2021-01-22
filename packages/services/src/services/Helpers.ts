import { Feature, Category, Timestamp } from '../types';
import moment from 'moment';

export const capitalize = (s: any) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const isFeature = (obj: Feature | Category): obj is Feature => {
  return (<Feature>obj)['title-es'] !== undefined;
};

export const convertTimestamp = (timestamp: Timestamp): moment.Moment => {
  return moment(timestamp.toDate());
};
