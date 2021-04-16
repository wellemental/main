import moment from 'moment';
import { FbUserPlan, UserPlan } from '../types';

export const isPlanActive = (plan?: UserPlan | FbUserPlan): boolean => {
  return !plan
    ? false
    : plan.nextRenewalUnix > moment().unix() || plan.type === 'promoCode';
};
