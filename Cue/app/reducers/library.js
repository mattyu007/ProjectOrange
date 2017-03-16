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

  if (action.type === 'LOADED_LIBRARY') {
    decks = action.decks

  } else if (action.type === 'DECK_CREATED') {
    decks.push(action.deck)
    localChanges.push({...action.deck, action: "add"})

  } else if (action.type === 'DECK_DELETED') {
    let deckIndex = decks.findIndex(deck => deck.uuid == action.uuid)
    if (decks[deckIndex])
      decks.splice(deckIndex,1)
    let changeIndex = localChanges.findIndex(deck => deck.uuid == action.uuid)
    if (localChanges[changeIndex]) {
      if (localChanges[changeIndex].action === 'add')
        localChanges.splice(changeIndex,1)
      else
        localChanges[changeIndex] = {uuid: action.uuid, action: 'delete'}
    } else {
      localChanges.push({uuid: action.uuid, action: 'delete'})
    }

  } else if (action.type === 'DECK_EDITED') {
    let change = action.change
    //update decks
    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid)
    if (decks[deckIndex]) {
      decks[deckIndex] = {
        ...decks[deckIndex],
        ...change,
        cards: _mergeCardChanges(decks[deckIndex].cards, change.cards),
        action: undefined
      }
    }
    //update localChanges
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (localChanges[changeIndex]) {
      localChanges[changeIndex] = {
        ...localChanges[changeIndex],
        ...change,
        cards: localChanges[changeIndex].cards.concat(change.cards),
        action: localChanges[changeIndex].action,
      }
    } else {
      if (decks[deckIndex])
        console.error("Could not find existing deck for edit action", change)
      else
        localChanges.push({
          ...change,
          action: 'edit',
          parent_deck_version: decks[deckIndex].deck_version,
          parent_user_data_version: decks[deckIndex].user_data_version
        })
    }

  } else if (action.type === 'DECK_SYNCED') {
    let change = action.change
    let serverDeck = action.serverDeck
    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid || deck.uuid == serverDeck.uuid)
    if (decks[deckIndex])
      decks[deckIndex] = serverDeck
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (localChanges[changeIndex])
      localChanges.splice(changeIndex,1)
  } else {
    return state
  }

  return {
    decks,
    localChanges
  }
}

//merges card changes for a deck's cards
function _mergeCardChanges(cards, changes) {
  if (! cards && !changes) return []
  if (!cards) return []
  if (!changes) return cards
  let mergedCards = cards.slice();
  changes.forEach(change => {
    let index = mergedCards.findIndex(card => card.uuid == change.uuid)
    if (change.action === 'add') {
      mergedCards.push({...change, action: undefined})
    } else if (change.action === 'delete' && mergedCards[index]) {
      mergedCards.splice(index,1)
    } else if (change.action === 'edit' && mergedCards[index]) {
      //TODO: update the position of every card if position changed
      mergedCards[index] = {...mergedCards[index], ...change, action: undefined}
    }
  })
  return mergedCards
}

module.exports = library;
