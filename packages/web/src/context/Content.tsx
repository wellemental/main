import React, { useRef, useEffect, useState } from 'react';
import { Spinner } from '../primitives';
import { TeacherService, ContentService } from '../services';
import { AllTeachers, Content as ContentType, Features } from '../types';
import { useConfig, useCurrentUser } from '../hooks';
import logger from '../services/LoggerService';

interface ContentContext {
  content: ContentType[] | null;
  teachers: AllTeachers | null;
  error: Error | string;
  loading: boolean;
  rcLoading?: boolean;
  features: Features | undefined;
  status: string[];
  getDbContent?: () => void;
}

export const Content = React.createContext<ContentContext>({
  content: [],
  teachers: {},
  error: '',
  loading: false,
  rcLoading: false,
  features: undefined,
  status: [],
});

export const ContentProvider = ({
  children,
}: {
  children: any;
}): JSX.Element => {
  const [content, setContent] = useState<ContentType[] | null>(null);
  const [teachers, setTeachers] = useState<AllTeachers | null>(null);
  const [error, setError] = useState('');
  const [statuses, setStatus] = useState([]);
  const { user } = useCurrentUser();
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

      // Update state with firestore data
      setContent(dbContent);
      setTeachers(dbTeachers);
    } catch (err) {
      console.log('ERROR', err);
      setError(`Error fetching content from database - ${err}`);
      logger.error(`Error getting firestore content data - ${err}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    // if (user) {
    const fetchContent = async (): Promise<void> => {
      try {
        await getDbContent();
      } catch (err) {
        logger.error('Error getting local content data');
      }
    };

    if (!teachers || !content) {
    }
    fetchContent();
    // }
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
        status: statuses,
        getDbContent,
      }}>
      {children}
    </Content.Provider>
  );
};
