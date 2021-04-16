import * as admin from 'firebase-admin';
// import moment from 'moment';
import { Platforms, PlayEvent } from '../types';

export const getPlays = async (id: string) => {
  const plays = {
    android: 0,
    ios: 0,
    web: 0,
    total: 0,
  };

  const completed = {
    android: 0,
    ios: 0,
    web: 0,
    total: 0,
  };

  try {
    const collection = admin.firestore().collectionGroup('plays');

    await collection.get().then(snapshots =>
      snapshots.docs.forEach(doc => {
        const data = doc.data() as PlayEvent;

        // Increment Totals
        plays.total++;
        if (!!data.completed) {
          completed.total++;
        }

        // Increment Platforms
        if (data.platform === Platforms.iOS) {
          plays.ios++;

          if (!!data.completed) {
            completed.ios++;
          }
        }
        if (data.platform === Platforms.Android) {
          plays.android++;

          if (!!data.completed) {
            completed.android++;
          }
        }
        if (data.platform === Platforms.Web) {
          plays.web++;

          if (!!data.completed) {
            completed.web++;
          }
        }
      }),
    );
  } catch (error) {
    console.log('Error getting weekly plays analytics', error);
  }

  return plays;
};

// const getWeek = () => {};
