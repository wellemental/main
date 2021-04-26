import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { IapValidate, ReceiptIap, User, IapPurchase } from '../types';
import { convertMillisToUnix, convertUnixToDateString } from '../helpers';

// These functions came from this tutorial
// https://rossbulat.medium.com/react-native-subscriptions-with-in-app-purchases-setup-fdaf3863e07f
// https://rossbulat.medium.com/validating-ios-subscription-receipts-in-react-native-node-js-70775d0fb3a
// https://rossbulat.medium.com/ios-subscriptions-auto-renewal-and-cancellation-syncing-with-node-js-f2bf3e24945

// This code is a shitshow so I apologize in advance to anyone going through it
// Didn't have time to refactor and was also just afriad to break anything

// Eventually could potentially transition to App Store Server Notifications - https://developer.apple.com/documentation/appstoreservernotifications/enabling_app_store_server_notifications
const appleReceiptVerify = require('node-apple-receipt-verify');
appleReceiptVerify.config({
  secret: '3c5b954ea91947dfb188f213972617a2', //functions.config().ios.iapsecret,
  environment: ['sandbox', 'production'], //functions.config().apple.env],
  excludeOldTransactions: true,
  verbose: true,
});

export const validateIap = async (
  data: IapValidate,
  context: functions.https.CallableContext,
): Promise<string> => {
  // console.log('Starting IAP Validation', functions.config().apple.env);
  if (!context.auth) {
    console.error('No auth context');
    return Promise.reject('User not logged in');
  }
  const userId = context.auth.uid;
  const { receipt, productId } = data;
  const { auto_renew_status, nextRenewal } = receipt;
  const userDoc = admin.firestore().collection('users').doc(userId);

  console.log('Uid', userId, 'ProductId', productId);
  console.log('autoRenew', auto_renew_status, 'nextRenewal', nextRenewal);

  try {
    // attempt to verify receipt
    const products: IapPurchase[] = await appleReceiptVerify.validate({
      excludeOldTransactions: true,
      extended: true,
      receipt: receipt,
    });
    // check if products exist
    if (Array.isArray(products) && products.length > 0) {
      // get the latest purchased product (subscription tier)
      const { expirationDate } = products[0];
      // convert ms to secs
      const expirationUnix = convertMillisToUnix(expirationDate);
      // persist in database
      // add to user doc in db
      try {
        const userPlan: Pick<User, 'plan'> = {
          plan: {
            type: 'iosIap',
            auto_renew_status: true,
            nextRenewalDate: convertUnixToDateString(expirationUnix), // moment.unix(expirationUnix).format('YYYY-MM-DD'),
            nextRenewalUnix: expirationUnix,
            startUnix: moment().unix(),
            startDate: convertUnixToDateString(moment().unix()),
            planId: productId,
            status: 'active',
            createdAt: new Date(),
            lastVerified: moment().format('YYYY-MM-DD'),
          },
        };

        console.log('Creating user plan', userPlan);

        // Updated .plan on userDoc
        await userDoc.update(userPlan);
      } catch (err) {
        console.error('Failed to update UserDoc IAP in database', err);
      }

      // store receipt in db in receipts-iap table
      try {
        console.log('Attempting to store receipt in UserDoc subcollection');
        // Add latest purchase to users doc for easy troubleshooting and validation
        await userDoc
          .collection('receipts-iap')
          .doc(`${moment().format('YYYY-MM-DD-HH-mm-ss')}-validate`)
          .set({
            latestPurchase: products[0],
            environment: 'production', //'sandbox', //functions.config().apple.env,
            receipt: receipt,
            action: 'new-subscription-validation',
            userId: userId,
            verified: true,
            createdAt: new Date(),
            createdAtUnix: moment().unix(),
          });
      } catch (err) {
        console.error('Failed to add receipt to database', err); // Catch any errors saving to the database
      }
      return Promise.resolve('Purchase complete!');
    } else {
      console.error('Products either undefined or not an array', products);
      return Promise.reject('Products either undefined or not an array');
    }
  } catch (e) {
    // transaction receipt is invalid
    console.error('Failed. Iap rransaction receipt is invalid.', e);
    return Promise.reject(
      'Failed. Iap transaction receipt is invalid. Please try again',
    );
  }
};

export const renewOrCancelIap = async (user: User): Promise<void> => {
  // Get latest transaction from receipt
  try {
    const receiptSnapshots = await admin
      .firestore()
      .collection('receipts-iap')
      .where('userId', '==', user.id)
      .orderBy('timestamp', 'desc')
      .get();

    const receipt = receiptSnapshots.docs;

    // If no subscriptions are expired, no need to run the rest
    if (receipt.length === 0) {
      console.log(
        `******No iOS IAP receipts found for this user ${user.id} - ${user.email}`,
      );
      return;
      // return Promise.reject(
      //   `No IAP receipts found for this user - ${user.email}`,
      // );
    }

    try {
      // get latest subscription receipt
      // This includes refunds per this documentation - https://developer.apple.com/documentation/storekit/in-app_purchase/handling_refund_notifications
      const record = receipt[0].data() as ReceiptIap;
      // re-verify receipt to get the latest subscription status
      const purchases: IapPurchase[] = await appleReceiptVerify.validate({
        receipt: record.receipt,
        extended: true, // Needed to enable additional fields on purchases obj
      });

      const userDoc = admin.firestore().collection('users').doc(user.id);

      console.log('***** PURCHSES LENGTH', purchases.length, user.email);
      // Cancel plan is no active plans are returned
      if (purchases.length === 0) {
        console.log('Canceling user plan', user.id);
        // await userDoc.update({ oldPlan: user.plan });
        // Change to free tier and remove plan metadata from user record
        // By not updating nextRenewalUnix, app will revoke user's premium access via isPlanActive.ts helper
        await userDoc.update({
          'plan.status': 'canceled',
          'plan.canceledAtUnix': moment().unix(),
          'plan.lastVerified': moment().format('YYYY-MM-DD'),
          'plan.type': 'iosIap',
          'plan.startUnix': convertMillisToUnix(
            record.products[0].purchaseDate,
          ),
          'plan.startDate': convertUnixToDateString(
            convertMillisToUnix(record.products[0].purchaseDate),
          ),
        });

        // Add doc to users receipts just for logging of cancellation
        try {
          await userDoc
            .collection('receipts-iap')
            .doc(`${moment().format('YYYY-MM-DD-HH-mm-ss')}-cancel`)
            .set({
              lastReceipt: record,
              environment: 'production', //'sandbox', //functions.config().apple.env,
              action: 'canceled',
              oldPlan: user.plan, // storing the old plan just in case of need for revert
              userId: user.id,
              createdAt: new Date(),
              createdAtUnix: moment().unix(),
            });
        } catch (error) {
          console.log(
            `Error adding cancellation doc to receipts-iap for ${user.email}`,
            error,
          );
        }
        return Promise.resolve();
      }

      // updating database with latest expiryTimestamp of renewed subscription
      if (purchases.length !== 0) {
        console.log("Renewing user's plan!");
        // Get the latest purchase from receipt verification
        const latestPurchase = purchases[0];
        // Reformat the expiration date as a unix timestamp
        const productId = latestPurchase.productId;
        let latestExpiryTimestamp: number = latestPurchase.expirationDate;
        latestExpiryTimestamp = convertMillisToUnix(latestExpiryTimestamp); // Math.round(latestExpiryTimestamp / 1000);

        const startUnix = latestPurchase.originalPurchaseDate
          ? convertMillisToUnix(latestPurchase.originalPurchaseDate)
          : null;

        // Update renewal date if more than current one
        // if (latestExpiryTimestamp > expiryTimestamp) {
        try {
          await userDoc.update({
            // Adding fields that shouldn't need updating bc early on we had a bug that was overwriting all fields instead of just updating the few, so adding them to re-add any info that was lost
            'plan.planId': productId,
            'plan.nextRenewalUnix': latestExpiryTimestamp,
            'plan.nextRenewalDate': convertUnixToDateString(
              latestExpiryTimestamp,
            ),
            'plan.lastVerified': moment().format('YYYY-MM-DD'),
            'plan.startDate': startUnix
              ? convertUnixToDateString(startUnix)
              : null,
            'plan.startUnix': startUnix,
            'plan.type': 'iosIap',
            'plan.status': 'active',
          });
        } catch (error) {
          console.log(
            `Error adding doc to receipts-iap for ${user.email}`,
            error,
          );
        }

        // Add latest purchase to users doc for easy troubleshooting and validation
        try {
          await userDoc
            .collection('receipts-iap')
            .doc(`${moment().format('YYYY-MM-DD-HH-mm-ss')}-renewal`)
            .set({
              latestPurchase,
              environment: 'production', //'sandbox', //functions.config().apple.env,
              action: 'renewed',
              oldPlan: user.plan, // storing the old plan just in case of need for revert
              createdAt: new Date(),
              createdAtUnix: moment().unix(),
              userId: user.id,
            });
        } catch (error) {
          console.log(
            `Error adding doc to receipts-iap for ${user.email}`,
            error,
          );
        }

        return Promise.resolve();
      }
    } catch (error) {
      console.log(
        `Error getting receipt snapshots fro user ${user.email}`,
        error,
      );
    }
  } catch (e) {
    console.log(
      `Failed to get latest Iap subscription receipt and validate it for user - ${user.email}`,
      e,
    );
    return Promise.reject(
      `Failed to get latest Iap subscription receipt and validate it for user - ${user.email} - ${e}`,
    );
  }
};
