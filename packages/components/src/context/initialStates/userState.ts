import { Languages, English, User, Translation } from 'common';

export interface UserContext {
  user: User | null;
  loading: boolean;
  language: Languages;
  translation: Translation;
  activePlan: boolean;
  isAdmin: boolean;
}

export const initialState: UserContext = {
  user: null,
  loading: true,
  language: Languages.En,
  translation: English,
  activePlan: false,
  isAdmin: false,
};
