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
} from '../primitives';
import { Body, Toast } from 'native-base';
import { Alert, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser, useContent } from '../hooks';
import { getReadableVersion } from 'react-native-device-info';
import { rateApp } from 'services';

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
  const { auth, translation } = useCurrentUser();
  const { getDbContent, features } = useContent();
  const [error, setError] = useState();
  const navigation = useNavigation();
  const version = getReadableVersion();

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

  // Link to event link from remote config if available
  // If not, go to default web link
  const linkExternally = (label: 'event' | 'help'): void => {
    const liveLink =
      features && features.event && features.event.url
        ? features.event.url
        : 'https://wellemental.co/live';

    const url =
      label === 'help' ? 'https://wellemental.zendesk.com/' : liveLink;

    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  const list: SettingsLink[] = [
    // {
    //   label: translation['Select language'],
    //   onPress: () => handleNavigate('Edit Profile'),
    //   iconName: 'ios-person',
    //   color: 'dark',
    // },
    {
      label: translation['Need help?'],
      onPress: () => linkExternally('help'),
      iconName: 'help-circle',
      color: 'info',
    },
    {
      label: 'Notifications',
      onPress: () => handleNavigate('Notifications'),
      iconName: 'notifications',
      color: 'warning',
    },
    {
      label: 'Rate App',
      onPress: rateApp,
      iconName: 'star',
      color: 'primary',
    },
    {
      label: 'Refresh Content',
      onPress: handleRefresh,
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

  return (
    // <View style={{ marginTop: -10 }}>
    <Container scrollEnabled>
      <PageHeading title={translation.Settings} />
      <Error error={error} />

      <LanguageToggle />

      {list.map((item: SettingsLink, idx: number) => {
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

      {/* <List style={{ marginTop: -15 }}>
        {list.map((item: SettingsLink, idx: number) => {
          return (
            <ListItem
              style={{ marginLeft: 0, paddingLeft: 0 }}
              key={idx}
              icon
              button
              onPress={item.onPress}>
              <Left>
                <Icon name={item.iconName} size={24} />
              </Left>
              <Body>
                <Text>{item.label}</Text>
              </Body>
              <Right>
                <Icon name="ios-arrow-forward" size={24} />
              </Right>
            </ListItem>
          );
        })}
      </List> */}
      <Box mt={2}>
        <Body>
          <Paragraph fine>{version}</Paragraph>
        </Body>
      </Box>
      <Body>
        {auth && (
          <Paragraph center fine>
            {auth.email}
          </Paragraph>
        )}
      </Body>

      {auth && auth.email === 'mike.r.vosters@gmail.com' && (
        <Body>
          <Paragraph fine>{auth.uid}</Paragraph>
        </Body>
      )}
      {/* </View> */}
    </Container>
  );
};

export default SettingsScreen;
