import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  TabNav,
  VideoScreen,
  AuthScreen,
  TeacherScreen,
  ContentScreen,
  LandingScreen,
  CategoryScreen,
  EditProfileScreen,
  ForgotPasswordScreen,
  NotificationsScreen,
  UpgradeScreen,
  CelebrationScreen,
  PlansScreen,
} from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList, AuthStackParamList } from './types';
import { useCurrentUser } from './hooks';
import variables from './assets/native-base-theme/variables/wellemental';

const Stack = createStackNavigator<RootStackParamList>();
// const ModalStack = createStackNavigator<ModalStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackScreen: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS,
        },
        headerTitle: '',
        headerTintColor: variables.brandPrimary,
        headerLeftContainerStyle: { paddingLeft: 10, paddingTop: 10 },
      }}>
      <AuthStack.Screen name="Landing" component={LandingScreen} />
      <AuthStack.Screen name="Auth" component={AuthScreen} />
    </AuthStack.Navigator>
  );
};

const linking = {
  prefixes: ['https://wellemental.com', 'wellemental://'],
  config: {
    screens: {
      Home: '',
      Profile: ':id/profile',
      Settings: ':id/blog',
    },
  },
};

const Navigator: React.FC = () => {
  const { user } = useCurrentUser();

  return (
    <NavigationContainer>
      <Stack.Navigator
        mode="modal"
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS,
          },
          headerTitle: '',
          headerTintColor: variables.brandPrimary,
          headerLeftContainerStyle: {
            paddingLeft: 10,
            paddingTop: 10,
            transform: [{ rotateZ: '-90deg' }],
          },
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="TabNav"
              component={TabNav}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Content" component={ContentScreen} />
            <Stack.Screen
              name="Celebration"
              component={CelebrationScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Plans" component={PlansScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen
              name="Video"
              component={VideoScreen}
              options={{
                headerStyle: {
                  backgroundColor: '#000',
                  shadowOpacity: 0,
                },
                headerTintColor: '#fff',
                cardStyle: {
                  backgroundColor: '#000',
                },
              }}
            />
            <Stack.Screen
              name="Upgrade"
              component={UpgradeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Teacher" component={TeacherScreen} />
            <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="AuthStack"
              component={AuthStackScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Forgot Password"
              component={ForgotPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
