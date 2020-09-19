import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';

const appleReceiptVerify = require('node-apple-receipt-verify');
appleReceiptVerify.config({
  secret: functions.config().ios.iapsecret,
  environment: ['Sandbox', 'Production'],
  excludeOldTransactions: true,
});

type IapValidate = {
  receipt: any;
  productId: string;
};

export const validateIap = async (
  data: IapValidate,
  context: functions.https.CallableContext,
): Promise<void> => {
  console.log('Starting Validation');
  if (!context.auth) {
    console.error('No auth context');
    return;
  }
  const userId = context.auth.uid;
  const { receipt, productId } = data;
  const { autoRenew, nextRenewal } = receipt;

  console.log('Uid', userId, 'ProductId', productId);
  console.log('autoRenew', autoRenew, 'nextRenewal', nextRenewal);

  try {
    console.log('Attempt to verify receipt');
    // attempt to verify receipt
    const products = await appleReceiptVerify.validate({
      excludeOldTransactions: true,
      receipt: receipt,
    });
    // check if products exist
    if (Array.isArray(products)) {
      // get the latest purchased product (subscription tier)
      const { expirationDate } = products[0];
      // convert ms to secs
      const expirationUnix = Math.round(expirationDate / 1000);
      // persist in database
      // add to user doc in db
      try {
        await admin
          .firestore()
          .collection('users')
          .doc(userId)
          .update({
            plan: { autoRenew, nextRenewal, planId: productId, expirationUnix },
          });
      } catch (err) {
        console.error('Failed to update UserDoc IAP in database', err);
      }

      // store receipt in db
      try {
        console.log('Attempt to store receipt in firestore');
        await admin.firestore().collection('receipts-iap').add({
          user_id: userId,
          receipt: receipt,
          verified: true,
          products: products,
          timestamp: moment().unix(),
        }); // Add the event to the database
      } catch (err) {
        console.error('Failed to add receipt to database', err); // Catch any errors saving to the database
      }
    }
  } catch (e) {
    // transaction receipt is invalid
    console.error('Failed. Transaction receipt is invalid.');
  }
};
