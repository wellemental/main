import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { teachers } from './teachers';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    const collection = firebase.firestore().collection('teachers');
    const batch = firebase.firestore().batch();

    const arr = teachers;

    arr.map((teacher) => {
      const ref = collection.doc(teacher.id);
      teacher.updated_at = firebase.firestore.Timestamp.fromDate(new Date());
      batch.set(ref, teacher);
    });

    try {
      await batch.commit();
      console.log(`${arr.length} Items batch added to database!`);
    } catch (err) {
      console.log('Error copying teachers', err);
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
