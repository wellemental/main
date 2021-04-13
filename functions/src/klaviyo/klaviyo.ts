import * as functions from 'firebase-functions';
import { PlanId, PlanTypes, SubStatus, User, Timestamp } from '../types';
import { isPlanActive } from '../helpers';
import * as moment from 'moment';

// Import and initialize Klaviyo
// DOCS: https://www.npmjs.com/package/node-klaviyo
const Klaviyo = require('node-klaviyo');
export const klaviyo = new Klaviyo({
  publicToken: functions.config().klaviyo.public,
  privateToken: functions.config().klaviyo.private,
});

type KlaviyoProperties = {
  planStatus?: SubStatus;
  planType?: PlanTypes;
  planActive?: boolean;
  planId?: PlanId;
  planRenewal?: Date;
  planCreated?: Date;
  planCanceled?: Date;
  accessCode?: string;
};

type KlaviyoProfile = {
  email: string;
  properties?: KlaviyoProperties;
};

export const addOrUpdateKlaviyoProfile = async (
  email: string,
  properties?: KlaviyoProperties,
): Promise<void> => {
  const profile: KlaviyoProfile = { email };

  if (properties) {
    profile.properties = properties;
  }

  try {
    await klaviyo.public.identify(profile);

    console.log('User successfully updated in Klaviyo');
    return Promise.resolve();
  } catch (error) {
    console.log('Error updating user plan in Klaviyo', error);
    return Promise.reject();
  }
};

export const addToList = async (email: string): Promise<void> => {
  try {
    //Identify a user - create/update a profile in Klaviyo
    await addOrUpdateKlaviyoProfile(email);

    // Add that profile to the appropriate list
    try {
      // Ignores past opt-out status - although there shouldn't be one since they're just joining
      await klaviyo.lists.addMembersToList({
        listId: functions.config().klaviyo.list,
        profiles: [{ email }],
      });
      console.log('User successfully added to Klaviyo list');
      return Promise.resolve();
    } catch (error) {
      console.log('Error adding profile to Klaviyo list', error);
      return Promise.reject();
    }
  } catch (error) {
    console.log(error);
  }
};

// If user has a new plan, update their Klaviyo profile
// Doesn't cover if plan field is deleted, but that is only possible manually by an admin
export const updateKlaviyoPlan = async (userAfter: User): Promise<void> => {
  if (userAfter.plan) {
    const properties: Partial<KlaviyoProperties> = {};

    const plan = userAfter.plan;

    if (plan) {
      properties.planActive = isPlanActive(plan) ? true : false;
      properties.planType = plan.type;

      if (plan.planId) {
        properties.planId = plan.planId as PlanId;
      }

      if (plan.status) {
        properties.planStatus = plan.status as SubStatus;
      }

      if (plan.nextRenewalDate) {
        properties.planRenewal = moment(plan.nextRenewalDate).toDate();
      }

      if (plan.code) {
        properties.accessCode = plan.code;
      }

      if (plan.createdAt) {
        const timestamp = plan.createdAt as Timestamp;
        properties.planCreated = timestamp.toDate();
      }

      if (plan.canceledAtUnix) {
        properties.planCanceled = moment(plan.canceledAtUnix).toDate();
      }

      try {
        await addOrUpdateKlaviyoProfile(userAfter.email, properties);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
