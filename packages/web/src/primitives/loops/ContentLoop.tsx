import React, { useState } from 'react';
import ContentCard from '../cards/ContentCard';
import {
  useContent,
  useCurrentUser,
  useMediaQuery,
  useNavigation,
} from '../../hooks';
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
  Colors,
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
  seeAll?: boolean;
  recentDate?: boolean;
  sort?: Sortings;
  random?: 1 | 2; // Used to get two random items for featured modules
  color?: Colors;
}

const ContentLoop: React.FC<Props> = ({
  filter,
  favorites,
  search,
  teacher,
  small,
  limit,
  seeAll,
  type,
  sort,
  recentDate,
  random,
  color,
  ...props
}) => {
  const { language, translation } = useCurrentUser();
  const { content, error } = useContent();
  let filteredContent: Content[] = content;
  const [hasLangFilter, setLangFilter] = useState(true);
  const [sorting, setSort] = useState<Sortings | undefined>(sort);
  const defaultLimit = 8;
  const [theLimit, setLimit] = useState(limit ? limit : defaultLimit);
  const navigation = useNavigation();

  // Calculate if screen size is mobile
  const isSmall = useMediaQuery('(max-width:444px)');

  const filters: Filters = {};

  // Filter language
  if (hasLangFilter) {
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
          {seeAll ? (
            <Button
              size="small"
              fullWidth={true}
              text="See all"
              disableElevation={color === 'white'}
              style={{
                backgroundColor: 'rgba(0,0,0,0)',
              }}
              variant={color === 'white' ? 'contained' : 'text'}
              onPress={() =>
                navigation.navigate('Category', {
                  category: { title: 'New', tag: undefined },
                })
              }
            />
          ) : (
            filteredContent.length >= defaultLimit &&
            filteredContent.length > theLimit && (
              <Button
                fullWidth={true}
                variant="text"
                text="Load more"
                onPress={() => setLimit(theLimit + defaultLimit)}
              />
            )
          )}
        </>
      ) : favorites ? (
        <ListEmpty>Tap the heart icon to favorite content</ListEmpty>
      ) : (
        <>
          <ListEmpty />
          {hasLangFilter && (
            <TextBox>
              <Link color="secondary" onClick={() => setLangFilter(false)}>
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
