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
    change,
  }
}

function rateDeck(uuid: string, user_rating: number): Action {
  let change = {
    uuid,
    user_rating
  }
  return {
    type: 'DECK_RATED',
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
          else // Network or server error
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
// ex: { uuid: string, action: 'add', name: string, cards:Array<Card> } if a deck was added
// ex: { uuid: string, action: 'edit', cards: [{action: 'edit', uuid: string, front: "fox", back: "20XX"}] } if 1 card in deck was changed
async function syncDeck(change) : PromiseAction {
  let serverDeck = {}
  if (change.action === "add") {
    serverDeck = await LibraryApi.createDeck(change.name, change.tags, change.cards);
    // check if any other changes need to be synced
    for (let key in change) {
      if (change[key] !== serverDeck[key]
          // Server deck uses 0 instead of a real boolean
          && (key === 'public' ? Boolean(change[key]) !== Boolean(serverDeck[key]) : true)
          && !key.match("^(?:cards|uuid|action|tags)$")) {
        console.info(`Performing post-add edit due to extra edit on key: ${key}`
          + ` (change: ${change[key]}, server: ${serverDeck[key]})`)
        serverDeck = await LibraryApi.editDeck({
          ...change,
          // Don't re-sync properties handled by createDeck
          name: undefined,
          tags: undefined,
          cards: undefined,
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
  } else if (change.action === "rate") {
    await LibraryApi.rateDeck(change.uuid, change.user_rating)
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
    name: 'Copy of ' + localDeck.name,
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
  syncDeck, syncLibrary, addLibrary, clearInaccessibleDecks, copyDeck, flagCard, rateDeck
};
