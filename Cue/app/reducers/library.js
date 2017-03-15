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
    if (deckIndex >= 0)
      decks.splice(deckIndex,1)
    let changeIndex = localChanges.findIndex(deck => deck.uuid == action.uuid)
    if (changeIndex >= 0) {
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
    if (deckIndex >= 0) {
      decks[deckIndex] = {
        ...decks[deckIndex],
        ...change,
        cards: _mergeCards(decks[deckIndex].cards, change.cards),
        action: undefined
      }
    }
    //update localChanges
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (changeIndex >= 0) {
      localChanges[changeIndex] = {
        ...localChanges[changeIndex],
        ...change,
        cards: _mergeCardsChanged(localChanges[changeIndex].cards, change.cards),
        action: localChanges[changeIndex].action
      }
    } else {
      localChanges.push({...change, action: 'edit'})
    }

  } else if (action.type === 'DECK_SYNCED') {
    let change = action.change
    let serverDeck = action.serverDeck
    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid || deck.uuid == serverDeck.uuid)
    if (deckIndex >= 0)
      decks[deckIndex] = serverDeck
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (changeIndex >= 0)
      localChanges.splice(changeIndex,1)
  } else {
    return state
  }

  return {
    decks,
    localChanges
  }
}

//merges card edits for a deck's cards
function _mergeCards(cards, cardsChanged) {
  if (!cards) return []
  if (!cardsChanged) return cards
  let mergedCards = cards.slice();
  cardsChanged.forEach(cardChange => {
    let index = mergedCards.findIndex(card => card.uuid == cardChange.uuid)
    if (index >= 0) {
      if (cardChange.action === 'delete')
        mergedCards.splice(index,1)
      else
        mergedCards[index] = {...mergedCards[index], ...cardChange, action: undefined}
    } else {
      mergedCards.push({...cardChange, action: undefined})
    }
  })
  return mergedCards
}

//merge card edits for a localChange's cards
function _mergeCardsChanged(cards, cardsChanged) {
  if (! cards && !cardsChanged) return []
  if (!cards) return cardsChanged
  if (!cardsChanged) return cards
  let mergedCards = cards.slice();
  cardsChanged.forEach(cardChange => {
    let index = mergedCards.findIndex(card => card.uuid == cardChange.uuid)
    if (index >= 0) {
      if (cardChange.action === 'delete' && cards[index].action === 'add')
        mergedCards.splice(index,1)
      else {
        mergedCards[index] = {...mergedCards[index], ...cardChange, action: cards[index].action}
      }
    } else {
      mergedCards.push(cardChange)
    }
  })
  return mergedCards
}

module.exports = library;
