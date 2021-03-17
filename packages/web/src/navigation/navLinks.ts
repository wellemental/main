import routes, { RouteType } from './routes';

interface Link extends RouteType {
  icon: string;
}

const links = {
  Home: 'home',
  Meditate: 'home',
  Move: 'home',
  Learn: 'home',
  Sleep: 'home',
  Profile: 'user',
  Settings: 'settings',
  Help: 'support',
  Logout: 'logout',
};

type Links = keyof typeof links;

const buildLinks = (linklist: Links[]): Link[] => {
  return linklist.map(route => {
    return { ...routes[route], icon: links[route] };
  });
};

export const mobileMainMenu: Link[] = buildLinks([
  'Home',
  'Meditate',
  'Learn',
  'Move',
  'Sleep',
  'Profile',
]);

export const desktopMainMenu: Link[] = buildLinks([
  'Home',
  'Meditate',
  'Learn',
  'Move',
  'Sleep',
  'Profile',
]);

export const desktopRightMenu: Link[] = buildLinks([
  'Settings',
  'Help',
  'Logout',
]);
