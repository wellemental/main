import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { Content } from '../types';
// import * as moment from 'moment';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    const arr: Content[] = [];

    const collection = firebase.firestore().collection('content');
    const content = await collection.get();

    content.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data() as Content;

      arr.push({
        id: snapshot.id,
        title: data.title,
        video: data.video,
        video_orientation: data.video_orientation,
        thumbnail: data.thumbnail,
        description: data.description,
        teacher: data.teacher,
        type: data.type,
        tags: data.tags,
        seconds: data.seconds,
        length: data.length,
        language: data.language,
        status: data.status,
        created_at: data.created_at,
      });
    });

    // console.dir(arr, { maxArrayLength: null });
    console.dir(JSON.stringify(arr));
    // console.table(arr);

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch((err) => {
  console.log(err);
});
