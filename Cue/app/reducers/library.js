// @flow

import type { Action } from '../actions/types';
import type { Deck, Card } from '../api/types';

export type State = {
  decks: ?Array<Deck>;
  inaccessibleDecks: ?Array<Deck>;
  localChanges: [];
};

const initialState: State = {
  decks: null,
  inaccessibleDecks: null,
  localChanges: [],
};

// if state.decks is null then library hasn't loaded yet
// if state.decks size is 0, then library is empty
function library(state: State = initialState, action: Action): State {
  let decks: Array<Deck> = state.decks == null ? [] : state.decks.slice()
  let inaccessibleDecks: Array<Deck> = state.inaccessibleDecks == null ? [] : state.inaccessibleDecks.slice()
  let localChanges = state.localChanges.slice()

  if (action.type === 'LOADED_LIBRARY') {
    inaccessibleDecks = []
    let loadedDecks = action.decks.slice()

    action.decks.forEach(deck => {
        if (!deck.accessible || deck.deleted) {
          let index = decks.findIndex(d => d.uuid == deck.uuid)
          if (index != -1) {
            inaccessibleDecks.push(decks[index])
          }

          localChanges.push({uuid: deck.uuid, action: 'delete'})

          let loadIndex = loadedDecks.findIndex(d => d.uuid == deck.uuid)
          if (loadIndex != -1) {
            loadedDecks.splice(loadIndex,1)
          }
        }
    })

    decks = loadedDecks
  } else if (action.type === 'CLEAR_INACCESSIBLE_DECKS') {
    inaccessibleDecks = []
  } else if (action.type === 'DECK_ADDED_TO_LIBRARY') {
    decks.push(action.addedDeck)
  } else if (action.type === 'DECK_ALREADY_IN_LIBRARY') {
    decks = state.decks
  } else if (action.type === 'DECK_CREATED') {
    decks.push({...action.deck, last_update: new Date()})
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
        cards: _applyCardChangesDecks(decks[deckIndex].cards, change.cards),
        action: undefined,
        last_update: new Date(),
      }
    }
    //update localChanges
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (localChanges[changeIndex]) {
      localChanges[changeIndex] = {
        ...localChanges[changeIndex],
        ...change,
        cards: _applyCardChangesLocalChanges(localChanges[changeIndex].cards, change.cards),
        action: localChanges[changeIndex].action === 'add' ? 'add' : 'edit',
      }
    } else if (!decks[deckIndex]) {
        console.warn("Could not find deck for an edit action that already exists", change)
    } else {
      localChanges.push({
        ...change,
        action: 'edit',
        parent_deck_version: decks[deckIndex].deck_version,
        parent_user_data_version: decks[deckIndex].user_data_version
      })
    }

  } else if (action.type === 'CARD_FLAGGED') {
    let change = action.change
    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid)
    if (decks[deckIndex]) {
      decks[deckIndex] = {
        ...decks[deckIndex],
        cards: _applyCardChangesDecks(decks[deckIndex].cards, change.cards),
        last_update: new Date()
      }
    }
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (localChanges[changeIndex]) {
      localChanges[changeIndex] = {
        ...localChanges[changeIndex],
        cards: _applyCardChangesLocalChanges(localChanges[changeIndex].cards, change.cards),
      }
    } else {
      localChanges.push({
        ...change,
        action: 'flag',
        parent_deck_version: decks[deckIndex].deck_version,
        parent_user_data_version: decks[deckIndex].user_data_version
      })
    }

  } else if (action.type === 'DECK_RATED') {
    let change = action.change

    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid)
    if (decks[deckIndex]) {
      let oldRating = decks[deckIndex].user_rating ? decks[deckIndex].user_rating : 0
      decks[deckIndex] = {
        ...decks[deckIndex],
        rating: decks[deckIndex].rating + change.user_rating - oldRating,
        num_ratings: decks[deckIndex].num_ratings + (oldRating ? 0 : 1),
        user_rating: change.user_rating
      }
    }

    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid && deck.user_rating)
    if (localChanges[changeIndex]) {
      localChanges[changeIndex] = {
        ...localChanges[changeIndex],
        user_rating: change.user_rating,
      }
    } else {
      localChanges.push({
        ...change,
        action: 'rate',
      })
    }

  } else if (action.type === 'SHARE_CODE_GENERATED') {
    let deck = decks.find((deck: Deck) => deck.uuid === action.uuid)
    deck.share_code = action.code
    deck.last_update = new Date()

  } else if (action.type === 'DECK_SYNCED' || action.type === 'DECK_CONFLICT_RESOLVED') {
    let change = action.change
    let updatedDeck = action.updatedDeck
    let deckIndex = decks.findIndex(deck => deck.uuid == change.uuid || deck.uuid == updatedDeck.uuid)
    if (decks[deckIndex]) {
      if (change.user_data_version) {
        decks[deckIndex] = {...decks[deckIndex], user_data_version: change.user_data_version}
      } else if (updatedDeck.deleted) {
        decks.splice(deckIndex,1)
      } else {
        decks[deckIndex] = updatedDeck
      }
    }
    let changeIndex = localChanges.findIndex(deck => deck.uuid == change.uuid)
    if (localChanges[changeIndex])
      localChanges.splice(changeIndex,1)

  } else {
    return state
  }

  return {
    decks,
    inaccessibleDecks,
    localChanges
  }
}

//apply card changes to a deck.cards
function _applyCardChangesDecks(cards: Array<Card>, changes) {
  console.debug('_applyCardChangesDecks', cards, changes)
  if (!cards && !changes) return []
  if (!changes) return cards
  if (!cards) cards = []

  let positionUpdateNeeded = false
  let mergedCards = cards.slice();

  changes.forEach(change => {
    let index = mergedCards.findIndex(card => card.uuid == change.uuid)

    if (change.action === 'add') {
      mergedCards.push({...change, action: undefined})

    } else if (change.action === 'delete') {
      if (index !== -1) {
        mergedCards.splice(index,1)
      } else {
        console.warn('Tried to delete non-existant card ' + change.uuid + '?')
      }

    } else if (change.action === 'edit') {
      if (index !== -1) {
        if (typeof change.position !== 'undefined' && change.position !== index) {
          // The change has a move; do the move
          positionUpdateNeeded = true
          let card = mergedCards.splice(index, 1)[0]
          card = {...card, ...change, action: undefined}
          mergedCards.splice(change.position, 0, card)
        } else {
          // The change is not a move; just edit the card in-place
          mergedCards[index] = {...mergedCards[index], ...change, action: undefined}
        }
      } else {
        console.warn('Tried to edit non-existant card ' + change.uuid + '?')
      }
    }
  })

  // Fix the position property of the cards if necessary
  if (positionUpdateNeeded) {
    mergedCards.forEach((card: Card, index: number) => {
      card.position = index
    })
  }

  return mergedCards
}

//apply card changes to a localChange.cards
function _applyCardChangesLocalChanges(cards: Array<Card>, changes) {
  console.debug('_applyCardChangesLocalChanges', cards, changes)
  if (!cards && !changes) return []
  if (!cards) return changes
  if (!changes) return cards
  let mergedCards = cards.slice();
  changes.forEach(change => {
    // Locate the existing localChanges record
    let index = mergedCards.findIndex(card => card.uuid == change.uuid)

    if (change.action === 'add') {
      mergedCards.push(change)

    } else if (change.action === 'delete') {
      if (index !== -1) {
        if (mergedCards[index].action === 'add') {
          mergedCards.splice(index,1)
        } else {
          mergedCards[index] = {uuid: change.uuid, action: 'delete'}
        }
      } else {
        mergedCards.push(change)
      }

    } else if (change.action === 'edit') {
      // For card moves, since our local changes and the server's changes are
      // applied in order, we only need to account for the case where a card
      // is edited or moved multiple times, which causes other cards to shift.
      if (index !== -1) {
        if (typeof change.position !== 'undefined'
            && typeof mergedCards[index].position !== 'undefined'
            && change.position !== mergedCards[index].position) {
          // Remove the card from the list of merged cards
          let localChange = mergedCards.splice(index, 1)[0]

          let oldPosition = localChange.position
          let newPosition = change.position

          console.debug('Processing move from ' + oldPosition + ' to ' + newPosition)
          // Forward move from X to Y: subtract 1 from all pending changes
          // with positions > X
          if (newPosition > oldPosition) {
            mergedCards.forEach((card: Card) => {
              if (typeof card.position !== 'undefined'
                  && card.position > oldPosition) {
                console.debug('Forward: Card at ' + card.position + ' will be adjusted -1')
                card.position--
              } else {
                console.debug('Forward: Card at ' + card.position + ' not affected')
              }
            })

          // Backward move from X to Y: we don't care! This is automatically taken
          // care of because the card is inserted last, so all other cards
          // are bumped automatically
          } else if (newPosition < oldPosition) {
            mergedCards.forEach((card: Card) => {
              console.log('Back: Nothing to do with card at ' + card.position)
            })
          }

          // Merge the new change and insert it at the end of the local changes
          mergedCards.push({...localChange, ...change, action: localChange.action})
        } else {
          mergedCards[index] = {...mergedCards[index], ...change, action: mergedCards[index].action}
        }
      } else {
        mergedCards.push(change)
      }
    }
  })
  return mergedCards
}

module.exports = library;
