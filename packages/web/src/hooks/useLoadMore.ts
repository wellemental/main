// Pulled from 'firestore-pagination-hook' - https://github.com/bmcmahen/firestore-pagination-hook/blob/master/src/index.ts
import { useReducer, useEffect } from 'react';
import firebase from '../base';

export type LoadMoreStateType = {
  hasMore: boolean;
  items: firebase.firestore.DocumentData[];
  after: firebase.firestore.QueryDocumentSnapshot | null;
  lastLoaded: firebase.firestore.QueryDocumentSnapshot | null;
  loadingMore: boolean;
  limit: number;
  loadingMoreError: null | Error;
  loading: boolean;
  loadMore: () => any; // added this
  loadingError: null | Error;
};

const dummyLoadMore = () => {
  return null;
};

const initialState = {
  hasMore: false,
  after: null,
  limit: 0,
  items: [],
  lastLoaded: null,
  loading: true,
  loadingError: null,
  loadingMore: false,
  loadingMoreError: null,
  loadMore: dummyLoadMore,
};

export const loadMoreInitialState = initialState;

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export type ActionType =
  | Action<'LOAD-MORE'>
  | Action<
      'LOADED',
      {
        value: firebase.firestore.QuerySnapshot;
        limit: number;
      }
    >;

function reducer(
  state: LoadMoreStateType,
  action: ActionType,
): LoadMoreStateType {
  switch (action.type) {
    case 'LOADED': {
      const items = [...state.items];
      let isAdding = false;

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
        lastLoaded: action.value.docs[action.value.docs.length - 1],
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
}

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
  console.log('DELETING ITEM!!!');
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
    console.log('ADDING TO TOP!!!');
    items.unshift(doc);

    // Else add the doc to the end of the items
  } else if (i === -1) {
    console.log('ADDING TO BOTTOM!!!');
    items.push(doc);
  }
}

interface PaginationOptions {
  // how many documents should we fetch at a time?
  limit?: number;
}

const useLoadMore = (
  query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  { limit = 10 }: PaginationOptions = {},
): LoadMoreStateType => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // when "after" changes, we update our query
  useEffect(() => {
    if (query) {
      const fn = query.limit(state.limit || limit);

      const unsubscribe = fn.onSnapshot(snap => {
        dispatch({ type: 'LOADED', value: snap, limit });
      });

      return unsubscribe;
    }
  }, [state.after]);

  // trigger firebase to load more
  const loadMore = (): void => {
    dispatch({ type: 'LOAD-MORE' });
  };

  return {
    loadingMore: state.loadingMore,
    loadingError: state.loadingError,
    loadingMoreError: state.loadingMoreError,
    loading: state.loading,
    hasMore: state.hasMore,
    items: state.items,
    after: state.after,
    lastLoaded: state.lastLoaded,
    limit: state.limit,
    // @ts-ignore
    loadMore,
  };
};

export default useLoadMore;
