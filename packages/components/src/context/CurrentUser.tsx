import React, { useEffect, useState, useRef } from 'react';
// import { auth, firestore } from 'services';
import { Spinner } from '../primitives';
import { User as FBUser } from 'firebase/app';
import { User } from 'services';
import { Unsubscriber } from '../types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const CurrentUser = React.createContext<any>({ currentUser: null });

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<FBUser | null>(
    auth().currentUser,
  );
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  let userDocUnsubscriber: React.MutableRefObject<Unsubscriber | null> = useRef(
    null,
  );

  useEffect(() => {
    // On mount, subscribe to auth and playerDoc listeners
    const authUnsubscriber = auth().onAuthStateChanged((user) => {
      setCurrentAuth(user);

      // Unsubscribe from previous userDoc listener if exists
      if (userDocUnsubscriber.current) {
        userDocUnsubscriber.current();
      }

      // If user logged in, subscribe to their player document
      if (auth) {
        subscribeToUserDoc(user);
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    // If app.tsx unmounts, cleanup all subscriptions
    return function cleanup() {
      if (userDocUnsubscriber.current) {
        userDocUnsubscriber.current();
      }
      authUnsubscriber();
    };
  }, []);

  const subscribeToUserDoc = async (user: User) => {
    console.log('SUBSCRIBING');
    userDocUnsubscriber.current = firestore()
      .collection('users')
      .onSnapshot(async (snapshot: firestore.DocumentSnapshot) => {
        const userData = snapshot.data();

        if (!user.email) {
          return Promise.resolve();
        } else if (!snapshot.exists) {
          return Promise.reject('User doc does not exist.');
        }

        const userDoc: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          subStatus: userData.subStatus,
          actions: userData.actions,
        };
        setCurrentUser(userDoc);
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
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
