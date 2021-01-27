import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import {
  webhookListen,
  startSubscription,
  cancelSubscription,
  getBillingPortal,
} from './stripe';
import { updateUserPlan } from './user';
import { validateIap, renewOrCancelSubscriptions } from './iap';
import { StripeEvent, PlayEvent, FieldValue } from './types';

// Initialize Firebase
firebase.initializeApp();

const onWebhookListen = webhookListen;
const onStartSubscription = functions.https.onCall(startSubscription);
const onGetBillingPortal = functions.https.onCall(getBillingPortal);
const onCancelSubscription = functions.https.onCall(cancelSubscription);

const onAddStripeEvent = functions.firestore
  .document('stripe-events/{eventId}')
  .onWrite((change, context) => {
    const {
      params: { eventId },
    } = context;
    let eventData = eventId;
    if (change.after.exists) {
      eventData = change.after.data() as StripeEvent;
      return updateUserPlan(eventId, eventData);
    }

    return Promise.resolve(eventData);
  });

const onValidateIap = functions.https.onCall(async (data, context) => {
  try {
    await validateIap(data, context);
    return { status: 'OK' };
  } catch (err) {
    console.error(err);
    return { status: 'Server error' };
  }
});

export const increment = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : 1);
};

// Increment content stat for totalPlays when created
const onPlayAdd = functions.firestore
  .document('users/{userId}/plays/{playId}')
  .onCreate(async (doc) => {
    // Pull contentId from the new play document
    const playData = doc.data() as PlayEvent;
    const contentId = playData.contentId;

    // Find the document in /content by the contentId
    const contentDoc = await firebase
      .firestore()
      .collection('content')
      .doc(contentId);

    // Increment the totalPlays stat on the doc
    await contentDoc.update({ totalPlays: increment() });
  });

// Update content stat for totalCompleted when play is updated
const onPlayUpdate = functions.firestore
  .document('users/{userId}/plays/{playId}')
  .onUpdate(async (change) => {
    if (change.after.exists && change.before.exists) {
      const playBefore = change.before.data() as PlayEvent;
      const playAfter = change.after.data() as PlayEvent;

      if (playAfter.completed && !playBefore.completed) {
        // Find the document in /content by the contentId
        const contentDoc = await firebase
          .firestore()
          .collection('content')
          .doc(playAfter.contentId);

        // Increment the totalPlays stat on the doc
        await contentDoc.update({ totalCompleted: increment() });
      }
    }
    return Promise.resolve();
  });

const EVERY_HOUR_CRON = '0 * * * *';
const runRenewOrCancelSubs = functions.pubsub
  .schedule(EVERY_HOUR_CRON)
  .onRun(renewOrCancelSubscriptions);

export {
  onWebhookListen,
  onAddStripeEvent,
  onValidateIap,
  runRenewOrCancelSubs,
  onStartSubscription,
  onCancelSubscription,
  onGetBillingPortal,
  onPlayAdd,
  onPlayUpdate,
};
