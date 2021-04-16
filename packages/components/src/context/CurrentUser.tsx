import React, { useEffect, useRef, useState } from 'react';
import { Languages, User, UserProfile } from 'common';
import { firestore, auth, LocalStateService } from 'services';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { English, Español, Unsubscriber } from 'common';
import moment from 'moment';
import { convertTimestamp } from 'services';
import Loading from '../primitives/loaders/Loading';

const localStateService = new LocalStateService();

export const CurrentUser = React.createContext<any>({
  currentUser: {
    language: Languages.En,
    plan: {},
  },
});

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // If no AsyncStorage user, get from firestore
  const getDbUser = async (userId): Promise<void> => {
    const userSnap = await firestore().collection('users').doc(userId).get();
    const userData = userSnap.data();

    const newUser = {
      id: userId,
      language: userData.language ? userData.language : Languages.En,
      favorites: userData.favorites,
      plan: userData.plan,
    };

    // Save to AsyncStorage
    await localStateService.setStorage('wmUser', newUser);

    // Set user state
    setCurrentUser(newUser);
  };

  // Update state and storage from Edit Profile
  const updateUser = async (fields: Partial<UserProfile>) => {
    const mergedFields = { ...currentUser, ...fields };

    // Update Async Storage
    try {
      await localStateService.setStorage('wmUser', mergedFields);
    } catch (err) {
      return Promise.reject('Error updating user settings');
    }
    // Update CurrentUser state
    setCurrentUser({ ...mergedFields, updated_at: new Date() });
  };

  // Update state and storage from Edit Profile
  const updateFavorites = async (contentId: string, isFav: boolean) => {
    const mergedFields = {
      ...currentUser,
      favorites: {
        ...currentUser.favorites,
        [contentId]: {
          favorited: isFav,
          updated_at: new Date(),
        },
      },
    };
    // Update Async Storage
    await localStateService.setStorage('wmUser', mergedFields);
    // Update CurrentUser state
    setCurrentUser({ ...mergedFields, updated_at: new Date() });
  };

  const userDocUnsubscriber: React.MutableRefObject<Unsubscriber | null> = useRef(
    null,
  );

  useEffect(() => {
    // On mount, subscribe to auth listener
    const authUnsubscriber = auth().onAuthStateChanged(user => {
      setCurrentAuth(user);

      // Unsubscribe from previous userDoc listener if exists
      if (userDocUnsubscriber.current) {
        userDocUnsubscriber.current();
      }

      // If user logged in, get CurrentUser
      if (user) {
        setLoading(true);
        subscribeToUserDoc(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
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
      .onSnapshot((snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
        // If user isn't logged in or doc doesn't exist
        if (!user.email) {
          return Promise.resolve();
        }

        // Build user doc
        if (snapshot) {
          const userData = snapshot.data();

          const userDoc: User = {
            language: userData.language,
            favorites: userData.favorites,
            plan: userData.plan,
            totalCompleted: userData.totalCompleted
              ? userData.totalCompleted
              : 0,
            totalPlays: userData.totalPlays ? userData.totalPlays : 0,
            totalSeconds: userData.totalSeconds ? userData.totalSeconds : 0,
            // If lastPlay isn't yesterday or today, streak should be 0
            streak:
              userData.lastPlay &&
              convertTimestamp(userData.lastPlay).isSameOrAfter(
                moment().subtract(1, 'day'),
                'day',
              )
                ? userData.streak
                : 0,
            firstPlay: userData.firstPlay
              ? convertTimestamp(userData.firstPlay).toDate()
              : undefined,
            lastPlay: userData.lastPlay
              ? convertTimestamp(userData.lastPlay).toDate()
              : undefined,
            promptedNotification: userData.promptedNotification
              ? userData.promptedNotification
              : false,
          };

          setCurrentUser(userDoc);
        }
        setLoading(false);
      });
  };

  const prevUser = useRef(currentUser);
  useEffect(() => {
    if (
      currentUser &&
      JSON.stringify(prevUser) !== JSON.stringify(currentUser)
    ) {
      localStateService.setStorage('wmUser', currentUser);
    }

    // if (auth && !currentUser) {
    //   const getLocaluser = async () => {
    //     try {
    //       const localUser = await localStateService.getUser();

    //       if (localUser) {
    //         // If AsyncStorage exists, set it to user state
    //         setCurrentUser(localUser);
    //       }
    //     } catch (err) {
    //       setError(err);
    //     }
    //   };

    //   getLocaluser();
    // }
  }, [currentUser]);

  return (
    <Loading fullPage loading={loading}>
      <CurrentUser.Provider
        value={{
          currentAuth,
          currentUser,
          loading,
          translation:
            currentUser &&
            currentUser.language &&
            currentUser.language === 'Español'
              ? Español
              : English,
          updateUser,
          updateFavorites,
          getDbUser,
          // activePlan: isPlanActive(!user ? undefined : user.plan),
          activePlan:
            !auth || !currentUser
              ? false
              : currentUser &&
                currentUser.plan &&
                (currentUser.plan.nextRenewalUnix > moment().unix() ||
                  currentUser.plan.type === 'promoCode'),
        }}>
        {children}
      </CurrentUser.Provider>
    </Loading>
  );
};
