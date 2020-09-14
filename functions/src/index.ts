import * as functions from 'firebase-functions';
import { webhookListen, StripeEvent } from './stripe';
import { validateIap } from './iap';
import * as firebase from 'firebase-admin';

// Initialize Firebase
firebase.initializeApp();

const onWebhookListen = webhookListen;

export const updatePlayerSubscription = (
  eventId: string,
  eventData: StripeEvent,
): string => {
  // const user = firebase.firestore().collection('users').doc(user.uid);

  return eventId;
};

const onAddStripeEvent = functions.firestore
  .document('events/{eventId}')
  .onWrite((change, context) => {
    const {
      params: { eventId },
    } = context;
    let eventData = eventId;
    if (change.after.exists) {
      eventData = change.after.data() as StripeEvent;
      // return updatePlayerSubscription(eventId, eventData);
    }

    // if (eventData.cancel_at_period_end) {
    // }

    return Promise.resolve(eventData);
  });

const onValidateIap = functions.https.onCall(validateIap);

export { onWebhookListen, onAddStripeEvent };
