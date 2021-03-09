import { Feature, Category } from 'common';
import { Timestamp, FieldValue } from '../types';
import moment from 'moment';
import { firestore } from 'firebase/app';

export const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export const slugify = (str: string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

export const unslugify = (str: string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return (
    str
      .toString()
      .toLowerCase()
      .replace(/-/g, ' ') // Replace spaces with -
      //.replace((c) => b.charAt(a.indexOf(c)), p) // Replace special characters
      .replace(/-and-/g, ' & ')
  ); // Replace & with 'and'
  // .replace(/[^\w\-]+/g, '') // Remove all non-word characters
  // .replace(/\-\-+/g, '-') // Replace multiple - with single -
  // .replace(/^-+/, '') // Trim - from start of text
  // .replace(/-+$/, ''); // Trim - from end of text
};

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

export const increment = (amount?: number): FieldValue => {
  return firestore.FieldValue.increment(amount ? amount : 1);
};
