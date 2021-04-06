import {
  AnalyticsServiceType,
  Week,
  PlatformStat,
  User,
  PlayEvent,
  SubsStat,
  Timestamp,
  Favorite,
  FbUserPlan,
  TotalsMap,
  Platforms,
  UserPlan,
  isPlanActive,
  StatObj,
  TotalStats,
  convertToTimestamp,
} from 'common';
import moment from 'moment';
import { ApplicationError } from '../models/Errors';
import BaseService from './BaseService';

class AnalyticsService extends BaseService implements AnalyticsServiceType {
  private totalsDoc = this.firestore.collection('analytics').doc('total');
  private dateFormat = 'YYYY-MM-DD';
  private defaultPlatformStat: PlatformStat = {
    android: 0,
    ios: 0,
    web: 0,
    total: 0,
  };

  private defaultSubsStat: SubsStat = {
    ...this.defaultPlatformStat,
    promoCode: 0,
  };

  // Get Sunday date string
  private getSundayString = (createdAt: Timestamp): string => {
    const createdAtMoment = moment(createdAt.toDate());
    const sunday = createdAtMoment.isoWeekday(7).format(this.dateFormat);
    return sunday;
  };

  private getSundayFromUnix = (unix: number): string => {
    const createdAtMoment = moment.unix(unix);
    const sunday = createdAtMoment.isoWeekday(7).format(this.dateFormat);
    return sunday;
  };

  private incrementSubs = (
    statObj: SubsStat,
    type: 'iosIap' | 'android' | 'stripe' | 'promoCode',
    shouldIncrement?: boolean,
  ) => {
    // Increment if shouldIncrement is undefined or false
    const willIncrement = !shouldIncrement ? false : true;

    if (willIncrement) {
      // Increment stat total
      statObj.total++;

      // Increment New Subscription Platforms
      if (type === 'iosIap') {
        statObj.ios++;
      }
      if (type === 'android') {
        statObj.android++;
      }
      if (type === 'stripe') {
        statObj.web++;
      }
      if (type === 'promoCode') {
        statObj.promoCode++;
      }
    }
  };

  private incrementPlatform = (
    statObj: PlatformStat,
    platform: Platforms | undefined,
    shouldIncrement?: boolean,
  ) => {
    // Increment if shouldIncrement is undefined or false
    const willIncrement = !shouldIncrement ? false : true;

    // Create PlatformStat object if it doesn't already exist
    if (!statObj) {
      statObj = { ...this.defaultPlatformStat };
    }

    if (willIncrement) {
      // Increment Totals
      statObj.total++;

      // Increment Platforms
      if (platform) {
        if (platform === Platforms.iOS) {
          statObj.ios++;
        }
        if (platform === Platforms.Android) {
          statObj.android++;
        }
        if (platform === Platforms.Web) {
          statObj.web++;
        }
      }
    }
  };

  private getSignups = async (
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<PlatformStat> => {
    const signups: PlatformStat = { ...this.defaultSubsStat };

    // Count all user signups that were created between dates
    try {
      const collection = this.firestore
        .collection('users')
        .where('created_at', '>', startTimestamp)
        .where('created_at', '<', endTimestamp);

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as User;
          // Early account didn't have created_at field it seems

          this.incrementPlatform(signups, data.platform);
          return Promise.resolve();
        }),
      );
      return signups;
    } catch (error) {
      console.log('Error getting weekly signup analytics', error);
      return Promise.reject();
    }
  };

  private getSubStats = async (
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<{
    newSubs: SubsStat;
    cancelled: SubsStat;
  }> => {
    const newSubs: SubsStat = { ...this.defaultSubsStat };
    const cancelled: SubsStat = { ...this.defaultSubsStat };

    try {
      // Can't do where query by subproperty
      // So query for all users with a plan - inefficient but no other way
      const collection = this.firestore.collection('users').orderBy('plan');

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data();
          // Early account didn't have created_at field it seems

          if (!!data.plan) {
            const plan = data.plan as FbUserPlan;

            // Only increment new subcribers if createdAt field is within the range
            const shouldIncrement =
              plan.createdAt &&
              plan.createdAt < endTimestamp &&
              plan.createdAt > startTimestamp;

            this.incrementSubs(newSubs, plan.type, shouldIncrement);
          }
          return Promise.resolve();
        }),
      );
    } catch (error) {
      console.log('Error getting weekly signup analytics', error);
      return Promise.reject();
    }

    return { newSubs, cancelled };
  };

  private getFavs = async (
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<PlatformStat> => {
    const favorites: PlatformStat = { ...this.defaultPlatformStat };
    try {
      const collection = this.firestore
        .collectionGroup('favorites')
        .where('createdAt', '>', startTimestamp)
        .where('createdAt', '<', endTimestamp);

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as Favorite;

          // Increment Completions
          this.incrementPlatform(favorites, data.platform, !!data.favorited);

          return Promise.resolve();
        }),
      );
      return favorites;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  private getPlays = async (
    startTimestamp: Timestamp,
    endTimestamp: Timestamp,
  ): Promise<{ plays: PlatformStat; completions: PlatformStat }> => {
    const plays: PlatformStat = { ...this.defaultPlatformStat };
    const completions: PlatformStat = { ...this.defaultPlatformStat };

    try {
      const collection = this.firestore
        .collectionGroup('plays')
        .where('createdAt', '>', startTimestamp)
        .where('createdAt', '<', endTimestamp);

      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as PlayEvent;
          // Increment Plays
          this.incrementPlatform(plays, data.platform);

          // Increment Completions
          this.incrementPlatform(completions, data.platform, !!data.completed);

          return;
        }),
      );
      return { plays, completions };
    } catch (error) {
      return Promise.reject('Error getting weekly plays analytics');
    }
  };

  public addWeek = async (dateStr: string): Promise<void> => {
    // dateStr passed in is the final day of the previous week
    // So add 8 days so that the end timestamp is at midnight of day after end date for following week
    // And add 1 days so the start timestamp is at midnight of the proper startDate
    const docMoment = moment(dateStr).add(7, 'days');
    const docId = docMoment.format(this.dateFormat);
    const endMoment = moment(dateStr).add(8, 'days');
    const startMoment = moment(dateStr).add(1, 'days');
    const endTimestamp = convertToTimestamp(endMoment.toDate());
    const startTimestamp = convertToTimestamp(startMoment.toDate());

    const { plays, completions } = await this.getPlays(
      startTimestamp,
      endTimestamp,
    );

    const favorites = await this.getFavs(startTimestamp, endTimestamp);
    const signups = await this.getSignups(startTimestamp, endTimestamp);
    const { newSubs, cancellations } = await this.getSubStats(
      startTimestamp,
      endTimestamp,
    );

    const thisWeek: Week = {
      id: docId,
      year: docMoment.year(),
      isoWeek: docMoment.isoWeek(),
      startDate: startMoment.format(this.dateFormat),
      endDate: docId,
      plays: plays ? plays : { ...this.defaultPlatformStat },
      completions: completions ? completions : { ...this.defaultPlatformStat },
      favs: favorites ? favorites : { ...this.defaultPlatformStat },
      signups: signups ? signups : { ...this.defaultPlatformStat },
      newSubs: newSubs ? newSubs : { ...this.defaultPlatformStat },
      cancellations: cancellations
        ? cancellations
        : { ...this.defaultPlatformStat },
    };
    await this.firestore
      .collection('analytics/weekly/weeks')
      .doc(docId)
      .set(thisWeek);
  };

  public updateTotals = async (): Promise<void> => {
    const collection = this.firestore.collection('users');
    let users = 0;
    const activeSubs = this.defaultSubsStat;
    try {
      await collection.get().then(snapshots =>
        snapshots.docs.forEach(doc => {
          const data = doc.data() as User;

          // Increment total users
          users++;

          // Increment ActiveSubs if plan exists and is active
          if (!!data.plan && isPlanActive(data.plan)) {
            const plan = data.plan as UserPlan;
            this.incrementSubs(activeSubs, plan.type);
          }
        }),
      );

      await this.totalsDoc.set({
        users,
        activeSubs,
        updatedAt: new Date(),
      });

      return Promise.resolve();
    } catch (error) {
      console.log('Error updating total analytics', error);
      return Promise.reject();
    }
  };

  private buildTotalsMap = (totals: TotalStats): TotalsMap => {
    const totalsMap: TotalsMap = {
      users: totals.users,
      totalActive: totals.activeSubs.total,
      totalPaid: totals.activeSubs.total - totals.activeSubs.promoCode,
      ios: totals.activeSubs.ios,
      android: totals.activeSubs.android,
      web: totals.activeSubs.web,
      promoCode: totals.activeSubs.promoCode,
      updatedAt: moment(totals.updatedAt.toDate()).fromNow(),
    };

    return totalsMap;
  };

  public getTotals = async (): Promise<TotalsMap> => {
    try {
      const doc = await this.totalsDoc.get();
      const data = doc.data() as TotalStats;

      const totals = this.buildTotalsMap(data);

      return totals;
    } catch (error) {
      console.log('Error getting totals', error);
      return Promise.reject('Error getting totals');
    }
  };

  public getNew = async (): Promise<void> => {
    const docRef = this.firestore.collection('analytics').doc('total');
    const doc = await docRef.get();
    const data = doc.data();

    const start = new Date();
    const collection = this.firestore
      .collectionGroup('plays')
      .where('createdAt', '>', start);
  };

  public get = async (): Promise<Week[]> => {
    const collection = this.firestore
      .collection('analytics/weekly/weeks')
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
