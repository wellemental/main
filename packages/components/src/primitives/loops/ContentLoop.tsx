import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import ContentCard from '../cards/ContentCard';
import Box from '../utils/Box';
import { useContent, useCurrentUser, useNavigation } from '../../hooks';
import {
  Content,
  Sortings,
  Categories,
  Filter,
  Filters,
  Teachers,
  filterContent,
  sortContent,
  getTwoRandomInt,
  getRandomInt,
  Colors,
} from 'common';
import ListEmpty from '../typography/ListEmpty';
import Error from '../typography/Error';
import Button from '../buttons/Button';

interface Props {
  filter?: Filter;
  type?: Categories;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  small?: boolean;
  limit?: number;
  seeAll?: boolean;
  recentDate?: boolean;
  sort?: Sortings;
  random?: 1 | 2; // Used to get two random items for featured modules
  color?: Colors;
  hasPadding?: boolean;
  header?: React.ReactElement;
  scrollEnabled?: boolean;
  autoLoadMore?: boolean;
  borderedAll?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  small,
  limit,
  seeAll,
  type,
  sort,
  recentDate,
  random,
  color,
  hasPadding,
  header,
  scrollEnabled,
  autoLoadMore = false,
  borderedAll = false,
  ...props
}) => {
  const { language, translation } = useCurrentUser();
  const { content, error } = useContent();
  let filteredContent: Content[] = content;
  const [hasLangFilter, setLangFilter] = useState(true);
  // For future user when we add sorting options to the UI
  const [sorting, setSort] = useState<Sortings | undefined>(sort);
  const defaultLimit = 8;
  const [theLimit, setLimit] = useState(limit ? limit : defaultLimit);
  const navigation = useNavigation();

  const filters: Filters = {};

  // Filter language
  if (hasLangFilter) {
    filters.language = language;
  }

  // Filter types
  if (type) {
    filters.type = type;
  }

  // Filter by tag or category
  if (filter) {
    filters.tags = [filter];
  }

  // Filter by teacher name
  if (teacher) {
    filters.teacher = teacher;
  }

  // Filter by search term
  if (search) {
    filters.search = search;
  }

  // Run it through filtering helper
  filteredContent = filterContent(content, filters);

  // Sort - defaults to 'priority' which falls back to most recent
  if (sorting) {
    filteredContent = sortContent(filteredContent, sorting);
  }

  // Get 1 or 2 random items from the contentArr
  // Used for featured loops
  if (random && filteredContent.length > random) {
    // Use diff function for getting 1 or 2 random items
    if (random === 2) {
      filteredContent = getTwoRandomInt(filteredContent.length).map(
        (idx: number) => filteredContent[idx],
      );
    } else {
      filteredContent = [filteredContent[getRandomInt(filteredContent.length)]];
    }
  }

  // Limit content length
  const limitedContent = filteredContent.slice(0, theLimit);

  // Check to see if there's any content
  const hasFilteredContent = filteredContent && filteredContent.length > 0;
  const loadMore = () => setLimit(theLimit + defaultLimit);

  return (
    <View style={{ marginHorizontal: hasPadding ? 15 : 0, marginBottom: 10 }}>
      <Error error={error} />

      {content && scrollEnabled ? (
        // If tabs and header need to be able to scroll up with the list
        // <ScrollView showsVerticalScrollIndicator={false}>
        //   {filteredContent.map((item, idx) => (
        //     <ContentCard key={idx} content={item} />
        //   ))}
        // </ScrollView>
        <FlatList
          data={limitedContent}
          initialNumToRender={10}
          ListHeaderComponent={header}
          showsVerticalScrollIndicator={false}
          onEndReached={autoLoadMore && loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            !autoLoadMore &&
            filteredContent.length >= defaultLimit &&
            filteredContent.length > theLimit && (
              <Box my={1.5}>
                <Button
                  // transparent
                  small
                  warning
                  text="Load more"
                  onPress={loadMore}
                />
              </Box>
            )
          }
          renderItem={({ item }) => (
            <ContentCard small={small} content={item} />
          )}
          ListEmptyComponent={<ListEmpty />}
          {...props}
        />
      ) : content && hasFilteredContent && filteredContent ? (
        <>
          {limitedContent.map((item, idx: number) => (
            <ContentCard small={small} key={idx} content={item} />
          ))}
          {content &&
            hasFilteredContent &&
            filteredContent &&
            (seeAll ? (
              <Box mt={1}>
                <Button
                  small
                  text="See all"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    ...(borderedAll ? {
                      borderWidth: 1,
                      borderColor: color === 'white' ? 'white' : '#214f4b',
                      marginTop: 4,
                    } : {}),
                  }}
                  transparent={color !== 'white'}
                  onPress={() =>
                    navigation.navigate('Category', {
                      category: { title: 'New', tag: undefined },
                    })
                  }
                />
              </Box>
            ) : (
              // Show load more if there's more content than the set slice limit
              // Limit is set to improve image and screen loading
              !scrollEnabled &&
              filteredContent.length >= defaultLimit &&
              filteredContent.length > theLimit && (
                <Box my={1}>
                  <Button
                    small
                    transparent
                    text="Load more"
                    onPress={() => setLimit(theLimit + defaultLimit)}
                  />
                </Box>
              )
            ))}
        </>
      ) : (
        <>
          <ListEmpty />
          {hasLangFilter && (
            <Button
              transparent
              onPress={() => setLangFilter(false)}
              text={`${translation['See all languages']} ›`}
            />
          )}
        </>
      )}
    </View>
  );
};

export default ContentLoop;
