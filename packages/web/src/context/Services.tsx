import React, { createContext, useEffect, useState } from 'react';
import {
  buildDependencies,
  dependenciesInstances,
} from '../services/DependencyService';
import { User } from 'common';
import { Spinner } from '../primitives';
import { useCurrentUser } from '../hooks';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const [container, setContainer] = useState(initialContainer);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    setContainer(
      buildDependencies({
        currentUser: user ? user : undefined,
      }),
    );
    setLoading(false);
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
