import React, { useRef, useEffect, useReducer, useState } from 'react';
import { LocalStateService } from 'services';
import {
  ContentObj,
  Features,
  Categories,
  ContentServiceType,
  Content as ContentType,
  RemoteConfigServiceType,
  ObserveContentServiceType,
} from 'common';
import Loading from '../primitives/loaders/Loading';
import { useConfig, useCurrentUser, useContainer, useLoadMore } from '../hooks';
import { StateType, contentReducer } from './reducers/contentReducer';
import { ContentStateType, initialState } from './initialStates/contentState';

// Check localStorage for Content
// If no localStorage, pull from Database
// Get content and teachers and match them together
// Return both content and teachers

const localStateService = new LocalStateService();

export const Content = React.createContext<ContentStateType>(initialState);

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const container = useContainer();
  const [content, setContent] = useState<ContentObj | null>(null);
  const [error, setError] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { user, language } = useCurrentUser();
  const [loading, setLoading] = useState(!content ? true : false);
  const [state, dispatch] = useReducer(contentReducer, initialState);

  if (!user) {
    return <>{children}</>;
  }

  const localUpdatedAt = useRef<Date | undefined>();

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
    return <Loading fullPage loading={true} />;
  }

  const getDbContent = async (): Promise<void> => {
    const setLocalContent = async (newContent: ContentObj): Promise<void> => {
      await localStateService.setStorage<{ [key: string]: ContentObj }>(
        'wmContent',
        {
          content: newContent,
        },
      );
    };
    // Get teachers and content from firestore
    try {
      const dbContent = await contentService.getContent();

      // Update AsyncStorage with firestore data
      if (dbContent) {
        await setLocalContent(dbContent);
      }

      // Update state with firestore data
      setContent(dbContent);
    } catch (err) {
      setError(`Error fetching content from database - ${err}`);
      // logger.error('Error getting firestore content data');
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   if (user) {
  //     const calcUpdateAvailable = async () => {
  //       // Get latest updated_at times from firestore
  //       const dbContentLatest = await contentService.getLatestUpdate();

  //       // Set updateAvailable to true if either database updated_at is more recent
  //       if (dbContentLatest) {
  //         setUpdateAvailable(dbContentLatest > localUpdatedAt.current);
  //       }
  //     };

  //     const fetchContent = async (): Promise<void> => {
  //       // First, try to fetch from AsyncStorage
  //       try {
  //         const localData = await localStateService.getContent();

  //         if (localData) {
  //           if (localData.content) {
  //             // Protection for old users. Content state was previously an array, now an object.
  //             // So if their localStarage content is an array, repull from db to make it an object.
  //             if (Array.isArray(localData.content)) {
  //               await getDbContent();
  //               // We updated content model to already have been built with the full corresponding teacher obj
  //               // If user's localStorage has old model, then update it
  //             } else if (
  //               typeof Object.values(localData.content)[0].teacher === 'string'
  //             ) {
  //               await getDbContent();
  //             } else {
  //               setContent(localData.content);
  //             }
  //           }
  //           if (localData.updated_at) {
  //             localUpdatedAt.current = localData.updated_at;
  //           }
  //           setLoading(false);
  //         } else {
  //           // If nothing in AsyncStorage, pull from Database
  //           await getDbContent();
  //         }
  //         await calcUpdateAvailable();
  //       } catch (err) {
  //         // logger.error('Error getting local content data');

  //         // In case there's an error getting localStorage, then pull from database as backup
  //         await getDbContent();
  //       }
  //     };

  //     if (!content) {
  //       fetchContent();
  //     }
  //   }
  // }, [state.allCcontent, user]);

  // // If updateAvailable, refetch content from database automatically
  // useEffect(() => {
  //   if (updateAvailable) {
  //     const autoFetchDb = async (): Promise<void> => {
  //       await getDbContent();
  //     };

  //     autoFetchDb();
  //   }
  // }, [updateAvailable]);

  // Get Featured Content from Remote Config
  // const { loading: rcLoading, data: rcData } = useConfig<Features>('featured');

  // if (!content && user) {
  //   return <Loading fullPage loading={!content} />;
  // }

  return (
    <Content.Provider
      value={{
        ...state,
        updateAvailable,
        getDbContent,
      }}>
      {children}
    </Content.Provider>
  );
};
