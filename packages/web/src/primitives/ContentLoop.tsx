import React from 'react';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags, Categories, TimeOfDay, Teachers } from '../types';
import ListEmpty from './ListEmpty';
import Error from './Error';
import Paragraph from './Paragraph';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface Props {
  filter?: Tags | TimeOfDay | Categories | string;
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
  let filteredContent: Content[] | null = content;

  // Filter by language
  if (user && user.language && filteredContent && favorites === undefined) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.language === user.language,
    );
  }

  // Filter by tag or category
  if (filter && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) => {
      if (item && item.tags) {
        return item.tags.includes(filter.toLowerCase() as Tags);
      }
      return;
    });
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
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  const hasFilteredContent = filteredContent && filteredContent.length > 0;

  return (
    <div>
      <Error error={error} />

      {content &&
      teachers &&
      scrollEnabled &&
      hasFilteredContent &&
      filteredContent ? (
        // If tabs and header need to be able to scroll up with the list
        <>
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
        </>
      ) : content && teachers && hasFilteredContent && filteredContent ? (
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
    </div>
  );
};

export default ContentLoop;
