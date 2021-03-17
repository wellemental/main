import { Translation } from '../types';

export const getTranslation = (phrase: string, translation: Translation) => {
  if (translation[phrase]) {
    return translation[phrase];
  } else {
    return phrase;
  }
};
