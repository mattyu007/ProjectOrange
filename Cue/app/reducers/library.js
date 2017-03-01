// @flow

import type {Action} from '../actions/types';
import type {Deck} from '../api/types';

export type State = {
  decks: Array<Deck>;
};

const initialState: State = { 
  decks: null,
};

// if state.decks is null then library hasn't loaded yet
// if state.decks size is 0, then library is empty
function library(state: State = initialState , action: Action): State {
  switch (action.type) {
    case 'LOADED_LIBRARY':
      return {
        decks:action.library,
      };
  }
  return state;
}


module.exports = library;
