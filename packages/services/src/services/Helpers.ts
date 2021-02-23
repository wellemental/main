import { Feature, Category, Timestamp, FieldValue } from '../types';
import moment from 'moment';
import firebase from '@react-native-firebase/app';
import Rate, { AndroidMarket } from 'react-native-rate';

export const capitalize = (s: any) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const isFeature = (obj: Feature | Category): obj is Feature => {
  return (<Feature>obj)['title-es'] !== undefined;
};

export const convertTimestamp = (timestamp: Timestamp): moment.Moment => {
  return moment(timestamp.toDate());
};

export const increment = (amount?: number): FieldValue => {
  return firebase.firestore.FieldValue.increment(amount ? amount : 1);
};

export const rateApp = () => {
  const options = {
    AppleAppID: '1531397725',
    GooglePackageName: 'com.wellemental.wellemental',
    // OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: true,
    openAppStoreIfInAppFails: true,
    // fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html',
  };
  Rate.rate(options, (success) => {
    if (success) {
      // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
      // Do nothing for now
    }
  });
};
