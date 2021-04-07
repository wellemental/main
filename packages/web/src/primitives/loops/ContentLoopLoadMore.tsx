import React from 'react';
import { PlayEvent, Colors, convertTimestamp } from 'common';
import { Button, ListEmpty, Loading, ContentCard, Box } from '..';
import { List } from '@material-ui/core';
import { useCurrentUser, useNavigation, useContent } from '../../hooks';

type Props = {
  homepage?: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => any;
  hasMore: boolean;
  items: any[];
  recentlyPlayed?: boolean;
  color?: Colors;
};

const ContentLoopLoadMore: React.FC<Props> = ({
  homepage,
  loading,
  items,
  hasMore,
  loadingMore,
  loadMore,
  color,
  recentlyPlayed,
}) => {
  const { translation } = useCurrentUser();
  const { content } = useContent();
  const navigation = useNavigation();

  return (
    <Loading loading={loading || !content}>
      <List style={{ paddingTop: 0 }}>
        {content && !!items && items.length > 0 ? (
          items.slice(0, homepage ? 2 : undefined).map((item, idx: number) => {
            const data = item.data() as PlayEvent;

            const contentMatch =
              content && data && data.contentId && content[data.contentId];

            return contentMatch ? (
              <ContentCard
                small
                key={idx}
                content={contentMatch}
                recentDate={
                  !recentlyPlayed
                    ? undefined
                    : convertTimestamp(data.createdAt).format('MMM D, YYYY')
                }
              />
            ) : null;
          })
        ) : (
          <ListEmpty center>
            {recentlyPlayed
              ? translation[
                  'Your recently played videos will appear here. Get started!'
                ]
              : translation[
                  'Your favorite videos will appear here. Get started!'
                ]}
          </ListEmpty>
        )}

        {homepage && recentlyPlayed && (
          <Box mt={1}>
            <Button
              size="small"
              text={translation['See all']}
              style={{
                backgroundColor: 'rgba(0,0,0,0',
              }}
              variant={color === 'white' ? 'text' : 'contained'}
              onPress={() =>
                navigation.navigate('Profile', { defaultTab: 'History' })
              }
            />
          </Box>
        )}

        {hasMore && !loadingMore && !homepage && items.length >= 7 && (
          <Box mt={1}>
            <Button
              size="small"
              disabled={loadingMore}
              text={translation['Load More']}
              onPress={loadMore}
            />
          </Box>
        )}
      </List>
    </Loading>
  );
};

export default ContentLoopLoadMore;