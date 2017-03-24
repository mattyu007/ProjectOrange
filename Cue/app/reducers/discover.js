// @flow

import type {Action} from '../actions/types';
import type {DeckMetadata} from '../api/types';

export type State = {
  searchString: string;
  searchResults: ?Array<DeckMetadata>;
  topDecks: ?Array<DeckMetadata>;
  newDecks: ?Array<DeckMetadata>;
};

const initialState: State = {
  searchString: '',
  searchResults: null,
  topDecks: null,
  newDecks: null
};

function discover(state: State = initialState , action: Action): State {
  let searchString = state.searchString;
  let searchResults = state.searchResults;
  let topDecks = state.topDecks;
  let newDecks = state.newDecks;

  if (action.type === "SEARCHED_DECKS") {
    searchString = action.searchString;
    searchResults = action.searchResults;
  } else if (action.type === "DISCOVERED_DECKS") {
    topDecks = action.topDecks;
    newDecks = action.newDecks;
  }

  return {
    searchString,
    searchResults,
    topDecks,
    newDecks,
  };
}


module.exports = discover;
