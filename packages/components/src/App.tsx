import React from 'react';
import { StatusBar } from 'react-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import platform from './assets/native-base-theme/variables/platform';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from 'types';
import { CurrentUserProvider } from './context';
import Navigator from './Navigator';

const App: React.FC = () => {
  return (
    <>
      <CurrentUserProvider>
        <StyleProvider style={getTheme(platform)}>
          <Root>
            <StatusBar barStyle="dark-content" />
            <Navigator />
          </Root>
        </StyleProvider>
      </CurrentUserProvider>
    </>
  );
};

export default App;
