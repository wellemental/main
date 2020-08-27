import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType, InitialUserDoc } from '../types';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

class UpdateUserService implements UpdateUserServiceType {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    const doc = collection.doc(id);

    const favUpdate = {};
    favUpdate[`actions.${contentId}.favorited`] = isFav;

    try {
      await doc.update({
        ...favUpdate,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      //   logger.error(`Failed to update player '${id}': ${error}`);
      throw new ApplicationError('Unable to fav content');
    }
  }

  public async createProfile(account: InitialUserDoc): Promise<void> {
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
        console.log('Error updating existing user doc: ', err);
      }
    } else {
      try {
        await user.set({
          ...account,
          created_at,
        });
      } catch (err) {
        console.log('Error creating user doc: ', err);
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
      // logger.error(`Failed to update player '${id}': ${error}`);
      throw new ApplicationError('Unable to update');
    }
  }
}

export default UpdateUserService;
