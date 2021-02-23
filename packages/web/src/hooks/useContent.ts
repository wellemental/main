import { useContext } from 'react';
import { Content } from '../context/Content';

export const useContent = () => {
  const contentContext = useContext(Content);
  if (!contentContext) throw new Error('Current content missing from context');
  return {
    content: contentContext.content,
    teachers: contentContext.teachers,
    loading: contentContext.loading,
    rcLoading: contentContext.rcLoading,
    features: contentContext.features,
    error: contentContext.error,
    getDbContent: contentContext.getDbContent,
  };
};
