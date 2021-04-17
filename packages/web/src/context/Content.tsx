import React, { useEffect, useRef, useReducer } from 'react';
import { Spinner } from '../primitives';
import {
  ContentObj,
  Content as ContentType,
  ContentServiceType,
  DocumentData,
  Features,
  Favorite,
  PlayEvent,
  Feature,
  RemoteConfigServiceType,
  ObserveContentServiceType,
  Languages,
} from 'common';
import { useContainer, useCurrentUser, useLoadMore } from '../hooks';
import { LoadMoreStateType, loadMoreInitialState } from '../hooks/useLoadMore';
import { ObserveContentService } from '../services';

export type StateType = {
  loading: boolean;
  error: string | null;
  allContent: ContentObj;
  features: Feature[];
  content: ContentType[];
  favorites: ContentType[];
  favsMore: LoadMoreStateType;
  history: ContentType[];
  historyMore: LoadMoreStateType;
};

export interface ContentContext {
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}

const initialState = {
  loading: true,
  error: null,
  allContent: {},
  features: [],
  content: [],
  favorites: [],
  favsMore: loadMoreInitialState,
  history: [],
  historyMore: loadMoreInitialState,
};

export const Content = React.createContext<ContentContext>({
  state: initialState,
  dispatch: () => null,
});

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export type ActionType =
  //   | Action<'LOAD-MORE'>
  | Action<
      'LOADED',
      {
        value: ContentObj;
        language: Languages;
      }
    >
  | Action<
      'LOADED_FEATURES',
      {
        value: Feature[];
      }
    >
  | Action<
      'UPDATE_HISTORY',
      {
        value: LoadMoreStateType;
      }
    >
  | Action<
      'UPDATE_FAVS',
      {
        value: LoadMoreStateType;
      }
    >;

const contentReducer = (state: StateType, action: ActionType): StateType => {
  const contentArr = Object.values(state.allContent);

  switch (action.type) {
    case 'LOADED': {
      const contentObj = action.value;
      const filtered = Object.values(contentObj);

      return {
        ...state,
        allContent: contentObj,
        content: filtered,
        loading: false,
      };
    }
    case 'LOADED_FEATURES': {
      return { ...state, features: action.value };
    }
    case 'UPDATE_HISTORY': {
      const history = matchContent(action.value.items, state.allContent, true);

      return { ...state, history, historyMore: action.value };
    }
    case 'UPDATE_FAVS': {
      const favorites = matchContent(action.value.items, state.allContent);
      return { ...state, favorites, favsMore: action.value };
    }
    // case 'FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr, action.language) };
    // }
    // case 'REMOVE_FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr) };
    // }
  }
};

const matchContent = (
  items: DocumentData[],
  content: ContentObj,
  history?: boolean,
): ContentType[] => {
  const arr: ContentType[] = [];

  // Match the contentId of the doc with existing content
  items.forEach((theItem: DocumentData) => {
    const data = theItem.data() as Favorite | PlayEvent;
    const match = content[data.contentId];

    if (!!match) {
      // If history, change createdAt to be when it was played by the user so we can display it on the front-end
      if (history) {
        match.created_at = data.createdAt;
      }

      arr.push(match);
    }
  });

  return arr;
};

// const filterLanguage = (items: ContentType[], language?: Languages) => {
//   return items.filter((item: ContentType) =>
//     // If no language param, then just return everything
//     language ? item.language === language : item,
//   );
// };

export const ContentProvider: React.FC = ({ children }): JSX.Element => {
  // const [error, setError] = useState('');
  const container = useContainer();
  const { user, language } = useCurrentUser();
  const [state, dispatch] = useReducer(contentReducer, initialState);

  if (!user) {
    return <>{children}</>;
  }

  const service = container.getInstance<ContentServiceType>('contentService');
  const remoteConfig = container.getInstance<RemoteConfigServiceType>(
    'remoteConfig',
  );
  const observeContent = container.getInstance<ObserveContentServiceType>(
    'observeContent',
  );
  // const observeContent: React.MutableRefObject<ObserveContentServiceType> = useRef(
  //   new ObserveContentService(user.id),
  // );

  useEffect(() => {
    // Load all content from db
    service.getContent().then(items => {
      dispatch({ type: 'LOADED', value: items, language: language });
    });

    // Get features from remote config
    remoteConfig
      .getValue<Features>('featured')
      .then(feature =>
        dispatch({ type: 'LOADED_FEATURES', value: feature.categories }),
      );
  }, []);

  const playsMore = useLoadMore(observeContent.playsQuery);
  const favsMore = useLoadMore(observeContent.favsQuery);

  useEffect(() => {
    if (state.allContent) {
      dispatch({ type: 'UPDATE_HISTORY', value: playsMore });
    }
  }, [state.allContent, playsMore.items]);

  useEffect(() => {
    if (state.allContent) {
      dispatch({ type: 'UPDATE_FAVS', value: favsMore });
    }
  }, [state.allContent, favsMore.items]);

  // Showing loading spinner until all content, favs, and history has loaded
  if (state.loading || state.favsMore.loading || state.historyMore.loading) {
    return <Spinner fullPage />;
  }

  return (
    <Content.Provider value={{ state, dispatch }}>{children}</Content.Provider>
  );
};
