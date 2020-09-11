import { useContext } from 'react';
import { CurrentUser2, CurrentUserState } from '../context';

export const useCurrentUser2 = (): CurrentUserState => {
  const userContext = useContext(CurrentUser2);
  if (!userContext) throw new Error('Current User missing from context');
  return { user: userContext.user, translation: userContext.translation };
};
