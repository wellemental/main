import { useContext } from 'react';
import { ServicesContext } from '../context';
import { Dependency } from 'services';

export const useDepends = (): Dependency => {
  const container = useContext(ServicesContext);
  if (!container) throw new Error('Missing Services context');
  return container;
};
