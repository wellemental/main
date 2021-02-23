import React from 'react';
import { Platform } from 'react-native';
import {
  PlayEvent,
  convertTimestamp,
  ContentObj,
  AllTeachers,
  PlaysObj,
} from 'services';
import { Button, ListEmpty, Spinner, ContentCardSmall } from '../primitives';
import { List } from 'native-base';
import { useCurrentUser } from '../hooks';
// import useLoadMore from '../hooks/useLoadMore';

type Props = {
  homepage?: boolean;
  loading: boolean;
  content: ContentObj;
  teachers: AllTeachers;
  loadingMore: boolean;
  loadMore: () => any;
  hasMore: boolean;
  items: any[];
};

const RecentlyPlayedLoop: React.FC<Props> = ({
  homepage,
  loading,
  content,
  items,
  teachers,
  hasMore,
  loadingMore,
  loadMore,
}) => {
  const { translation } = useCurrentUser();

  return loading || !content || !teachers ? (
    <Spinner />
  ) : (
    <>
      <List style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 5 }}>
        {!!items && items.length > 0 ? (
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

export default RecentlyPlayedLoop;
