import React from 'react';
import { PlayEvent, Colors } from 'common';
import { convertTimestamp } from 'services';
import {
  Button,
  ListEmpty,
  Loading,
  ContentCardSmall,
  Box,
} from '../primitives';
import { List } from 'native-base';
import { useCurrentUser, useNavigation, useContent } from '../hooks';

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
    <Loading loading={loading || !content} fullPage={false}>
      <List>
        {content && !!items && items.length > 0 ? (
          items.slice(0, homepage ? 2 : undefined).map((item, idx: number) => {
            const data = item.data() as PlayEvent;

            const contentMatch =
              content && data && data.contentId && content[data.contentId];

            return contentMatch ? (
              <ContentCardSmall
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
              small
              text={translation['See all']}
              style={{
                backgroundColor: 'rgba(0,0,0,0',
              }}
              transparent={color === 'white' ? false : true}
              onPress={() =>
                navigation.navigate('Profile', { defaultTab: 'Journey' })
              }
            />
          </Box>
        )}

        {hasMore && !loadingMore && !homepage && items.length >= 7 && (
          <Box mt={1}>
            <Button
              warning
              small
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
