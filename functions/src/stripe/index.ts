import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as moment from 'moment';
import { mcTagUser } from '../mailchimp';
import { StripeEvent } from '../types';
//
const stripe = require('stripe')(functions.config().stripe.sk);
const endpointSecret = functions.config().stripe.webhooksecret;

export const createStripeCustomer = async (
  email: string,
  uid: string,
): Promise<string> => {
  const customer = await stripe.customers.create({
    email,
    metadata: { firebaseUID: uid },
  });

  const user = admin.firestore().collection('users').doc(uid);

  const userSnapshot = await user.get();

  if (userSnapshot.exists) {
    try {
      await user.update({
        stripeId: customer.id,
      });
    } catch (err) {
      console.log('Error updating user: ', err);
    }
  }

  return customer.id;
};

export const startSubscription = async (
  data: any,
  context: functions.https.CallableContext,
): Promise<FirebaseFirestore.WriteResult | void> => {
  if (!context.auth) {
    console.error('No Auth Context', context);
    return Promise.reject();
  }
  const userId = context.auth.uid;
  const userDoc = admin.firestore().collection('users').doc(userId);

  const userSnap = await userDoc.get();
  const user = userSnap.data();

  if (!user) {
    console.error('No User');
    return Promise.reject();
  }

  let stripeId: string | undefined = user.stripeId;
  if (!user.stripeId) {
    try {
      stripeId = await createStripeCustomer(user.email, userId);
      console.info('Stripe customer created: ', stripeId, 'UID', userId);
    } catch (err) {
      console.error('Stripe customer not created: ', err);
    }
  }

  // Attach the card to the user
  const source = await stripe.customers.createSource(stripeId, {
    source: data.source,
  });

  if (!source) {
    throw new Error('Stripe failed to attach card');
  }

  // Subscribe the user to the plan
  let sub: any;
  try {
    sub = await stripe.subscriptions.create({
      customer: stripeId,
      items: [{ price: data.plan }],
      trial_period_days: data.trial_period_days,
    });
    console.info('Subscription Created', sub);
  } catch (err) {
    console.error('Error creating Stripe subscription: ', err);
  }

  // Update user document to reflect subscription status
  try {
    await userDoc.update({
      plan: {
        type: 'stripe',
        auto_renew_status: true,
        nextRenewalDate:
          sub.current_period_end &&
          moment.unix(sub.current_period_end).format('YYYY-MM-DD'),
        nextRenewalUnix:
          sub.current_period_end && moment.unix(sub.current_period_end),
        planId: data.plan,
        subId: sub.id,
        custId: stripeId,
        status: sub.status,
        createdAt: new Date(),
        trial_period_ends:
          sub.current_period_end &&
          moment.unix(sub.current_period_end).format('YYYY-MM-DD'),
      },
    });
  } catch (err) {
    console.log('Error updating user doc with stripe subscription info, err');
  }

  // Tag user in Mailchimp
  try {
    await mcTagUser(user.email, 'Pro');
  } catch (err) {
    console.log('Unable to tag user in Mailchimp', err);
  }

  return Promise.resolve();
};

// No longer using this cancellation function
// This is to cancel a subscription with a cancel button of our own
// We're now using Stripe's subscription management portal ('getBillingPortal') and the cancellation events are processed via Stripe's webhook events in 'onAddStripeEvent'
export const cancelSubscription = async (
  data: any,
  context: functions.https.CallableContext,
): Promise<void> => {
  if (!context.auth) {
    console.error('No auth context');
    return Promise.reject();
  }
  const userId = context.auth.uid;

  const userDoc = await admin.firestore().collection('users').doc(userId);

  const userSnap = await userDoc.get();
  const user = userSnap.data();
  if (!user) {
    console.error('No user for data');
    return Promise.reject();
  }
  const subId: string | undefined = user.subId;

  // Cancel the user plan
  try {
    return await stripe.subscriptions.del(
      subId,
      (err: any, confirmation: any) => {
        if (err) {
          console.error('Error cancelling subscription: ', err);
          return Promise.reject();
        }

        if (!confirmation) {
          console.error('No confirmation');
          return Promise.reject();
        }

        // Update user document to reflect subscription status
        try {
          return userDoc
            .update({
              subStatus: 'canceled',
              canceledAtUnix: moment().unix(),
            })
            .then(() => {
              // Add firebase custom claims to control app access
              return admin
                .auth()
                .getUser(userId)
                .then(userRecord => {
                  if (userRecord.customClaims) {
                    console.log(
                      'Downgrade custom claims2',
                      userRecord.customClaims.account,
                    );
                    userRecord.customClaims.account = 'free';
                  }
                });
            })
            .catch(error => {
              console.log('Error updating userDoc or Claims', error);
              return Promise.reject();
            })
            .finally(() => {
              console.info('Resolve Promise');
              return Promise.resolve();
            });
        } catch (error) {
          console.log(
            'Error updating userDoc after subscription cancellation',
            error,
          );
          return Promise.reject();
        }
      },
    );
  } catch (err) {
    console.log('Error cancelling subs with Stripe');
    return Promise.reject();
  }
};

export const getBillingPortal = async (
  data: any,
  context: functions.https.CallableContext,
): Promise<FirebaseFirestore.WriteResult | void> => {
  if (!context || !context.auth) {
    console.error('No Auth Context', context);
    return Promise.reject();
  }
  const userId = context.auth.uid;
  const userDoc = admin.firestore().collection('users').doc(userId);

  const userSnap = await userDoc.get();
  const user = userSnap.data();

  if (!user) {
    console.error('No User');
    return Promise.reject();
  }

  return await stripe.billingPortal.sessions.create({
    customer: user.stripeId,
    return_url: 'https://app.wellemental.co',
  });
};

export const webhookListen = functions.https.onRequest(
  (request: any, response: functions.Response): any => {
    const sig = request.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret,
      ); // Validate the request
    } catch (err) {
      console.error('Failed to create Stripe event', err); // Catch any errors saving to the database
      response.status(400).end(); // Signing signature failure, return an error 400
      return;
    }

    const hook = event.data.object;

    const formattedEvent: StripeEvent = {
      id: event.id,
      type: event.type,
      created: event.created,
      current_period_end: hook.current_period_end
        ? moment.unix(hook.current_period_end).format('YYYY-MM-DD')
        : null,
      current_period_end_unix: hook.current_period_end,
      cancel_at: hook.cancel_at,
      cancel_at_date: hook.cancel_at
        ? moment.unix(hook.cancel_at).format('YYYY-MM-DD')
        : null,
      cancel_at_period_end: hook.cancel_at_period_end,
      customer: hook.customer,
      subId: hook.id,
      status: hook.status,
      priceId: hook.items.data[0].price.id,
      pricePaid: hook.items.data[0].price.unit_amount,
      trialPeriodLength: hook.items.data[0].plan.trial_period_days,
      trial_end: hook.trial_end
        ? moment.unix(hook.trial_end).format('YYYY-MM-DD')
        : null,
    };

    return admin
      .firestore()
      .collection('stripe-events')
      .doc(event.id)
      .set(formattedEvent) // Add the event to the database
      .then(snapshot => {
        // Return a successful response to acknowledge the event was processed successfully
        // tslint:disable-next-line
        return response.json({
          received: true,
          ref: snapshot.toString(),
        });
      })
      .catch(err => {
        console.error('Failed to add to database', err); // Catch any errors saving to the database
        // tslint:disable-next-line
        return response.status(500).end();
      });
  },
);

// if delete during trial, status="canceled" and current_period_end is day they should lose access
// When trialing, current_period_end is correct
// when active, current_period_end is correct
// if status === 'active' or 'trialing', they have access
// if status === 'canceled' && current_period_ends > today, they have access
//
