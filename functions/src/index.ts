import * as functions from 'firebase-functions';
// import { webhookListen, StripeEvent } from './stripe';
import { validateIap, renewOrCancelSubscriptions } from './iap';
import * as firebase from 'firebase-admin';

// Initialize Firebase
firebase.initializeApp();

// const onWebhookListen = webhookListen;

// export const updatePlayerSubscription = (
//   eventId: string,
//   eventData: StripeEvent,
// ): string => {
//   // const user = firebase.firestore().collection('users').doc(user.uid);

//   return eventId;
// };

// const onAddStripeEvent = functions.firestore
//   .document('events/{eventId}')
//   .onWrite((change, context) => {
//     const {
//       params: { eventId },
//     } = context;
//     let eventData = eventId;
//     if (change.after.exists) {
//       eventData = change.after.data() as StripeEvent;
//       // return updatePlayerSubscription(eventId, eventData);
//     }

//     // if (eventData.cancel_at_period_end) {
//     // }

//     return Promise.resolve(eventData);
//   });

// Triggers on signup
const createStreamTokenAndClaims = async (
  user: firebase.auth.UserRecord,
): Promise<void> => {
  const userDoc = firebase.firestore().collection('players').doc(user.uid);

  try {
    await userDoc.set({
      id: user.uid,
      email: user.email,
      createdAt: firebase.firestore.Timestamp.fromDate(
        new Date(user.metadata.creationTime),
      ),
    });
  } catch (err) {
    console.log('Error creating user doc: ', err);
  }

  return;
};

const createUser = functions.https.onCall();

const onCreateUser = functions.auth.user().onCreate(async (user) => {
  const userDoc = firebase.firestore().collection('users').doc(user.uid);

  try {
    await userDoc.set({
      id: user.uid,
      email: user.email,
      createdAt: firebase.firestore.Timestamp.fromDate(
        new Date(user.metadata.creationTime),
      ),
    });
  } catch (err) {
    console.log('Error creating user doc: ', err);
  }

  return;
});

const onValidateIap = functions.https.onCall(validateIap);

const EVERY_HOUR_CRON = '0 * * * *';
const runRenewOrCancelSubs = functions.pubsub
  .schedule(EVERY_HOUR_CRON)
  .onRun(renewOrCancelSubscriptions);

export {
  // onWebhookListen,
  // onAddStripeEvent,
  onValidateIap,
  runRenewOrCancelSubs,
};
