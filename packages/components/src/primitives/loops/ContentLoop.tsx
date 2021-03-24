import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import ContentCard from '../cards/ContentCard';
import { useContent } from '../../hooks';
import { Content, Tags, Teachers, TimeOfDay, Categories } from 'common';
import ListEmpty from '../typography/ListEmpty';
import Error from '../typography/Error';
import Paragraph from '../typography/Paragraph';
import Loading from '../loaders/Loading';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Props {
  filter?: Tags | Categories | TimeOfDay;
  search?: string;
  teacher?: Teachers;
  scrollEnabled?: boolean;
  header?: React.ReactElement;
  hasPadding?: boolean; // Apply horizontal margin for Library screen bc of tabs full width requirement
}

const ContentLoop: React.FC<Props> = ({
  filter,
  search,
  teacher,
  header,
  scrollEnabled,
  hasPadding,
  ...props
}) => {
  const { user } = useCurrentUser();
  const { content, error } = useContent();

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
  filteredContent = filteredContent.sort((a, b) =>
    a.priority > b.priority ? 1 : -1,
  );

  const hasFilteredContent = filteredContent && filteredContent.length > 0;

  return (
    <Loading
      loading={content && scrollEnabled && hasFilteredContent}
      fullPage={false}>
      <View style={{ marginHorizontal: hasPadding ? 15 : 0 }}>
        <Error error={error} />

        {content && scrollEnabled && hasFilteredContent ? (
          // If tabs and header need to be able to scroll up with the list
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredContent.map((item, idx) => (
              <ContentCard key={idx} content={item} />
            ))}
          </ScrollView>
        ) : (
          content && (
            <FlatList
              data={filteredContent}
              initialNumToRender={10}
              ListHeaderComponent={header}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, idx }) => (
                <ContentCard key={idx} content={item} />
              )}
              ListEmptyComponent={<ListEmpty />}
              {...props}
            />
          )
        )}
      </View>
    </Loading>
  );
};

export default ContentLoop;
