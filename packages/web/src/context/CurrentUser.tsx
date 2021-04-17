import React, { useEffect, useState, useRef } from 'react';
import {
  User,
  isPlanActive,
  setTranslation,
  Languages,
  English,
  Translation,
} from 'common';
import { Spinner } from '../primitives';
import ObserveUserService from '../services/ObserveUserService';

// export interface UserContext {
//   user: User | null;
//   loading: boolean;
//   language: Languages;
//   translation: Translation;
//   activePlan: boolean;
//   isAdmin: boolean;
// }

const initialState = {
  user: null,
  loading: true,
  language: Languages.En,
  translation: English,
  activePlan: false,
  isAdmin: false,
};

export const CurrentUser = React.createContext<any>(initialState);

export const CurrentUserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const observeUser = useRef(new ObserveUserService(setUser, setLoading));

  useEffect(() => {
    // On mount, subscribe to auth and playerDoc listeners
    observeUser.current.subscribe();

    // On logout, unsubscribe to auth and playerDoc listeners
    return observeUser.current.unsubscribe;
  }, []);

  // if (loading) {
  //   return <Spinner fullPage />;
  // }

  return (
    <CurrentUser.Provider
      value={{
        user: user,
        loading,
        language: user && user.language ? user.language : Languages.En,
        translation: setTranslation(!user ? undefined : user.language),
        activePlan: isPlanActive(!user ? undefined : user.plan),
        isAdmin: user ? !!user.isAdmin : false,
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
