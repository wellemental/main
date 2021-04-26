import { LoadMoreStateType } from '../initialStates/loadMoreState';
import { Action } from 'common';

export type ActionType =
  | Action<'LOAD-MORE'>
  | Action<
      'LOADED',
      {
        value: firebase.firestore.QuerySnapshot;
        limit: number;
      }
    >;

export const loadMoreReducer = (
  state: LoadMoreStateType,
  action: ActionType,
): LoadMoreStateType => {
  switch (action.type) {
    case 'LOADED': {
      const items = [...state.items];
      let isAdding = false;

      // Added conditional due to error upon signup
      !!action.value &&
        action.value.docChanges().forEach(change => {
          if (change.type === 'added') {
            isAdding = true;
            addItem(change.doc, items);
          } else if (change.type === 'modified') {
            updateItem(change.doc, items);
          } else if (change.type === 'removed') {
            deleteItem(change.doc, items);
          }
        });

      const nextLimit = items.length + action.limit;

      const end = items.length < action.limit || nextLimit === state.limit;

      return {
        ...state,
        hasMore: isAdding ? !end : state.hasMore,
        limit: nextLimit,
        loading: false,
        loadingError: null,
        lastLoaded: !action.value // Added conditional due to error upon signup
          ? null
          : action.value.docs[action.value.docs.length - 1],
        loadingMore: false,
        items,
      };
    }

    case 'LOAD-MORE': {
      return {
        ...state,
        loadingMore: true,
        after: state.lastLoaded,
      };
    }
  }
};

function findIndexOfDocument(
  doc: firebase.firestore.QueryDocumentSnapshot,
  items: firebase.firestore.DocumentData[],
) {
  return items.findIndex(item => {
    return item.id === doc.id;
  });
}

function updateItem(
  doc: firebase.firestore.QueryDocumentSnapshot,
  items: firebase.firestore.DocumentData[],
) {
  const i = findIndexOfDocument(doc, items);
  items[i] = doc;
}

function deleteItem(
  doc: firebase.firestore.QueryDocumentSnapshot,
  items: firebase.firestore.DocumentData[],
) {
  const i = findIndexOfDocument(doc, items);
  items.splice(i, 1);
}

function addItem(
  doc: firebase.firestore.QueryDocumentSnapshot,
  items: firebase.firestore.DocumentData[],
) {
  const i = findIndexOfDocument(doc, items);
  const newDoc = doc.data();
  const firstDoc = items[0] && items[0].data();

  // If document was added more recently, put at top
  // Use case is for new favs and plays during a user session
  if (firstDoc && i === -1 && newDoc.createdAt > firstDoc.createdAt) {
    items.unshift(doc);

    // Else add the doc to the end of the items
  } else if (i === -1) {
    items.push(doc);
  }
}
