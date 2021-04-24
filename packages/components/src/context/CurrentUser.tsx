import React, { useEffect, useRef, useState } from 'react';
import { Languages, User } from 'common';
import { setTranslation, isPlanActive } from 'common';
import Loading from '../primitives/loaders/Loading';
import { ObserveUserService } from 'services';
import { initialState, UserContext } from './initialStates/userState';

export const CurrentUser = React.createContext<UserContext>(initialState);

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

  // If observe user is still loading and there isn't a users (failsafe in case loading doesn't get set)
  if (loading && !user) {
    return <Loading fullPage loading={true} />;
  }

  return (
    <CurrentUser.Provider
      value={{
        user,
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
