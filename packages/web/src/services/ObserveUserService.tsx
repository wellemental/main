import firebase, { FbUser } from '../base';
import {
  User,
  Languages,
  ObserveUserServiceType,
  convertTimestamp,
} from 'common';
import moment from 'moment';
import { setUserProperties } from '../services/TrackerService';

class ObserveUserService implements ObserveUserServiceType {
  private auth: FbUser | null = null;
  private authUnsubscriber?: () => void;
  private user?: User;
  private userUnsubscriber?: () => void;
  private setUser: React.Dispatch<React.SetStateAction<User | null>>;
  private setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.setUser = setUser;
    this.setLoading = setLoading;
  }

  public subscribe(): void {
    // Stop any existing subscriptions
    this.unsubscribe();

    this.authUnsubscriber = firebase
      .auth()
      .onAuthStateChanged((newAuth: FbUser | null) => {
        // Unsubscribe from previous userDoc listener if exists
        if (this.userUnsubscriber) {
          this.userUnsubscriber();
        }

        // If no user, set state to default (pass no parameters)
        if (!newAuth) {
          this.setUser(null);
          this.user = undefined;
          this.auth = null;
          this.setLoading(false);
        } else {
          // Set loading state while user doc is built
          this.setLoading(true);

          // If auth changed, subscribe to userDoc
          if (this.authChanged(newAuth)) {
            this.auth = newAuth;
            this.subscribeToUserDoc(newAuth);
          }
        }
      });

    return;
  }

  public unsubscribe(): void {
    if (this.authUnsubscriber) this.authUnsubscriber();
    if (this.userUnsubscriber) this.userUnsubscriber();
  }

  private subscribeToUserDoc = async (auth: FbUser) => {
    this.userUnsubscriber = firebase
      .firestore()
      .collection('users')
      .doc(auth.uid)
      .onSnapshot((snapshot: any) => {
        const userData = snapshot.data();

        // If user isn't logged in or doc doesn't exist
        if (!auth.email || !userData || !snapshot) {
          return Promise.resolve();
        }

        // Build user state
        this.user = {
          id: userData.id,
          email: snapshot.exists ? userData.email : undefined,
          language:
            userData && userData.language ? userData.language : Languages.En,
          favorites: userData && userData.favorites ? userData.favorites : {},
          stripeId:
            userData && userData.stripeId ? userData.stripeId : undefined,
          plan: userData && userData.plan ? userData.plan : undefined,
          isAdmin: userData && userData.isAdmin ? userData.isAdmin : false,
          totalCompleted:
            userData && userData.totalCompleted ? userData.totalCompleted : 0,
          totalPlays: userData && userData.totalPlays ? userData.totalPlays : 0,
          totalSeconds:
            userData && userData.totalSeconds
              ? Math.floor(userData.totalSeconds / 3600)
              : 0,
          // If lastPlay isn't yesterday or today, streak should be 0
          streak:
            userData &&
            userData.lastPlay &&
            convertTimestamp(userData.lastPlay).isSameOrAfter(
              moment().subtract(1, 'day'),
              'day',
            )
              ? userData.streak
              : 0,
          firstPlay:
            userData && userData.firstPlay
              ? convertTimestamp(userData.firstPlay).toDate()
              : undefined,
          lastPlay:
            userData && userData.lastPlay
              ? convertTimestamp(userData.lastPlay).toDate()
              : undefined,
          promptedNotification:
            userData && userData.promptedNotification
              ? userData.promptedNotification
              : false,
        };

        // Set GA Firebase User Properties
        setUserProperties(this.user.id ? this.user.id : undefined, {
          Payment: this.user.plan ? this.user.plan.type : 'Free',
          Type: this.user.plan ? this.user.plan.planId : 'Free',
          PlanStatus: this.user.plan ? this.user.plan.planId : 'Free',
        });

        this.setUser(this.user);
        this.setLoading(false);
      });
  };

  // This seems unnecessary, but keeping for time's sake
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
