import React from 'react';
import ContentCard from './ContentCard';
import { useContent } from '../hooks';
import { Content, Tags } from 'services';
import ListEmpty from './ListEmpty';

interface Props {
  filter?: Tags;
  favorites?: string[];
  search?: string;
}

const ContentLoop: React.FC<Props> = ({ filter, favorites, search }) => {
  const { content, teachers } = useContent();
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

  if (search && content) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.title.includes(search),
    );
  }

  return (
    <>
      {content && teachers ? (
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
    </>
  );
};

export default ContentLoop;
