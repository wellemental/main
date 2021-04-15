import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { User } from '../types';
import { updateKlaviyoPlan, addToList } from '../klaviyo';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Failed to get firebase instance');
  }

  try {
    const COLLECTION = firebase.firestore().collection('users');

    const result = await COLLECTION.get();

    // Set index to multiple the timeout
    let idx = 0;

    result.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      // Setting timeout so Klaviyo doesn't hit rate limit
      idx = idx + 1;
      setTimeout(async () => {
        const data = snapshot.data() as User;

        if (data) {
          // Exclude testing accounts that I created
          if (data.email && !data.email.includes('test')) {
            console.log('Importing User', data.email ? data.email : 'N/A');
            try {
              await addToList(data.email);
              await updateKlaviyoPlan(data);
            } catch (err) {
              console.log('Error updating user in Klaviyo', data.email);
            }
          }
        }
      }, idx * 500);
    });
    return Promise.resolve();
  } catch (err) {
    console.log('Error getting users collection', err);
    return Promise.reject();
  }
};

run().catch(err => {
  console.log(err);
});
