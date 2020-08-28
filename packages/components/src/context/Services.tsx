import React, { createContext, useEffect, useState } from 'react';
import { buildDependencies } from 'services';
import { useCurrentUser } from '../hooks';

const initialContainer = buildDependencies({});
export const ServicesContext = createContext(initialContainer);

export const ServicesProvider: React.FC = ({ children }) => {
  const [container, setContainer] = useState(initialContainer);
  const { user: currentUser } = useCurrentUser();

  useEffect(() => {
    console.log('USER SERVE', currentUser);
    if (currentUser) {
      setContainer(
        buildDependencies({
          currentUser,
        }),
      );
    }
  }, [currentUser]);
  return (
    <ServicesContext.Provider value={container}>
      {children}
    </ServicesContext.Provider>
  );
};
