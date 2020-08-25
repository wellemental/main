import React, { useEffect, useState, useRef } from 'react';
// import { auth, firestore } from 'services';
import Spinner from '../primitives/Spinner';
import { User } from 'services';
import { Unsubscriber } from '../types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const CurrentUser = React.createContext<any>({ currentUser: null });

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userDocUnsubscriber: React.MutableRefObject<Unsubscriber | null> = useRef(
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
      if (user) {
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

  const subscribeToUserDoc = async (user: FirebaseAuthTypes.User) => {
    userDocUnsubscriber.current = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(async (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
        const userData = snapshot.data();

        if (!user.email) {
          return Promise.resolve();
        } else if (!snapshot.exists) {
          return Promise.reject('User doc does not exist.');
        }

        const userDoc: User = {
          id: user.uid,
          email: userData.email,
          name: userData.name,
          subStatus: userData.subStatus,
          actions: userData.actions,
        };

        setCurrentUser(userDoc);
      });
  };

  return (
    <CurrentUser.Provider
      value={{
        currentAuth,
        currentUser,
        loading,
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
