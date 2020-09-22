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

const iap = {
  notification_type: 'DID_CHANGE_RENEWAL_STATUS',
  password: '3c5b954ea91947dfb188f213972617a2',
  bid: 'com.wellemental',
  latest_expired_receipt: 'LATEST EXPIRED RECEIPT GOES HERE',
  unified_receipt: {
    environment: 'Sandbox',
    latest_receipt: 'LATEST RECEIPT GOES HERE',
    status: 0,
    latest_receipt_info: [
      {
        expires_date: '2020-09-22 00:34:16 Etc/GMT',
        original_transaction_id: '1000000721101392',
        is_trial_period: 'false',
        purchase_date: '2020-09-22 00:29:16 Etc/GMT',
        purchase_date_pst: '2020-09-21 17:29:16 America/Los_Angeles',
        subscription_group_identifier: '20682892',
        quantity: '1',
        transaction_id: '1000000721107066',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
        web_order_line_item_id: '1000000055866965',
        purchase_date_ms: '1600734556000',
        original_purchase_date_ms: '1600733057000',
        expires_date_ms: '1600734856000',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
        expires_date_pst: '2020-09-21 17:34:16 America/Los_Angeles',
        product_id: 'wellemental_pro',
        is_in_intro_offer_period: 'false',
      },
      {
        expires_date_pst: '2020-09-21 17:29:16 America/Los_Angeles',
        purchase_date_ms: '1600734256000',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
        purchase_date: '2020-09-22 00:24:16 Etc/GMT',
        is_trial_period: 'false',
        original_transaction_id: '1000000721101392',
        original_purchase_date_ms: '1600733057000',
        subscription_group_identifier: '20682892',
        transaction_id: '1000000721106573',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
        is_in_intro_offer_period: 'false',
        quantity: '1',
        purchase_date_pst: '2020-09-21 17:24:16 America/Los_Angeles',
        expires_date: '2020-09-22 00:29:16 Etc/GMT',
        product_id: 'wellemental_pro',
        web_order_line_item_id: '1000000055866916',
        expires_date_ms: '1600734556000',
      },
      {
        is_in_intro_offer_period: 'false',
        subscription_group_identifier: '20682892',
        purchase_date_pst: '2020-09-21 17:19:16 America/Los_Angeles',
        expires_date: '2020-09-22 00:24:16 Etc/GMT',
        purchase_date_ms: '1600733956000',
        transaction_id: '1000000721105444',
        purchase_date: '2020-09-22 00:19:16 Etc/GMT',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
        web_order_line_item_id: '1000000055866848',
        expires_date_pst: '2020-09-21 17:24:16 America/Los_Angeles',
        is_trial_period: 'false',
        original_transaction_id: '1000000721101392',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
        product_id: 'wellemental_pro',
        quantity: '1',
        original_purchase_date_ms: '1600733057000',
        expires_date_ms: '1600734256000',
      },
      {
        transaction_id: '1000000721103112',
        purchase_date_ms: '1600733656000',
        expires_date: '2020-09-22 00:19:16 Etc/GMT',
        purchase_date_pst: '2020-09-21 17:14:16 America/Los_Angeles',
        subscription_group_identifier: '20682892',
        expires_date_pst: '2020-09-21 17:19:16 America/Los_Angeles',
        quantity: '1',
        is_in_intro_offer_period: 'false',
        product_id: 'wellemental_pro',
        original_transaction_id: '1000000721101392',
        is_trial_period: 'false',
        original_purchase_date_ms: '1600733057000',
        purchase_date: '2020-09-22 00:14:16 Etc/GMT',
        expires_date_ms: '1600733956000',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
        web_order_line_item_id: '1000000055866786',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
      },
      {
        purchase_date_pst: '2020-09-21 17:09:16 America/Los_Angeles',
        is_in_intro_offer_period: 'false',
        expires_date: '2020-09-22 00:14:16 Etc/GMT',
        web_order_line_item_id: '1000000055866731',
        expires_date_ms: '1600733656000',
        original_transaction_id: '1000000721101392',
        transaction_id: '1000000721102154',
        purchase_date: '2020-09-22 00:09:16 Etc/GMT',
        original_purchase_date_ms: '1600733057000',
        is_trial_period: 'false',
        purchase_date_ms: '1600733356000',
        quantity: '1',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
        product_id: 'wellemental_pro',
        expires_date_pst: '2020-09-21 17:14:16 America/Los_Angeles',
        subscription_group_identifier: '20682892',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
      },
      {
        transaction_id: '1000000721101392',
        expires_date_ms: '1600733356000',
        web_order_line_item_id: '1000000055866730',
        product_id: 'wellemental_pro',
        purchase_date_ms: '1600733056000',
        subscription_group_identifier: '20682892',
        original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
        quantity: '1',
        expires_date_pst: '2020-09-21 17:09:16 America/Los_Angeles',
        original_transaction_id: '1000000721101392',
        is_trial_period: 'false',
        purchase_date_pst: '2020-09-21 17:04:16 America/Los_Angeles',
        original_purchase_date_ms: '1600733057000',
        expires_date: '2020-09-22 00:09:16 Etc/GMT',
        original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
        is_in_intro_offer_period: 'false',
        purchase_date: '2020-09-22 00:04:16 Etc/GMT',
      },
    ],
    pending_renewal_info: [
      {
        original_transaction_id: '1000000721101392',
        auto_renew_product_id: 'wellemental_pro',
        product_id: 'wellemental_pro',
        auto_renew_status: '0',
        is_in_billing_retry_period: '0',
        expiration_intent: '1',
      },
    ],
  },
  auto_renew_status_change_date: '2020-09-22 00:33:23 Etc/GMT',
  auto_renew_status_change_date_ms: '1600734803000',
  environment: 'Sandbox',
  auto_renew_product_id: 'wellemental_pro',
  bvrs: '2.8',
  auto_renew_status_change_date_pst: '2020-09-21 17:33:23 America/Los_Angeles',
  auto_renew_status: 'false',
  latest_expired_receipt_info: {
    product_id: 'wellemental_pro',
    original_purchase_date_pst: '2020-09-21 17:04:17 America/Los_Angeles',
    purchase_date_ms: '1600734556000',
    unique_identifier: 'bfc2146796f37f23f11ba01e590cfd5d9cbfbb0d',
    original_transaction_id: '1000000721101392',
    expires_date_formatted: '2020-09-22 00:34:16 Etc/GMT',
    bid: 'com.wellemental',
    subscription_group_identifier: '20682892',
    version_external_identifier: '0',
    original_purchase_date: '2020-09-22 00:04:17 Etc/GMT',
    item_id: '1531514961',
    web_order_line_item_id: '1000000055866965',
    quantity: '1',
    bvrs: '2.8',
    unique_vendor_identifier: '79D5B1A4-489E-4675-8531-313949F54485',
    original_purchase_date_ms: '1600733057000',
    is_trial_period: 'false',
    purchase_date: '2020-09-22 00:29:16 Etc/GMT',
    expires_date_formatted_pst: '2020-09-21 17:34:16 America/Los_Angeles',
    is_in_intro_offer_period: 'false',
    purchase_date_pst: '2020-09-21 17:29:16 America/Los_Angeles',
    expires_date: '1600734856000',
    transaction_id: '1000000721107066',
  },
};
