import React from 'react';
import { User } from 'services';
import { Translations } from '../types';

export interface CurrentUserState {
  user: User;
  translation: Translations;
}

export const CurrentUser2 = React.createContext({} as CurrentUserState);
