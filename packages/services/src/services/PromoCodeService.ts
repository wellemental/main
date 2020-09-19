import firestore from '@react-native-firebase/firestore';
import { ApplicationError, InvalidPromoCodeError } from '../models/Errors';
import { UserProfile, PromoCodeServiceType, PromoCode } from '../types';
import logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';
import UpdateUserService from './UpdateUserService';

const COLLECTION = 'users';
const usersColl = firestore().collection(COLLECTION);
const promoCodeColl = firestore().collection('promo-codes');
const updateUserService = new UpdateUserService();

type PromoCode = {
  id: string;
  code: string;
  limit: number;
  used: number;
};

class PromoCodeService implements PromoCodeServiceType {
  public async upgradeUser(userId: string, code: string): Promise<void> {
    const planUpgrade = {
      type: 'promoCode',
      code,
      status: 'active',
    };

    try {
      return await updateUserService.updateProfile(userId, {
        plan: planUpgrade,
      });
    } catch (err) {
      Promise.reject(err);
    }
  }

  public async validateCode(code: string): Promise<PromoCode> {
    const query = promoCodeColl.where('code', '==', code).limit(1);

    try {
      await query.get().then((snapshots) => {
        snapshots.docs.map((doc) => {
          if (doc) {
            const data = doc.data();

            // Accept if it exist and is below limit
            if (data.used < data.limit) {
              return Promise.resolve(data);
            } else {
              // Reject if promo code is at it's limit
              return Promise.reject(
                new InvalidPromoCodeError("Promo code has reached it's limit"),
              );
            }
          } else {
            // If promo code doesn't exist or any other issues
            return Promise.reject(
              new InvalidPromoCodeError('Invalid promo code'),
            );
          }
        });
      });
    } catch (err) {
      return Promise.reject(
        new ApplicationError('Error validating promo code'),
      );
    }
  }

  public async validateAndUpgrade(userId: string, code: string): Promise<void> {
    const promoCodeData = await this.validateCode(code);
    await promoCodeColl
      .doc(promoCodeData.id)
      .update({ used: promoCodeData.used + 1 });
  }
}

export default PromoCodeService;
