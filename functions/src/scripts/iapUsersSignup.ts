import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
// import * as moment from 'moment';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    // const obj: {
    //   [key: string]: Partial<{
    //     userId: string;
    //     timestamp: number;
    //     timestampDate: Date;
    //     email: string;
    //     plan?: { [key: string]: { [key: string]: string } };
    //   }>;
    // } = {};

    const arr: {
      userId: string;
      email: string;
      plan?: { [key: string]: { [key: string]: string } } | string;
      created_at: Date;
    }[] = [];

    const userCollection = firebase.firestore().collection('users');
    //   .where('created_at', '>', 1609649776);
    const users = await userCollection.get();

    users.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data();

      if (data && data.id) {
        // data[data.id] = {};
        // console.log('DATA OBJ', data[data.id]);
        // Jan 1 Unix = 1609459200
        // Jan 3 Unix = 160964977
        // 1607509833;

        if (
          ((data.plan && data.plan.type !== 'promoCode') || !data.plan) &&
          !data.email.includes('test')
        ) {
          arr.push({
            email: data.email,
            userId: data.id,
            plan: data.plan ? JSON.stringify(data.plan) : 'None',
            created_at: data.created_at.toDate(),
          });
          //     `'Email': ${data.email} | UID: ${data.id} | PLAN: ${
          //       data.plan ? JSON.stringify(data.plan) : 'None'
          //     } | CREATED_AT: ${moment(data.created_at.seconds).toDate()}  //`,
          //   );
        }

        // obj[data.id].userId = data.id;
        // obj[data.id].email = data.email;
        // obj[data.id].plan = data.plan ? data.plan : 'None';
      }
    });

    // console.log('USERS ARR', arr);
    // console.dir(arr, { maxArrayLength: null });
    console.table(arr);

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch((err) => {
  console.log(err);
});
