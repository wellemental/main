import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { Languages } from '../types';

// class LanguageService {
//     constructor(
//         language: React.Dispatch<(prevState: undefined) => undefined>,
//       ) {
//         this.userChanged = userChanged;
//       }
// }

export const getTranslation = (language: Languages): void => {
  return language === Languages.Es ? Español : English;
};
