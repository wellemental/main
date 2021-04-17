import React, { useEffect, useState, useReducer } from 'react';
import { Spinner } from '../primitives';
import { TeacherService, ContentService } from '../services';
import { LoadMoreStateType } from '../hooks/useLoadMore';
import {
  AllTeachers,
  Categories,
  ContentObj,
  Content as ContentType,
  Features,
  ContentServiceType,
  User,
  PlaysServiceType,
  FavoritesServiceType,
  PlayEvent,
  Favorite,
} from 'common';
import {
  useConfig,
  useCurrentUser,
  useContainer,
  useQuery,
  useLoadMore,
} from '../hooks';

type BuildContent<T> = T;
interface ContentContext {
  content: ContentObj | null;
  error: Error | string;
  // plays: ContentType[];
  // favs: ContentType[];
  // playsMore?: StateType;
  // favsMore?: StateType;
  loading: boolean;
  rcLoading?: boolean;
  features: Features | undefined;
  getDbContent?: () => void;
}

export const Content = React.createContext<ContentContext>({
  content: {},
  error: '',
  // plays: [],
  // favs: [],
  loading: false,
  rcLoading: false,
  features: undefined,
});

export const ContentProvider: React.FC = ({ children }): JSX.Element => {
  // Load all content
  // Subscribe to favorites and rebuild with content on each change
  // Subscribe to history and rebuild with content on each change
  // const [error, setError] = useState('');
  const { user } = useCurrentUser();
  const [content, setContent] = useState<ContentObj | null>(null);
  const [loading, setLoading] = useState(!content ? true : false);
  // const [plays, setPlays] = useState<ContentType[] | null>(null);
  // const [favs, setFavs] = useState<ContentType[] | null>(null);

  // Load all the content
  const container = useContainer();
  const service = container.getInstance<ContentServiceType>('contentService');
  // const playsService = container.getInstance<PlaysServiceType>('playsService');
  // const favsService = container.getInstance<FavoritesServiceType>(
  //   'favoritesService',
  // );

  // Load all the content by default
  // ISSUE: Gets content every time user is updated
  const { data, error, loading: getLoading } = useQuery(service.getContent);

  // Set default content state
  useEffect(() => {
    setContent(data);
    setLoading(false);
  }, [data]);

  // Get batch of Plays
  // const playsMore = useLoadMore(playsService.query, { limit: 7 });
  // const playItems = playsMore.items;

  // Match Favs and Plays with Content Items
  // const buildContent = (
  //   items: firebase.firestore.DocumentData[],
  // ): ContentType[] => {
  //   return items.map(item => {
  //     const data = item.data();
  //     const matchedContent: ContentType =
  //       content && content[data.contentId] && content[data.contentId];

  //     return matchedContent;
  //   });
  // };

  // useEffect(() => {
  //   setPlays(buildContent(playItems));
  // }, [playItems, content]);

  // Get batch of Favs
  // const favsMore = useLoadMore(favsService.query, { limit: 7 });
  // const favItems = favsMore.items;

  // useEffect(() => {
  //   setFavs(buildContent(favItems));
  // }, [favItems, content]);

  // Get Featured Content from Remote Config
  const { loading: rcLoading, data: rcData }: any = useConfig('featured');

  // If user is logged in and content or remote config is still loading, show spinner
  if (loading || rcLoading) {
    return <Spinner fullPage />;
  }

  return (
    <Content.Provider
      value={{
        content: content,
        features: rcData,
        // plays,
        // favs,
        // playsMore,
        // favsMore,
        loading: loading,
        rcLoading: rcLoading,
        error,
        // getDbContent,
      }}>
      {children}
    </Content.Provider>
  );
};
