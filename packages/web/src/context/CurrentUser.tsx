import React, { useEffect, useState, useRef } from 'react';
import firebase, { FbUser } from '../base';
import { Unsubscriber, Languages, User } from 'common';
import { English } from 'common';
import { Español } from 'common';
import { Spinner } from '../primitives';
import moment from 'moment';
import { convertTimestamp } from '../services/helpers';
import { setUserProperties } from '../services/TrackerService';

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
            language:
              userData && userData.language ? userData.language : Languages.En,
            favorites: userData && userData.favorites ? userData.favorites : {},
            stripeId:
              userData && userData.stripeId ? userData.stripeId : undefined,
            plan: userData && userData.plan ? userData.plan : undefined,
            totalCompleted: userData.totalCompleted
              ? userData.totalCompleted
              : 0,
            totalPlays: userData.totalPlays ? userData.totalPlays : 0,
            totalSeconds: userData.totalSeconds
              ? Math.floor(userData.totalSeconds / 3600)
              : 0,
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
          };

          setCurrentUser(userDoc);
          setLoading(false);

          // Set GA Firebase User Properties
          setUserProperties(userDoc.id ? userDoc.id : undefined, {
            Payment: userDoc.plan ? userDoc.plan.type : 'Free',
            Type: userDoc.plan ? userDoc.plan.planId : 'Free',
            PlanStatus: userDoc.plan ? userDoc.plan.planId : 'Free',
          });
        }
      });
  };

  if (loading) {
    return <Spinner />;
  }

  // console.log('CURRENT AUTH', currentAuth && currentAuth.uid);
  // console.log('CURRENT USER', currentUser);
  // if (currentUser && currentUser.plan) {
  //   console.log(
  //     'NOW',
  //     moment().unix(),
  //     'NOW DATE',
  //     moment().toDate(),
  //     'RENEWAL',
  //     1613120646, //currentUser.plan.nextRenewalUnix,
  //     'RENEW DATE',
  //     moment.unix(1613120646 * 1000).toDate(),
  //     // moment.unix(currentUser.plan.nextRenewalUnix).toDate(),
  //     'ACTIVE?',
  //     1613120646 > moment().unix(),
  //     // currentUser.plan.nextRenewalUnix > moment().unix(),
  //   );
  // }

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
              (currentUser.plan.nextRenewalUnix > moment().unix() ||
                currentUser.plan.type === 'promoCode'),
      }}>
      {children}
    </CurrentUser.Provider>
  );
};
