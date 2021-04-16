import {
  Content,
  Sortings,
  Categories,
  Filter,
  Filters,
  Teachers,
} from '../types';

export const sortContent = (content: Content[], sort: Sortings): Content[] => {
  let filteredContent = [...content];

  // Items with priority field set go above those with no priority
  if (sort === 'priority') {
    console.log('PRIORITY SORT!!!');

    filteredContent = filteredContent.sort((a, b) => {
      console.log('AAAA', a.priority, 'BBBB', b.priority);
      return !a.priority
        ? 1
        : !b.priority
        ? -1
        : a.priority > b.priority
        ? 1
        : -1;
    });
  }

  return filteredContent;
};
