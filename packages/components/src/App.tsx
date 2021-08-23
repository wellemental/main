import React, { useEffect } from 'react';
import { StatusBar, Platform, UIManager } from 'react-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import wellemental from './assets/native-base-theme/variables/wellemental';
import {
  CurrentUserProvider,
  ContentProvider,
  NotificationProvider,
  ServicesProvider,
  IAPProvider,
} from './context';
import Navigator from './navigation/Navigator';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import AppUsage from './appUsage';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
    Orientation.lockToPortrait();
  }, []);

  return (
    <CurrentUserProvider>
      <StyleProvider style={getTheme(wellemental)}>
        <ServicesProvider>
          <ContentProvider>
            <IAPProvider>
              <NotificationProvider>
                <Root>
                  <SafeAreaProvider>
                    {Platform.OS === 'ios' ? (
                      <StatusBar barStyle="dark-content" />
                    ) : (
                      <StatusBar
                        translucent={true}
                        backgroundColor={'transparent'}
                      />
                    )}
                    <AppUsage />
                    <Navigator />
                  </SafeAreaProvider>
                </Root>
              </NotificationProvider>
            </IAPProvider>
          </ContentProvider>
        </ServicesProvider>
      </StyleProvider>
    </CurrentUserProvider>
  );
};

export default App;
