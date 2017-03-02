// @flow
import { serverURL } from '../env';


//TODO: not sure proper way to get state in the api
//TODO: look into moving checkStatus and auth header creation into common util
var LibraryApi = {

	fetchLibrary(state) {
		let url = serverURL + '/api/v1/library';
		let user = state.user;
		return fetch(url, {
			headers: {
				'X-CUE-USER-ID' : user.userId,
				'X-CUE-ACCESS-TOKEN': user.accessToken,
			}
		})
		.then(checkStatus)
		.then(response => response.json())
		.catch(e => {
			throw (e)
		});
	},

	fetchDeck(uuid : string, state) {
		let url = serverURL + '/api/v1/deck/' + uuid;
		let user = state.user;
		return fetch(url, {
			headers: {
				'X-CUE-USER-ID' : user.userId,
				'X-CUE-ACCESS-TOKEN': user.accessToken,
			}
		})
		.then(checkStatus)
		.then(response => response.json())
		.catch(e => {
			throw (e)
		});
	},
}

var checkStatus = function(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		let error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

module.exports = LibraryApi;