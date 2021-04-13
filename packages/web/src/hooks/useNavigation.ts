import { useHistory } from './useHistory';
import { Category, Content, slugify } from 'common';

type NavigationService = {
  navigate: (routeName: string, params?: {}) => void;
  goBack: () => void;
};

interface Params {
  content?: Content;
  category?: Category;
}

export const useNavigation = (): NavigationService => {
  const history = useHistory();

  return {
    navigate: (routeName: string, params?: Params) => {
      if (routeName === 'Content' && params && params.content) {
        history.push(`/content/${slugify(params.content.title)}`);
      } else if (routeName === 'Category' && params && params.category) {
        history.push(`/category/${slugify(params.category.title)}`);
      } else {
        history.push(routeName, params);
      }
    },
    goBack: () => {
      history.goBack();
    },
  };
};
