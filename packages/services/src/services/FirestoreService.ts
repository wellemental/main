import { PlayEvent, Content, FirestoreServiceType } from '../types';
import { ApplicationError } from '../models/Errors';
import BaseService from './BaseService';

type MappedTypes = {
  plays: PlayEvent;
  content: Content;
};

type ServiceNames = keyof MappedTypes;

class FirestoreService extends BaseService implements FirestoreServiceType {
  collection = this.firestore
    .collection('users')
    .doc(this.currentUser.id)
    .collection('plays');

  public query = this.collection.orderBy('createdAt', 'desc');

  public add = async (id: string, duration: number): Promise<void> => {
    try {
      await this.collection.add({
        contentId: id,
        duration: duration,
        createdAt: new Date(),
      });
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error storing user play data');
    }
  };

  public get = async (type: ServiceNames): Promise<PlayEvent[]> => {
    try {
      // For use on user profile where it doesn't
      if (!filtered) {
        const plays: PlayEvent[] = [];

        await this.query.get().then((snapshots) =>
          snapshots.docs.forEach((doc) => {
            const data = doc.data() as PlayEvent;
            plays.push({ ...data });
          }),
        );
        return plays;
      }
    } catch (err) {
      // this.logger.error(err);
      throw new ApplicationError('Error getting user plays');
    }
  };
}

export default FirestoreService;
