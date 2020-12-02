import React, { useEffect, useState, useRef } from 'react';
import firebase, { FbUser } from '../base';
import { Unsubscriber, Languages, User } from '../types';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { Spinner } from '../primitives';

export const CurrentUser = React.createContext<any>({
  currentUser: {
    language: Languages.En,
    plan: {},
  },
});

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<FbUser | null>(
    firebase.auth().currentUser,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userDocUnsubscriber: React.MutableRefObject<Unsubscriber | null> = useRef(
    null,
  );

  useEffect(() => {
    // On mount, subscribe to auth and playerDoc listeners
    const authUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
      // if (!localState) {
      //   setLoading(true);
      // }
      setCurrentAuth(user);

      // Unsubscribe from previous userDoc listener if exists
      if (userDocUnsubscriber.current) {
        userDocUnsubscriber.current();
      }

      // If user logged in, get CurrentUser
      if (user) {
        subscribeToUserDoc(user);
      } else {
        setCurrentUser(null);
      }

      // If app.tsx unmounts, cleanup all subscriptions
      return function cleanup() {
        if (userDocUnsubscriber.current) {
          userDocUnsubscriber.current();
        }
        authUnsubscriber();
      };
    });
  }, []);

  const subscribeToUserDoc = async (user: FbUser) => {
    userDocUnsubscriber.current = firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot((snapshot: any) => {
        // If user isn't logged in or doc doesn't exist
        if (!user.email) {
          return Promise.resolve();
        }

        // Build user doc
        if (snapshot) {
          const userData = snapshot.data();

          const userDoc: User = {
            // name: userData.name,
            language: userData.language,
            // birthday: userData.birthday,
            favorites: userData.favorites,
            stripeId: userData.stripeId,
            plan: userData.plan,
          };

          setCurrentUser(userDoc);
          setLoading(false);
        }
      });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <CurrentUser.Provider
      value={{
        currentAuth,
        currentUser,
        loading,
        translation:
          currentUser && currentUser.language === 'Español' ? Español : English,
        // updateUser,
        // updateFavorites,
        // getDbUser,
        activePlan:
          !currentAuth || !currentUser
            ? false
            : currentUser &&
              currentUser.plan &&
              currentUser.plan.status === 'active',
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
