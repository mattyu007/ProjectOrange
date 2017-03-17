// @flow
import CueApi from './CueApi';

var DiscoverApi = {

	searchDecks(searchString : string) {
		let endpoint = '/api/v1/discover/search?query=' + searchString;
		console.info('Searching for decks matching query "' + searchString + '" from URL: ' + endpoint)
		return CueApi.fetch(endpoint);
	},
	fetchTop() {
		let endpoint = '/api/v1/discover/top';
		console.info('Fetching popular decks from URL: ' + endpoint)
		return CueApi.fetch(endpoint);
	},
	fetchNew() {
		let endpoint = '/api/v1/discover/new';
		console.info('Fetching new decks from URL: ' + endpoint)
		return CueApi.fetch(endpoint);
	}
}

module.exports = DiscoverApi;
