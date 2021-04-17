import React from 'react';
import { Colors, convertTimestamp, Content } from 'common';
import { Button, ListEmpty, ContentCard, Box } from '..';
import { List } from '@material-ui/core';
import { useContent, useNavigation } from '../../hooks';

type Props = {
  homepage?: boolean;
  type: 'history' | 'favorites';
  color?: Colors;
};

const ContentLoopLoadMore: React.FC<Props> = ({ homepage, type, color }) => {
  const { favsMore, favorites, history, historyMore } = useContent();
  const navigation = useNavigation();

  // Change which content arr we're using
  const actions = type === 'history' ? historyMore : favsMore;
  const content = type === 'history' ? history : favorites;
  let filtered = [...content];
  const hasContent = !!content && content.length > 0;

  // Pull first two unique values if is a homepage history loop
  const getTwoUnique = (): Content[] => {
    // Make copy of Arr so idx doesn't change as items get pushed into contentArr
    const arr = [];
    let idx = 0;

    // Add unique items to contentArr until there's two items or it's looped through all items
    do {
      const item = content[idx];
      // Automatically add first item into array
      if (arr.length === 0) {
        arr.push(item);
      } else {
        // If contentId is unique, add it to the array
        if (item.id !== arr[0].id) {
          arr.push(item);
        }
      }

      // Increment idx after each loop
      idx++;
    } while (arr.length < 2 && idx < content.length);

    return arr;
  };

  // Convert documents into data and set in local state
  if (hasContent) {
    // If recently played on homepage, remove duplicates
    if (type === 'history' && homepage) {
      filtered = getTwoUnique();
      // If other 2x content loop on homepage, just splice
    } else if (homepage) {
      filtered = content.slice(0, 2);
    }
  }

  return (
    <>
      <List style={{ paddingTop: 0 }}>
        {hasContent ? (
          filtered.map((item: Content, idx: number) => {
            return (
              <ContentCard
                small
                key={idx}
                content={item}
                recentDate={
                  type === 'history' && item.created_at
                    ? convertTimestamp(item.created_at).format('MMM D, YYYY')
                    : undefined
                }
              />
            );
          })
        ) : (
          <ListEmpty center color={color}>
            {type === 'history'
              ? 'Your recently played videos will appear here. Get started!'
              : 'Your favorite videos will appear here. Get started!'}
          </ListEmpty>
        )}

        {actions.hasMore &&
          !actions.loadingMore &&
          !homepage &&
          filtered.length >= 7 && (
            <Box mt={1}>
              <Button
                fullWidth={true}
                size="small"
                disabled={actions.loadingMore}
                text="Load More"
                onPress={actions.loadMore}
              />
            </Box>
          )}

        {filtered.length > 0 && homepage && (
          <Button
            size="small"
            fullWidth={true}
            text="See all"
            disableElevation={color === 'white'}
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            variant={color === 'white' ? 'contained' : 'text'}
            onPress={() =>
              navigation.navigate('Profile', {
                defaultTab: 'History',
              })
            }
          />
        )}
      </List>
    </>
  );
};

export default ContentLoopLoadMore;
