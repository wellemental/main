// NOT USING YET, MAY DELETE PENDING PROGRESS
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Button, ListEmpty, ContentCardSmall } from '../primitives';
import { List } from 'native-base';
import { Content } from 'common';
import { convertTimestamp } from 'services';
import { useCurrentUser } from '../hooks';

type Props = {
  homepage?: boolean;
  content: Content[];
  type?: 'recent' | 'new' | 'favs';
  limit?: number;
};

const ContentLoopSmall: React.FC<Props> = ({
  homepage,
  content,
  limit,
  type,
}) => {
  const { translation } = useCurrentUser();

  return (
    <>
      <List style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 0 }}>
        {content && content.length > 0 ? (
          content
            .slice(0, limit)
            .map((item, idx: number) => (
              <ContentCardSmall
                key={idx}
                content={item}
                recentDate={
                  type === 'recent'
                    ? convertTimestamp(item.created_at).format('MMM DD, YYYY')
                    : undefined
                }
              />
            ))
        ) : (
          <ListEmpty />
        )}
        {homepage && <Button text={translation['See all']} transparent />}
      </List>
    </>
  );
};

export default ContentLoopSmall;
