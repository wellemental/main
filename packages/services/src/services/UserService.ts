// import { firestore } from '../base';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User as FBUser } from 'firebase/app';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Teacher, Teachers, User } from '../types';
import { ApplicationError } from '../models/Errors';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

export interface UserServiceType {
  observeAuth: () => void;
  observeUserDoc: () => void;
}

class UserService implements UserServiceType {
  private auth: FirebaseAuthTypes.User | null = null;
  private user?: User;
  private authUnsubscriber?: () => void;
  private userDocUnsubscriber?: () => void;
  private setAuth: React.Dispatch<FBUser | null>;
  private setUser: React.Dispatch<React.SetStateAction<User | null>>;

  constructor(setAuth: React.SetStateAction<FBUser | null>, setUser: React.Dispatch<React.SetStateAction<User | null>>) {
    this.setAuth = setAuth;
    this.setUser = setUser;
  }
  public subscribeToAuth = auth().onAuthStateChanged((authChange) => {
    this.setAuth(authChange);

    // Unsubscribe from previous userDoc listener if exists
    if (this.userDocUnsubscriber.current) {
      this.userDocUnsubscriber.current();
    }

    // If user logged in, subscribe to their player document
    if (this.auth) {
      subscribeToUserDoc(user);
    } else {
      setUser(null);
    }
  })



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
        user = userDoc;
      });
  };
  
}

export default UserService;
