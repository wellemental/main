import * as admin from 'firebase-admin';
import { StripeEvent } from '../types';

export const updateUserPlan = async (
  eventId: string,
  eventData: StripeEvent,
): Promise<void> => {
  console.log('UPDATING USER PLAN');
  const query = admin
    .firestore()
    .collection('users')
    .where('stripeId', '==', eventData.customer);

  try {
    const userSnapshot: FirebaseFirestore.DocumentSnapshot | null = await query
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0];
        }
        return null;
      });

    if (!userSnapshot || !userSnapshot.data()) {
      console.error('No user snapshot');
      return Promise.reject('No user found');
    }
    const userData = userSnapshot.data();

    const stripeEvents =
      userData && userData.plan && userData.plan.stripeEvents
        ? [...userData.plan.stripeEvents, eventId]
        : [eventId];

    try {
      await admin.firestore().collection('users').doc(userSnapshot.id).update({
        'plan.status': eventData.status,
        'plan.stripeEvents': stripeEvents,
        'plan.nextRenewalDate': eventData.current_period_end,
        'plan.nextRenewalUnix': eventData.current_period_end_unix,
      });
    } catch (err) {
      console.log('Error updating user: ', err);
      return Promise.reject('Error updating user');
    }
  } catch (error) {
    console.log('Error getting user snapshot');
  }
};
