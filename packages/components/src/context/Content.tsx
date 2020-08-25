import React, { useRef, ReactChildren } from 'react';
import { Spinner } from '../primitives';
import {
  TeacherService,
  ContentService,
  AllTeachers,
  Content as ContentType,
} from 'services';
// import { Unsubscriber } from '../types';
import { useQuery } from '../hooks';

export const Content = React.createContext<any>({ content: null });

export const ContentProvider = ({
  children,
}: {
  children: ReactChildren;
}): JSX.Element => {
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
    return <Spinner />;
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
