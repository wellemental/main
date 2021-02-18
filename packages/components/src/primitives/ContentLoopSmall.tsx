// NOT USING YET, MAY DELETE PENDING PROGRESS
import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
import {
  Error,
  PageHeading,
  Container,
  StatDisplay,
  Button,
  ListEmpty,
  Tabs,
  Box,
  Headline,
  Spinner,
  ContentCardSmall,
  Paragraph,
} from '../primitives';
import { List } from 'native-base';
import { MenuItem } from '../types';
import { useCurrentUser, useContent, useContainer } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import SettingsScreen from '../screens/SettingsScreen';

type Props = {
  homepage?: boolean;
  short?: boolean;
  type?: 'recent' | 'new' | 'favs';
};

// Recently played
// Favs
// New

const ContentLoopSmall: React.FC<Props> = ({ homepage, short, homepage }) => {
  const { translation } = useCurrentUser();
  const { content, teachers } = useContent();
  const [error, setError] = useState();

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
  } = useLoadMore(service.query, { limit: homepage ? 2 : 7 });

  return loading || !content || !teachers ? (
    <Spinner />
  ) : (
    <>
      <List style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 5 }}>
        {items && items.length > 0 ? (
          items.slice(0, 2).map((item, idx: number) => {
            const data = item.data() as PlayEvent;
            const contentMatch =
              data && data.contentId && content[data.contentId];
            const teacherMatch =
              data &&
              data.contentId &&
              content[data.contentId] &&
              teachers[content[data.contentId].teacher];

            return contentMatch && teacherMatch ? (
              <ContentCardSmall
                key={idx}
                content={contentMatch}
                teacher={teacherMatch}
                recentDate={
                  homepage
                    ? undefined
                    : convertTimestamp(data.createdAt).format('MMM DD, YYYY')
                }
              />
            ) : null;
          })
        ) : (
          <ListEmpty>
            {
              translation[
                'Your recently played videos will appear here. Get started!'
              ]
            }
          </ListEmpty>
        )}
        {homepage && <Button text={translation['See all']} transparent />}
        {hasMore && !homepage && (
          <Button
            transparent
            disabled={loadingMore}
            text={translation['Load More']}
            onPress={loadMore}
          />
        )}
      </List>
    </>
  );
};

export default ContentLoopSmall;
