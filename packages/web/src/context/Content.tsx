import React, { useEffect, useState, useReducer } from 'react';
import { Spinner } from '../primitives';
import {
  ContentObj,
  Content as ContentType,
  ContentServiceType,
  Features,
  FavoritesServiceType,
  PlaysServiceType,
  Feature,
  RemoteConfigServiceType,
  ObserveContentServiceType,
  Languages,
  Tags,
  Categories,
} from 'common';
import { useContainer, useCurrentUser, useLoadMore } from '../hooks';
import { FavoritesService } from '../services';

type BuildContent<T> = T;

export type StateType = {
  loading: boolean;
  error: string | null;
  allContent: ContentObj;
  features: Feature[];
  content: ContentType[];
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
  // | Action<'FILTER_LANGUAGE', { language: Languages }>
  // | Action<'REMOVE_FILTER_LANGUAGE'>
  | Action<'GET_FEATURED', { category: Categories; limit?: number }>;

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
    // case 'FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr, action.language) };
    // }
    // case 'REMOVE_FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr) };
    // }
    case 'GET_FEATURED': {
      const limit = action.limit ? action.limit : 2;

      const features = contentArr
        .filter(
          item =>
            item.type === action.category && item.tags.includes(Tags.Featured),
        )
        .slice(0, limit);

      return { ...state, content: features };
    }
  }
};

// const filterLanguage = (items: ContentType[], language?: Languages) => {
//   return items.filter((item: ContentType) =>
//     // If no language param, then just return everything
//     language ? item.language === language : item,
//   );
// };

export const ContentProvider: React.FC = ({ children }): JSX.Element => {
  // Load all content
  // Subscribe to favorites and rebuild with content on each change
  // Subscribe to history and rebuild with content on each change
  // const [error, setError] = useState('');
  const { user, language } = useCurrentUser();
  const [state, dispatch] = useReducer(contentReducer, initialState);

  const container = useContainer();

  const remoteConfig = container.getInstance<RemoteConfigServiceType>(
    'remoteConfig',
  );

  // const favsService = container.getInstance<FavoritesServiceType>(
  //   'favoritesService',
  // );

  useEffect(() => {
    if (user) {
      const service = container.getInstance<ContentServiceType>(
        'contentService',
      );
      service
        .getContent()
        .then(items => {
          dispatch({ type: 'LOADED', value: items, language: language });
        })
        .then(res => {
          // Subscribe to plays and favs
          const observeContent = container.getInstance<ObserveContentServiceType>(
            'observeContent',
          );
          // observeContent.subscribe;

          // Match them with content & set to state

          // Whenever subscriber updates, update state
        });

      remoteConfig
        .getValue<Features>('featured')
        .then(feature =>
          dispatch({ type: 'LOADED_FEATURES', value: feature.categories }),
        );
    }
  }, []);

  // const favs = useLoadMore(favsService.query);
  // const plays = useLoadMore(service.playsQuery);

  // console.log('FAVS', favs.items.length);

  // Reset language filter whenever user changes their langauge
  // useEffect(() => {
  //   if (user) {
  //     dispatch({
  //       type: 'FILTER_LANGUAGE',
  //       language: language,
  //     });
  //   }
  // }, [user]);

  console.log('STATE NEW', state);

  // if (state.loading) {
  //   return <Spinner fullPage />;
  // }

  return (
    <Content.Provider value={{ state, dispatch }}>{children}</Content.Provider>
  );
};
