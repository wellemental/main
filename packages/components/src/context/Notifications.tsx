import React, { useEffect } from 'react';
import { ObserveNotificationsType } from 'common';
import { useContainer, useCurrentUser } from '../hooks';

export const NotificationContext = React.createContext(
  {} as ObserveNotificationsType,
);

export const NotificationProvider = ({ children }: any) => {
  const container = useContainer();
  const { user } = useCurrentUser();

  if (!user) {
    return <>{children}</>;
  }

  const service = container.getInstance<ObserveNotificationsType>(
    'observeNotifications',
  );

  useEffect(() => {
    service.subscribe();
    return service.unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={service}>
      {children}
    </NotificationContext.Provider>
  );
};
