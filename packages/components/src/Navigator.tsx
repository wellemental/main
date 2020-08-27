import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  TabNav,
  VideoScreen,
  AuthScreen,
  TeacherScreen,
  ContentScreen,
  LandingScreen,
  EditProfileScreen,
  SaveUserScreen,
} from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useCurrentUser } from './hooks';
import variables from './assets/native-base-theme/variables/wellemental';

const Stack = createStackNavigator<RootStackParamList>();

const Navigator: React.FC = () => {
  const { auth, user } = useCurrentUser();
  const userDocCreated =
    user && !!user.email && !!user.birthday && !!user.name && !!user.language;

  console.log('USERDOC', userDocCreated, user);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          // cardShadowEnabled: false,
          headerStyle: { shadowOpacity: 0 },
          headerTitle: '',
          headerTintColor: variables.brandPrimary,
          headerLeftContainerStyle: { paddingLeft: 10, paddingTop: 10 },
        }}>
        {auth ? (
          <>
            {!userDocCreated ? (
              <Stack.Screen name="Save User" component={SaveUserScreen} />
            ) : (
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
                <Stack.Screen
                  name="Edit Profile"
                  component={EditProfileScreen}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              // options={{ mode: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
