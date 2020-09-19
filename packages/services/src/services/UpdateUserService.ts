import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType, InitialUserDoc } from '../types';
import logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

class UpdateUserService implements UpdateUserServiceType {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    console.log('FAVORITING 1***', id);
    const doc = collection.doc(id); //
    const userSnapshot = await doc.get();
    const favUpdate = {};
    favUpdate[`favorites.${contentId}.favorited`] = isFav;
    favUpdate[
      `favorites.${contentId}.updated_at`
    ] = firestore.Timestamp.fromDate(new Date());

    try {
      console.log('FAVORITING');
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
        tracker.track(TrackingEvents.Favorite);
      } else {
        tracker.track(TrackingEvents.Unfavorite);
      }
    } catch (error) {
      logger.error('Failed to favorite content');
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
        logger.error('Failed to update user doc');
      }
    } else {
      try {
        await user.set({
          ...account,
          created_at,
        });
      } catch (err) {
        logger.error('Failed to create user doc');
      }
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
      logger.error(`Failed to update user '${id}'`);
      throw new ApplicationError('Unable to update');
    }
    return Promise.resolve();
  }
}

export default UpdateUserService;
