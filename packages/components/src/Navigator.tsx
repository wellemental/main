import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  TabNav,
  VideoScreen,
  AuthScreen,
  TeacherScreen,
  ContentScreen,
  EditProfileScreen,
} from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useCurrentUser } from './hooks';

const Stack = createStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  const { auth } = useCurrentUser();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth ? (
          <>
            <Stack.Screen
              name="TabNav"
              component={TabNav}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Content" component={ContentScreen} />
            <Stack.Screen name="Video" component={VideoScreen} />
            <Stack.Screen name="Teacher" component={TeacherScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
