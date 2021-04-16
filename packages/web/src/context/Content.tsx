import React, { useEffect, useState, useReducer } from 'react';
import { Spinner } from '../primitives';
import {
  ContentObj,
  Content as ContentType,
  ContentServiceType,
  Features,
  Feature,
  RemoteConfigServiceType,
  Languages,
  Tags,
  Categories,
} from 'common';
import { useContainer, useCurrentUser, useLocation } from '../hooks';

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
  const service = container.getInstance<ContentServiceType>('contentService');
  const remoteConfig = container.getInstance<RemoteConfigServiceType>(
    'remoteConfig',
  );

  useEffect(() => {
    if (user) {
      console.log('CONTENT OCNTEXT RUNNING!!!');
      service.getContent().then(items => {
        dispatch({ type: 'LOADED', value: items, language: language });
      });

      remoteConfig
        .getValue<Features>('featured')
        .then(feature =>
          dispatch({ type: 'LOADED_FEATURES', value: feature.categories }),
        );
    }
  }, []);

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

  return (
    <Content.Provider value={{ state, dispatch }}>{children}</Content.Provider>
  );
};
