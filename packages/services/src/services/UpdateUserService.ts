import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';

class UpdateUserService {
  public async favorite(
    id: string,
    contentId: string,
    isFav: boolean,
  ): Promise<void> {
    const doc = firestore().collection('users').doc(id);

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
}

export default UpdateUserService;
