import React, { useState, useEffect } from 'react';
import {
  Button,
  PageHeading,
  Box,
  Paragraph,
  Container,
  Error,
} from '../primitives';
import {
  NotificationScreenRouteProp,
  NotificationScreenNavigationProp,
} from '../types';
import { useContainer } from '../hooks';
import { ObserveNotificationsType, AuthorizationStatus } from 'common';

type Props = {
  route: NotificationScreenRouteProp;
  navigation: NotificationScreenNavigationProp;
};

const NotificationsScreen: React.FC<Props> = ({ route, navigation }) => {
  const params = route && route.params;
  const prompt = params && params.prompt;
  const [error, setError] = useState(undefined);
  const [permissions, setPermissions] = useState<AuthorizationStatus>(-1); // Default to not determined

  const container = useContainer();
  const service = container.getInstance<ObserveNotificationsType>(
    'observeNotifications',
  );

  const handleRequestPermissions = async (): Promise<void> => {
    try {
      await service.requestPermissions();
      await service.subscribe();
      await service.setNotificationPrompted();
      navigation.goBack();
    } catch (errorMsg) {
      setError(errorMsg);
    }
  };

  const checkPermission = async () => {
    setPermissions(await service.checkPermissions());
  };

  const setPrompted = async () => {
    try {
      await service.setNotificationPrompted();
      navigation.goBack();
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <Container>
      <PageHeading title="Notifications" />

      <Error error={error} />

      {permissions === -1 ? ( // If permission is undetermined
        <>
          <Paragraph>
            Receive push notifications about app updates and new content?
          </Paragraph>
          <Box mt={2}>
            <Button
              primary
              onPress={handleRequestPermissions}
              text="Enable Notifications"
            />
          </Box>
        </>
      ) : permissions === 0 ? (
        <Paragraph>
          To enable push notifications, go to your iOS settings and find
          Wellemental within the Notifications list.
        </Paragraph>
      ) : (
        <Paragraph>Notifications are already enabled!</Paragraph>
      )}
      {prompt && permissions === -1 && (
        <Box mt={2}>
          <Button
            primary
            bordered
            onPress={setPrompted}
            text="Don't ask again"
          />
        </Box>
      )}
    </Container>
  );
};

export default NotificationsScreen;
