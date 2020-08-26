import React, { ReactElement } from 'react';
import { ScrollView, FlatList } from 'react-native';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags } from 'services';
import ListEmpty from './ListEmpty';
import { Teachers } from 'types';
import Error from './Error';
import Paragraph from './Paragraph';

interface Props {
  filter?: Tags;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  header?: ReactElement;
  scrollEnabled?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  header,
  scrollEnabled,
}) => {
  const { content, teachers, contentError, teachersError } = useContent();

  let filteredContent: Content[] = content;

  if (filter && content) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.tags.includes(filter),
    );
  }

  if (favorites && content) {
    filteredContent = filteredContent.filter((item: Content) =>
      favorites.includes(item.id),
    );
  }

  if (teacher && content) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.teacher === teacher,
    );
  }

  if (search && content) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.title.includes(search),
    );
  }
  // useEffect(() => {}, [filter, teacher, favorites, search]);

  return contentError || teachersError ? (
    <>
      <Paragraph>Content Error</Paragraph>
      <Error error={contentError} />
      <Paragraph>Teacher Error</Paragraph>
      <Error error={teachersError} />
    </>
  ) : content && teachers && scrollEnabled ? (
    // If tabs and header need to be able to scroll up with the list
    <FlatList
      ListHeaderComponent={header}
      data={filteredContent}
      renderItem={({ item }) => (
        <ContentCard content={item} teacher={teachers[item.teacher]} />
      )}
    />
  ) : content && teachers ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      {filteredContent.map((item, idx) => (
        <ContentCard
          key={idx}
          content={item}
          teacher={teachers[item.teacher]}
        />
      ))}
    </ScrollView>
  ) : (
    <ListEmpty />
  );
};

export default ContentLoop;
