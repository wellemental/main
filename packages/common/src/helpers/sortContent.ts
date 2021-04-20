import { Content, Sortings } from '../types';

export const sortContent = (content: Content[], sort: Sortings): Content[] => {
  let filteredContent = [...content];
  const sortAbove = -1;
  const sortBelow = 1;

  // Items with priority field set go above those with no priority
  if (sort === 'priority') {
    filteredContent = filteredContent.sort((a, b) => {
      return !a.priority
        ? sortBelow
        : !b.priority
        ? sortAbove
        : a.priority > b.priority
        ? sortBelow
        : sortAbove;
    });
  } else if (sort === 'mostFavorited') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.totalFavorites > b.totalFavorites ? sortAbove : sortBelow;
    });
  } else if (sort === 'popular') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.totalPlays > b.totalPlays ? sortAbove : sortBelow;
    });
  } else if (sort === 'shortest') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.length < b.length ? sortAbove : sortBelow;
    });
  } else if (sort === 'longest') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.length > b.length ? sortAbove : sortBelow;
    });
  } else if (sort === 'alphabetical') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.title < b.title ? sortAbove : sortBelow;
    });
  } else if (sort === 'alphabeticalReverse') {
    filteredContent = filteredContent.sort((a, b) => {
      return a.title > b.title ? sortAbove : sortBelow;
    });
  }

  return filteredContent;
};
