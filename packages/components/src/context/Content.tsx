import React, { useRef, useEffect, useState } from 'react';
import { ContentService, LocalStateService } from 'services';
import {
  ContentObj,
  Features,
  Categories,
  Content as ContentType,
} from 'common';
import Loading from '../primitives/Loading';
import { useConfig, useCurrentUser } from '../hooks';

interface ContentContext {
  content: ContentObj;
  error: Error | string;
  loading: boolean;
  rcLoading: boolean;
  features: Features;
  updateAvailable: boolean;
  status: string[];
  getDbContent: () => void;
  getFeatures: (category: Categories) => ContentType[];
}

// Check localStorage for Content
// If no localStorage, pull from Database
// Get content and teachers and match them together
// Return both content and teachers

const contentService = new ContentService();
const localStateService = new LocalStateService();

export const Content = React.createContext<ContentContext>({
  content: null,
  error: null,
  loading: false,
  rcLoading: false,
  features: undefined,
  updateAvailable: false,
  status: [],
  getDbContent: null,
  getFeatures: null,
});

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const [content, setContent] = useState<ContentObj | null>(null);
  const [error, setError] = useState('');
  const [statuses, setStatus] = useState([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(!content ? true : false);

  const localUpdatedAt = useRef<Date | undefined>();

  const getFeatures = (category: Categories): ContentType[] => {
    return contentService.getFeatures(category, content);
  };

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
      } else {
        // logger.info(
        //   `No results from fb for teachers or content. Not setting locally.`,
        // );
      }

      // Update state with firestore data
      setContent(dbContent);
    } catch (err) {
      setError(`Error fetching content from database - ${err}`);
      // logger.error('Error getting firestore content data');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const calcUpdateAvailable = async () => {
        // Get latest updated_at times from firestore
        const dbContentLatest = await contentService.getLatestUpdate();

        // Set updateAvailable to true if either database updated_at is more recent
        if (dbContentLatest) {
          setUpdateAvailable(dbContentLatest > localUpdatedAt.current);
        } else {
          setStatus((status) => [...status, 'Failed to get latest from db']);
        }
      };

      const fetchContent = async (): Promise<void> => {
        // First, try to fetch from AsyncStorage
        try {
          setStatus((status) => [...status, 'Fetching local data']);

          const localData = await localStateService.getContent();

          if (localData) {
            if (localData.content) {
              // Protection for old users. Content state was previously an array, now an object.
              // So if their localStarage content is an array, repull from db to make it an object.
              if (Array.isArray(localData.content)) {
                await getDbContent();
                // We updated content model to already have been built with the full corresponding teacher obj
                // If user's localStorage has old model, then update it
              } else if (
                typeof Object.values(localData.content)[0].teacher === 'string'
              ) {
                await getDbContent();
              } else {
                setContent(localData.content);
              }
            }
            if (localData.updated_at) {
              localUpdatedAt.current = localData.updated_at;
            }
            setLoading(false);
          } else {
            // If nothing in AsyncStorage, pull from Database
            await getDbContent();
          }
          await calcUpdateAvailable();
        } catch (err) {
          // logger.error('Error getting local content data');

          // In case there's an error getting localStorage, then pull from database as backup
          await getDbContent();
        }
      };

      if (!content) {
        fetchContent();
      }
    }
  }, [content, user]);

  // If updateAvailable, refetch content from database automatically
  useEffect(() => {
    if (updateAvailable) {
      const autoFetchDb = async (): Promise<void> => {
        await getDbContent();
      };

      autoFetchDb();
    }
  }, [updateAvailable]);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData } = useConfig<Features>('featured');

  if (!content) {
    return <Loading fullPage loading={!content} />;
  }

  return (
    <Content.Provider
      value={{
        content,
        features: rcData,
        loading: loading,
        rcLoading: rcLoading,
        updateAvailable,
        error,
        status: statuses,
        getDbContent,
        getFeatures,
      }}>
      {children}
    </Content.Provider>
  );
};
