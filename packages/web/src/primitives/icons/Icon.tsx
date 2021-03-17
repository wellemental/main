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
  logout: { inactive: LogoutIcon },
  support: { inactive: ContactSupportIcon },
  'chevron-right': { inactive: ChevronRight },
  contact: { active: EmailIcon, inactive: EmailOutlined },
};

type Icons = keyof typeof icons;

const Icon: React.FC<Props> = ({ name, active }) => {
  // Get corresponding icon from icons list
  const iconSet = icons[name];
  // If icon object has active version, use that, if not use inactive
  const Icon = active && iconSet.active ? iconSet.active : iconSet.inactive;

  return (
    <>
      <Icon />
    </>
  );
};

export default Icon;
