import React, { useState } from 'react';
import { AuthService } from '../services';
import { Error, PageHeading } from '../primitives';
import { useHistory, useCurrentUser } from '../hooks';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Person as UserIcon,
  ExitToApp as LogoutIcon,
  ChevronRight,
  CreditCard as CreditCardIcon,
} from '@material-ui/icons';
// import CalendarIcon from '@material-ui/icons/DateRange';

type SettingsLink = {
  label: string;
  onPress: () => void;
  icon: JSX.Element;
};
const service = new AuthService();

const SettingsScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const [error, setError] = useState();
  const history = useHistory();

  const handleNavigate = (screen: string): void => {
    history.push(screen);
  };

  const handleLogout = async () => {
    try {
      await service.logout();
    } catch (err) {
      setError(err);
    }
  };

  const list: SettingsLink[] = [
    {
      label: translation['Select language'],
      onPress: () => handleNavigate('/language'),
      icon: <UserIcon />,
    },
    {
      label: translation['Subscription'],
      onPress: () => handleNavigate('/subscription'),
      icon: <CreditCardIcon />,
    },
    // {
    //   label: translation['Live Event'],
    //   onPress: () => handleNavigate('/live'),
    //   icon: <CalendarIcon />,
    // },
    { label: translation.Logout, onPress: handleLogout, icon: <LogoutIcon /> },
  ];

  return (
    <>
      <PageHeading
        title={translation.Account}
        subtitle={user ? user.email : undefined}
      />
      <Error error={error} />
      <List>
        {list.map((item: SettingsLink, idx: number) => {
          return (
            <ListItem
              style={{ marginLeft: 0, paddingLeft: 0 }}
              key={idx}
              button
              onClick={item.onPress}>
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText>{item.label}</ListItemText>

              <ChevronRight />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default SettingsScreen;
