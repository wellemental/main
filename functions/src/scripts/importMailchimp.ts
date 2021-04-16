import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Get mascots failed');
  }

  try {
    const COLLECTION = firebase.firestore().collection('users');
    const result = await COLLECTION.get();

    const arr: string[] = [];

    result.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data();

      if (data) {
        arr.push(
          `${data.email}|${data.language}|${
            data.plan && data.plan.code ? data.plan.code : 'na'
          }|${data.plan && data.plan.status ? data.plan.status : 'free'}|${
            data.plan && data.plan.planId
              ? data.plan.planId
              : data.plan && data.plan.code
              ? 'promoCode'
              : 'free'
          }`,
        );
      }
    });

    console.log('MHL PLAYERS', JSON.stringify(arr, null, 1));
    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch(err => {
  console.log(err);
});
