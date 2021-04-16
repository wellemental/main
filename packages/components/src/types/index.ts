// Types that have to do with navigation, all other are in 'common' package
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  Content,
  Teacher,
  Languages,
  Category,
  VersionConfig,
  Translation,
} from 'common';

export type TabParamList = {
  Home: undefined;
  Learn: undefined;
  Meditate: undefined;
  Sleep: undefined;
  Move: undefined;
  Profile: { defaultTab: string };
};

export type RootStackParamList = {
  TabNav: undefined;
  Library: undefined;
  Search: undefined;
  Settings: undefined;
  Teachers: undefined;
  Content: { content: Content };
  Category: { category: Category };
  Video: {
    content: Content;
    teacher: Teacher;
    savedVideoPath?: string;
    handleComplete: () => void;
  };
  Teacher: { teacher: Teacher };
  'Edit Profile': undefined;
  'Save User': undefined;
  'Forgot Password': { translation: Translation };
  AuthStack: undefined;
  Upgrade: { version: VersionConfig };
  Plans: undefined;
  Celebration: undefined;
  Notifications: { prompt: boolean };
};

export type AuthStackParamList = {
  Auth: { language: Languages };
  Landing: undefined;
};

export type MainNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type HomeScreenNavigationProp = StackNavigationProp<
  TabParamList,
  'Home'
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

export type NotificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notifications'
>;

export type UpgradeScreenRouteProp = RouteProp<RootStackParamList, 'Upgrade'>;
export type ContentScreenRouteProp = RouteProp<RootStackParamList, 'Content'>;
export type VideoScreenRouteProp = RouteProp<RootStackParamList, 'Video'>;
export type NotificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Notifications'
>;
export type TeacherScreenRouteProp = RouteProp<RootStackParamList, 'Teacher'>;
export type AuthScreenRouteProp = RouteProp<AuthStackParamList, 'Auth'>;
export type LibraryScreenRouteProp = RouteProp<RootStackParamList, 'Library'>;
export type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;
export type ProfileScreenRouteProp = RouteProp<TabParamList, 'Profile'>;
export type ForgotPasswordScreenRouteProp = RouteProp<
  RootStackParamList,
  'Forgot Password'
>;
