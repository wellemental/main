import React, { useRef, useEffect } from 'react';
import { AppState, View } from 'react-native';
import moment from 'moment';
import { LocalStateService, UpdateUserService } from 'services';
import { useCurrentUser } from '../hooks';

const APP_USAGE_TIME = 'APP_USAGE_TIME';
const DATE_FORMAT = 'MMDDYYYY';

const AppUsage: React.FC = () => {
  let appStartTime = moment();
  const localStateService = new LocalStateService();
  const { user } = useCurrentUser();
  const updateUserService = new UpdateUserService();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      appCheckUsage()
    }
  }, [user?.id]);

  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      appStartTime = moment();
      appCheckUsage();
    } else if (nextAppState === "inactive") {
      storeUsage();
    }
    appState.current = nextAppState;
  };

  const appCheckUsage = async () => await updateUserService.updateAppUsageTime(user.id);
  
  const storeUsage = async () => {
    if (user) {
      const response = await localStateService.getStorage(APP_USAGE_TIME);
      const value = JSON.parse(response);

      const day = appStartTime.format(DATE_FORMAT);
      const entry = { start: appStartTime.format(), end: moment().format() }
      let timings = [entry];
      if (value && value['day'] === day) {
        timings = value['timings'].concat(timings);
      }
      localStateService.setStorage(APP_USAGE_TIME, { day, timings });
    }
  }
  return (
    <View />
  );
};

export default AppUsage;
