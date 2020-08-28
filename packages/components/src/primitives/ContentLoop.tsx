import React from 'react';
import { ScrollView } from 'react-native';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags, Categories, TimeOfDay } from 'services';
import ListEmpty from './ListEmpty';
import { Teachers } from 'types';
import Error from './Error';
import Paragraph from './Paragraph';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface Props {
  filter?: Tags | TimeOfDay | Categories;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  scrollEnabled?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  scrollEnabled,
}) => {
  const { user } = useCurrentUser();
  const { content, teachers, contentError, teachersError } = useContent();

  let filteredContent: Content[] = content.filter(
    (item: Content) => item.language !== user.language,
  );

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

  return contentError || teachersError ? (
    <>
      <Paragraph>Content Error</Paragraph>
      <Error error={contentError} />
      <Paragraph>Teacher Error</Paragraph>
      <Error error={teachersError} />
    </>
  ) : content && teachers && scrollEnabled ? (
    // If tabs and header need to be able to scroll up with the list
    <ScrollView showsVerticalScrollIndicator={false}>
      {filteredContent.map((item, idx) => (
        <ContentCard
          key={idx}
          content={item}
          teacher={teachers[item.teacher]}
        />
      ))}
    </ScrollView>
  ) : content && teachers ? (
    filteredContent.map((item, idx) => (
      <ContentCard key={idx} content={item} teacher={teachers[item.teacher]} />
    ))
  ) : (
    <ListEmpty />
  );
};

export default ContentLoop;
