import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Content, Teacher } from 'services';
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
  Content: { content: Content; teacher: Teacher };
  Video: { content: Content; teacher: Teacher };
  Teacher: { teacher: Teacher };
  'Edit Profile': undefined;
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

export type VideoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Video'
>;

export type ContentScreenRouteProp = RouteProp<RootStackParamList, 'Content'>;
export type VideoScreenRouteProp = RouteProp<RootStackParamList, 'Video'>;
export type TeacherScreenRouteProp = RouteProp<RootStackParamList, 'Teacher'>;

export type TabsType = {
  [key: string]: ReactElement;
};
