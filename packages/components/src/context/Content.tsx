import React, { useRef } from 'react';
import { Spinner } from '../primitives';
import {
  TeacherService,
  ContentService,
  AllTeachers,
  Content as ContentType,
  Features,
} from 'services';
import { useQuery, useConfig } from '../hooks';

interface ContentContext {
  content: ContentType[];
  teachers: AllTeachers;
  contentError: Error;
  teachersError: Error;
  loading: boolean;
  features: Features;
}

export const Content = React.createContext<ContentContext>({
  content: null,
  teachers: null,
  contentError: null,
  teachersError: null,
  loading: true,
  features: undefined,
});

const service = new TeacherService();
const service2 = new ContentService();

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const query = useRef(service.getAllTeachers);
  const {
    loading: teacherLoading,
    data: teachers,
    error: teachersError,
  } = useQuery<AllTeachers>(query.current);

  const query2 = useRef(service2.getContent);
  const {
    loading: contentLoading,
    data: content,
    error: contentError,
  } = useQuery<ContentType[]>(query2.current);

  const { loading: rcLoading, data: rcData } = useConfig('featured');

  if (contentLoading || teacherLoading || rcLoading) {
    return <Spinner text="Loading Content..." />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
        contentError,
        teachersError,
        features: rcData,
        loading: teacherLoading || contentLoading || rcLoading,
      }}>
      {children}
    </Content.Provider>
  );
};
