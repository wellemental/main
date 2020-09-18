import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import wellemental from './assets/native-base-theme/variables/wellemental';
import {
  CurrentUserProvider,
  ContentProvider,
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
              <Root>
                <SafeAreaProvider>
                  {Platform.OS === 'ios' && (
                    <StatusBar barStyle="dark-content" />
                  )}
                  <Navigator />
                </SafeAreaProvider>
              </Root>
            </ServicesProvider>
          </IAPProvider>
        </ContentProvider>
      </StyleProvider>
    </CurrentUserProvider>
  );
};

export default App;
