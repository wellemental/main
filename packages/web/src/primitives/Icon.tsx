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
import SettingsIcon from '@material-ui/icons/Settings';
import { IconProps } from '@material-ui/core/Icon';

type Props = {
  name: string;
  active?: boolean;
};

const Icon: React.FC<Props & IconProps> = ({ name, active }) => {
  return name === 'library' ? (
    active ? (
      <LibraryIcon />
    ) : (
      <LibraryIcon />
    )
  ) : name === 'user' ? (
    active ? (
      <PersonIcon />
    ) : (
      <PersonOutlined />
    )
  ) : name === 'favorite' ? (
    active ? (
      <FavoriteIcon />
    ) : (
      <FavoriteBorder />
    )
  ) : name === 'home' ? (
    active ? (
      <HomeIcon />
    ) : (
      <HomeOutlined />
    )
  ) : name === 'search' ? (
    <SearchIcon />
  ) : name === 'settings' ? (
    <SettingsIcon />
  ) : name === 'logout' ? (
    <LogoutIcon />
  ) : name === 'chevron-right' ? (
    <ChevronRight />
  ) : name === 'contact' ? (
    active ? (
      <EmailIcon />
    ) : (
      <EmailOutlined />
    )
  ) : (
    <LibraryIcon />
  );
};

export default Icon;
