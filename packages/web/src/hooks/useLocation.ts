import { useLocation as ogUseLocation } from 'react-router-dom';
import { LocationState } from 'common';

export const useLocation = () => {
  let location: any = ogUseLocation();
  let state: LocationState | undefined | null = location.state as LocationState;

  return { location, state };
};
