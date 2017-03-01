// @flow
import type { PromiseAction } from './types';
import LibraryApi from '../api/Library';

async function loadLibrary(state): PromiseAction {
  let library = await LibraryApi.fetchLibrary(state);
  return {
    type: 'LOADED_LIBRARY',
    library,
  };
}

module.exports = { loadLibrary };