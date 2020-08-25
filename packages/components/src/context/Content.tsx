import React, { useState, useRef } from 'react';
import { Spinner } from '../primitives';
import { TeacherService, ContentService } from 'services';
// import { Unsubscriber } from '../types';
import { useQuery } from '../hooks';

const CACHE: any = {};
export const Content = React.createContext<any>({ content: null });

export const ContentProvider = ({ children }: any) => {
  const service = new TeacherService();
  const query = useRef(service.getAllTeachers);
  const { loading: teacherLoading, data: teachers } = useQuery(query.current);

  const service2 = new ContentService();
  const query2 = useRef(service2.getContent);
  const { loading: contentLoading, data: content } = useQuery(query2.current);

  if (contentLoading || teacherLoading) {
    return <Spinner />;
  }

  return (
    <Content.Provider
      value={{
        content,
        teachers,
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
