import * as admin from 'firebase-admin';
import * as moment from 'moment';
import { User } from '../types';
import { validateAndroidSubscription } from './android';
import { renewOrCancelIap } from './iap';

type Recap = {
  date: string;
  totalAndroid: number;
  totalIos: number;
  android: { id: string; email: string }[];
  ios: { id: string; email: string }[];
  failed: { email: string; error: string | Error }[];
};

// Implementation Reference: https://medium.com/@rossbulat/ios-subscriptions-auto-renewal-and-cancellation-syncing-with-node-js-f2bf3e24945
// fetching subscriptions that are due a renewal based on expiry timestamp
export const renewOrCancelSubscriptions = async (): Promise<void> => {
  const recap: Recap = {
    date: moment().format('YYYY-MM-DD-HH-mm-ss'),
    totalAndroid: 0,
    android: [],
    totalIos: 0,
    ios: [],
    failed: [],
  };

  try {
    console.log('Starting sub renew and cancellation script');
    // Get subscriptions past renewal date
    const snapshots = await admin
      .firestore()
      .collection('users')
      .where('plan.nextRenewalUnix', '<', moment().unix()) // Renewal date is in the past
      .where('plan.status', '==', 'active') // It hasn't already been cancelled in previous check
      .get();

    const accounts = snapshots.docs;

    // If no subscriptions are expired, no need to run the rest
    if (accounts.length === 0) {
      await admin
        .firestore()
        .collection('subscription-recaps')
        .doc(moment().format('YYYY-MM-DD-HH-mm-ss'))
        .set(recap);
      console.log('No accounts found past expiry');
      return;
    }

    // Has issue where loop stops if a promise is rejected
    await Promise.all(
      accounts.map(async account => {
        const user = account.data() as User;

        // Validate ios subscriptions
        if (user.plan.type === 'iosIap') {
          recap.totalIos++;
          recap.ios.push({ id: user.id, email: user.email });
          try {
            await renewOrCancelIap(user);
          } catch (error) {
            recap.failed.push({ email: user.email, error: error.toString() });
          }
        }

        // No need to validate 'promoCode' or 'stripe'
        // 'stripe' verifies by webhooks
        // 'promoCode' is access codes which don't currently have an expiration

        // Validate android subscriptions
        if (user.plan.type === 'android' && !!user.plan.purchaseToken) {
          recap.totalAndroid++;
          recap.android.push({ id: user.id, email: user.email });

          try {
            await validateAndroidSubscription(
              {
                sku_id: user.plan.planId,
                purchase_token: user.plan.purchaseToken,
                package_name: 'com.wellemental.wellemental',
              },
              user.id,
            );
          } catch (error) {
            recap.failed.push({ email: user.email, error: error.toString() });
          }
        }
      }),
    );

    // Adding basic recap to database for easier debug and reviewing
    await admin
      .firestore()
      .collection('subscription-recaps')
      .doc(moment().format('YYYY-MM-DD-HH-mm-ss'))
      .set({ status: 'success', ...recap });
  } catch (e) {
    // Log even if it fails
    await admin
      .firestore()
      .collection('subscription-recaps')
      .doc(moment().format('YYYY-MM-DD-HH-mm-ss'))
      .set({ status: 'failed', ...recap });
    console.log('Failed to run Renew/Cancel Sub script', e);
  }
};
