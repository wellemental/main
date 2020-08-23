import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen, ContentScreen, AuthScreen } from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from 'types';
import { useCurrentUser } from './hooks';

const Stack = createStackNavigator<StackParamList>();

const Navigator: React.FC = () => {
  const { auth } = useCurrentUser();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
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
