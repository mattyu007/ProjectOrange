// @flow

import type {Deck, DeckMetadata} from '../api/types';

export type Action =
	{ type: 'LOADED_LIBRARY', decks: Array<Deck> }
  |	{ type: 'LOADED_USERNAME', name: string }
  | { type: 'LOGGED_IN', data: { userId: string; accessToken: string; } }
  | { type: 'LOGGED_OUT' }
  | { type: 'SWITCH_TAB', tab: 'library' | 'discover' | 'search' }
  | { type: 'DECK_CREATED', deck: {} }
  | { type: 'DECK_DELETED', uuid: string }
	| { type: 'DECK_EDITED', change: {} }
  | { type: 'DECK_SYNCED', updatedDeck: Deck, change: {} }
	| { type: 'DECK_CONFLICT_RESOLVED', updatedDeck: Deck, change: {} }
  | { type: 'SHARE_CODE_GENERATED', uuid: string, code: string }
  | { type: 'SEARCHED_DECKS', searchResults: Array<DeckMetadata>, searchString: string }
  | { type: 'DISCOVERED_DECKS', newDecks: Array<DeckMetadata>, topDecks: Array<DeckMetadata> }
  | { type: 'CARD_FLAGGED', change: {uuid: string, cards:[{uuid:string, needs_review: Boolean, action: 'edit'}]} }
	| { type: 'DECK_ALREADY_IN_LIBRARY'}
	| { type: 'DECK_ADDED_TO_LIBRARY', addedDeck: Deck}
	| { type: 'CLEAR_INACCESSIBLE_DECKS'}
	| { type: 'DECK_RATED', change: {uuid: string, userRating: number}}
	;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
