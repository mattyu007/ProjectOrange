// @flow
import type { PromiseAction } from './types';
import type {Deck} from '../api/types';
import DiscoverApi from '../api/Discover';

async function searchDecks(searchString : string): PromiseAction {

  let searchResults = await DiscoverApi.searchDecks(searchString);

  return {
    type: 'SEARCHED_DECKS',
    searchString: searchString,
    searchResults: searchResults,
  };
}

module.exports = { searchDecks };
