import { useContext } from 'react';
import { CurrentUser } from '../context/CurrentUser';

export const useCurrentUser = () => {
  const userContext = useContext(CurrentUser);
  if (!userContext) throw new Error('Current User missing from context');
  return {
    auth: userContext.currentAuth,
    user: userContext.CurrentUser,
  };
};
