// Pulled from 'firestore-pagination-hook' - https://github.com/bmcmahen/firestore-pagination-hook/blob/master/src/index.ts
import { useReducer, useEffect } from 'react';
import firebase from '../base';
import {
  LoadMoreStateType,
  initialState,
} from '../context/initialStates/loadMoreState';
import { loadMoreReducer } from '../context/reducers/loadMoreReducer';

export const loadMoreInitialState = initialState;

interface PaginationOptions {
  // how many documents should we fetch at a time?
  limit?: number;
}

const useLoadMore = (
  query: firebase.firestore.Query<firebase.firestore.DocumentData>,
  { limit = 10 }: PaginationOptions = {},
): LoadMoreStateType => {
  const [state, dispatch] = useReducer(loadMoreReducer, initialState);

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
