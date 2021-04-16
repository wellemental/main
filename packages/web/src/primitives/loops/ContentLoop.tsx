import React, { useState } from 'react';
import ContentCard from '../cards/ContentCard';
import { useContent, useCurrentUser, useMediaQuery } from '../../hooks';
import {
  Content,
  Sortings,
  Categories,
  Filter,
  Filters,
  Teachers,
  filterContent,
  sortContent,
  convertTimestamp,
  getTwoRandomInt,
  getRandomInt,
} from 'common';
import ListEmpty from '../typography/ListEmpty';
import TextBox from '../utils/TextBox';
import Error from '../typography/Error';
import Link from '@material-ui/core/Link';
import Button from '../buttons/Button';
interface Props {
  filter?: Filter;
  type?: Categories;
  favorites?: string[];
  search?: string;
  teacher?: Teachers;
  small?: boolean;
  limit?: number;
  noLoadMore?: boolean;
  recentDate?: boolean;
  sort?: Sortings;
  random?: 1 | 2; // Used to get two random items for featured modules
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  small,
  limit,
  noLoadMore,
  type,
  sort,
  recentDate,
  random,
  ...props
}) => {
  const { language, translation } = useCurrentUser();
  const { content, error, dispatch } = useContent();
  let filteredContent: Content[] = content;
  const [hasLangFilter, setLangFilter] = useState(true);
  const [sorting, setSort] = useState<Sortings | undefined>(sort);
  const defaultLimit = 8;
  const [theLimit, setLimit] = useState(limit ? limit : defaultLimit);

  // Calculate if screen size is mobile
  const isSmall = useMediaQuery('(max-width:444px)');

  const filters: Filters = {};

  // Filter language
  if (hasLangFilter) {
    console.log('FILTERING LANGUAGE', language);
    filters.language = language;
  }

  // Filter types
  if (type) {
    filters.type = type;
  }

  // Filter by tag or category
  if (filter) {
    filters.tags = [filter];
  }

  // Filter by teacher name
  if (teacher) {
    filters.teacher = teacher;
  }

  // Filter by search term
  if (search) {
    filters.search = search;
  }

  filteredContent = filterContent(content, filters);

  // Filter by favorites
  if (favorites && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      favorites.includes(item.id),
    );
  }

  // Sort - defaults to 'priority' which falls back to most recent
  if (sorting) {
    filteredContent = sortContent(filteredContent, sorting);
  }

  // Get 1 or 2 random items from the contentArr
  // Used for featured loops
  if (random && filteredContent.length > random) {
    // Use diff function for getting 1 or 2 random items
    if (random === 2) {
      filteredContent = getTwoRandomInt(filteredContent.length).map(
        (idx: number) => filteredContent[idx],
      );
    } else {
      filteredContent = [filteredContent[getRandomInt(filteredContent.length)]];
    }
  }

  // Check to see if there's any content
  const hasFilteredContent = filteredContent && filteredContent.length > 0;

  return (
    <>
      <Error error={error} />

      {content && hasFilteredContent && filteredContent ? (
        <>
          {filteredContent.slice(0, theLimit).map((item, idx) => (
            <ContentCard
              small={small || isSmall}
              key={idx}
              content={item}
              recentDate={
                recentDate
                  ? convertTimestamp(item.created_at).format('MMM DD, YYYY')
                  : undefined
              }
            />
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
        <ListEmpty>Tap the heart icon to favorite content</ListEmpty>
      ) : (
        <>
          <ListEmpty />
          {hasLangFilter && (
            <TextBox>
              <Link
                color="secondary"
                onClick={() => setLangFilter(false)}
                // onClick={() => dispatch({ type: 'REMOVE_FILTER_LANGUAGE' })}
              >
                {translation['See all languages']} ›
              </Link>
            </TextBox>
          )}
        </>
      )}
    </>
  );
};

export default ContentLoop;
