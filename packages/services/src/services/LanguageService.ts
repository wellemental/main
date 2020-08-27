import { English as ogEnglish } from '../translations/en.js';
import { Español as ogEspañol } from '../translations/es.js';
import { Languages } from '../types';

export const English = ogEnglish;
export const Español = ogEspañol;

export const getTranslation = (language: Languages): void => {
  return language === Languages.Es ? Español : English;
};
