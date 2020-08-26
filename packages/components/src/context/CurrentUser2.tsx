import React from 'react';
import { User } from 'services';

type Translations = { [key: string]: string };

export interface CurrentUserState {
  user: User;
  translation: Translations;
}

export const CurrentUser2 = React.createContext({} as CurrentUserState);
