import React, { useState } from 'react';
import { AuthService } from 'services';
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

type SettingsLink = {
  label: string;
  onPress: () => void;
  iconName: string;
};

const SettingsScreen: React.FC = () => {
  const [error, setError] = useState();
  const navigation = useNavigation();
  const service = new AuthService();

  const handleNavigate = (screen: string): void => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    try {
      service.logout();
    } catch (err) {
      setError(err);
    }
  };

  const confirmLogout = (): void => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Yes, Logout',
        style: 'destructive',
        onPress: handleLogout,
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const list: SettingsLink[] = [
    {
      label: 'Edit Profile',
      onPress: () => handleNavigate('Edit Profile'),
      iconName: 'ios-person',
    },
    { label: 'Logout', onPress: confirmLogout, iconName: 'md-exit' },
  ];

  return (
    <Container>
      <PageHeading title="Account" />
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
