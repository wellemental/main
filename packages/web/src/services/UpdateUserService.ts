import firebase from 'firebase/app';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType, InitialUserDoc } from '../types';
import logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';

const COLLECTION = 'users';
const collection = firebase.firestore().collection(COLLECTION);

class UpdateUserService implements UpdateUserServiceType {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    const doc = collection.doc(id); //
    try {
      const userSnapshot = await doc.get();
      const favUpdate: {
        [key: string]: boolean | firebase.firestore.Timestamp;
      } = {};
      favUpdate[`favorites.${contentId}.favorited`] = isFav;
      favUpdate[
        `favorites.${contentId}.updated_at`
      ] = firebase.firestore.Timestamp.fromDate(new Date());

      try {
        if (userSnapshot.exists) {
          await doc.update({
            ...favUpdate,
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          await doc.set({
            ...favUpdate,
            updated_at: firebase.firestore.FieldValue.serverTimestamp(),
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
    } catch (err) {}
    return Promise.resolve();
  }

  public async createProfile(account: Partial<InitialUserDoc>): Promise<void> {
    const user = collection.doc(account.id);
    const created_at = firebase.firestore.Timestamp.fromDate(new Date());

    try {
      await user.set({
        ...account,
        created_at,
      });
    } catch (err) {
      //   logger.error('Failed to create user doc');
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
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      //   logger.error(`Failed to update user '${id}'`);
      //   throw new ApplicationError('Unable to update');
    }
    return Promise.resolve();
  }
}

export default UpdateUserService;
