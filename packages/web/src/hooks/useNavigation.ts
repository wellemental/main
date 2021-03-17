import { useHistory } from './useHistory';

type NavigationService = {
  navigate: (routeName: string, params: {}) => void;
  goBack: () => void;
};

export const useNavigation = (): NavigationService => {
  const history = useHistory();

  return {
    navigate: (routeName: string, params: {}) => {
      history.push(routeName, params);
    },
    goBack: () => {
      history.goBack();
    },
  };
};
