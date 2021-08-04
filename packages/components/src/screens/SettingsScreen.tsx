import React, { useState } from 'react';
import { AuthService, LocalStateService } from 'services';
import {
  Error,
  Box,
  Paragraph,
  Button,
  LanguageToggle,
  PageHeading,
  Container,
  Loading,
} from '../primitives';
import { Body, Toast } from 'native-base';
import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser, useContent } from '../hooks';
import { getReadableVersion } from 'react-native-device-info';
import { rateApp } from 'services';
import Notifications from './../primitives/components/Notifications';

type SettingsLink = {
  label: string;
  onPress: () => void | Promise<any>;
  iconName: string;
  color:
    | 'light'
    | 'info'
    | 'dark'
    | 'warning'
    | 'primary'
    | 'success'
    | 'danger';
};

const SettingsScreen: React.FC = () => {
  const { translation, isAdmin } = useCurrentUser();
  const { getDbContent, features } = useContent();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const version = getReadableVersion();
  const { user } = useCurrentUser();

  // const container = useContainer();
  // const authService = container.getInstance<AuthServiceType>('auth');
  // const localStateService = container.getInstance<LocalStateServiceType>(
  //   'localState',
  // );

  const handleNavigate = (screen: string): void => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      const authService = new AuthService();
      const localStateService = new LocalStateService();
      await authService.logout();
      await localStateService.resetStorage();
    } catch (err) {
      setError(err);
    }
  };

  const confirmLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: translation['Yes, Logout'],
        style: 'destructive',
        onPress: handleLogout,
      },
      { text: translation.Cancel, style: 'cancel' },
    ]);
  };

  const handleRefresh = async (): Promise<void> => {
    try {
      await getDbContent();
      Toast.show({
        text: translation['Content refreshed'],
        style: { marginBottom: 20 },
      });
    } catch (err) {
      Toast.show({
        text: translation['Error. Please try again.'],
        style: { marginBottom: 20 },
      });
    }
  };

  const handleRating = () => {
    setLoading(true);
    rateApp(() => setLoading(false));
  };

  // Link to event link from remote config if available
  // If not, go to default web link
  const linkExternally = (label: 'event' | 'help'): void => {
    // Not using yet - was going to be building a live event architecture
    const liveLink =
      features && features.event && features.event.url
        ? features.event.url
        : 'https://wellemental.co/live';

    const url =
      label === 'help' ? 'https://wellemental.zendesk.com/' : liveLink;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const list: SettingsLink[] = [
    {
      label: translation['Need help?'],
      onPress: () => linkExternally('help'),
      iconName: 'help-circle',
      color: 'warning',
    },
    {
      label: 'Rate App',
      onPress: handleRating,
      iconName: 'star',
      color: 'primary',
    },
    {
      label: 'Refresh Content',
      onPress: handleRefresh,
      iconName: 'refresh',
      color: 'info',
    },
    {
      label: 'Notifications',
      onPress: () => {},
      iconName: 'refresh',
      color: 'info',
    },
    // { label: 'Live Event', onPress: () => linkExternally('event'), iconName: 'calendar' },
    {
      label: translation.Logout,
      onPress: confirmLogout,
      iconName: 'md-exit',
      color: 'warning',
    },
  ];
  if (loading) {
    return <Loading fullPage loading={true} text={translation['One moment...']} />
  }
  return (
    <Container scrollEnabled>
      <PageHeading title={translation.Settings} />
      <Error error={error} />

      <LanguageToggle />

      {list.map((item: SettingsLink, idx: number) => {
        if (item.label === 'Notifications') {
          return <Notifications />
        }
        return (
          <Box mt={1.5} key={idx}>
            <Button
              iconName={item.iconName}
              bordered
              light={item.color === 'light'}
              info={item.color === 'info'}
              warning={item.color === 'warning'}
              dark={item.color === 'dark'}
              primary={item.color === 'primary'}
              danger={item.color === 'danger'}
              success={item.color === 'success'}
              text={item.label}
              onPress={item.onPress}
            />
          </Box>
        );
      })}

      <Box mt={2}>
        <Body>
          <Paragraph fine>{version}</Paragraph>
        </Body>
      </Box>
      <Body>
        {user && (
          <Paragraph center fine>
            {user.email}
          </Paragraph>
        )}
      </Body>

      {isAdmin && (
        <Body>
          <Paragraph fine>{user.id}</Paragraph>
        </Body>
      )}
    </Container>
  );
};

export default SettingsScreen;
