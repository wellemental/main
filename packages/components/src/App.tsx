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
import Navigator from './navigation/Navigator';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
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
