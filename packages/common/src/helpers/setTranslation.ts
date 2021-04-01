import { English, Español } from '../translations';
import { Languages, Translation } from '../types';

export const setTranslation = (language?: Languages): Translation => {
  return language === 'Español' ? Español : English;
};
