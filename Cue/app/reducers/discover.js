// @flow

import type {Action} from '../actions/types';
import type {DeckMetadata} from '../api/types';

export type State = {
  searchString: string;
  searchResults: ?Array<DeckMetadata>;
};

const initialState: State = {
  searchString: '',
  searchResults: null,
};

function discover(state: State = initialState , action: Action): State {

  switch (action.type) {
    case 'SEARCHED_DECKS':
      return {
        searchString: action.searchString,
        searchResults: action.searchResults,
      };
  }
  return state;
}


module.exports = discover;
