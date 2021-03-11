import React from 'react';
import { Colors, PlayEvent } from 'common';
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
  color: Colors;
};

const RecentlyPlayedLoop: React.FC<Props> = ({
  homepage,
  loading,
  items,
  hasMore,
  color,
  loadingMore,
  loadMore,
}) => {
  const { translation } = useCurrentUser();
  const { content } = useContent();
  const navigation = useNavigation();

  return (
    <Loading loading={loading || !content} fullPage={false}>
      <List>
        {!!items && items.length > 0 ? (
          items.slice(0, 2).map((item, idx: number) => {
            const data = item.data() as PlayEvent;

            const contentMatch =
              data && data.contentId && content[data.contentId];

            return contentMatch ? (
              <ContentCardSmall
                key={idx}
                content={contentMatch}
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
        {homepage && (
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
        {hasMore && !loadingMore && !homepage && (
          <Button
            transparent
            disabled={loadingMore}
            text={translation['Load More']}
            onPress={loadMore}
          />
        )}
      </List>
    </Loading>
  );
};

export default RecentlyPlayedLoop;
