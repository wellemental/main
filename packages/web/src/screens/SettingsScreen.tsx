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

type SettingsLink = {
  label: string;
  onPress: () => void;
  icon: JSX.Element;
};
const service = new AuthService();

const SettingsScreen: React.FC = () => {
  const { auth, translation } = useCurrentUser();
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

  //   const confirmLogout = (): void => {
  //     Alert.alert('Logout', 'Are you sure you want to logout?', [
  //       {
  //         text: translation['Yes, Logout'],
  //         style: 'destructive',
  //         onPress: handleLogout,
  //       },
  //       { text: translation.Cancel, style: 'cancel' },
  //     ]);
  //   };

  const list: SettingsLink[] = [
    {
      label: translation['Select language'],
      onPress: () => handleNavigate('/language'),
      icon: <UserIcon />,
    },
    {
      label: translation['Subscription'],
      onPress: () => handleNavigate('/account'),
      icon: <CreditCardIcon />,
    },
    // {
    //   label: translation.Subscription,
    //   onPress: () => handleNavigate('Plans'),
    //   iconName: 'cart',
    // },
    // { label: 'Refresh User', onPress: getDbUser, iconName: 'refresh' },
    { label: translation.Logout, onPress: handleLogout, icon: <LogoutIcon /> },
  ];

  return (
    <>
      <PageHeading
        title={translation.Account}
        subtitle={auth ? auth.email : undefined}
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
