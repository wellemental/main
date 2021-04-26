import {
  DocumentData,
  Content,
  ContentObj,
  Favorite,
  PlayEvent,
} from '../types';

export const matchContent = (
  items: DocumentData[],
  content: ContentObj,
  history?: boolean,
): Content[] => {
  const arr: Content[] = [];

  // Match the contentId of the doc with existing content
  items.forEach((theItem: DocumentData) => {
    const data = theItem.data() as Favorite | PlayEvent;
    const match = content[data.contentId];

    if (!!match) {
      // If history, change createdAt to be when it was played by the user so we can display it on the front-end
      if (history) {
        match.created_at = data.createdAt;
      }

      arr.push(match);
    }
  });

  return arr;
};
