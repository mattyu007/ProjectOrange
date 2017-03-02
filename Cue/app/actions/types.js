// @flow

import type {Deck} from '../api/types';

export type Action =
	{ type: 'LOADED_LIBRARY', decks: Array<Deck> }
  |	{ type: 'LOADED_USERNAME', name: string }
  | { type: 'LOGGED_IN', data: { userId: string; accessToken: string; } }
  | { type: 'LOGGED_OUT' }
  | { type: 'SWITCH_TAB', tab: 'library' | 'discover' | 'search' }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
