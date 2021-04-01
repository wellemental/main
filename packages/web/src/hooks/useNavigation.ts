import { useHistory } from './useHistory';
import { Content, slugify } from 'common';

type NavigationService = {
  navigate: (routeName: string, params?: {}) => void;
  goBack: () => void;
};

export const useNavigation = (): NavigationService => {
  const history = useHistory();

  return {
    navigate: (routeName: string, params?: { content?: Content }) => {
      if (routeName === 'Content' && params && params.content) {
        history.push(`/content/${slugify(params.content.title)}`);
      } else {
        history.push(routeName, params);
      }
    },
    goBack: () => {
      history.goBack();
    },
  };
};
