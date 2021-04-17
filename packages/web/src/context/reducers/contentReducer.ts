import {
  Feature,
  ContentObj,
  Content,
  Action,
  Languages,
  matchContent,
} from 'common';
import { LoadMoreStateType } from '../initialStates/loadMoreState';

export type StateType = {
  loading: boolean;
  error: string | null;
  allContent: ContentObj;
  features: Feature[];
  content: Content[];
  favorites: Content[];
  favsMore: LoadMoreStateType;
  history: Content[];
  historyMore: LoadMoreStateType;
};

export type ActionType =
  //   | Action<'LOAD-MORE'>
  | Action<
      'LOADED',
      {
        value: ContentObj;
        language: Languages;
      }
    >
  | Action<
      'LOADED_FEATURES',
      {
        value: Feature[];
      }
    >
  | Action<
      'UPDATE_HISTORY',
      {
        value: LoadMoreStateType;
      }
    >
  | Action<
      'UPDATE_FAVS',
      {
        value: LoadMoreStateType;
      }
    >;

export const contentReducer = (
  state: StateType,
  action: ActionType,
): StateType => {
  const contentArr = Object.values(state.allContent);

  switch (action.type) {
    case 'LOADED': {
      const contentObj = action.value;
      const filtered = Object.values(contentObj);

      return {
        ...state,
        allContent: contentObj,
        content: filtered,
        loading: false,
      };
    }
    case 'LOADED_FEATURES': {
      return { ...state, features: action.value };
    }
    case 'UPDATE_HISTORY': {
      const history = matchContent(action.value.items, state.allContent, true);

      return { ...state, history, historyMore: action.value };
    }
    case 'UPDATE_FAVS': {
      const favorites = matchContent(action.value.items, state.allContent);
      return { ...state, favorites, favsMore: action.value };
    }
    // case 'FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr, action.language) };
    // }
    // case 'REMOVE_FILTER_LANGUAGE': {
    //   return { ...state, content: filterLanguage(contentArr) };
    // }
  }
};
