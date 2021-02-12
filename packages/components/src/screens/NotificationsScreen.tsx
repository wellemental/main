import React, { useState, useEffect } from 'react';
import {
  Button,
  PageHeading,
  Box,
  Paragraph,
  Container,
  Error,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { ObserveNotifications, AuthorizationStatus } from 'services';

const service = new ObserveNotifications();

const NotificationsScreen: React.FC = () => {
  const [error, setError] = useState(undefined);
  const [permissions, setPermissions] = useState<AuthorizationStatus>(-1); // Default to not determined
  const { translation } = useCurrentUser();

  const handleRequestPermissions = async (): Promise<void> => {
    try {
      await service.requestPermissions();
      await service.subscribe();
    } catch (errorMsg) {
      setError(errorMsg);
    }
  };

  const checkPermission = async () => {
    setPermissions(await service.checkPermissions());
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <Container>
      <PageHeading title={translation.Notifications} />

      <Error error={error} />

      {permissions === -1 ? ( // If permission is undetermined
        <>
          <Paragraph>
            {
              translation[
                'Receive push notifications about app updates and new content?'
              ]
            }
          </Paragraph>
          <Box mt={2}>
            <Button
              primary
              onPress={handleRequestPermissions}
              padder="top"
              text={translation['Enable Notifications']}
            />
          </Box>
        </>
      ) : permissions === 0 ? (
        <Paragraph>
          {
            translation[
              'To enable push notifications, go to your iOS settings and find Wellemental within the Notifications list.'
            ]
          }
        </Paragraph>
      ) : (
        <Paragraph>
          {translation['Notifications are already enabled!']}
        </Paragraph>
      )}
    </Container>
  );
};

export default NotificationsScreen;
