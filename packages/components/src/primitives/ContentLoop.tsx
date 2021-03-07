import React from 'react';
import { View, ScrollView } from 'react-native';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags, Teachers, TimeOfDay, Categories } from 'common';
import ListEmpty from './ListEmpty';
import Error from './Error';
import Paragraph from './Paragraph';
import Spinner from './Spinner';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface Props {
  filter?: Tags | Categories | TimeOfDay;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  scrollEnabled?: boolean;
  hasPadding?: boolean; // Apply horizontal margin for Library screen bc of tabs full width requirement
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  scrollEnabled,
  hasPadding,
}) => {
  const { user, translation } = useCurrentUser();
  const { content, teachers, error, loading } = useContent();

  let filteredContent: Content[] = content ? Object.values(content) : [];

  // Filter by language
  if (user && user.language && filteredContent && favorites === undefined) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.language === user.language,
    );
  }

  // Filter by tag or category
  if (filter && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.tags.includes(filter.toLowerCase()),
    );
  }

  // Filter by favorites
  if (favorites && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      favorites.includes(item.id),
    );
  }

  // Filter by teacher
  if (teacher && filteredContent) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.teacher === teacher,
    );
  }

  // Filter by search term
  if (search && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.title.includes(search),
    );
  }

  const hasFilteredContent = filteredContent && filteredContent.length > 0;

  return (
    <View style={{ marginHorizontal: hasPadding ? 15 : 0 }}>
      <Error error={error} />

      {loading ? (
        <Spinner />
      ) : content && teachers && scrollEnabled && hasFilteredContent ? (
        // If tabs and header need to be able to scroll up with the list
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredContent.map((item, idx) => (
            <>
              <Paragraph>First one</Paragraph>
              <ContentCard
                key={idx}
                content={item}
                teacher={teachers[item.teacher]}
              />
            </>
          ))}
        </ScrollView>
      ) : content && teachers && hasFilteredContent ? (
        filteredContent.map((item, idx) => (
          <ContentCard
            key={idx}
            content={item}
            teacher={teachers[item.teacher]}
          />
        ))
      ) : favorites ? (
        <ListEmpty>
          {translation['Tap the heart icon to favorite content']}
        </ListEmpty>
      ) : (
        <ListEmpty />
      )}
    </View>
  );
};

export default ContentLoop;
