import React, { createContext, useEffect, useState } from 'react';
import { buildDependencies, dependenciesInstances } from 'services';
import { useCurrentUser } from '../hooks';
import { Loading } from '../primitives';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const { user } = useCurrentUser();

  if (!user) {
    return <>{children}</>;
  }
  const [container, setContainer] = useState(initialContainer);

  useEffect(() => {
    // Backup for admin or early users that don't have id stored on their user doc
    const currentUser = { ...user };
    if (currentUser && !currentUser.id) {
      currentUser.id = user.id;
    }

    setContainer(
      buildDependencies({
        currentUser,
      }),
    );
  }, [user]);

  if (user && !dependenciesInstances.currentUser) {
    return <Loading loading={true} fullPage />;
  }

  return (
    <ServicesContext.Provider value={container}>
      {children}
    </ServicesContext.Provider>
  );
};
