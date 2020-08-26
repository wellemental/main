import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
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
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
}) => {
  const { content, teachers, contentError, teachersError } = useContent();

  let filteredContent: Content[] = content;

  useEffect(() => {
    console.log('CONTENT', content, 'FILTERRRR', filter, teacher, favorites);

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
  }, [filter, teacher, favorites, search]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {contentError || teachersError ? (
        <>
          <Paragraph>Content Error</Paragraph>
          <Error error={contentError} />
          <Paragraph>Teacher Error</Paragraph>
          <Error error={teachersError} />
        </>
      ) : content && teachers ? (
        filteredContent.map((item, idx) => (
          <ContentCard
            key={idx}
            content={item}
            teacher={teachers[item.teacher]}
          />
        ))
      ) : (
        <ListEmpty />
      )}
    </ScrollView>
  );
};

export default ContentLoop;
