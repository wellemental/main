import React, { createContext, useEffect, useState } from 'react';
import {
  buildDependencies,
  dependenciesInstances,
} from '../services/DependencyService';
import { Spinner } from '../primitives';
import { useCurrentUser } from '../hooks';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const { user } = useCurrentUser();

  if (!user) {
    return <>{children}</>;
  }

  const [container, setContainer] = useState(initialContainer);

  useEffect(() => {
    setContainer(
      buildDependencies({
        currentUser: user ? user : undefined,
      }),
    );
  }, [user]);

  if (user && !dependenciesInstances.currentUser) {
    return <Spinner fullPage />;
  }

  return (
    <ServicesContext.Provider value={container}>
      {children}
    </ServicesContext.Provider>
  );
};
