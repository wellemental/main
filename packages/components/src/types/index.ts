import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Content, Teacher, Languages, Category, Version } from 'services';
import { ReactElement } from 'react';

export type TabParamList = {
  Library: { default: string };
  Home: undefined;
  Favorites: undefined;
  Search: undefined;
  Settings: undefined;
};

export type Unsubscriber = () => void;

export type RootStackParamList = {
  TabNav: undefined;
  Content: { content: Content; teacher: Teacher };
  Category: { category: Category };
  Video: { content: Content; teacher: Teacher };
  Teacher: { teacher: Teacher };
  'Edit Profile': undefined;
  'Save User': undefined;
  'Forgot Password': { translation: Translations };
  AuthStack: undefined;
  Upgrade: { version: Version };
};

export type AuthStackParamList = {
  Auth: { language: Languages };
  Landing: undefined;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type ContentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Content'
>;

export type UpgradeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Upgrade'
>;

export type VideoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Video'
>;

export type UpgradeScreenRouteProp = RouteProp<RootStackParamList, 'Upgrade'>;
export type ContentScreenRouteProp = RouteProp<RootStackParamList, 'Content'>;
export type VideoScreenRouteProp = RouteProp<RootStackParamList, 'Video'>;
export type TeacherScreenRouteProp = RouteProp<RootStackParamList, 'Teacher'>;
export type AuthScreenRouteProp = RouteProp<AuthStackParamList, 'Auth'>;
export type LibraryScreenRouteProp = RouteProp<TabParamList, 'Library'>;
export type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;
export type ForgotPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  'Forgot Password'
>;

export type TabsType = {
  [key: string]: ReactElement;
};

export type Translations = { [key: string]: string };
