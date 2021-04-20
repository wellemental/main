import { Feature, ContentObj, Content } from 'common';
import {
  LoadMoreStateType,
  initialState as loadMoreInitialState,
} from './loadMoreState';

export type ContentStateType = {
  loading: boolean;
  error: string | null;
  allContent: ContentObj;
  features: Feature[];
  content: Content[];
  favorites: Content[];
  favsMore: LoadMoreStateType;
  history: Content[];
  historyMore: LoadMoreStateType;
  getDbContent: () => void;
};

export const initialState = {
  loading: true,
  error: null,
  allContent: {},
  features: [],
  content: [],
  favorites: [],
  favsMore: loadMoreInitialState,
  history: [],
  historyMore: loadMoreInitialState,
  getDbContent: null,
};
