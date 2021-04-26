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
    contentService.getContentfromDb().then(items => {
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

  // Showing loading spinner until all content has loaded
  // Not waiting for history or favs bc it was causing error upon new user signup
  if (state.loading) {
    return <Spinner fullPage />;
  }

  return <Content.Provider value={state}>{children}</Content.Provider>;
};
