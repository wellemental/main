import React, { createContext, useEffect, useState } from 'react';
import { buildDependencies } from '../services/DependencyService';
import { useCurrentUser } from '../hooks';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const [container, setContainer] = useState(initialContainer);
  const { auth, user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      // Backup for admin or early users that don't have id stored on their user doc
      const currentUser = { ...user };
      if (!currentUser.id) {
        currentUser.id = auth.uid;
      }

      setContainer(
        buildDependencies({
          currentUser,
        }),
      );
    }
  }, [user]);

  return (
    <ServicesContext.Provider value={container}>
      {children}
    </ServicesContext.Provider>
  );
};
