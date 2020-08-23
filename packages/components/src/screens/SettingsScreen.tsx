import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { AuthService } from 'services';
import { Error, Button } from '../primitives';

const SettingsScreen: React.FC = () => {
  const [error, setError] = useState();
  const service = new AuthService();

  const handleLogout = () => {
    try {
      service.logout();
    } catch (err) {
      setError(err);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
      <Button text="Logout" onPress={handleLogout} />
      <Error error={error} />
    </View>
  );
};

export default SettingsScreen;
