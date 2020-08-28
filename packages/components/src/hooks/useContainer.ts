import { useContext } from 'react';
import { ServicesContext } from '../context';
import { Container } from '../services/container';

export const useContainer = (): Container => {
  const container = useContext(ServicesContext);
  if (!container) throw new Error('Missing Services context');
  return container;
};
