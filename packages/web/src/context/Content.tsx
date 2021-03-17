import React, { useEffect, useState } from 'react';
import { Spinner } from '../primitives';
import { TeacherService, ContentService } from '../services';
import {
  AllTeachers,
  Categories,
  ContentObj,
  Features,
  Content as ContentType,
} from 'common';
import { useConfig, useCurrentUser } from '../hooks';
import logger from '../services/LoggerService';

interface ContentContext {
  content: ContentObj | null;
  error: Error | string;
  loading: boolean;
  rcLoading?: boolean;
  features: Features | undefined;
  getDbContent?: () => void;
}

const contentService = new ContentService();

export const Content = React.createContext<ContentContext>({
  content: {},
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
  const [error, setError] = useState('');
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(!content ? true : false);

  const getDbContent = async () => {
    // Get teachers and content from firestore
    try {
      const dbContent = await contentService.getContent();

      // Update state with firestore data
      setContent(dbContent);
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
