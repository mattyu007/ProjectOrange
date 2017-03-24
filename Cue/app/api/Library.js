// @flow
import CueApi from './CueApi'
import DeviceInfo from 'react-native-device-info'
import type { Deck } from './types'

var LibraryApi = {

  fetchLibrary() {
    let endpoint = '/api/v1/library';
    console.info('Fetching Library from endpoint: ' + endpoint)
    return CueApi.fetch(endpoint);
  },

  fetchDeck(uuid : string, shareCode?: string) {
    let endpoint = '/api/v1/deck/' + uuid;
    if (shareCode) {
      endpoint += '?share_code=' + shareCode
    }
    console.info('Fetching deck from endpoint: ' + endpoint)
    return CueApi.fetch(endpoint);
  },

  createDeck(
      name: string,
      tags: Array<string> = [],
      cards: Array<{front:string; back:string}> = []) {
    let endpoint = '/api/v1/deck/add';

    let body = JSON.stringify ({
      name,
      tags: tags,
      device: DeviceInfo.getDeviceName(),
      cards: cards,
    })
		console.info('Creating deck "' + name + '" at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'POST', body)
  },

  editDeck (change){
    let endpoint = '/api/v1/deck/' + change.uuid
    let actions

    if (change.cards) {
      actions = change.cards.map(card => {
        return {...card, card_id: card.uuid, uuid: undefined}
      })
    }
    let body = JSON.stringify({
      device: DeviceInfo.getDeviceName(),
      parent_deck_version: change.parent_deck_version,
      parent_user_data_version: change.parent_user_data_version,
      name: change.name,
      public: change.public,
      unshare: change.unshare,
      tags: change.tags,
      actions
    })

    console.info('editing deck' + body + ' at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'PUT', body)
  },

  deleteDeck(uuid: string) {
    let endpoint = '/api/v1/library/' + uuid
    console.info('deleting deck at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'DELETE').catch(e=>{
      if (e.response && e.response.status !== 404) {
        // don't throw if deck already deleted
        throw e
      }
    })
  },

  generateShareCode(uuid: string) {
    let endpoint = '/api/v1/deck/' + uuid + '/code'
    console.info('Generating share code using endpoint: ' + endpoint)
    return CueApi.fetch(endpoint, 'GET')
  },

  getUuidByShareCode(shareCode: string) {
    let endpoint = '/api/v1/deck/uuid/' + shareCode
    console.info('Fetching deck UUID from share code "' + shareCode + '" at endpoint:' + endpoint)
    return CueApi.fetch(endpoint)
  },

  addDeckToLibrary(uuid: string, shareCode?: string) {
    let endpoint = '/api/v1/library/add';
    let method = 'POST'
    let body = JSON.stringify({
      uuid: uuid,
      device: DeviceInfo.getDeviceName(),
      share_code: shareCode,
    });
    console.info('Adding deck "' + uuid + '" to library from endpoint: ' + endpoint)
    return CueApi.fetch(endpoint, method, body);
  },

  overwriteDeck(deck: Deck) {
    let endpoint = '/api/v1/deck/' + deck.uuid
    let method = 'POST'
    let cards = deck.cards.map(card => {return {
      ...card,
      uuid: card.uuid ? card.uuid : null
    }})
    let body = JSON.stringify({
      name: deck.name,
      tags: deck.tags,
      public: Boolean(deck.public), //server returns 400 without Boolean conversion
      device: DeviceInfo.getDeviceName(),
      cards
    })
    console.info('Overwriting ' + body + ' at endpoint: ' + endpoint)
    return CueApi.fetch(endpoint, method, body)
  },

  flagCard(change) {
    let endpoint = '/api/v1/deck/' + change.uuid + '/flag'
    let method = 'PUT'
    let actions = []
    if (change.cards) {
      actions = change.cards.map(card => {
        return {card_id: card.uuid, needs_review: card.needs_review}
      })
    }
    let body = JSON.stringify({
      device: DeviceInfo.getDeviceName(),
      parent_deck_version: change.parent_deck_version,
      parent_user_data_version: change.parent_user_data_version,
      actions
    })
    console.info('Flagging card "' + body + '" at endpoint: ' + endpoint)
    return CueApi.fetch(endpoint, method, body);
  },

  rateDeck(uuid: string, rating: number) {
    let endpoint = '/api/v1/deck/' + uuid + '/rate'
    let method = 'POST'
    let body = JSON.stringify({
      rating
    })
    console.info('Rating deck "' + uuid + '" ' + rating + ' at endpoint: ' + endpoint)
    return CueApi.fetch(endpoint, method, body);
  }

}

module.exports = LibraryApi;
