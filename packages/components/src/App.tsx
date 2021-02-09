import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
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
import Navigator from './Navigator';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <CurrentUserProvider>
      <StyleProvider style={getTheme(wellemental)}>
        <ContentProvider>
          <IAPProvider>
            <ServicesProvider>
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
                    <Navigator />
                  </SafeAreaProvider>
                </Root>
              </NotificationProvider>
            </ServicesProvider>
          </IAPProvider>
        </ContentProvider>
      </StyleProvider>
    </CurrentUserProvider>
  );
};

export default App;
