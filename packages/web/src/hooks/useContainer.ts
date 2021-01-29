import { useContext } from 'react';
import { ServicesContext } from '../context';
import { Dependency } from '../services/DependencyService';

export const useContainer = (): Dependency => {
  const container = useContext(ServicesContext);

  if (!container) throw new Error('Missing Services context');
  return container;
};
