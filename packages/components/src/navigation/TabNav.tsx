import React from 'react';

import { Icon } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { colors } from 'common';
import { useCurrentUser } from '../hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MoveScreen from '../screens/MoveScreen';
import MeditateScreen from '../screens/MeditateScreen';
import LearnScreen from '../screens/LearnScreen';
import SleepScreen from '../screens/SleepScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNav: React.FC = () => {
  const { translation } = useCurrentUser();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = focused
            ? route.name.toLowerCase()
            : route.name.toLowerCase().concat('-outline');

          if (route.name === 'Sleep') {
            iconName = focused ? 'moon' : 'moon-outline';
            // iconName = focused ? 'bed' : 'bed-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Move') {
            iconName = focused ? 'body' : 'body-outline';
          } else if (route.name === 'Meditate') {
            iconName = focused ? 'sunny' : 'sunny-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }

          // You can return any component that you like here!
          return (
            <Icon
              name={iconName}
              style={{
                color: colors.text,
                opacity: focused ? 1 : 0.4,
              }}
            />
          );
        },
      })}
      tabBarOptions={{
        inactiveBackgroundColor: colors.base,
        activeBackgroundColor: colors.base,
        inactiveTintColor: colors.lightText,
        activeTintColor: colors.text,
        style: {
          backgroundColor: colors.base,
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: 5 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.neutral,
          shadowColor: colors.lightText,
          borderTopWidth: 0,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.35,
          shadowRadius: 13.84,
          elevation: 5,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: translation.Home }}
      />
      <Tab.Screen
        name="Meditate"
        component={MeditateScreen}
        options={{ title: translation.Meditate }}
      />

      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: translation.Learn }}
      />

      <Tab.Screen
        name="Move"
        component={MoveScreen}
        options={{ title: translation.Move }}
      />

      <Tab.Screen
        name="Sleep"
        component={SleepScreen}
        options={{ title: translation.Sleep }}
      />

      <Tab.Screen
        name="Profile"
        // component={SettingsScreen}
        component={ProfileScreen}
        options={{ title: translation.Profile }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
