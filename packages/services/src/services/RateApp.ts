import Rate, { AndroidMarket } from 'react-native-rate';

export const rateApp = (cb = () => {}) => {
  const options = {
    AppleAppID: '1531397725',
    GooglePackageName: 'com.wellemental.wellemental',
    OtherAndroidURL:
      'https://play.google.com/store/apps/details?id=com.wellemental.wellemental',
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: true,
    openAppStoreIfInAppFails: true,
    fallbackPlatformURL: 'http://www.wellemental.co',
  };
  Rate.rate(options, success => {
    cb();
    if (success) {
      // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
      // Do nothing for now
    }
  });
};
