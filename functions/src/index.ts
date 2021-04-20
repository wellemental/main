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
import { validateAndroidSubscription } from './android';
import { addToList, updateKlaviyoPlan } from './klaviyo';
import { StripeEvent, PlayEvent, FieldValue, Favorite, User } from './types';

// Initialize Firebase
firebase.initializeApp();

const onWebhookListen = webhookListen;
const onStartSubscription = functions.https.onCall(startSubscription);
const onGetBillingPortal = functions.https.onCall(getBillingPortal);
const onCancelSubscription = functions.https.onCall(cancelSubscription);

// Sync user to Klaviyo when their account is created
const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async doc => {
    // Pull email from the new user document
    const userData = doc.data() as Pick<User, 'email'>;
    const userEmail = userData.email;

    try {
      await addToList(userEmail);
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      return Promise.reject();
    }
  });

// Update Klaviyo profile when user plan changes
const onUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async change => {
    if (change.after.exists && change.before.exists) {
      const userAfter = change.after.data() as User;

      try {
        await updateKlaviyoPlan(userAfter);
      } catch (error) {
        console.log(error);
      }
    }
    return Promise.resolve();
  });

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

const onValidateAndroid = functions.https.onCall(async (data, context) => {
  try {
    await validateAndroidSubscription(data, context);
    return {
      status: 200,
      message: 'Purchase Complete!',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: 'Failed to verify subscription, Try again!',
    };
  }
});

export const increment = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : 1);
};

export const decrement = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : -1);
};

// Increment content stat for totalPlays when created
const onPlayAdd = functions.firestore
  .document('users/{userId}/plays/{playId}')
  .onCreate(async doc => {
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
  .onUpdate(async change => {
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

// Update content stat for totalCompleted when play is updated
const onFavUpdate = functions.firestore
  .document('users/{userId}/favorites/{contentId}')
  .onUpdate(async change => {
    if (change.after.exists) {
      const favAfter = change.after.data() as Favorite;

      if (favAfter) {
        // Prob don't need this conditional, but keeping just in case
        // Find the document in /content by the contentId
        const contentDoc = await firebase
          .firestore()
          .collection('content')
          .doc(favAfter.contentId);

        // Increment or decrememt the totalFavorites stat on the doc
        const adjustment = favAfter.favorited ? increment : decrement;
        await contentDoc.update({ totalFavorites: adjustment() });
      }
    }
    return Promise.resolve();
  });

// const EVERY_HOUR_CRON = '0 * * * *';
// Every day at 1am
const EVERY_DAY_CHRON = '0 1 * * *';
const runRenewOrCancelSubs = functions.pubsub
  .schedule(EVERY_DAY_CHRON)
  .onRun(renewOrCancelSubscriptions);

export {
  onWebhookListen,
  onAddStripeEvent,
  onValidateIap,
  runRenewOrCancelSubs,
  onStartSubscription,
  onCancelSubscription,
  onValidateAndroid,
  onGetBillingPortal,
  onPlayAdd,
  onPlayUpdate,
  onFavUpdate,
  onUserCreate,
  onUserUpdate,
};
