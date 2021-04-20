import { Content, Filters } from '../types';

export const filterContent = (
  content: Content[],
  filters: Filters,
  limit?: number,
): Content[] => {
  let filteredContent = [...content];

  if (!!filters.language) {
    filteredContent = filteredContent.filter((item: Content) =>
      // If no language param, then just return everything
      filters.language ? item.language === filters.language : item,
    );
  }

  // Filter by content type
  if (!!filters.type) {
    filteredContent = filteredContent.filter(
      item => item.type === filters.type,
    );
  }

  // Filter the content for each tag in the array
  if (!!filters.tags) {
    filters.tags.forEach(
      tag =>
        (filteredContent = filteredContent.filter(item =>
          item.tags.includes(tag),
        )),
    );
  }

  // Filter by teacher name
  if (!!filters.teacher) {
    filteredContent = filteredContent.filter(
      (item: Content) => item.teacher.name === filters.teacher,
    );
  }

  // Filter by search term
  if (!!filters.search) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.title.toLowerCase().includes(filters.search.toLowerCase()),
    );
  }

  return filteredContent;
};
