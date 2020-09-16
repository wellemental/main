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
import { useConfig } from '../hooks';
import { Logger } from 'services';

interface ContentContext {
  content: ContentType[];
  teachers: AllTeachers;
  contentError: Error;
  teachersError: Error;
  loading: boolean;
  features: Features;
  updateAvailable: boolean;
}

export const Content = React.createContext<ContentContext>({
  content: null,
  teachers: null,
  contentError: null,
  teachersError: null,
  loading: true,
  features: undefined,
  updateAvailable: false,
});

const localStateService = new LocalStateService();
const teacherService = new TeacherService();
const contentService = new ContentService();

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
  const [loading, setLoading] = useState(!content || !teachers ? true : false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const localUpdatedAt = useRef<Date | undefined>();

  const getDbContent = async () => {
    // Get teachers and content from firestore
    try {
      const dbTeachers = await teacherService.getAllTeachers();
      const dbContent = await contentService.getContent();

      // Update AsyncStorage with firestore data
      setLocalContent(dbContent, dbTeachers);

      // Update state with firestore data
      setContent(dbContent);
      setTeachers(dbTeachers);
    } catch (err) {
      Logger.error(`Error getting firestore content data - ${err}`);
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchContent = async (): Promise<void> => {
      // First, try to fetch from AsyncStorage
      try {
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
          // If nothing in AsyncStorage, pull from Database
          await getDbContent();
        }
      } catch (err) {
        Logger.error(`Error getting local content data - ${err}`);
        setError(err);
      }
    };

    if (!teachers || !content) {
      fetchContent();
    }

    const calcUpdateAvailable = async () => {
      // Get latest updated_at times from firestore
      const dbContentLatest = await contentService.getLatestUpdate();
      const dbTeacherLatest = await teacherService.getLatestUpdate();

      // Set updateAvailable to true if either database updated_at is more recent
      setUpdateAvailable(
        dbContentLatest > localUpdatedAt.current ||
          dbTeacherLatest > localUpdatedAt.current,
      );
    };

    if (localUpdatedAt.current) {
      calcUpdateAvailable();
    }
  }, []);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData } = useConfig('featured');

  if (loading || rcLoading) {
    return <Spinner text="Loading Content..." />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
        features: rcData,
        loading: loading || rcLoading,
        updateAvailable,
      }}>
      {children}
    </Content.Provider>
  );
};
