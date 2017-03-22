// @flow

import type {Deck} from '../api/types';

export type Action =
	{ type: 'LOADED_LIBRARY', decks: Array<Deck> }
  |	{ type: 'LOADED_USERNAME', name: string }
  | { type: 'LOGGED_IN', data: { userId: string; accessToken: string; } }
  | { type: 'LOGGED_OUT' }
  | { type: 'SWITCH_TAB', tab: 'library' | 'discover' | 'search' }
  | { type: 'DECK_CREATED', deck: {} }
  | { type: 'DECK_DELETED', uuid: string }
  | { type: 'DECK_SYNCED', serverDeck: Deck, change: {} }
  | { type: 'DECK_EDITED', change: {} }
  | { type: 'SHARE_CODE_GENERATED', uuid: string, code: string }
  | { type: 'DECK_CONFLICT_RESOLVED', updatedDeck: Deck}
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
