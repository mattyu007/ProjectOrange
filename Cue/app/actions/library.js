// @flow
import type { PromiseAction } from './types';
import type {Deck} from '../api/types';
import LibraryApi from '../api/Library';

async function loadLibrary(): PromiseAction {
  let library = await LibraryApi.fetchLibrary();
  let promises : Array<Promise<Deck>> = []

  for (let deckMetadata of library) {
  	promises.push(LibraryApi.fetchDeck(deckMetadata.uuid));
  }
  let decks = await Promise.all(promises);
  return {
    type: 'LOADED_LIBRARY',
    decks,
  };
}

module.exports = { loadLibrary };
