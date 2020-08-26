import React, { useRef } from 'react';
import { Spinner } from '../primitives';
import {
  TeacherService,
  ContentService,
  AllTeachers,
  Content as ContentType,
} from 'services';
// import { Unsubscriber } from '../types';
import { useQuery } from '../hooks';

interface ContentContext {
  content: Content[];
  teachers: AllTeachers;
  contentError: Error;
  teachersError: Error;
  loading: boolean;
}

export const Content = React.createContext<ContentContext>({
  content: null,
  teachers: null,
  contentError: null,
  teachersError: null,
  loading: true,
});

export const ContentProvider = ({ children }: { children }): JSX.Element => {
  const service = new TeacherService();
  const query = useRef(service.getAllTeachers);
  const {
    loading: teacherLoading,
    data: teachers,
    error: teachersError,
  } = useQuery<AllTeachers>(query.current);

  const service2 = new ContentService();
  const query2 = useRef(service2.getContent);
  const {
    loading: contentLoading,
    data: content,
    error: contentError,
  } = useQuery<ContentType[]>(query2.current);

  if (contentLoading || teacherLoading) {
    return <Spinner text="Loading Content..." />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
        contentError,
        teachersError,
        loading: teacherLoading || contentLoading,
      }}>
      {children}
    </Content.Provider>
  );
};

function hashArgs(...args: any) {
  return args.reduce((acc: any, arg: any) => stringify(arg) + ':' + acc, '');
}

function stringify(val: any) {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}
