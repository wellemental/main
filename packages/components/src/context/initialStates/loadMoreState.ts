// Pulled from 'firestore-pagination-hook' - https://github.com/bmcmahen/firestore-pagination-hook/blob/master/src/index.ts
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type LoadMoreStateType = {
  hasMore: boolean;
  items: FirebaseFirestoreTypes.DocumentData[];
  after: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
  lastLoaded: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
  loadingMore: boolean;
  loadMore: () => any; // Added this
  limit: number;
  loadingMoreError: null | Error;
  loading: boolean;
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
