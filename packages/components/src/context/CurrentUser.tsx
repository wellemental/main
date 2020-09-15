import React, { useEffect, useState, useRef } from 'react';
// import { auth, firestore } from 'services';
import { Languages, UpdateUserService, User, LocalUser } from 'services';
import { Unsubscriber } from '../types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { LocalStateService } from 'services';
import { Spinner } from '../primitives';

// Store bday, language, username, and email during signup
// After nav transitions, pull data from localStorage and create userDoc

// setCurrentUser: () => {},

const service = new LocalStateService();

const getLocalUser = async (): Promise<LocalUser> => {
  try {
    const res = await service.getStorage('wmUser');
    return JSON.parse(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
const completeOnboarding = async () => {
  const json = await getLocalUser();
  json.onboardingComplete = true;
  await service.setStorage('wmUser', JSON.stringify(json));
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

  useEffect(() => {
    // If userDoc hasn't been created yet, then create it in database
    if (!!currentAuth && !!currentUser && !currentUser.onboardingComplete) {
      console.log('CREATING USER DOC******');
      console.log('CURRENT AUTH******', !!currentAuth);
      console.log('CURRENT USER******', !!currentUser);
      console.log('CURRENT ONB******', !currentUser.onboardingComplete);
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

  const subscribeToUserDoc = async (user: FirebaseAuthTypes.User) => {
    const usersRef = firestore().collection('users').doc(user.uid);

    userDocUnsubscriber.current = usersRef.onSnapshot(
      async (snapshot: FirebaseFirestoreTypes.DocumentSnapshot) => {
        const userData = snapshot.data();

        // If user isn't logged in or doc doesn't exist
        if (!user.email) {
          return Promise.resolve();
        }

        if (!snapshot.exists) {
          console.log('SNAPSHOT DOESNT EXIST, CREATE IT');
          // If userDoc doesn't exist, create it
          const getUser = async () => {
            try {
              const res = await getLocalUser();
              setCurrentUser(res);
            } catch (err) {
              setError(err);
            }
          };

          getUser();
        } else {
          // Build user doc
          const userDoc: User = {
            name: userData.name,
            language: userData.language,
            birthday: userData.birthday,
            subStatus: userData.subStatus,
            actions: userData.actions,
            onboardingComplete: userData.onboardingComplete,
          };

          setCurrentUser(userDoc);
        }
      },
    );
  };

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
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
