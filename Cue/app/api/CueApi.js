// @flow
'use strict'

import { serverURL } from '../env';

class CueApi {
	static userId  = null;
	static accessToken = null;

	static setAuthHeader(userId: ?string, accessToken: ?string) {
		this.userId = userId;
		this.accessToken = accessToken;
	}

	static fetch (endpoint: string, method: string = 'GET', body: ?string = null): Promise<JSON> {
		let headers = null;
		if (this.userId != null && this.accessToken != null) {
			headers = {
				'X-CUE-USER-ID' : this.userId,
				'X-CUE-ACCESS-TOKEN': this.accessToken,
			}
		}
		return fetch(serverURL + endpoint, {
			method: method,
			headers: headers,
			body: body,
		})
		.then(checkStatus)
		.then(response => response.json())
		.catch(e => {
			throw (e)
		});
	}
}

var checkStatus = function(response) {
	if (response.ok) {
		return response;
	} else {
		let error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

module.exports = CueApi;
