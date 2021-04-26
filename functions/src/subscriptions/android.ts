// Pulled from https://medium.com/@msasikanth/google-play-iap-verification-using-cloud-functions-bd8c3a22f9b9
// import * as functions from 'firebase-functions';
// Google API Overview - https://developer.android.com/google/play/billing/subscriptions
// Could potentially transition to real-time dev notifications? - https://developer.android.com/google/play/billing/getting-ready#configure-rtdn
import * as admin from 'firebase-admin';
import * as key from './android-service-account.json'; // JSON key file
import { google } from 'googleapis';
import * as moment from 'moment';
import { User, AndroidValidate } from '../types';
import { convertMillisToUnix } from '../helpers';

// This code is a shitshow so I apologize in advance to anyone going through it
// Didn't have time to refactor and was also just afriad to break anything

const authClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});

const playDeveloperApiClient = google.androidpublisher({
  version: 'v3',
  auth: authClient,
});

export const validateAndroidSubscription = async (
  data: AndroidValidate,
  userId: string,
): Promise<string> => {
  console.log('Starting Android Validation');

  // const userId = context.auth.uid;
  const skuId: string = data.sku_id;
  const purchaseToken: string = data.purchase_token;
  const packageName: string = data.package_name;

  const userRef = admin.firestore().collection('users').doc(userId);
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const user = userDoc.data() as User;

  // Get Subscription from Google Play
  try {
    await authClient.authorize();
    const subscription = await playDeveloperApiClient.purchases.subscriptions.get(
      {
        packageName: packageName,
        subscriptionId: skuId,
        token: purchaseToken,
      },
    );

    // If status === 200, purchase is valid
    if (subscription.status === 200) {
      console.log('User purchase is valid');
      // Full info on response data - https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptions#SubscriptionPurchase
      const {
        autoRenewing,
        expiryTimeMillis,
        orderId,
        startTimeMillis,
        userCancellationTimeMillis,
      } = subscription.data;

      const expirationUnix = expiryTimeMillis
        ? convertMillisToUnix(expiryTimeMillis)
        : moment().unix();

      const startUnix = startTimeMillis
        ? convertMillisToUnix(startTimeMillis)
        : moment().unix();

      // Build user plan object to update in database
      // Api reference to understand lifecycle - https://developer.android.com/google/play/billing/subscriptions
      const userPlan: Pick<User, 'plan'> = {
        plan: {
          type: 'android',
          auto_renew_status: autoRenewing ? autoRenewing : true,
          nextRenewalDate: moment.unix(expirationUnix).format('YYYY-MM-DD'),
          nextRenewalUnix: expirationUnix, // Is plan active is all based on this
          startUnix: startUnix,
          startDate: moment.unix(startUnix).format('YYYY-MM-DD'),
          lastVerified: moment().format('YYYY-MM-DD'),
          planId: skuId,
          status: userCancellationTimeMillis ? 'canceled' : 'active', // Not storing specific status like "expired" or "paused" for simplicity
          orderId: orderId ? orderId : '',
          purchaseToken: purchaseToken, // Storing for easy future validation
          createdAt: new Date(),
        },
      };

      // Add cancellation info if it's been cancelled
      // userCancellationTimeMillis is only defined if user has cancelled
      if (userCancellationTimeMillis) {
        userPlan.plan.canceledAtUnix = convertMillisToUnix(
          userCancellationTimeMillis,
        );
      }

      try {
        // Update User Plan on the user doc
        await userRef.update(userPlan);

        console.log('Updated user plan on user doc');

        // Add latest purchase to user's doc for easy troubleshooting and validation
        await userRef
          .collection('receipts-android')
          .doc(
            `${moment().format(
              // Don't have 'validated'
              `YYYY-MM-DD-hh-mm-ss`,
            )}-${
              !user.plan
                ? 'new-subscriber'
                : !!userCancellationTimeMillis
                ? 'canceled'
                : 'renewal'
            }`,
          )
          .set({
            data: subscription.data,
            status: subscription.status,
            action: !user.plan
              ? 'new-subscription-validation'
              : userCancellationTimeMillis
              ? 'canceled'
              : 'renewal',
            userId,
            createdAt: new Date(),
            createdAtUnix: moment().unix(),
            oldPlan: !!user.plan ? user.plan : 'new-subscriber',
          });
        console.log('Updated user receipt on user doc');
      } catch (err) {
        console.error(
          `Failed to update UserDoc for Android purchase in database - userId - ${userId}`,
          err,
        );
        return Promise.reject(
          `Failed to update UserDoc for Android purchase in database - userId - ${userId} - ${err}`,
        );
      }

      // Subscription response is successful. subscription.data will return the subscription information.
      return Promise.resolve('Purchase complete!');
    } else {
      // User's purchase is fraudelent

      // Cancel account
      // Don't update nextRenewalUnix so plan will be marked inactive
      await userRef.update({
        'plan.status': 'canceled',
        'plan.canceledAtUnix': moment().unix(),
        'plan.cancelReason': 'fradulent',
      });

      // Add fraud check info to user's doc for easy troubleshooting and validation
      await userRef
        .collection('receipts-android')
        .doc(`${moment().format('YYYY-MM-DD-hh-mm-ss')}-failed`)
        .set({
          data: subscription.data,
          status: subscription.status,
          action: 'invalid purchase',
          userId,
          createdAt: new Date(),
          createdAtUnix: moment().unix(),
          oldPlan: !!user.plan ? user.plan : 'new-subscriber',
        });
    }
    console.log('User purchase is not valid');
    return Promise.reject('User android purchase is not valid');
  } catch (error) {
    // User's purchase is too old to be checked
    // Cancel account
    // Don't update nextRenewalUnix so plan will be marked inactive
    await userRef.update({
      'plan.status': 'canceled',
      'plan.canceledAtUnix': moment().unix(),
      'plan.cancelReason': 'expired',
    });

    // Add expiration info to user's doc for easy troubleshooting and validation
    await userRef
      .collection('receipts-android')
      .doc(`${moment().format('YYYY-MM-DD-hh-mm-ss')}-expired`)
      .set({
        data: 'expired',
        status: 'expired',
        action: 'expired purchase',
        userId,
        createdAt: new Date(),
        createdAtUnix: moment().unix(),
        oldPlan: !!user.plan ? user.plan : 'new-subscriber',
      });

    // Logging error for debugging
    console.log(error);
  }

  // This message is returned when there is no successful response from the subscription/purchase get call
  // return {
  //   status: 500,
  //   message: 'Failed to verify subscription, Try again!',
  // };
  console.log(`Android products not found for user ${userId}`);
  return Promise.resolve('Android products not found');
};
