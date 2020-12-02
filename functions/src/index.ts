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
import { StripeEvent } from './types';

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

const onValidateIap = functions.https.onCall(validateIap);

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
};
