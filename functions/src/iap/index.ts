import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';

const appleReceiptVerify = require('node-apple-receipt-verify');
appleReceiptVerify.config({
  secret: functions.config().ios.iapsecret,
  environment: [process.env.APPLE_APP_STORE_ENV],
  excludeOldTransactions: true,
});

export const validateIap = async (
  data: any,
  context: https.CallableContext,
): Promise<void> => {
  if (!context.auth) {
    console.error('No auth context');
    return;
  }
  const userId = context.auth.uid;
  const { receipt, productId } = data;
  const { autoRenew, nextRenewal } = receipt;

  try {
    // attempt to verify receipt
    const products = await appleReceiptVerify.validate({
      excludeOldTransactions: true,
      receipt: receipt,
    });
    // check if products exist
    if (Array.isArray(products)) {
      // get the latest purchased product (subscription tier)
      let { expirationDate } = products[0];
      // convert ms to secs
      let expirationUnix = Math.round(expirationDate / 1000);
      // persist in database
      const userDoc = await admin
        .firestore()
        .collection('players')
        .doc(userId)
        .update({ plan: { autoRenew, nextRenewal, planId: productId } });
    }
  } catch (e) {
    // transaction receipt is invalid
  }
};
