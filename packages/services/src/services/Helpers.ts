import { Feature, Category } from '../types';

export const capitalize = (s: any) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const isFeature = (obj: Feature | Category): obj is Feature => {
  return (<Feature>obj)['title-es'] !== undefined;
};
