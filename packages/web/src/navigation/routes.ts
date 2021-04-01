import {
  AuthScreen,
  CategoryScreen,
  ContentScreen,
  DownloadScreen,
  FavoritesScreen,
  ForgotPasswordScreen,
  HomeScreen,
  LearnScreen,
  LibraryScreen,
  MeditateScreen,
  MoveScreen,
  PlansScreen,
  PromoCodeScreen,
  SearchScreen,
  SettingsScreen,
  SleepScreen,
  StripePortal,
  SubscriptionScreen,
  TeacherScreen,
} from '../screens';
import ProfileScreen from '../screens/ProfileScreen';
import { Tags } from 'common';

export type RouteType = {
  label: string;
  slug: string;
  component: React.FC<any>;
  pro: boolean;
  loggedIn: boolean;
  tag?: Tags;
};

export const routes2: RouteType[] = [
  {
    label: 'Library',
    slug: '/library',
    pro: false,
    loggedIn: true,
    component: LibraryScreen,
  },
  {
    label: 'Meditate',
    slug: '/meditate',
    pro: false,
    loggedIn: true,
    component: MeditateScreen,
  },
];

// Build this so I could map it in app.tsx, but components were showing as undefined in the map
const routes: { [key: string]: RouteType } = {
  Home: {
    label: 'Home',
    slug: '/',
    pro: false,
    loggedIn: true,
    component: HomeScreen,
  },
  Library: {
    label: 'Library',
    slug: '/library',
    pro: false,
    loggedIn: true,
    component: LibraryScreen,
  },
  Meditate: {
    label: 'Meditate',
    slug: '/meditate',
    pro: false,
    loggedIn: true,
    component: MeditateScreen,
  },
  Learn: {
    label: 'Learn',
    slug: '/learn',
    loggedIn: true,
    pro: false,
    component: LearnScreen,
  },
  Move: {
    label: 'Move',
    slug: '/move',
    pro: false,
    loggedIn: true,
    component: MoveScreen,
  },
  Sleep: {
    label: 'Sleep',
    slug: '/sleep',
    pro: false,
    loggedIn: true,
    component: SleepScreen,
  },
  Profile: {
    label: 'Profile',
    slug: '/profile',
    pro: true,
    loggedIn: true,
    component: ProfileScreen,
  },
  Favorites: {
    label: 'Favorites',
    slug: '/favorites',
    pro: true,
    loggedIn: true,
    component: FavoritesScreen,
  },
  Stripe: {
    label: 'Stripe',
    slug: '/stripe',
    component: StripePortal,
    pro: false,
    loggedIn: true,
  },
  Download: {
    label: 'Download',
    slug: '/download',
    component: DownloadScreen,
    pro: false,
    loggedIn: true,
  },
  Plans: {
    label: 'Plans',
    slug: '/plans',
    component: PlansScreen,
    pro: false,
    loggedIn: true,
  },
  Subscription: {
    label: 'Subscription',
    slug: '/subscription',
    component: SubscriptionScreen,
    pro: false,
    loggedIn: true,
  },
  ForgotPassword: {
    label: 'Forgot Password',
    slug: '/forgot-password',
    pro: false,
    loggedIn: false,
    component: ForgotPasswordScreen,
  },
  Content: {
    label: 'Content',
    slug: '/content',
    pro: false,
    loggedIn: true,
    component: ContentScreen,
  },
  Teacher: {
    label: 'Teacher',
    slug: '/teacher',
    pro: false,
    loggedIn: true,
    component: TeacherScreen,
  },
  Search: {
    label: 'Search',
    slug: '/search',
    pro: true,
    loggedIn: true,
    component: SearchScreen,
  },
  Friends: {
    label: 'Friends',
    slug: '/friends',
    pro: false,
    loggedIn: false,
    component: AuthScreen,
  },
  Login: {
    label: 'Login',
    slug: '/login',
    pro: false,
    loggedIn: false,
    component: AuthScreen,
  },
  Access: {
    label: 'Access Code',
    slug: '/access',
    pro: false,
    loggedIn: true,
    component: PromoCodeScreen,
  },
  Category: {
    label: 'Category',
    slug: '/category',
    pro: false,
    loggedIn: true,
    component: CategoryScreen,
  },
  Settings: {
    label: 'Your Account',
    slug: '/settings',
    pro: false,
    loggedIn: true,
    component: SettingsScreen,
  },
  Help: {
    label: 'Help',
    slug: 'support', // '/settings',
    pro: false,
    loggedIn: true,
    component: SettingsScreen,
  },
  Logout: {
    label: 'Logout',
    slug: 'logout',
    pro: false,
    component: SettingsScreen,
    loggedIn: true,
  },
};

export default routes;
