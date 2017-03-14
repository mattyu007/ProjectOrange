// @flow
import type { Action, PromiseAction, ThunkAction } from './types';
import type {Deck} from '../api/types';
import LibraryApi from '../api/Library';
import CueApi from '../api/CueApi'
import uuidV4 from 'uuid/v4'

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

function deleteDeck(uuid: string) : Action {
  return {
    type: 'DECK_DELETED',
    uuid
  }
}

function createDeck(name: string) : Action {
  let deck = {
    name,
    uuid: uuidV4(),
    public: false,
    cards: [],
    owner: CueApi.userId,
    accession: 'private',
  }
  return {
    type: 'DECK_CREATED',
    deck,
  }
}

function editDeck(deck) : Action {
  return {
    type: 'DECK_EDITED',
    deck
  }
}

//attempts to sync each deck once, returns list of failed syncs
function syncLibrary(localChanges): ThunkAction {
  let failedSyncs = []
  return (dispatch, getState) => {
    let promises = []
    localChanges.forEach(change =>{
      promises.push(dispatch(syncDeck(change))
        .catch(e => {
          console.info('sync failed : ', change)
          failedSyncs.push(change)
        }))
    })
    Promise.all(promises).then(() => {
      if (failedSyncs.length == 0) dispatch(loadLibrary())
    })
    console.log('failed syncs:  ', failedSyncs)
    return failedSyncs
  };
}

// deck should only contain changes in the deck to avoid sending excess data
// ex: { uuid: string, action 'add', name: string } if a deck was added
// ex: { uuid: string, action 'edit', cards: [{action: 'edit', card-id: string, front: "fox"}] } if 1 card in deck was changed
async function syncDeck(change) : PromiseAction {
  let serverDeck
  try {
    if (change.action == "add"){
      serverDeck = await LibraryApi.createDeck(change.name, change.tags, change.cards);
      // TODO: if you edit an added deck, the action will remain 'add',
      // so need to determine if extra changes need to be synced as well
    } else if (change.action == "edit") {
      serverDeck = await LibraryApi.editDeck(change)
    } else if (change.action == "delete") {
      await LibraryApi.deleteDeck(change.uuid)
    }
  } catch (e) {
    //TODO: handle no connection and conflict
    console.warn(e)
    throw e
  }
  return {
    type: 'DECK_SYNCED',
    serverDeck,
    change
  }
}

module.exports = { loadLibrary, createDeck, deleteDeck, editDeck, syncDeck, syncLibrary };
