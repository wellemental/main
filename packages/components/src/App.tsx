import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen, ContentScreen } from './screens';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import platform from './assets/native-base-theme/variables/platform';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from 'types';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  return (
    <>
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Content" component={ContentScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Root>
      </StyleProvider>
    </>
  );
};

export default App;
