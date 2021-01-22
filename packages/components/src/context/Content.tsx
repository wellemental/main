import React, { useRef, useEffect, useState } from 'react';
import {
  TeacherService,
  ContentService,
  AllTeachers,
  LocalStateService,
  Content as ContentType,
  ContentObj,
  Features,
} from 'services';
import { useConfig, useCurrentUser } from '../hooks';
import { logger } from 'services';

interface ContentContext {
  content: ContentObj;
  teachers: AllTeachers;
  error: Error | string;
  loading: boolean;
  rcLoading: boolean;
  features: Features;
  updateAvailable: boolean;
  status: string[];
  getDbContent: () => void;
}

export const Content = React.createContext<ContentContext>({
  content: null,
  teachers: null,
  error: null,
  loading: false,
  rcLoading: false,
  features: undefined,
  updateAvailable: false,
  status: [],
  getDbContent: null,
});

const localStateService = new LocalStateService();

const setLocalContent = async (content, teachers) => {
  await localStateService.setStorage('wmContent', {
    content,
    teachers,
  });
};

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const [content, setContent] = useState<ContentObj | null>(null);
  const [teachers, setTeachers] = useState<AllTeachers | null>(null);
  const [error, setError] = useState('');
  const [statuses, setStatus] = useState([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(
    // !auth ? false : !content || !teachers ? true : false,
    !content || !teachers ? true : false,
  );
  const localUpdatedAt = useRef<Date | undefined>();

  const getDbContent = async (): void => {
    // Get teachers and content from firestore
    try {
      const teacherService = new TeacherService();
      const contentService = new ContentService();
      const dbTeachers = await teacherService.getAllTeachers();
      const dbContent = await contentService.getContent();

      // Update AsyncStorage with firestore data
      if (dbTeachers && dbContent) {
        await setLocalContent(dbContent, dbTeachers);
      } else {
        logger.info(
          `No results from fb for teachers or content. Not setting locally.`,
        );
      }

      // Update state with firestore data
      setContent(dbContent);
      setTeachers(dbTeachers);
    } catch (err) {
      setError(`Error fetching content from database - ${err}`);
      logger.error('Error getting firestore content data');
      logger.error(`Error getting firestore content data - ${err}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const calcUpdateAvailable = async () => {
        setStatus((status) => [
          ...status,
          'Getting latest updates from content and teachers',
        ]);
        logger.info('Calculating update available');
        // Get latest updated_at times from firestore
        const teacherService = new TeacherService();
        const contentService = new ContentService();
        const dbContentLatest = await contentService.getLatestUpdate();
        const dbTeacherLatest = await teacherService.getLatestUpdate();

        // Set updateAvailable to true if either database updated_at is more recent
        if (dbContentLatest || dbTeacherLatest) {
          setUpdateAvailable(
            dbContentLatest > localUpdatedAt.current ||
              dbTeacherLatest > localUpdatedAt.current,
          );
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
              setContent(localData.content);
            }
            if (localData.teachers) {
              setTeachers(localData.teachers);
            }
            if (localData.updated_at) {
              localUpdatedAt.current = localData.updated_at;
            }
            setLoading(false);
          } else {
            logger.info('No local data, fetching from database');
            // If nothing in AsyncStorage, pull from Database
            await getDbContent();
          }
          await calcUpdateAvailable();
        } catch (err) {
          logger.error('Error getting local content data');

          // In case there's an error getting localStorage, then pull from database as backup
          await getDbContent();
        }
      };

      if (!teachers || !content) {
        fetchContent();
      }
    }
  }, [content, teachers, user]);

  // If updateAvailable, refetch content from database automatically
  useEffect(() => {
    if (updateAvailable) {
      const autoFetchDb = async (): void => {
        await getDbContent();
      };

      autoFetchDb();
    }
  }, [updateAvailable]);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData } = useConfig<Features>('featured');

  if ((user && loading) || (user && rcLoading)) {
    // return <Spinner text="Loading Content..." />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
        features: rcData,
        loading: loading,
        rcLoading: rcLoading,
        updateAvailable,
        error,
        status: statuses,
        getDbContent,
      }}>
      {children}
    </Content.Provider>
  );
};
