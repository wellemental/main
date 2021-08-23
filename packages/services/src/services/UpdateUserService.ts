import { LocalStateService } from 'services';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import _ from 'lodash';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType, InitialUserDoc, Moment } from 'common';
import BaseService from './BaseService';
// import logger from './LoggerService';
// import tracker, { TrackingEvents } from './TrackerService';
const APP_USAGE_TIME = 'APP_USAGE_TIME';
const DATE_FORMAT = 'MMDDYYYY';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

class UpdateUserService implements UpdateUserServiceType {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    const doc = collection.doc(id); //
    try {
      const userSnapshot = await doc.get();
      const favUpdate = {};
      favUpdate[`favorites.${contentId}.favorited`] = isFav;
      favUpdate[
        `favorites.${contentId}.updated_at`
      ] = firestore.Timestamp.fromDate(new Date());

      try {
        if (userSnapshot.exists) {
          await doc.update({
            ...favUpdate,
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await doc.set({
            ...favUpdate,
            updated_at: firestore.FieldValue.serverTimestamp(),
          });
        }
        if (isFav) {
          // tracker.track(TrackingEvents.Favorite);
        } else {
          // tracker.track(TrackingEvents.Unfavorite);
        }
      } catch (error) {
        // logger.error('Failed to favorite content');
        throw new ApplicationError('Unable to fav content');
      }
    } catch (err) {}
    return Promise.resolve();
  }

  public async createProfile(account: Partial<InitialUserDoc>): Promise<void> {
    const user = collection.doc(account.id);
    const created_at = firestore.Timestamp.fromDate(new Date());

    try {
      await user.set({
        ...account,
        created_at,
      });
    } catch (err) {
      // logger.error('Failed to create user doc');
    }
  }

  public async updateProfile(
    id: string,
    fields: UserProfile | { [key: string]: any },
  ): Promise<void> {
    const doc = collection.doc(id);

    try {
      await doc.update({
        ...fields,
        updated_at: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      // logger.error(`Failed to update user '${id}'`);
      throw new ApplicationError('Unable to update');
    }
    return Promise.resolve();
  }

  public async updateAppUsageTime(id: string): Promise<void> {
    const doc = collection.doc(id);
    const userDoc = await doc.get();
    const { appUsageTime = {} } = userDoc.data();
    const localStateService = new LocalStateService();
    let usageDays = {};
    
    Array.from({ length: 7 }).map((_, i) => {
      const dayString = moment().subtract(i, 'd').format(DATE_FORMAT);
      usageDays[dayString] = appUsageTime[dayString] || [];
    });

    const response = await localStateService.getStorage(APP_USAGE_TIME)
    const usage = JSON.parse(response);

    if (usage) {
      const current = usage['day'];
      const currentTimings = _.uniqWith([...(appUsageTime[current] || []), ...(usage['timings'] || [])], _.isEqual);
      usageDays[current] = currentTimings;
    }
    
    try {
      await doc.update({
        appUsageTime: usageDays,
        updated_at: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      // logger.error(`Failed to update user '${id}'`);
      throw new ApplicationError('Unable to update');
    }
    return Promise.resolve();
  }
}

export default UpdateUserService;
