import React from 'react';
import { User } from 'services';
import { Translation } from '../types';

export interface CurrentUserState {
  user: User;
  translation: Translation;
}

export const CurrentUser2 = React.createContext({} as CurrentUserState);
