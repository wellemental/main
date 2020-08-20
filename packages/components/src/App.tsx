import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, SettingsScreen, LibraryScreen } from './screens';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import platform from './assets/native-base-theme/variables/platform';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <>
      <StyleProvider style={getTheme(platform)}>
        <Root>
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Library" component={LibraryScreen} />
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </Root>
      </StyleProvider>
    </>
  );
};

export default App;
