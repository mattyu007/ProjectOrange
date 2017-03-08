// @flow
import type { PromiseAction } from './types';
import type {Deck} from '../api/types';
import LibraryApi from '../api/Library';

async function loadLibrary(): PromiseAction {
  let library = await LibraryApi.fetchLibrary();
  let decks = [];
  for (let deckMetadata of library) {
  	let deck = await LibraryApi.fetchDeck(deckMetadata.uuid);
  	decks.push(deck);
  }
  return {
    type: 'LOADED_LIBRARY',
    decks,
  };
}

module.exports = { loadLibrary };
