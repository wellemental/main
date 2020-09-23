import React, { useRef, useEffect, useState } from 'react';
import { Spinner } from '../primitives';
import {
  TeacherService,
  ContentService,
  AllTeachers,
  LocalStateService,
  Content as ContentType,
  Features,
} from 'services';
import { useConfig, useCurrentUser } from '../hooks';
import { logger } from 'services';

interface ContentContext {
  content: ContentType[];
  teachers: AllTeachers;
  error: Error | string;
  loading: boolean;
  rcLoading: boolean;
  features: Features;
  updateAvailable: boolean;
  status: string[];
  getDbContent?: () => void;
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
});

const localStateService = new LocalStateService();

const setLocalContent = async (content, teachers) => {
  await localStateService.setStorage('wmContent', {
    content,
    teachers,
  });
};

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const [content, setContent] = useState<ContentType[] | null>(null);
  const [teachers, setTeachers] = useState<AllTeachers | null>(null);
  const [error, setError] = useState('');
  const [statuses, setStatus] = useState([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { auth } = useCurrentUser();
  const [loading, setLoading] = useState(
    // !auth ? false : !content || !teachers ? true : false,
    !content || !teachers ? true : false,
  );
  const localUpdatedAt = useRef<Date | undefined>();

  const getDbContent = async () => {
    // Get teachers and content from firestore
    try {
      const teacherService = new TeacherService();
      const contentService = new ContentService();
      const dbTeachers = await teacherService.getAllTeachers();
      const dbContent = await contentService.getContent();

      // Update AsyncStorage with firestore data
      if (dbTeachers) {
        setStatus((status) => [...status, 'Successly got Teachers']);
      }
      if (dbContent) {
        setStatus((status) => [...status, 'Successly got content']);
      }

      if (dbTeachers && dbContent) {
        setStatus((status) => [
          ...status,
          'Successly got Teach & content from db, storing locally',
        ]);
        logger.info('Successly got Teach & content from db, storing locally');
        await setLocalContent(dbContent, dbTeachers);
      } else {
        setStatus((status) => [
          ...status,
          'No results from fb for teachers or content. Not setting locally.',
        ]);
        logger.info(
          `No results from fb for teachers or content. Not setting locally.`,
        );
      }

      // Update state with firestore data
      setContent(dbContent);
      setTeachers(dbTeachers);
    } catch (err) {
      setStatus((status) => [
        ...status,
        `Error fetching content from database - ${err}`,
      ]);
      setError(`Error fetching content from database - ${err}`);
      logger.error('Error getting firestore content data');
      logger.error(`Error getting firestore content data - ${err}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auth) {
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
          logger.info('Calculating update available');
          setStatus((status) => [...status, 'Successfully got latest from db']);

          setStatus((status) => [
            ...status,
            `Local - ${localUpdatedAt.current} - Content - ${dbContentLatest} - Teacher - ${dbTeacherLatest}`,
            `isContentNewer? - ${dbContentLatest > localUpdatedAt.current}`,
            `isTEacherNewer? - ${dbTeacherLatest > localUpdatedAt.current}`,
          ]);

          logger.info(
            `Local - ${localUpdatedAt.current} - Content - ${dbContentLatest} - Teacher - ${dbTeacherLatest}`,
          );
          logger.info(
            `isContentNewer? - ${dbContentLatest > localUpdatedAt.current}`,
          );
          logger.info(
            `isTEacherNewer? - ${dbTeacherLatest > localUpdatedAt.current}`,
          );
          setUpdateAvailable(
            dbContentLatest > localUpdatedAt.current ||
              dbTeacherLatest > localUpdatedAt.current,
          );
        } else {
          logger.info('Failed to get latest from db');
          setStatus((status) => [...status, 'Failed to get latest from db']);
        }
      };

      const fetchContent = async (): Promise<void> => {
        // First, try to fetch from AsyncStorage
        try {
          setStatus((status) => [...status, 'Fetching local data']);

          const localData = await localStateService.getContent();

          if (localData) {
            setStatus((status) => [...status, 'Got local data']);
            logger.info('Got local data');
            if (localData.content) {
              logger.info('Got local content');
              setStatus((status) => [...status, 'Got local content']);
              setContent(localData.content);
            }
            if (localData.teachers) {
              logger.info('Got local teachers');
              setStatus((status) => [...status, 'Got local teachers']);
              setTeachers(localData.teachers);
            }
            if (localData.updated_at) {
              setStatus((status) => [
                ...status,
                `Got local updated_at - ${localData.updated_at}`,
              ]);
              setStatus((status) => [...status, 'Got local updated_at']);
              localUpdatedAt.current = localData.updated_at;
            }
            setLoading(false);
          } else {
            setStatus((status) => [
              ...status,
              'No local data, fetching from database',
            ]);
            logger.info('No local data, fetching from database');
            // If nothing in AsyncStorage, pull from Database
            await getDbContent();
          }
          await calcUpdateAvailable();
        } catch (err) {
          setStatus((status) => [...status, 'Error fetching content']);
          logger.error('Error getting local content data');
        }
      };

      if (!teachers || !content) {
        setStatus((status) => [
          ...status,
          'No content or teachers. Fetching local data',
        ]);
        fetchContent();
      }
    }
  }, [content, teachers, auth]);

  // If updateAvailable, refetch content from database automatically
  useEffect(() => {
    if (updateAvailable) {
      const autoFetchDb = async () => {
        setStatus((status) => [
          ...status,
          'Auto-fetching content from database',
        ]);
        logger.info('Auto-fetching content from database');
        await getDbContent();
      };

      autoFetchDb();
    }
  }, [updateAvailable]);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData } = useConfig('featured');

  console.log('LOADING', loading, rcLoading, 'AUTH', !!auth);
  console.log(
    'CONTENT',
    !!content,
    'TEACHERS',
    !!teachers,
    'FEATURES',
    !!rcData,
  );
  if ((auth && loading) || (auth && rcLoading)) {
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
