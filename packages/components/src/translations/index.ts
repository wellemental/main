import { English } from './en.js';
import { Español } from './es.js';
import { Languages } from 'services';

export const getTranslation = (language: Languages): void => {
  return language === Languages.Es ? Español : English;
};
