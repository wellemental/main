import React, { useEffect, useState, useRef } from 'react';
import { User, isPlanActive, setTranslation, Languages } from 'common';
import { Spinner } from '../primitives';
import ObserveUserService from '../services/ObserveUserService';
import { initialState } from './initialStates/userState';

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

  if (loading) {
    return <Spinner fullPage />;
  }

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
