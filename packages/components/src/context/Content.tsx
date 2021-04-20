import React, { useEffect, useReducer, useState } from 'react';
import {
  ContentObj,
  Features,
  ContentServiceType,
  ObserveContentServiceType,
} from 'common';
import Loading from '../primitives/loaders/Loading';
import {
  useConfig,
  useQuery,
  useCurrentUser,
  useContainer,
  useLoadMore,
} from '../hooks';
import { contentReducer } from './reducers/contentReducer';
import { ContentStateType, initialState } from './initialStates/contentState';

export const Content = React.createContext<ContentStateType>(initialState);

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const container = useContainer();
  const [error, setError] = useState('');
  const { user, language } = useCurrentUser();
  const [state, dispatch] = useReducer(contentReducer, initialState);

  if (!user) {
    return <>{children}</>;
  }

  const contentService = container.getInstance<ContentServiceType>(
    'contentService',
  );

  // Get content from database or localStorage
  const {
    data: fetchedContent,
    error: fetchedContentError,
  } = useQuery<ContentObj>(contentService.getContentContext);

  // Get Featured Content from Remote Config
  const { loading: featuresLoading, data: features } = useConfig<Features>(
    'featured',
  );

  // Update state with fetched content
  useEffect(() => {
    if (fetchedContent) {
      dispatch({ type: 'LOADED', value: fetchedContent, language: language });
    }
    if (fetchedContentError) {
      // Need to add error handling allowing users to retrigger content fetch from front-end if it doesn't load
    }
  }, [fetchedContent]);

  // Update state with fetched featured categories
  useEffect(() => {
    if (features) {
      dispatch({ type: 'LOADED_FEATURES', value: features.categories });
    }
  }, [fetchedContent]);

  // Get favs and history
  const historyMore = useLoadMore(contentService.historyQuery);
  const favsMore = useLoadMore(contentService.favsQuery);

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
    return <Loading fullPage loading={true} />;
  }

  return (
    <Content.Provider
      value={{
        ...state,
        getDbContent: contentService.getContentfromDb,
      }}>
      {children}
    </Content.Provider>
  );
};
