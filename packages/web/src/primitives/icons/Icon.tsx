import React from 'react';
import LibraryIcon from './LibraryIcon';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import HomeOutlined from '@material-ui/icons/HomeOutlined';
import HomeIcon from '@material-ui/icons/Home';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import EmailOutlined from '@material-ui/icons/EmailOutlined';
import EmailIcon from '@material-ui/icons/Email';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import SettingsIcon from '@material-ui/icons/Settings';
import { IconProps } from '@material-ui/core/Icon';
import MehIcon from '@material-ui/icons/SentimentDissatisfied';
import FocusIcon from '@material-ui/icons/TrackChanges';
import TrendingUp from '@material-ui/icons/TrendingUp';
import TrendingDown from '@material-ui/icons/TrendingDown';
import BookIcon from '@material-ui/icons/ImportContacts';
import HistoryIcon from '@material-ui/icons/History';
import TimerIcon from '@material-ui/icons/Timer';
import ClassesIcon from '@material-ui/icons/AccessibilityNew';
import SchoolIcon from '@material-ui/icons/School';

type Props = {
  name: Icons;
  active?: boolean;
};

type Icon = {
  active?: React.FC;
  inactive: React.FC;
};

const icons: { [key: string]: Icon } = {
  library: { active: LibraryIcon, inactive: LibraryIcon },
  user: { active: PersonIcon, inactive: PersonOutlined },
  favorites: { active: FavoriteIcon, inactive: FavoriteBorder },
  home: { active: HomeIcon, inactive: HomeOutlined },
  search: { inactive: SearchIcon },
  settings: { inactive: SettingsIcon },
  cog: { inactive: SettingsIcon },
  logout: { inactive: LogoutIcon },
  support: { inactive: ContactSupportIcon },
  'chevron-right': { inactive: ChevronRight },
  contact: { active: EmailIcon, inactive: EmailOutlined },
  stress: { inactive: MehIcon },
  focus: { inactive: FocusIcon },
  energize: { inactive: TrendingUp },
  rest: { inactive: TrendingDown },
  philosophy: { inactive: BookIcon },
  history: { inactive: HistoryIcon },
  breaks: { inactive: TimerIcon },
  'yoga-breaks': { inactive: TimerIcon },
  'yoga-classes': { inactive: ClassesIcon },
  teach: { inactive: ClassesIcon },
  school: { inactive: SchoolIcon },
};

export type Icons = keyof typeof icons;

const Icon: React.FC<Props & IconProps> = ({
  name,
  active,
  style,
  ...props
}) => {
  // Get corresponding icon from icons list
  const iconSet = icons[name];
  // If icon object has active version, use that, if not use inactive
  const Icon =
    iconSet && active && iconSet.active
      ? iconSet.active
      : iconSet && iconSet.inactive
      ? iconSet.inactive
      : null;

  // @ts-ignore - not accepting style prop for some reason
  return <>{Icon && <Icon style={style} />}</>;
};

export default Icon;
