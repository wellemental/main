import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Content } from 'services';
import { ReactElement } from 'react';

export type TabParamList = {
  Library: undefined;
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Settings: undefined;
};

export type Unsubscriber = () => void;

export type RootStackParamList = {
  TabNav: undefined;
  Content: { content: Content };
  Auth: undefined;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type ContentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Content'
>;

export type ContentScreenRouteProp = RouteProp<RootStackParamList, 'Content'>;

export type TabsType = {
  [key: string]: ReactElement;
};
