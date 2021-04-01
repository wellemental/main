import moment from 'moment';
import { UserPlan } from '../types';

export const isPlanActive = (plan?: UserPlan): boolean => {
  return !plan
    ? false
    : plan.nextRenewalUnix > moment().unix() || plan.type === 'promoCode';
};
