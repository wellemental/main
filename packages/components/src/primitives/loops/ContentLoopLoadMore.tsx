import React from 'react';
import { Colors, Content } from 'common';
import { convertTimestamp } from 'services';
import { Button, ListEmpty, ContentCard, Box } from '..';
import { List } from 'native-base';
import { useNavigation, useContent } from '../../hooks';

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
      <List>
        {hasContent ? (
          filtered.map((item, idx: number) => {
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
          <ListEmpty center>
            {type === 'history'
              ? 'Your recently played videos will appear here. Get started!'
              : 'Your favorite videos will appear here. Get started!'}
          </ListEmpty>
        )}

        {homepage && type === 'history' && (
          <Box mt={1}>
            <Button
              small
              text={'See all'}
              style={{
                backgroundColor: 'rgba(0,0,0,0',
              }}
              transparent={color === 'white' ? false : true}
              onPress={() =>
                navigation.navigate('Profile', { defaultTab: 'History' })
              }
            />
          </Box>
        )}

        {actions.hasMore &&
          !actions.loadingMore &&
          !homepage &&
          content.length >= 7 && (
            <Box mt={1}>
              <Button
                warning
                small
                disabled={actions.loadingMore}
                text={'Load More'}
                onPress={actions.loadMore}
              />
            </Box>
          )}
      </List>
    </>
  );
};

export default ContentLoopLoadMore;
