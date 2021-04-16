// import * as functions from 'firebase-functions';
import {
  PlanId,
  PlanTypes,
  SubStatus,
  User,
  Timestamp,
  Platforms,
  Languages,
  FieldValue,
} from '../types';
import { isPlanActive } from '../helpers';
import * as moment from 'moment';

// Import and initialize Klaviyo
// DOCS: https://www.npmjs.com/package/node-klaviyo
const Klaviyo = require('node-klaviyo');
export const klaviyo = new Klaviyo({
  publicToken: 'Tau2rS', //functions.config().klaviyo.public,
  privateToken: 'pk_d1309ae143991d63d70a59a3c71604a738', // functions.config().klaviyo.private,
});

type KlaviyoProperties = {
  planStatus?: SubStatus;
  planType?: PlanTypes | 'accessCode';
  planActive?: boolean;
  planId?: PlanId;
  planRenewal?: Date;
  planCreated?: Date;
  planCanceled?: Date;
  accessCode?: string;
  platform?: Platforms;
  totalPlays?: number | FieldValue;
  totalCompleted?: number | FieldValue;
  totalSeconds?: number | FieldValue;
  streak?: number | FieldValue;
  firstPlay?: Date;
  lastPlay?: Date;
  isAdmin?: boolean;
  language?: Languages;
  appImport?: boolean;
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
        listId: 'VtgG55', //'RTd3N2',//functions.config().klaviyo.list,
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
  const properties: Partial<KlaviyoProperties> = {
    platform: userAfter.platform,
    language: userAfter.language,
    appImport: true,
  };

  if (userAfter.firstPlay) {
    // @ts-ignore - Need to cleanup Typescript - Firestore stores it as Timestamp but we turn it into a Date on load
    const firstPlay = userAfter.firstPlay as Timestamp;
    properties.firstPlay = firstPlay.toDate();
  }

  if (userAfter.lastPlay) {
    // @ts-ignore - Need to cleanup Typescript - Firestore stores it as Timestamp but we turn it into a Date on load
    const lastPlay = userAfter.lastPlay as Timestamp;
    properties.lastPlay = lastPlay.toDate();
  }

  if (userAfter.platform) {
    properties.platform = userAfter.platform;
  }

  if (userAfter.totalPlays) {
    properties.totalPlays = userAfter.totalPlays;
  }

  if (userAfter.totalCompleted) {
    properties.totalCompleted = userAfter.totalCompleted;
  }

  if (userAfter.totalSeconds) {
    properties.totalSeconds = userAfter.totalSeconds;
  }

  if (userAfter.streak) {
    properties.streak = userAfter.streak;
  }

  if (userAfter.isAdmin) {
    properties.isAdmin = userAfter.isAdmin;
  }

  const plan = userAfter.plan;

  if (plan) {
    properties.planActive = isPlanActive(plan) ? true : false;
    // Adding plan to start of plan property names to make them easier to understand in Klaviyo
    properties.planType = plan.type === 'promoCode' ? 'accessCode' : plan.type;

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
  }
  try {
    await addOrUpdateKlaviyoProfile(userAfter.email, properties);
  } catch (error) {
    console.log(error);
  }
};
