import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType, InitialUserDoc } from '../types';
import Logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

class UpdateUserService implements UpdateUserServiceType {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    const doc = collection.doc(id); //
    const userSnapshot = await doc.get();

    const favUpdate = {};
    favUpdate[`actions.${contentId}.favorited`] = isFav;

    try {
      if (userSnapshot.exists) {
        await doc.update({
          ...favUpdate,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await doc.set({
          ...favUpdate,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }
      if (isFav) {
        tracker.track(TrackingEvents.Favorite);
      } else {
        tracker.track(TrackingEvents.Unfavorite);
      }
    } catch (error) {
      Logger.error('Failed to favorite content');
      throw new ApplicationError('Unable to fav content');
    }

    return Promise.resolve();
  }

  public async createProfile(account: Partial<InitialUserDoc>): Promise<void> {
    const user = collection.doc(account.id);

    const userSnapshot = await user.get();

    const created_at = firestore.Timestamp.fromDate(new Date());

    if (userSnapshot.exists) {
      try {
        await user.update({
          ...account,
          created_at,
        });
      } catch (err) {
        Logger.error('Failed to update user doc');
      }
    } else {
      try {
        await user.set({
          ...account,
          created_at,
        });
      } catch (err) {
        Logger.error('Failed to create user doc');
      }
    }
  }

  public async updateProfile(id: string, fields: UserProfile): Promise<void> {
    const doc = collection.doc(id);

    try {
      await doc.update({
        ...fields,
        updated_at: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      Logger.error(`Failed to update player '${id}'`);
      throw new ApplicationError('Unable to update');
    }
    return Promise.resolve();
  }
}

export default UpdateUserService;
