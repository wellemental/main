import { initializeFirebase } from './initialize';
import * as firebase from 'firebase-admin';
import { ReceiptIap } from '../types';

const run = async (): Promise<void> => {
  const app = initializeFirebase();
  if (!app) {
    console.log('Database initialize failed');
  }

  try {
    const COLLECTION = firebase.firestore().collection('receipts-iap');
    // const result = await COLLECTION.where('timestamp', '>', 1609459200).get();
    const result = await COLLECTION.get();

    const obj: {
      [key: string]: Partial<{
        userId: string;
        timestamp: number;
        timestampDate: Date;
        email: string;
        plan?: { [key: string]: { [key: string]: string } };
      }>;
    } = {};

    // Jan 1 Unix = 1609459200

    result.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data() as ReceiptIap;

      if (data) {
        obj[data.userId] = {
          userId: data.userId,
          timestamp: data.timestamp,
          timestampDate: data.timestampDate,
        };
      }
    });

    console.log('RECEIPT OBJ', obj);

    const userCollection = firebase.firestore().collection('users');
    const users = await userCollection.get();

    users.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
      const data = snapshot.data();

      if (data && !!obj[data.id]) {
        obj[data.id].email = data.email;
        obj[data.id].plan = data.plan ? data.plan : 'None';
      }
    });

    console.log('WITH EMAILS', obj);

    return Promise.resolve();
  } catch (err) {
    console.log('ERROR', err);
    return Promise.reject();
  }
};

run().catch((err) => {
  console.log(err);
});

// FETCHED

// const fetched = {
//   GK3PJhj0grdzdpn21XPUVyOCfFa2: {
//     userId: 'GK3PJhj0grdzdpn21XPUVyOCfFa2',
//     timestamp: 1609553278,
//     timestampDate: null,
//     email: 'williams.sara@gmail.com',
//     plan: {
//       auto_renew_status: true,
//       planId: 'wellemental_pro',
//       nextRenewalUnix: 1612216771,
//       type: 'iosIap',
//       createdAt: [Timestamp],
//       nextRenewalDate: '2021-02-01',
//       status: 'active',
//     },
//   },
//   QcD2ETRUyAVb3wH44wgdNkzvhOv1: {
//     userId: 'QcD2ETRUyAVb3wH44wgdNkzvhOv1',
//     timestamp: 1609709559,
//     timestampDate: null,
//     email: 'nicole@reclamationventures.co',
//     plan: {
//       type: 'iosIap',
//       auto_renew_status: true,
//       planId: 'wellemental_pro',
//       nextRenewalUnix: 1612376714,
//       status: 'active',
//       createdAt: null,
//       nextRenewalDate: '2021-02-03',
//     },
//   },
//   wOxZCNE76UfFIEqOgJcsO0Dr0nM2: {
//     userId: 'wOxZCNE76UfFIEqOgJcsO0Dr0nM2',
//     timestamp: 1610495292,
//     timestampDate: null,
//     email: 'mike.r.vosters@gmail.com',
//     plan: { canceledAtUnix: 1610499610, status: 'canceled' },
//   },
// };
