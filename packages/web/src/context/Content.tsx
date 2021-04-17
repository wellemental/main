import React, { useEffect, useReducer } from 'react';
import { Spinner } from '../primitives';
import {
  ContentServiceType,
  Features,
  RemoteConfigServiceType,
  ObserveContentServiceType,
} from 'common';
import { useContainer, useCurrentUser, useLoadMore } from '../hooks';
import { StateType, contentReducer } from './reducers/contentReducer';
import { initialState } from './initialStates/contentState';

export const Content = React.createContext<StateType>(initialState);

// const filterLanguage = (items: ContentType[], language?: Languages) => {
//   return items.filter((item: ContentType) =>
//     // If no language param, then just return everything
//     language ? item.language === language : item,
//   );
// };

export const ContentProvider: React.FC = ({ children }): JSX.Element => {
  const container = useContainer();
  const { user, language } = useCurrentUser();
  const [state, dispatch] = useReducer(contentReducer, initialState);

  if (!user) {
    return <>{children}</>;
  }

  const contentService = container.getInstance<ContentServiceType>(
    'contentService',
  );
  const remoteConfig = container.getInstance<RemoteConfigServiceType>(
    'remoteConfig',
  );
  const observeContent = container.getInstance<ObserveContentServiceType>(
    'observeContent',
  );

  useEffect(() => {
    // Load all content from db
    contentService.getContent().then(items => {
      dispatch({ type: 'LOADED', value: items, language: language });
    });

    // Get features from remote config
    remoteConfig
      .getValue<Features>('featured')
      .then(feature =>
        dispatch({ type: 'LOADED_FEATURES', value: feature.categories }),
      );
  }, []);

  // Get favs and history
  const historyMore = useLoadMore(observeContent.historyQuery);
  const favsMore = useLoadMore(observeContent.favsQuery);

  // Update content state when favs and history items are updated
  useEffect(() => {
    if (state.allContent) {
      dispatch({ type: 'UPDATE_HISTORY', value: historyMore });
    }
  }, [state.allContent, historyMore.items]);

  useEffect(() => {
    if (state.allContent) {
      dispatch({ type: 'UPDATE_FAVS', value: favsMore });
    }
  }, [state.allContent, favsMore.items]);

  // Showing loading spinner until all content, favs, and history has loaded
  if (state.loading || state.favsMore.loading || state.historyMore.loading) {
    return <Spinner fullPage />;
  }

  return <Content.Provider value={state}>{children}</Content.Provider>;
};
