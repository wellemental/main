import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { PlayEvent, Platforms, Favorite, PlatformStat, Week } from '../types';
import * as moment from 'moment';
import { firestore } from 'firebase-admin';

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
  const plays: { [key: string]: PlatformStat } = {};
  const completions: { [key: string]: PlatformStat } = {};
  const favorites: { [key: string]: PlatformStat } = {};

  // Determine if play is the same isoWeek
  //   const isThisWeek = (docDate: moment.Moment, currWeek: number) => {
  //     return docDate.isoWeek() === currWeek ? true : false;
  //   };

  // Get Sunday date string
  const getSundayString = (createdAt: firestore.Timestamp): string => {
    const createdAtMoment = moment(createdAt.toDate());
    return createdAtMoment.isoWeekday(7).format(dateFormat);
  };

  //*********************************
  // GET PLAYS AND COMPLETIONS
  //*********************************
  const getPlays = async (): Promise<void> => {
    // const plays = { ...defaultPlatformStat };
    // const completions = { ...defaultPlatformStat };

    try {
      const collection = firebase.firestore().collectionGroup('plays');

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as PlayEvent;
          const thisSundayStr = getSundayString(data.createdAt);

          if (!plays[thisSundayStr]) {
            plays[thisSundayStr] = { ...defaultPlatformStat };
          }

          if (!completions[thisSundayStr]) {
            completions[thisSundayStr] = { ...defaultPlatformStat };
          }
          // Convert createdAt timestamp to moment
          //   const createdAtMoment = moment(data.createdAt.toDate());

          // If the play wasn't in the same week, return and don't increment anything
          //   if (!isThisWeek(createdAtMoment, week)) {
          //     return Promise.reject();
          //   }

          // Increment Totals
          plays[thisSundayStr].total++;
          if (!!data.completed) {
            completions[thisSundayStr].total++;
          }

          // Increment Platforms
          if (data.platform === Platforms.iOS) {
            plays[thisSundayStr].ios++;

            if (!!data.completed) {
              completions[thisSundayStr].ios++;
            }
          }
          if (data.platform === Platforms.Android) {
            plays[thisSundayStr].android++;

            if (!!data.completed) {
              completions[thisSundayStr].android++;
            }
          }
          if (data.platform === Platforms.Web) {
            plays[thisSundayStr].web++;

            if (!!data.completed) {
              completions[thisSundayStr].web++;
            }
          }
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

          if (!favorites[thisSundayStr]) {
            favorites[thisSundayStr] = { ...defaultPlatformStat };
          }

          // If the play wasn't in the same week, return and don't increment anything
          //   if (!isThisWeek(createdAtMoment, week)) {
          //     return Promise.reject();
          //   }

          // Increment Totals
          if (!!data.favorited) {
            favorites[thisSundayStr].total++;

            // Increment Platforms
            if (data.platform === Platforms.iOS) {
              favorites[thisSundayStr].ios++;
            }
            if (data.platform === Platforms.Android) {
              favorites[thisSundayStr].android++;
            }
            if (data.platform === Platforms.Web) {
              favorites[thisSundayStr].web++;
            }
          }

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
      };
      await firebase
        .firestore()
        .collection('analytics-weekly')
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
    } catch (error) {
      console.log('GET ALL ERROR', error);
    }

    let sun = moment().isoWeekday(7);

    while (sun.isAfter('2020-10-12')) {
      console.log('WHILE SUNDAY', sun);
      addWeek(sun);
      sun = sun.subtract(7, 'days');
    }
  };

  await getAll();

  return Promise.resolve();
};

run().catch(err => {
  console.log(err);
});
