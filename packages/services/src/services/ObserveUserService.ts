// import { firestore } from '../base';
// import { firestore, auth, FbUser, DocumentSnapshot } from '../base';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User as FBUser } from 'firebase/app';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Teacher, Teachers, User, Languages } from '../types';
import { ApplicationError } from '../models/Errors';

const COLLECTION = 'users';
const collection = firestore().collection(COLLECTION);

export interface ObserveUserServiceType {
  subscribe(): void;
  unsubscribe(): void;
}

// NOT CURRENTLY USING, KEPT IT ALL IN CURRENT USER CONTEXT

class ObserveUserService implements ObserveUserServiceType {
  private language: FbUser | null = null;
  private setLanguage: React.SetStateAction<Languages>;
  private languageUnsubscriber?: () => void;
  private auth: FbUser | null = null;
  private authUnsubscriber?: () => void;
  private user?: User;
  private userUnsubscriber?: () => void;
  private userChanged: React.Dispatch<(prevState: undefined) => undefined>;

  constructor(
    userChanged: React.Dispatch<(prevState: undefined) => undefined>,
  ) {
    this.userChanged = userChanged;
  }

  public subscribe(): void {
    // Stop any existing subscriptions
    this.unsubscribe();
    this.userUnsubscriber = auth().onAuthStateChanged(this.authStateChanged);
  }

  public unsubscribe(): void {
    if (this.authUnsubscriber) this.authUnsubscriber();
    if (this.userUnsubscriber) this.userUnsubscriber();
  }

  private authStateChanged = async (newAuth: FbUser | null): Promise<void> => {
    if (!auth) {
      this.user = undefined;
      this.auth = null;
      if (this.userUnsubscriber) this.userUnsubscriber();
      this.userChanged();

      return;
    }

    // Set the user id for analytics
    // analytics().setUserId(user.uid);

    // We seem to get duplicate calls to this on boot, this keeps us from oversubscribing to player updates
    if (this.authChanged(newAuth)) {
      this.auth = newAuth;
      this.observeUser(newAuth);
    }
  };

  private observeUser = (user: FbUser): void => {
    if (this.userUnsubscriber) this.userUnsubscriber();

    this.userUnsubscriber = collection
      .doc(user.uid)
      .onSnapshot(this.userStateChanged);
  };

  private userStateChanged = async (
    snapshot: DocumentSnapshot,
  ): Promise<void> => {
    const userData = snapshot.data() as User;

    // No user means we're logged out but somehow got here so tell the subscriber
    // No firePlayer means there's no Player profile (e.g. Onboarding) so tell the subscriber
    if (!userData || !this.auth) {
      this.userChanged();
      return Promise.resolve();
    }

    if (!this.auth.email) {
      // logger.error('Player does not have an email');
      return Promise.resolve();
    }

    this.user = {
      id: userData.id,
      birthday: snapshot.exists ? userData.birthday : undefined,
      language: snapshot.exists ? userData.language : undefined,
      name: snapshot.exists ? userData.name : undefined,
      email: snapshot.exists ? userData.email : undefined,
      subStatus: snapshot.exists ? userData.subStatus : undefined,
      actions: snapshot.exists ? userData.actions : undefined,
    };
  };

  private authChanged = (newAuth: FbUser): boolean => {
    if (!this.auth) return true;

    if (
      this.auth.uid === newAuth.uid &&
      this.auth.email === newAuth.email &&
      this.auth.displayName === newAuth.displayName
    ) {
      return false;
    } else {
      return true;
    }
  };
}

export default ObserveUserService;
