import {
  AnalyticsServiceType,
  Week,
  PlatformStat,
  User,
  PlayEvent,
  SubsStat,
  TotalsMap,
  Platforms,
  UserPlan,
  isPlanActive,
  StatObj,
  TotalStats,
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

  private incrementSubs = (
    statObj: SubsStat,
    type: 'iosIap' | 'android' | 'stripe' | 'promoCode',
  ) => {
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

  public buildTotalsMap = (totals: TotalStats): TotalsMap => {
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
