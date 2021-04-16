import React, { useEffect, useState, useRef } from 'react';
import { User, isPlanActive, setTranslation } from 'common';
import { Spinner } from '../primitives';
import ObserveUserService from '../services/ObserveUserService';

export const CurrentUser = React.createContext<any>({});

export const CurrentUserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
        translation: setTranslation(!user ? undefined : user.language),
        activePlan: isPlanActive(!user ? undefined : user.plan),
        isAdmin: user ? !!user.isAdmin : false,
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
