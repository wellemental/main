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

run().catch((err) => {
  console.log(err);
});

// import * as firebase from 'firebase-admin';
// import * as functions from 'firebase-functions';
// // import { PlanId } from '../iap';
// import { initializeFirebase } from './initialize';

// const md5 = require('md5');

// // import and initialize Mailchimp instance
// const Mailchimp = require('mailchimp-api-v3');
// const mailchimp = new Mailchimp(functions.config().mailchimp.secret);
// const mcList = functions.config().mailchimp.list;

// type McUserUpdate = {
//   MMERGE5?: string; // Access Code
//   MMERGE6?: Date; // Next Renewal Date
//   MMERGE7?: string; // Language
//   MMERGE8?: string; // Plan
// };

// type McUpdate = { email: string; updates: McUserUpdate };

// const run = async (): Promise<void> => {
//   const app = initializeFirebase();
//   if (!app) {
//     console.log('Firebase initialize failed');
//   }
//   const arr: McUpdate[] = [];
//   try {
//     const COLLECTION = firebase.firestore().collection('users');
//     const result = await COLLECTION.get();

//     result.forEach((snapshot: firebase.firestore.DocumentSnapshot): void => {
//       const data = snapshot.data();

//       if (data) {
//         const updates: McUserUpdate = {
//           MMERGE7: data.language,
//           MMERGE5: data.plan && data.plan.code ? data.plan.code : '',
//           MMERGE8: data.plan && data.plan.status ? data.plan.status : 'free',
//         };

//         if (data.plan && data.plan.nextRenewelDate) {
//           updates.MMERGE6 = data.plan.nextRenewelDate;
//         }

//         arr.push({
//           email: data.email,
//           updates,
//         });
//       }
//     });

//     console.log('Wellemental Users', arr);
//   } catch (err) {
//     console.log('ERROR', err);
//   }

//   const operations = arr.map((user, i) => ({
//     method: 'PUT',
//     path: `/lists/${mcList}/members/${md5(user.email.toLowerCase())}`,
//     operation_id: i,
//     body: {
//       email_address: user.email,
//       status_if_new: 'subscribed',
//       merge_fields: user.updates,
//     },
//   }));
//   try {
//     await mailchimp.batch(operations);
//     console.log('Success');
//     // return Promise.resolve();
//   } catch (err) {
//     console.error(`MC Batch error: ${err}`);
//     // return Promise.reject();
//   }
//   return Promise.resolve();
// };

// run();
