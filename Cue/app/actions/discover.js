// @flow
import type { PromiseAction } from './types';
import type {Deck, DeckMetadata} from '../api/types';
import DiscoverApi from '../api/Discover';

async function searchDecks(searchString : string): PromiseAction {

  let searchResults = await DiscoverApi.searchDecks(searchString);

  return {
    type: 'SEARCHED_DECKS',
    searchString: searchString,
    searchResults: searchResults,
  };
}

async function discoverDecks(): PromiseAction {

  let promises : Array<Promise<Array<Deck>>> = []

  promises.push(DiscoverApi.fetchNew());
  promises.push(DiscoverApi.fetchTop());

  let collections = await Promise.all(promises);

  return {
    type: 'DISCOVERED_DECKS',
    newDecks: collections[0],
    topDecks: collections[1],
  };
}

module.exports = { searchDecks, discoverDecks };
