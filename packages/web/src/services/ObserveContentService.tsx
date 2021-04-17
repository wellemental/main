import firebase, { FbUser } from '../base';
import {
  User,
  Languages,
  ObserveContentServiceType,
  Unsubscriber,
  Content,
  PlayEvent,
  Favorite,
} from 'common';
import { convertTimestamp } from './helpers';
import moment from 'moment';
import { setUserProperties } from './TrackerService';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

interface ObserveContentProps {
  options: BaseServiceContructorOptions;
  content: Content[];
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

class ObserveContentService
  extends BaseService
  implements ObserveContentServiceType {
  private unsubscribers: Unsubscriber[] = [];

  private plays?: PlayEvent[];
  private playsUnsubscriber?: Unsubscriber;
  private favs?: Favorite[];
  private favsUnsubscriber?: Unsubscriber;
  private setUser: React.Dispatch<React.SetStateAction<User | null>>;
  private setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  private userDoc = this.firestore.collection('users').doc(this.currentUser.id);
  private favsQuery = this.userDoc
    .collection('plays')
    .orderBy('createdAt', 'desc');

  constructor(props: ObserveContentProps) {
    super(props.options);
    this.setUser = props.setUser;
    this.setLoading = props.setLoading;
  }

  // Add listeners for favs and plays (first 10 of each)
  // Return arrays of each
  // Within content context,

  public subscribe(): void {
    // Stop any existing subscriptions
    this.unsubscribe();

    const unsubscriber = this.favsQuery.onSnapshot((snapshot: any) => {
      // Unsubscribe from previous userDoc listener if exists
      if (this.favsUnsubscriber) {
        this.favsUnsubscriber();
      }

      const favs: Favorite[] = [];
      for (const doc of snapshot.docs) {
        const data = doc.data() as Favorite;
        if (data) {
          favs.push({ ...data });
        } else {
          this.logger.warn(
            `Failed to add scorecard doc: ${JSON.stringify(doc)}`,
          );
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

export default ObserveContentService;
