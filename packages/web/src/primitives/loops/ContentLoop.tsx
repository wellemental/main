import React, { useState } from 'react';
import ContentCard from '../cards/ContentCard';
import { useContent, useCurrentUser, useMediaQuery } from '../../hooks';
import { Content, Tags, Categories, TimeOfDay, Teachers } from 'common';
import ListEmpty from '../typography/ListEmpty';
import Error from '../typography/Error';
import Link from '@material-ui/core/Link';
import Button from '../buttons/Button';
import { Box } from '../utils';
interface Props {
  filter?: Tags | TimeOfDay | Categories | string;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  small?: boolean;
  limit?: number;
  noLoadMore?: boolean;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  small,
  limit,
  noLoadMore,
}) => {
  const { user, translation } = useCurrentUser();
  const { content, error } = useContent();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const [isLangFilter, setLangFilter] = useState(true);
  const defaultLimit = 8;
  const [theLimit, setLimit] = useState(limit ? limit : defaultLimit);

  // Calculate if screen size is mobile
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
        <>
          {filteredContent.slice(0, theLimit).map((item, idx) => (
            <ContentCard small={small || isSmall} key={idx} content={item} />
          ))}
          {!noLoadMore &&
            filteredContent.length >= defaultLimit &&
            filteredContent.length > theLimit && (
              <Button
                fullWidth={true}
                variant="text"
                text="Load more"
                onPress={() => setLimit(theLimit + defaultLimit)}
              />
            )}
        </>
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
