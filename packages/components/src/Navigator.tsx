import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNav, ContentScreen, AuthScreen } from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useCurrentUser } from './hooks';

const Stack = createStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  const { auth } = useCurrentUser();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {auth ? (
          <>
            <Stack.Screen name="TabNav" component={TabNav} />
            <Stack.Screen name="Content" component={ContentScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
