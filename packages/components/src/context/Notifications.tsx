import React, { useEffect } from 'react';
import { ObserveNotifications, ObserveNotificationsType } from 'services';
import { useContainer } from '../hooks';

export const NotificationContext = React.createContext<ObserveNotificationsType>(
  new ObserveNotifications(),
);

const service = new ObserveNotifications();

export const NotificationProvider = ({ children }: any) => {
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
