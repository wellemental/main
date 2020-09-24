// import * as admin from 'firebase-admin';
// import * as functions from 'firebase-functions';
// import * as moment from 'moment';

// enum SubStatus {
//   Canceled = 'canceled',
//   Active = 'active',
//   Trial = 'trialing',
//   Unpaid = 'unpaid',
//   Incomplete = 'incomplete',
//   Incomplete_Expired = 'incomplete_expired',
//   Past_Due = 'past_due',
// }

// export type StripeEvent = {
//   id: string;
//   type: string;
//   created: number;
//   cancel_at: number;
//   current_period_end: string;
//   cancel_at_date: string;
//   cancel_at_period_end: boolean;
//   customer: string;
//   subId: string;
//   status: SubStatus;
//   priceId: string;
//   pricePaid: number;
//   trialPeriodLength: number;
//   trial_end: string;
// };

// const stripe = require('stripe')(functions.config().stripe.sk);
// const endpointSecret = functions.config().stripe.webhooksecret;

// export const webhookListen = functions.https.onRequest(
//   (request: any, response: functions.Response): any => {
//     const sig = request.headers['stripe-signature'];

//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.rawBody,
//         sig,
//         endpointSecret,
//       ); // Validate the request
//     } catch (err) {
//       console.error('Failed to create Stripe event', err); // Catch any errors saving to the database
//       return response.status(400).end(); // Signing signature failure, return an error 400
//     }

//     const hook = event.data.object;

//     console.log(
//       'CANCEL AT DATE',
//       hook.cancel_at_date,
//       'TRIAL END',
//       hook.trial_end,
//     );

//     const formattedEvent: StripeEvent = {
//       id: event.id,
//       type: event.type,
//       created: event.created,
//       current_period_end: moment
//         .unix(hook.current_period_end)
//         .format('YYYY-MM-DD'),
//       cancel_at: hook.cancel_at,
//       cancel_at_date: moment.unix(hook.cancel_at_date).format('YYYY-MM-DD'),
//       cancel_at_period_end: hook.cancel_at_period_end,
//       customer: hook.customer,
//       subId: hook.id,
//       status: hook.status,
//       priceId: hook.items.data[0].price.id,
//       pricePaid: hook.items.data[0].price.unit_amount,
//       trialPeriodLength: hook.items.data[0].plan.trial_period_days,
//       trial_end: moment.unix(hook.trial_end).format('YYYY-MM-DD'),
//     };

//     console.log('GETS HERE THOOOOO', formattedEvent.status);

//     admin
//       .firestore()
//       .collection('events')
//       .add(formattedEvent) // Add the event to the database
//       .then((snapshot) => {
//         // Return a successful response to acknowledge the event was processed successfully
//         response.json({
//           received: true,
//           ref: snapshot.toString(),
//         });
//         return;
//       })
//       .catch((err) => {
//         console.error('Failed to add to database', err); // Catch any errors saving to the database
//         return response.status(500).end();
//       });
//   },
// );

// // if delete during trial, status="canceled" and current_period_end is day they should lose access
// // When trialing, current_period_end is correct
// // when active, current_period_end is correct
// // if status === 'active' or 'trialing', they have access
// // if status === 'canceled' && current_period_ends > today, they have access
// //
