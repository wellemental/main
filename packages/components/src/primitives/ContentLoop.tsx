import React from 'react';
import { View, ScrollView } from 'react-native';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags, Categories, TimeOfDay } from 'services';
import ListEmpty from './ListEmpty';
import { Teachers } from 'services';
import Error from './Error';
import Paragraph from './Paragraph';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface Props {
  filter?: Tags | TimeOfDay | Categories;
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
  const { content, teachers, error } = useContent();

  let filteredContent: Content[] = content;

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

      {content && teachers && scrollEnabled && hasFilteredContent ? (
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
      {/* <Paragraph>
        Language: {user && user.language ? user.language : 'N/A'}
      </Paragraph>
      <Paragraph>Content Loading? {loading.toString()}</Paragraph>
      <Paragraph>Remote Config Loading? {rcLoading.toString()}</Paragraph>
      <Paragraph>Got Content? {content && !!content.toString()}</Paragraph>
      <Paragraph>Got Teachers? {content && !!content.toString()}</Paragraph>
      {filter && <Paragraph>Filter: {filter}</Paragraph>}
      {favorites && <Paragraph>Favs!</Paragraph>}
      {teacher && <Paragraph>Teacher: {teacher}</Paragraph>} */}
      {/* {search && <Paragraph>Search: {search}</Paragraph>} */}
      {/* <Paragraph>Status***</Paragraph> */}
      {/* {status &&
        status.map((item, idx) => (
          <Paragraph note key={idx + item}>
            *** {item}
          </Paragraph>
        ))} */}
    </View>
  );
};

export default ContentLoop;
