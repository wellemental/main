import React, { useEffect, useState } from 'react';
import { Spinner } from '../primitives';
import { TeacherService, ContentService } from '../services';
import { AllTeachers, ContentObj, Features } from '../types';
import { useConfig, useCurrentUser } from '../hooks';
import logger from '../services/LoggerService';

interface ContentContext {
  content: ContentObj | null;
  teachers: AllTeachers | null;
  error: Error | string;
  loading: boolean;
  rcLoading?: boolean;
  features: Features | undefined;
  getDbContent?: () => void;
}

export const Content = React.createContext<ContentContext>({
  content: {},
  teachers: {},
  error: '',
  loading: false,
  rcLoading: false,
  features: undefined,
});

export const ContentProvider = ({
  children,
}: {
  children: any;
}): JSX.Element => {
  const [content, setContent] = useState<ContentObj | null>(null);
  const [teachers, setTeachers] = useState<AllTeachers | null>(null);
  const [error, setError] = useState('');
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(
    // !auth ? false : !content || !teachers ? true : false,
    !content || !teachers ? true : false,
  );

  const getDbContent = async () => {
    // Get teachers and content from firestore
    try {
      const teacherService = new TeacherService();
      const contentService = new ContentService();
      const dbTeachers = await teacherService.getAllTeachers();
      const dbContent = await contentService.getContent();

      // Update state with firestore data
      setContent(dbContent);
      setTeachers(dbTeachers);
    } catch (err) {
      setError(`Error fetching content from database - ${err}`);
      logger.error(`Error getting firestore content data - ${err}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const fetchContent = async (): Promise<void> => {
        try {
          await getDbContent();
        } catch (err) {
          logger.error('Error getting local content data');
        }
        setLoading(false);
      };

      if (!teachers || !content) {
      }
      fetchContent();
    }
  }, []);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData }: any = useConfig('featured');

  if ((user && loading) || rcLoading) {
    return <Spinner text="Loading Content..." />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
        features: rcData,
        loading: loading,
        rcLoading: rcLoading,
        error,
        getDbContent,
      }}>
      {children}
    </Content.Provider>
  );
};
