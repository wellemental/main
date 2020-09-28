import React, { useEffect, useRef, useState } from 'react';
// import { auth, firestore } from 'services';
import { Languages, UpdateUserService, User, UserProfile } from 'services';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { LocalStateService, UserPlan } from 'services';
import { Spinner } from '../primitives';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const localStateService = new LocalStateService();
const profileService = new UpdateUserService();

export const CurrentUser = React.createContext<any>({
  currentUser: {
    onboardingComplete: false,
    language: Languages.En,
    birthday: '',
    name: '',
    plan: {},
  },
});

export const CurrentUserProvider = ({ children }: any) => {
  const [currentAuth, setCurrentAuth] = useState<FirebaseAuthTypes.User | null>(
    auth().currentUser,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [error, setError] = useState('');

  // const userDocUnsubscriber: React.MutableRefObject<Unsubscriber | null> = useRef(
  //   null,
  // );

  // localStateService.resetStorage();

  // If no AsyncStorage user, get from firestore
  const getDbUser = async (userId): Promise<void> => {
    const userSnap = await firestore().collection('users').doc(userId).get();
    const userData = userSnap.data();

    const newUser = {
      id: userId,
      name: userData.name,
      language: userData.language,
      birthday: userData.birthday,
      onboardingComplete: userData.onboardingComplete,
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
    const authUnsubscriber = auth().onAuthStateChanged((user) => {
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

        // If user just signed up, save their user data to database
        if (!snapshot.exists) {
          setCreatingUser(true);

          try {
            const localUser = await localStateService.getUser();
            if (localUser) {
              // If AsyncStorage exists, set it to user state
              setCurrentUser(localUser);
            }
          } catch (err) {
            console.log('Error getting local user');
          }

          console.log('LOCAL USER', localUser);

          await profileService.createProfile({
            id: currentAuth.uid,
            email: currentAuth.email,
            name: currentUser.name,
            birthday: currentUser.birthday,
            language: currentUser.language,
            onboardingComplete: true,
          });

          // Set onboardingComplete locally so this doesn't run after first load
          setCreatingUser(false);
        }

        // If user isn't logged in or doc doesn't exist
        if (!user.email) {
          return Promise.resolve();
        } else if (!snapshot.exists) {
          return Promise.reject('User doc does not exist.');
        }

        // Build user doc
        const userDoc: User = {
          name: userData.name,
          language: userData.language,
          birthday: userData.birthday,
          favorites: userData.favorites,
          plan: userData.plan,
        };

        setCurrentUser(userDoc);
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

  if (creatingUser) {
    return <Spinner text="Creating account..." />;
  }

  console.log('CURRENT USER', currentUser);

  return (
    <CurrentUser.Provider
      value={{
        currentAuth,
        currentUser,
        loading,
        translation:
          currentUser && currentUser.language === 'Español' ? Español : English,
        updateUser,
        updateFavorites,
        getDbUser,
        activePlan:
          !auth || !currentUser
            ? false
            : currentUser &&
              currentUser.plan &&
              currentUser.plan.status === 'active',
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
