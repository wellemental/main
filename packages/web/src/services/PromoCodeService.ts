// import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase/app';
import { ApplicationError, InvalidPromoCodeError } from '../models/Errors';
import { PromoCodeServiceType, PromoCode } from 'common';
import logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';
import UpdateUserService from './UpdateUserService';

const promoCodeColl = firebase.firestore().collection('promo-codes');
const updateUserService = new UpdateUserService();

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
      logger.error(`Error upgrading user ${err}`);
      Promise.reject(err);
    }
  }

  public async validateCode(code: string): Promise<PromoCode | void> {
    const query = promoCodeColl.where('code', '==', code).limit(1);

    try {
      const snapshots = await query.get();
      const doc = snapshots.docs[0];

      if (doc) {
        const data = doc.data();

        // Accept if it exist and is below limit
        if (data.used < data.limit) {
          const stuff = { id: doc.id, ...data } as PromoCode;
          return stuff;
        } else {
          // Reject if promo code is at it's limit
          logger.error("Promo code has reached it's limit");
          return Promise.reject(
            new InvalidPromoCodeError("Promo code has reached it's limit"),
          );
        }
      } else {
        // If promo code doesn't exist or any other issues
        logger.error("Promo code doesn't exist");
        return Promise.reject(new InvalidPromoCodeError('Invalid promo code'));
      }
    } catch (err) {
      logger.error('Unable to query promo codes');
      console.log('Unable to query promo codes', err);
      return Promise.reject(
        new ApplicationError('Error validating promo code'),
      );
    }
  }

  public async validateAndUpgrade(userId: string, code: string): Promise<void> {
    try {
      const promoCodeData = await this.validateCode(code);

      if (promoCodeData && promoCodeData.id) {
        await this.upgradeUser(userId, code);
        await promoCodeColl
          .doc(promoCodeData.id)
          .update({ used: promoCodeData.used + 1 });

        return Promise.resolve();
      }
    } catch (err) {
      logger.error(`Error validating and upgrading - ${err}`);
      console.log('Error validating and upgrading', err);
      return Promise.reject(err);
    }
  }
}

export default PromoCodeService;
