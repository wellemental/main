import React, { createContext, useEffect, useState } from 'react';
import { buildDependencies, dependenciesInstances } from 'services';
import { useCurrentUser } from '../hooks';
import { Spinner } from '../primitives';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const [container, setContainer] = useState(initialContainer);
  const { user } = useCurrentUser();

  useEffect(() => {
    // Backup for admin or early users that don't have id stored on their user doc
    const currentUser = { ...user };
    if (!currentUser.id) {
      currentUser.id = user.id;
    }

    setContainer(
      buildDependencies({
        currentUser,
      }),
    );
  }, [user]);

  if (user && !dependenciesInstances.currentUser) {
    return <Spinner />;
  }

  return (
    <ServicesContext.Provider value={container}>
      {children}
    </ServicesContext.Provider>
  );
};
