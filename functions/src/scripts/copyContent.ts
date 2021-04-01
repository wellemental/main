import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { contentArr } from './content';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    const collection = firebase.firestore().collection('content');
    const batch = firebase.firestore().batch();

    // const arr = contentArr.slice(0, 2);
    const arr = contentArr;

    arr.map((content) => {
      const ref = collection.doc(content.id);
      content.updated_at = firebase.firestore.Timestamp.fromDate(new Date());
      batch.set(ref, content);
    });

    try {
      await batch.commit();
      console.log(`${contentArr.length} Items batch added to database!`);
    } catch (err) {
      console.log('Error copying content', err);
    }

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch((err) => {
  console.log(err);
});
