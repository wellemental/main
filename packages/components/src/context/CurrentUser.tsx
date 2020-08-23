import React, { useEffect, useState } from 'react';
import { auth } from 'services';
import { Spinner } from '../primitives';
import { User } from 'firebase/app';

export const CurrentUser = React.createContext<any>({ currentUser: null });

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<User | null>(
    auth().currentUser,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, subscribe to auth and playerDoc listeners
    return auth().onAuthStateChanged((user) => {
      setCurrentAuth(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <CurrentUser.Provider
      value={{
        currentAuth,
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
