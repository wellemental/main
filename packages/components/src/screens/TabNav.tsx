import React from 'react';
import LibraryScreen from './LibraryScreen';
import SettingsScreen from './SettingsScreen';
import HomeScreen from './HomeScreen';
import FavoritesScreen from './FavoritesScreen';
import { Icon } from 'native-base';
import SearchScreen from './SearchScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import variables from '../assets/native-base-theme/variables/wellemental';
import { useCurrentUser } from '../hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNav: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = focused
            ? route.name.toLowerCase()
            : route.name.toLowerCase().concat('-outline');

          if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} style={{ color: 'white' }} />;
        },
      })}
      tabBarOptions={{
        inactiveBackgroundColor: variables.brandPrimary,
        activeBackgroundColor: variables.brandPrimary,
        inactiveTintColor: variables.white,
        activeTintColor: variables.white,
        style: {
          backgroundColor: variables.brandPrimary,
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: 5 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: variables.brandPrimary,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: translation.Home }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{ title: translation.Library }}
      />

      {activePlan && (
        <>
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: translation.Favorites }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{ title: translation.Search }}
          />
        </>
      )}
      <Tab.Screen
        name="Settings"
        // component={SettingsScreen}
        component={ProfileScreen}
        options={{ title: translation.Settings }}
      />
    </Tab.Navigator>
  );
};

export default TabNav;
