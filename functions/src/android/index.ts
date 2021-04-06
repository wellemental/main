// Pulled from https://medium.com/@msasikanth/google-play-iap-verification-using-cloud-functions-bd8c3a22f9b9
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as key from './android-service-account.json'; // JSON key file
import { google } from 'googleapis';
import * as moment from 'moment';
import { User, AndroidValidate } from '../types';

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
  context: functions.https.CallableContext,
): Promise<string> => {
  console.log('Starting Android Validation');
  if (!context.auth) {
    console.error('No auth context');
    return Promise.reject('User not logged in');
  }

  const userId = context.auth.uid;
  const skuId: string = data.sku_id;
  const purchaseToken: string = data.purchase_token;
  const packageName: string = data.package_name;

  console.log('Uid', userId, 'ProductId', skuId);

  try {
    await authClient.authorize();
    const subscription = await playDeveloperApiClient.purchases.subscriptions.get(
      {
        packageName: packageName,
        subscriptionId: skuId,
        token: purchaseToken,
      },
    );

    if (subscription.status === 200) {
      const { autoRenewing, expiryTimeMillis, orderId } = subscription.data;
      const expirationUnix = expiryTimeMillis
        ? Math.round(+expiryTimeMillis / 1000)
        : moment().unix();

      console.log('expiryTimeMillis', expiryTimeMillis);

      try {
        const userPlan: Partial<User> = {
          plan: {
            type: 'android',
            auto_renew_status: autoRenewing ? autoRenewing : true,
            nextRenewalDate: moment.unix(expirationUnix).format('YYYY-MM-DD'),
            nextRenewalUnix: expirationUnix,
            planId: skuId,
            status: 'active',
            orderId: orderId ? orderId : '',
            createdAt: new Date(),
          },
        };

        console.log('Updating user plan', userPlan);

        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update(userPlan);
      } catch (err) {
        console.error(
          'Failed to update UserDoc for Android purchase in database',
          err,
        );
      }

      // Subscription response is successful. subscription.data will return the subscription information.
      return Promise.resolve('Purchase complete!');
    }
  } catch (error) {
    // Logging error for debugging
    console.log(error);
  }

  // This message is returned when there is no successful response from the subscription/purchase get call
  // return {
  //   status: 500,
  //   message: 'Failed to verify subscription, Try again!',
  // };
  return Promise.reject('Products either undefined or not an array');
};
