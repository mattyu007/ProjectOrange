// @flow

import type { Action } from '../actions/types';
import type { Deck } from '../api/types';

export type State = {
  decks: ?Array<Deck>;
  localChanges: [];
};

const initialState: State = {
  decks: null,
  localChanges: [],
};

// if state.decks is null then library hasn't loaded yet
// if state.decks size is 0, then library is empty
function library(state: State = initialState, action: Action): State {
  let decks: Array<Deck> = state.decks == null ? [] : state.decks.slice()
  let localChanges = state.localChanges.slice()
  if (action.type == 'LOADED_LIBRARY') {
    decks = action.decks

  } else if (action.type == 'DECK_CREATED') {
    decks.push(action.deck)
    localChanges.push({...action.deck, action: "add"})

  } else if (action.type == 'DECK_DELETED') {
    let uuid = action.uuid
    decks.find( (deck, i) => {
      if (deck.uuid == uuid)
        return decks.splice(i,1)
    })
    if (!localChanges.find( (localChange, i) => {
      if (localChange.uuid == uuid && localChange.action == 'add')
        return localChanges.splice(i,1)
    })) {
      localChanges.push({uuid, action: 'delete'})
    }

  } else if (action.type == 'DECK_EDITED') {
    let editedDeck = action.deck
    decks.find( (deck, i) => {
      if (deck.uuid == editedDeck.uuid)
        return decks[i] = { ...deck, editedDeck }
    })
    if (!localChanges.find( (deck, i) => {
      if (deck.uuid == editedDeck.uuid)
        return localChanges[i] = { ...deck, editedDeck }
    })) {
      localChanges.push({editedDeck, action: 'edit'})
    }

  } else if (action.type == 'DECK_SYNCED') {
    let change = action.change
    let serverDeck = action.serverDeck
    decks.find( (deck, i) => {
      if (deck.uuid == change.uuid || deck.uuid == serverDeck.uuid) {
        return decks[i] = serverDeck
      }
    })
    localChanges.find( (deck, i) => {
      if (deck.uuid = change.uuid)
        return localChanges.splice(i,1)
    })
  }

  return {
    decks,
    localChanges
  }
}


module.exports = library;
