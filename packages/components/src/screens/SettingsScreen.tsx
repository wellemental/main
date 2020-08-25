import React, { useState } from 'react';
import { AuthService } from 'services';
import { Error, Button, PageHeading, Container } from '../primitives';

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
    <Container>
      <PageHeading title="Account" />
      <Button text="Logout" onPress={handleLogout} />
      <Error error={error} />
    </Container>
  );
};

export default SettingsScreen;
