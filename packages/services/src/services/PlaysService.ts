import {
  PlayEvent,
  PlaysObj,
  User,
  PlaysServiceType,
  // TrackingEvents,
} from '../types';
import { ApplicationError } from '../models/Errors';
import BaseService from './BaseService';
import { increment } from './helpers';
import moment from 'moment';

class PlaysService extends BaseService implements PlaysServiceType {
  userDoc = this.firestore.collection('users').doc(this.currentUser.id);
  collection = this.userDoc.collection('plays');
  public query = this.collection.orderBy('createdAt', 'desc');

  public add = async (id: string): Promise<void> => {
    try {
      // Add to the plays collection
      await this.collection.add({
        contentId: id,
        createdAt: new Date(),
      });

      // Increment the users totalPlays stat
      const newUpdate: Partial<User> = { totalPlays: increment() };

      if (!this.currentUser.firstPlay) {
        newUpdate.firstPlay = new Date();
      }

      await this.userDoc.update(newUpdate);

      // this.tracker.track(TrackingEvents.PlayVideo);
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error storing user play data');
    }
  };

  public complete = async (id: string, duration: number): Promise<void> => {
    try {
      const durationIncrement = increment(duration);

      const updateStreak = !this.currentUser.lastPlay // If it's their first play ever, increment
        ? increment()
        : moment(this.currentUser.lastPlay).isSame(
            // If last play was yesterday, increment the streak
            moment().subtract(1, 'day'),
            'day',
          )
        ? increment()
        : moment(this.currentUser.lastPlay).isSame(moment(), 'day') // If last play is same as today, do nothing
        ? this.currentUser.streak
        : 0; // If last play is more than 1 day ago, set streak to 1

      // Increase user completed meditation and total Minutes duration
      const userUpdate: Partial<User> = {
        totalCompleted: increment(),
        totalSeconds: durationIncrement,
        lastPlay: new Date(),
      };

      userUpdate.streak = updateStreak;

      await this.userDoc.update(userUpdate);
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error logging completed play stats');
    }

    try {
      // Mark the play completed
      await this.query
        .limit(1)
        .where('contentId', '==', id)
        .get()
        .then((snapshots) => {
          const doc = snapshots.docs[0];
          doc.ref.update({ completed: true });
        });
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error updating play complete status');
    }
  };

  public get = async (): Promise<PlaysObj> => {
    try {
      const plays: PlaysObj = {};

      // For use on user profile where it doesn't
      await this.query
        .limit(10)
        .get()
        .then((snapshots) =>
          snapshots.docs.forEach((doc) => {
            const data = doc.data() as PlayEvent;
            plays[doc.id] = { ...data };
          }),
        );
      return plays;
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error getting user plays');
    }
  };
}

export default PlaysService;
