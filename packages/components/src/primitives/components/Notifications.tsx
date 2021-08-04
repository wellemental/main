import React, { useState, useEffect, useRef } from 'react';
import { AppState, Switch } from 'react-native';
import {
  Button,
  TextTranslate,
  Box,
  Paragraph,
  Container,
  Error,
} from 'components/src/primitives';
import {
  NotificationScreenRouteProp,
  NotificationScreenNavigationProp,
} from 'components/src/types';
import { useContainer } from 'components/src/hooks';
import { colors, ObserveNotificationsType, AuthorizationStatus } from 'common';

type Props = {
  route: NotificationScreenRouteProp;
  navigation: NotificationScreenNavigationProp;
};

const Notifications: React.FC<Props> = ({ route }) => {
  const params = route && route.params;
  const prompt = params && params.prompt;
  const [error, setError] = useState(undefined);
  const [permissions, setPermissions] = useState<AuthorizationStatus>(-1); // Default to not determined

  const appState = useRef(AppState.currentState);
  const container = useContainer();
  const service = container.getInstance<ObserveNotificationsType>(
    'observeNotifications',
  );

  const handleRequestPermissions = async (): Promise<void> => {
    try {
      await service.requestPermissions();
      await service.subscribe();
      await service.setNotificationPrompted();
    } catch (errorMsg) {
      setError(errorMsg);
    }
  };

  const checkPermission = async () => {
    const resp = await service.checkPermissions();
    setPermissions(resp);
  };

  const setPrompted = async () => {
    try {
      await service.setNotificationPrompted();
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    checkPermission();
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      checkPermission();
    }
    appState.current = nextAppState;
  };

  const handleChange = () => {
    handleRequestPermissions();
  };
  
  return (
    <Box
      mt={1.5}
      py={1.5}
      px={2}
      style={{
        borderWidth: 1,
        borderColor: colors.info,
        borderRadius: 11
      }}>
      <Box
        row
        justifyContent="space-between"
        alignItems="center">
        <Paragraph color="info" style={{ flex: 1, fontWeight: "500" }}>
          <TextTranslate>Notifications</TextTranslate>
        </Paragraph>
        <Switch
          trackColor={{ false: colors.lightText, true: colors.primary }}
          value={permissions === 1}
          onValueChange={handleChange}
        />
      </Box>
      <Error error={error} />

      {permissions === -1 ? ( // If permission is undetermined
        <>
          <Paragraph size={14} lineHeight={15} gt={0.5}>
            Receive push notifications about app updates and new content?
          </Paragraph>
          {/* <Box mt={2}>
            <Button
              primary
              onPress={handleRequestPermissions}
              text="Enable Notifications"
            />
          </Box> */}
        </>
      ) : (
          <Paragraph size={14} lineHeight={15} gt={0.5}>
            To {`${permissions === 0 ? 'enable' : 'disable'}`} push notifications, go to your phone settings and find
          Wellemental within the Notifications list.
        </Paragraph>
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
    </Box>
  );
};

export default Notifications;
