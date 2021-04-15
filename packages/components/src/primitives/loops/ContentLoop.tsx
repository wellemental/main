import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import ContentCard from '../cards/ContentCard';
import { useContent } from '../../hooks';
import { Content, Tags, Teachers, TimeOfDay, Categories } from 'common';
import ListEmpty from '../typography/ListEmpty';
import Error from '../typography/Error';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  filter?: Tags | Categories | TimeOfDay;
  search?: string;
  teacher?: Teachers;
  scrollEnabled?: boolean;
  header?: React.ReactElement;
  hasPadding?: boolean; // Apply horizontal margin for Library screen bc of tabs full width requirement
  small?: boolean;
  limit?: number;
  noLoadMore?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  search,
  teacher,
  header,
  scrollEnabled,
  hasPadding,
  small,
  limit,
  noLoadMore,
  ...props
}) => {
  const { user } = useCurrentUser();
  const { content, error } = useContent();
  const defaultLimit = 8;
  const [theLimit, setLimit] = useState(limit ? limit : defaultLimit);

  let filteredContent: Content[] = content ? Object.values(content) : [];

  // Filter by language
  if (user && user.language && filteredContent && teacher === undefined) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.language === user.language,
    );
  }

  // Filter by tag or category
  if (filter && filteredContent) {
    filteredContent = filteredContent.filter(
      (item: Content) =>
        item && item.tags && item.tags.includes(filter.toLowerCase()),
    );
  }

  // Filter by teacher
  if (teacher && filteredContent) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.teacher && item.teacher.name === teacher,
    );
  }

  // Filter by search term
  if (search && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.title.includes(search),
    );
  }

  // Sort by priority
  // Items with priority field set go above those with no priority
  filteredContent = filteredContent.sort((a, b) =>
    !a.priority ? 1 : !b.priority ? -1 : a.priority > b.priority ? 1 : -1,
  );

  filteredContent = filteredContent.slice(0, theLimit);

  return (
    <View style={{ marginHorizontal: hasPadding ? 15 : 0 }}>
      <Error error={error} />

      {content && scrollEnabled ? (
        // If tabs and header need to be able to scroll up with the list
        // <ScrollView showsVerticalScrollIndicator={false}>
        //   {filteredContent.map((item, idx) => (
        //     <ContentCard key={idx} content={item} />
        //   ))}
        // </ScrollView>
        <FlatList
          data={filteredContent}
          initialNumToRender={10}
          ListHeaderComponent={header}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ContentCard small={small} content={item} />
          )}
          ListEmptyComponent={<ListEmpty />}
          {...props}
        />
      ) : (
        content &&
        filteredContent.map((item, idx: number) => (
          <ContentCard small={small} key={idx} content={item} />
        ))
      )}
    </View>
  );
};

export default ContentLoop;
