import React from 'react';
import { StatusBar } from 'react-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import wellemental from './assets/native-base-theme/variables/wellemental';
import { CurrentUserProvider, ContentProvider } from './context';
import Navigator from './Navigator';

const App: React.FC = () => {
  return (
    <>
      <CurrentUserProvider>
        <ContentProvider>
          <StyleProvider style={getTheme(wellemental)}>
            <Root>
              <StatusBar barStyle="dark-content" />
              <Navigator />
            </Root>
          </StyleProvider>
        </ContentProvider>
      </CurrentUserProvider>
    </>
  );
};

export default App;
