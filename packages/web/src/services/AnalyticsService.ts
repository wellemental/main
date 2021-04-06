import {
  AnalyticsServiceType,
  Week,
  PlatformStat,
  PlayEvent,
  Platforms,
} from 'common';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import BaseService from './BaseService';

const columns: string[] = [
  'isoWeek',
  'startDate',
  'endDate',
  'signups',
  'activeSubs',
  'newSubs',
  'cancellations',
  'plays',
  'completions',
  'seconds',
  'favs',
];
class AnalyticsService extends BaseService implements AnalyticsServiceType {
  static dateFormat = 'YYYY-MM-DD';
  public defaultPlatformStat: PlatformStat = {
    android: 0,
    ios: 0,
    web: 0,
    total: 0,
  };
  //   static sunday = moment().isoWeekday(1);
  //   static sundayStr = sunday.format(dateFormat);

  // Determine if play is the same isoWeek
  //   public isThisWeek = (date: moment.Moment, isoWeek) => {
  //     return date.isoWeek() === sunday.isoWeek() ? true : false;
  //   };

  //   public getPlays = async (
  //     date: string,
  //   ): Promise<{
  //     plays: PlatformStat;
  //     completions: PlatformStat;
  //   }> => {
  //     const plays = this.defaultPlatformStat;
  //     const completions = this.defaultPlatformStat;

  //     try {
  //       const collection = this.firestore.collectionGroup('plays');

  //       await collection.get().then(snapshots =>
  //         snapshots.docs.forEach(doc => {
  //           const data = doc.data() as PlayEvent;
  //           // Convert createdAt timestamp to moment
  //           const createdAtMoment = moment(data.createdAt.toDate());

  //           // If the play wasn't in the same week, return and don't increment anything
  //           if (!this.isThisWeek(createdAtMoment)) {
  //             return;
  //           }

  //           // Increment Totals
  //           plays.total++;
  //           if (!!data.completed) {
  //             completions.total++;
  //           }

  //           // Increment Platforms
  //           if (data.platform === Platforms.iOS) {
  //             plays.ios++;

  //             if (!!data.completed) {
  //               completions.ios++;
  //             }
  //           }
  //           if (data.platform === Platforms.Android) {
  //             plays.android++;

  //             if (!!data.completed) {
  //               completions.android++;
  //             }
  //           }
  //           if (data.platform === Platforms.Web) {
  //             plays.web++;

  //             if (!!data.completed) {
  //               completions.web++;
  //             }
  //           }
  //           return;
  //         }),
  //       );
  //       console.log('GET PLAYS', plays, completions);
  //     } catch (error) {
  //       console.log('Error getting weekly plays analytics', error);
  //       return Promise.reject();
  //     }
  //   };

  public get = async (): Promise<Week[]> => {
    const collection = this.firestore
      .collection('analytics-weekly')
      .orderBy('endDate', 'desc');

    try {
      const weeks: Week[] = [];

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as Week;
          weeks.push({ ...data });
        }),
      );

      return weeks;
    } catch (error) {
      console.log('Error getting weekly analytics', error);
      throw new ApplicationError('Error getting weekly analytics');
    }
  };
}

export default AnalyticsService;
