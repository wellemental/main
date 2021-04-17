import { Languages, English } from 'common';

// export interface UserContext {
//   user: User | null;
//   loading: boolean;
//   language: Languages;
//   translation: Translation;
//   activePlan: boolean;
//   isAdmin: boolean;
// }

export const initialState = {
  user: null,
  loading: true,
  language: Languages.En,
  translation: English,
  activePlan: false,
  isAdmin: false,
};
