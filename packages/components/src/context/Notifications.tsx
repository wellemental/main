import React, { useEffect } from 'react';
import { ObserveNotifications } from 'services';
import { ObserveNotificationsType } from 'common';
import { useContainer, useCurrentUser } from '../hooks';

export const NotificationContext = React.createContext(
  {} as ObserveNotificationsType,
);

export const NotificationProvider = ({ children }: any) => {
  const container = useContainer();
  const { user } = useCurrentUser();
  const service = container.getInstance<ObserveNotificationsType>(
    'observeNotifications',
  );

  useEffect(() => {
    if (user) {
      service.subscribe();
      return service.unsubscribe();
    }
  }, []);

  return (
    <NotificationContext.Provider value={service}>
      {children}
    </NotificationContext.Provider>
  );
};
