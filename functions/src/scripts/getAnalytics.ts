// Script to backfill all the analytics weeks from the beginning
import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import {
  PlayEvent,
  Platforms,
  // UserPlan,
  Favorite,
  PlatformStat,
  Week,
  FbUserPlan,
  User,
} from '../types';
import * as moment from 'moment';

type StatObj = { [key: string]: PlatformStat };

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  const defaultPlatformStat = {
    android: 0,
    ios: 0,
    web: 0,
    total: 0,
  };

  const dateFormat = 'YYYY-MM-DD';
  const plays: StatObj = {};
  const completions: StatObj = {};
  const favorites: StatObj = {};
  const signups: StatObj = {};
  const cancelledSubs: StatObj = {};
  const newSubs: StatObj = {};

  // Determine if play is the same isoWeek
  //   const isThisWeek = (docDate: moment.Moment, currWeek: number) => {
  //     return docDate.isoWeek() === currWeek ? true : false;
  //   };

  const incrementPlatform = (
    sundayStr: string | undefined,
    statObj: StatObj,
    platform: Platforms,
    shouldIncrement?: boolean,
  ) => {
    // Increment if shouldIncrement is undefined or false
    const willIncrement =
      shouldIncrement === undefined ? true : shouldIncrement;

    if (sundayStr) {
      // Create PlatformStat object for the week if it doesn't already exist
      if (!statObj[sundayStr]) {
        statObj[sundayStr] = { ...defaultPlatformStat };
      }

      if (willIncrement) {
        // Increment Totals
        statObj[sundayStr].total++;

        // Increment Platforms
        if (platform === Platforms.iOS) {
          statObj[sundayStr].ios++;
        }
        if (platform === Platforms.Android) {
          statObj[sundayStr].android++;
        }
        if (platform === Platforms.Web) {
          statObj[sundayStr].web++;
        }
      }
    }
  };

  const incrementSubs = (
    sundayStr: string | undefined,
    statObj: StatObj,
    type: 'iosIap' | 'android' | 'stripe' | 'promoCode',
  ) => {
    if (!!sundayStr) {
      // Create PlatformStat object for the week if it doesn't already exist
      if (!statObj[sundayStr]) {
        statObj[sundayStr] = { ...defaultPlatformStat };
      }

      // Increment stat total
      statObj[sundayStr].total++;

      // Increment New Subscription Platforms
      if (type === 'iosIap') {
        statObj[sundayStr].ios++;
      }
      if (type === 'android') {
        statObj[sundayStr].android++;
      }
      if (type === 'stripe') {
        statObj[sundayStr].web++;
      }
    }
  };

  // Get Sunday date string
  const getSundayString = (createdAt: firebase.firestore.Timestamp): string => {
    const createdAtMoment = moment(createdAt.toDate());
    const sunday = createdAtMoment.isoWeekday(7).format(dateFormat);
    return sunday;
  };

  const getSundayFromUnix = (unix: number): string => {
    const createdAtMoment = moment.unix(unix);
    const sunday = createdAtMoment.isoWeekday(7).format(dateFormat);
    return sunday;
  };

  //*********************************
  // GET PLAYS AND COMPLETIONS
  //*********************************
  const getPlays = async (): Promise<void> => {
    try {
      const collection = firebase.firestore().collectionGroup('plays');

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as PlayEvent;
          const thisSundayStr = getSundayString(data.createdAt);

          // Increment Plays
          incrementPlatform(thisSundayStr, plays, data.platform);

          // Increment Completions
          incrementPlatform(
            thisSundayStr,
            completions,
            data.platform,
            !!data.completed,
          );

          // if (!plays[thisSundayStr]) {
          //   plays[thisSundayStr] = { ...defaultPlatformStat };
          // }

          // if (!completions[thisSundayStr]) {
          //   completions[thisSundayStr] = { ...defaultPlatformStat };
          // }

          // // Increment Totals
          // plays[thisSundayStr].total++;
          // if (!!data.completed) {
          //   completions[thisSundayStr].total++;
          // }

          // // Increment Platforms
          // if (data.platform === Platforms.iOS) {
          //   plays[thisSundayStr].ios++;

          //   if (!!data.completed) {
          //     completions[thisSundayStr].ios++;
          //   }
          // }
          // if (data.platform === Platforms.Android) {
          //   plays[thisSundayStr].android++;

          //   if (!!data.completed) {
          //     completions[thisSundayStr].android++;
          //   }
          // }
          // if (data.platform === Platforms.Web) {
          //   plays[thisSundayStr].web++;

          //   if (!!data.completed) {
          //     completions[thisSundayStr].web++;
          //   }
          // }
          return;
        }),
      );
      console.log('GET PLAYS', plays, completions);
      return Promise.resolve();
    } catch (error) {
      console.log('Error getting weekly plays analytics', error);
      return Promise.reject();
    }
  };

  //*********************************
  // GET FAVS
  //*********************************
  const getFavs = async (): Promise<void> => {
    try {
      const collection = firebase.firestore().collectionGroup('favorites');

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as Favorite;
          const thisSundayStr = getSundayString(data.createdAt);

          // Increment Completions
          incrementPlatform(
            thisSundayStr,
            favorites,
            data.platform,
            !!data.favorited,
          );

          return Promise.resolve();
        }),
      );
      console.log('GET Favorites', favorites);
      return Promise.resolve();
    } catch (error) {
      console.log('Error getting weekly favorites analytics', error);
      return Promise.reject();
    }
  };

  //*********************************
  // GET ALL SIGNUPS AND SUBSCRIPTIONS
  //*********************************
  const getSignups = async (): Promise<void> => {
    try {
      const collection = firebase.firestore().collection('users');

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as User;
          // Early account didn't have created_at field it seems
          const thisSundayStr =
            data.created_at && getSundayString(data.created_at);

          incrementPlatform(thisSundayStr, signups, data.platform);

          // Increment Subscription Totals
          if (!!data.plan) {
            const plan = data.plan as FbUserPlan;

            const subSundayStr =
              plan.createdAt && getSundayString(plan.createdAt);

            // Increment New Subscriptions
            incrementSubs(subSundayStr, newSubs, plan.type);

            // Increment Cancelled Subscriptions
            const subCancelSundayStr = !!plan.canceledAtUnix
              ? getSundayFromUnix(plan.canceledAtUnix)
              : undefined;

            incrementSubs(subCancelSundayStr, cancelledSubs, plan.type);
          }

          return Promise.resolve();
        }),
      );
      console.log('GET Signups', signups);
      console.log('GET newSubs', newSubs);
      return Promise.resolve();
    } catch (error) {
      console.log('Error getting weekly signup analytics', error);
      return Promise.reject();
    }
  };

  //*********************************
  // ADD ANALYTICS TO FIRESTORE
  //*********************************
  const addWeek = async (date: moment.Moment): Promise<void> => {
    const sundayStr = date.format(dateFormat);

    console.log('SUNDAY ADDING', sundayStr);
    try {
      // Create week
      const thisWeek: Week = {
        id: sundayStr,
        year: date.year(),
        isoWeek: date.isoWeek(),
        startDate: date.subtract(6, 'days').format(dateFormat),
        endDate: sundayStr,
        plays: plays[sundayStr] ? plays[sundayStr] : { ...defaultPlatformStat },
        completions: completions[sundayStr]
          ? completions[sundayStr]
          : { ...defaultPlatformStat },
        favs: favorites[sundayStr]
          ? favorites[sundayStr]
          : { ...defaultPlatformStat },
        signups: signups[sundayStr]
          ? signups[sundayStr]
          : { ...defaultPlatformStat },
        newSubs: newSubs[sundayStr]
          ? newSubs[sundayStr]
          : { ...defaultPlatformStat },
        cancellations: cancelledSubs[sundayStr]
          ? cancelledSubs[sundayStr]
          : { ...defaultPlatformStat },
      };
      await firebase
        .firestore()
        .collection('analytics/weekly/weeks')
        .doc(sundayStr)
        .set(thisWeek);

      return Promise.resolve();
    } catch (error) {
      console.log('Error savings plays to database', error);
      return Promise.reject();
    }
  };

  const getAll = async () => {
    try {
      await getPlays();
      await getFavs();
      await getSignups();
    } catch (error) {
      console.log('GET ALL ERROR', error);
    }

    // This didn't work for some reason, kept subtracting 13-14 days each loop
    // let sun = moment('2021-04-04');
    // while (sun.isAfter('2020-10-12')) {
    //   console.log('WHILE SUNDAY', sun);
    //   sun.subtract(7, 'days');
    // }

    // Manual hack to backfill bc moment while loop wasn't working
    const weeks: string[] = [
      '2021-04-11',
      '2021-04-04',
      '2021-03-28',
      '2021-03-21',
      '2021-03-14',
      '2021-03-07',
      '2021-02-28',
      '2021-02-21',
      '2021-02-14',
      '2021-02-07',
      '2021-01-31',
      '2021-01-24',
      '2021-01-17',
      '2021-01-10',
      '2021-01-03',
      '2020-12-27',
      '2020-12-20',
      '2020-12-13',
      '2020-12-06',
      '2020-11-29',
      '2020-11-22',
      '2020-11-15',
      '2020-11-08',
      '2020-11-01',
      '2020-10-25',
      '2020-10-18',
    ];

    weeks.forEach(async week => {
      await addWeek(moment(week));
    });
  };

  await getAll();

  return Promise.resolve();
};

run().catch(err => {
  console.log(err);
});
