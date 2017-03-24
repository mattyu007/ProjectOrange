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

function editDeck(change) : Action {
  return {
    type: 'DECK_EDITED',
    change
  }
}

function recordShareCode(uuid: string, shareCode: string): Action {
  return {
    type: 'SHARE_CODE_GENERATED',
    uuid,
    code: shareCode,
  }
}

function flagCard(deckUuid: string, cardUuid: string, needs_review: Boolean): Action {
  let change = {
    uuid: deckUuid,
    cards: [{uuid: cardUuid, needs_review, action: 'edit'}]
  }
  return {
    type: 'CARD_FLAGGED',
    change
  }
}

async function resolveConflict(useServerDeck: Boolean, localDeck: Deck) : PromiseAction {
  let updatedDeck
  if (useServerDeck)
    updatedDeck = await LibraryApi.fetchDeck(localDeck.uuid)
  else
    updatedDeck = await LibraryApi.overwriteDeck(localDeck)

  return {
    type: 'DECK_CONFLICT_RESOLVED',
    updatedDeck,
  }
}

//attempts to sync each deck once, returns list of failed syncs
function syncLibrary(localChanges): ThunkAction {
  return (dispatch, getState) => {
    let failedSyncs = []
    let promises = []
    localChanges.forEach(change =>{
      promises.push(dispatch(syncDeck(change))
        .catch(e => {
          if (e.response && e.response.status === 409)  // Sync conflict
            failedSyncs.push(change)
          else // Network error
            throw e
        }))
    })
    return Promise.all(promises).then(() => {
      console.info('failed syncs:  ', failedSyncs)
      return failedSyncs;
    })
  };
}

// change should only contain changes in the deck to avoid sending excess data
// ex: { uuid: string, action: 'add', name: string } if a deck was added
// ex: { uuid: string, action: 'edit', cards: [{action: 'edit', uuid: string, front: "fox", back: "20XX"}] } if 1 card in deck was changed
async function syncDeck(change) : PromiseAction {
  let serverDeck = {}
  if (change.action === "add") {
    serverDeck = await LibraryApi.createDeck(change.name, change.tags);
    // check if any other changes need to be synced
    for (let key in change) {
      if((key === 'cards' && change.cards.length) || (change[key] != serverDeck[key] && !key.match("^(?:cards|uuid|action)$"))) {
        serverDeck = await LibraryApi.editDeck({
          ...change,
          uuid: serverDeck.uuid,
          parent_deck_version: serverDeck.user_data_version,
          parent_user_data_version: serverDeck.deck_version})
        break
      }
    }
  } else if (change.action === "edit") {
    serverDeck = await LibraryApi.editDeck(change)
  } else if (change.action === "delete") {
    await LibraryApi.deleteDeck(change.uuid)
  } else if (change.action === "flag") {
    let response = await LibraryApi.flagCard(change)
    change = {...change, user_data_version: response.user_data_version}
  }
  return {
    type: 'DECK_SYNCED',
    serverDeck,
    change
  }
}

async function addLibrary(uuid: string, shareCode?: string): PromiseAction {
  try {
    await LibraryApi.addDeckToLibrary(uuid, shareCode);
  } catch (e) {
    return {
      type: 'DECK_ALREADY_IN_LIBRARY'
    }
  }

  let addedDeck = await LibraryApi.fetchDeck(uuid);

  return {
    type: 'DECK_ADDED_TO_LIBRARY',
    addedDeck,
  };
}

function clearInaccessibleDecks(): Action {
  return {
    type: 'CLEAR_INACCESSIBLE_DECKS'
  }
}

function copyDeck(localDeck: Deck) : Action {
  let newCards = localDeck.cards.map(card => {
    return {...card, action: 'add', uuid: uuidV4()}
  })

  let deck = {
    name: localDeck.name,
    uuid: uuidV4(),
    public: false,
    cards: newCards,
    owner: CueApi.userId,
    accession: 'private',
  }
  return {
    type: 'DECK_CREATED',
    deck,
  }
}

module.exports = {
  loadLibrary, createDeck, deleteDeck, editDeck, recordShareCode, resolveConflict,
  syncDeck, syncLibrary, addLibrary, clearInaccessibleDecks, copyDeck, flagCard
};
