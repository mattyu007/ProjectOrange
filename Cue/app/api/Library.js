// @flow
import CueApi from './CueApi';

var LibraryApi = {

	fetchLibrary() {
		let endpoint = '/api/v1/library';
		console.info('Fetching Library from endpoint: ' + endpoint)
		return CueApi.fetch(endpoint);
	},

	fetchDeck(uuid : string) {
		let endpoint = '/api/v1/deck/' + uuid;
		console.info('Fetching deck "' + uuid + '" from endpoint: ' + endpoint)
		return CueApi.fetch(endpoint);
	},
}

module.exports = LibraryApi;
