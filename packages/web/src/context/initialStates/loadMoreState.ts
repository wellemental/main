import firebase from '../../base';

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

export const initialState = {
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
