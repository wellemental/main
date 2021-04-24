import moment from 'moment';
import { FbUserPlan, UserPlan } from '../types';

export const isPlanActive = (plan?: UserPlan | FbUserPlan): boolean => {
  // If user doesn't have a plan, plan isn't active
  // If user's renewal date is in the future or it's a promo code, plan is valid
  // If nextRenewalUnix is undefined and no promo code (due to early plan updating bug), plan still would be marked inactive
  // Only verifies against nextRenewalUnix as that field is not updated once plan is canceled
  // Could add additional check for status === 'active' && plan.type !== promoCode
  // Once we add expiration dates to access codes, need to remove the 'promoCode' conditional
  return !plan
    ? false
    : plan.nextRenewalUnix > moment().unix() || plan.type === 'promoCode';
};
