import React, { useState } from 'react';
import ContentCard from '../cards/ContentCard';
import { useContent, useCurrentUser, useMediaQuery } from '../../hooks';
import { Content, Tags, Categories, TimeOfDay, Teachers } from 'common';
import ListEmpty from '../typography/ListEmpty';
import Error from '../typography/Error';
import Link from '@material-ui/core/Link';

interface Props {
  filter?: Tags | TimeOfDay | Categories | string;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  scrollEnabled?: boolean;
  hasPadding?: boolean; // Apply horizontal margin for Library screen bc of tabs full width requirement
  small?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  scrollEnabled,
  hasPadding,
  small,
}) => {
  const { user, translation } = useCurrentUser();
  const { content, error } = useContent();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const [isLangFilter, setLangFilter] = useState(true);

  // Calculate if
  const isSmall = useMediaQuery('(max-width:444px)');

  // Filter by language
  if (
    isLangFilter &&
    user &&
    user.language &&
    filteredContent &&
    favorites === undefined
  ) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.language === user.language,
    );
  }

  // Filter by tag or category
  if (!!filter && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) => {
      if (item && item.tags) {
        return item.tags.includes(filter.toLowerCase() as Tags);
      }
      return item;
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
      (item: Content) => item.teacher.name === teacher,
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
    <>
      <Error error={error} />

      {content && hasFilteredContent && filteredContent ? (
        filteredContent.map((item, idx) => (
          <ContentCard small={small || isSmall} key={idx} content={item} />
        ))
      ) : favorites ? (
        <ListEmpty>
          {translation['Tap the heart icon to favorite content']}
        </ListEmpty>
      ) : (
        <>
          <ListEmpty />
          {isLangFilter && (
            <Link color="secondary" onClick={() => setLangFilter(false)}>
              {translation['See all languages']} ›
            </Link>
          )}
        </>
      )}
    </>
  );
};

export default ContentLoop;
