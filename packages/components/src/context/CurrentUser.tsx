import React, { useEffect, useState } from 'react';
// import { auth, firestore } from 'services';
import { Languages, UpdateUserService, User, UserProfile } from 'services';
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { LocalStateService } from 'services';
import { Spinner } from '../primitives';

const localStateService = new LocalStateService();

const completeOnboarding = async () => {
  const userObj = await localStateService.getUser();
  if (userObj) {
    userObj.onboardingComplete = true;
  }
  await localStateService.setStorage('wmUser', userObj);
};

export const CurrentUser = React.createContext<any>({
  currentUser: {
    onboardingComplete: false,
    language: Languages.En,
    birthday: '',
    name: '',
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
    };

    // Save to AsyncStorage
    await localStateService.setStorage('wmUser', newUser);

    // Set user state
    setCurrentUser(newUser);
  };

  // Update state and storage from Edit Profile
  const updateUser = async (fields: UserProfile) => {
    const mergedFields = { ...currentUser, ...fields };
    // Update Async Storage
    await localStateService.setStorage('wmUser', mergedFields);

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

  useEffect(() => {
    // On mount, subscribe to auth listener
    return auth().onAuthStateChanged((user) => {
      setCurrentAuth(user);

      // If user logged in, get CurrentUser
      if (user) {
        const getLocalUser = async () => {
          try {
            const localUser = await localStateService.getUser();

            if (localUser) {
              // If AsyncStorage exists, set it to user state
              setCurrentUser(localUser);
            } else {
              // If it doesn't exist, get state from firestore
              await getDbUser(user.uid);
            }
          } catch (err) {
            setError(err);
          }
        };

        getLocalUser();
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // If userDoc hasn't been created yet (onboarding not complete), then create it in database
    if (!!currentAuth && !!currentUser && !currentUser.onboardingComplete) {
      setCreatingUser(true);
      const profileService = new UpdateUserService();
      profileService.createProfile({
        id: currentAuth.uid,
        email: currentAuth.email,
        name: currentUser.name,
        birthday: currentUser.birthday,
        language: currentUser.language,
        onboardingComplete: true,
      });
      // Set onboardingComplete locally so this doesn't run after first load
      completeOnboarding();
      setCreatingUser(false);
    }
  }, [currentAuth, currentUser]);

  if (creatingUser) {
    return <Spinner text="Creating account..." />;
  }

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
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
