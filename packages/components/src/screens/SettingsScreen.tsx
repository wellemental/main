import React, { useState } from 'react';
import { AuthService, LocalStateService } from 'services';
import { Error, PageHeading, Container } from '../primitives';
import {
  Body,
  Left,
  List,
  Icon,
  ListItem,
  Right,
  Text,
  Toast,
} from 'native-base';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser, useContent } from '../hooks';

type SettingsLink = {
  label: string;
  onPress: () => void;
  iconName: string;
};
const service = new AuthService();
const localStateService = new LocalStateService();

const SettingsScreen: React.FC = () => {
  const { auth, translation, getDbUser } = useCurrentUser();
  const { getDbContent } = useContent();
  const [error, setError] = useState();
  const navigation = useNavigation();

  const handleNavigate = (screen: string): void => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await service.logout();
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
      console.log('ERRO', err);
      Toast.show({
        text: translation['Error. Please try again.'],
        style: { marginBottom: 20 },
      });
    }
  };

  const list: SettingsLink[] = [
    {
      label: translation['Edit Profile'],
      onPress: () => handleNavigate('Edit Profile'),
      iconName: 'ios-person',
    },
    {
      label: translation.Subscription,
      onPress: () => handleNavigate('Plans'),
      iconName: 'cart',
    },
    { label: 'Refresh Content', onPress: handleRefresh, iconName: 'refresh' },
    // { label: 'Refresh User', onPress: getDbUser, iconName: 'refresh' },
    { label: translation.Logout, onPress: confirmLogout, iconName: 'md-exit' },
  ];

  return (
    <Container>
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
      </List>
    </Container>
  );
};

export default SettingsScreen;
