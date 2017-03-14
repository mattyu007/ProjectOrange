// @flow
import CueApi from './CueApi'
import DeviceInfo from 'react-native-device-info'


var LibraryApi = {

  fetchLibrary() {
    let endpoint = '/api/v1/library';
    console.info('Fetching Library from endpoint: ' + endpoint)
    return CueApi.fetch(endpoint);
  },

  fetchDeck(uuid : string) {
    let endpoint = '/api/v1/deck/' + uuid;
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
      device: DeviceInfo.getUniqueID(),
      cards: cards,
    })
		console.info('Creating deck "' + name + '" at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'POST', body)
  },

  editDeck (change){
    let endpoint = 'api/v1/deck/' + change.uuid
    let body = JSON.stringify({
      device: DeviceInfo.getUniqueID(),
			parent_deck_version: change.parent_deck_version,
			parent_user_data_version: change.parent_user_data_version,
			name: change.name,
			public: change.public,
			tags: change.tags,
			actions: change.cards
    })
    console.info('editing deck' + body + ' at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'PUT', body)
  },

  deleteDeck(uuid: string) {
    let endpoint = 'api/v1/library/' + uuid
		console.info('deleteing deck at endpoint ' + endpoint)
    return CueApi.fetch(endpoint, 'DELETE')
  }
}

module.exports = LibraryApi;
