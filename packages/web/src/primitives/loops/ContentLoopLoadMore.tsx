import React, { useEffect, useState } from 'react';
import { PlayEvent, Colors, convertTimestamp, Content } from 'common';
import { Button, ListEmpty, Loading, ContentCard, Box } from '..';
import { List } from '@material-ui/core';
import { useContent } from '../../hooks';

type Props = {
  homepage?: boolean;
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => any;
  hasMore: boolean;
  items: firebase.firestore.DocumentData[];
  recentlyPlayed?: boolean;
};

const ContentLoopLoadMore: React.FC<Props> = ({
  homepage,
  loading,
  items,
  hasMore,
  loadingMore,
  loadMore,
  recentlyPlayed,
}) => {
  const { content } = useContent();
  const [contentArr, setContentArr] = useState<any[]>([]);

  const hasContent = !!content && items.length > 0;

  const hasContentMatch = (theItem: PlayEvent): boolean => {
    return (
      !!content &&
      !!theItem &&
      !!theItem.contentId &&
      !!content[theItem.contentId]
    );
  };

  const matchContent = (theItem: PlayEvent): Content | null => {
    return !!content && hasContentMatch(theItem)
      ? content[theItem.contentId]
      : null;
  };

  // Pull first two unique values if is a homepage history loop
  const getTwoUnique = () => {
    // Make copy of Arr so idx doesn't change as items get pushed into contentArr
    const arr = [];
    let idx = 0;

    // Add unique items to contentArr until there's two items or it's looped through all items
    do {
      const data = items[idx].data();
      const hasMatch = hasContentMatch(data);

      // Play must have a matched Content Id, failsafe in case content gets deleted or input incorrectly in database
      if (hasMatch) {
        // Automatically add first item into array
        if (arr.length === 0) {
          arr.push(data);
        } else {
          // If contentId is unique, add it to the array
          if (data.contentId !== arr[0].contentId) {
            arr.push(data);
          }
        }
      }

      // Increment idx after each loop
      idx++;
    } while (arr.length < 2 && idx < items.length);

    return arr;
  };

  useEffect(() => {
    // Convert documents into data and set in local state
    if (hasContent) {
      // If recently played on homepage, remove duplicates
      if (recentlyPlayed && homepage) {
        setContentArr(getTwoUnique());
        // If other 2x content loop on homepage, just splice
      } else if (homepage) {
        setContentArr(items.slice(0, 2).map(item => item.data()));
        // Else just map all of them
      } else {
        setContentArr(items.map(item => item.data()));
      }
    }
  }, [content, items]);

  return (
    <Loading loading={loading || !content}>
      <List style={{ paddingTop: 0 }}>
        {hasContent ? (
          contentArr.map((item, idx: number) => {
            const contentMatch = matchContent(item);

            return contentMatch ? (
              <ContentCard
                small
                key={idx}
                content={contentMatch}
                recentDate={
                  !recentlyPlayed
                    ? undefined
                    : convertTimestamp(item.createdAt).format('MMM D, YYYY')
                }
              />
            ) : null;
          })
        ) : (
          <ListEmpty center>
            {recentlyPlayed
              ? 'Your recently played videos will appear here. Get started!'
              : 'Your favorite videos will appear here. Get started!'}
          </ListEmpty>
        )}

        {hasMore && !loadingMore && !homepage && items.length >= 7 && (
          <Box mt={1}>
            <Button
              fullWidth={true}
              size="small"
              disabled={loadingMore}
              text="Load More"
              onPress={loadMore}
            />
          </Box>
        )}
      </List>
    </Loading>
  );
};

export default ContentLoopLoadMore;
