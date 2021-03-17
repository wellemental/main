import React from 'react';
import { Button, ListEmpty, ContentCardSmall, Box } from '../';
import { Content } from 'common';
import { convertTimestamp } from '../../services/helpers';

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
  return (
    <Box>
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
      {homepage && <Button text="See all" />}
    </Box>
  );
};

export default ContentLoopSmall;
