import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { Teacher } from '../types';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    const arr: Teacher[] = [];

    const collection = firebase.firestore().collection('teachers');
    const teachers = await collection.get();

    teachers.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data() as Teacher;

      arr.push({
        id: snapshot.id,
        name: data.name,
        bio: data.bio,
        photo: data.photo,
        language: data.language,
      });
    });

    console.dir(arr, { maxArrayLength: null });
    // console.dir(JSON.stringify(arr));

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch((err) => {
  console.log(err);
});
