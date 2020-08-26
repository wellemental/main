import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';
import { UserProfile, UpdateUserServiceType } from '../types';

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
