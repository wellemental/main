// import { firestore } from '../base';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Teacher, Teachers } from '../types';
import { ApplicationError } from '../models/Errors';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

export interface UserServiceType {
  observeAuth: () => void;
  observeUserDoc: () => void;
}

class UserService implements UserServiceType {
  public subscribeToUserDoc = async (user: User) {
    userDocUnsubscriber.current = firestore()
      .collection('users')
      .onSnapshot(async (snapshot: firestore.DocumentSnapshot) => {
        const userData = snapshot.data();

        if (!user.email) {
          return Promise.resolve();
        } else if (!snapshot.exists) {
          return Promise.reject('User doc does not exist.');
        }

        const userDoc: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          subStatus: userData.subStatus,
          actions: userData.actions,
        };
        setCurrentUser(userDoc);
      });
  };
  
}

export default UserService;
