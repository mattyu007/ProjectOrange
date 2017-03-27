// @flow
'use strict'

import { StatusBar, Platform } from 'react-native'

import { serverURL } from '../env';

class CueApi {
	static userId  = null;
	static accessToken = null;
	static requestsPending = 0;

	static setNetworkActivityIndicatorVisible(value: boolean) {
		if (Platform.OS === 'ios') {
			if (value) {
				this.requestsPending++
			} else {
				this.requestsPending--
			}

			StatusBar.setNetworkActivityIndicatorVisible(this.requestsPending > 0)
		}
	}

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
		this.setNetworkActivityIndicatorVisible(true)
		return fetch(serverURL + endpoint, {
			method: method,
			headers: headers,
			body: body,
		})
		.then(checkStatus)
		.then(response => response.text())
		.then(text => {
			this.setNetworkActivityIndicatorVisible(false)
			try {
				return JSON.parse(text)
			} catch (e) {
				return {}
			}
		})
		.catch(e => {
			this.setNetworkActivityIndicatorVisible(false)
			if (!e.recoveryMessage) {
				e.recoveryMessage = 'Check your Internet connection and try again.'
			}
			throw e
		});
	}
}

var checkStatus = function(response) {
	if (response.ok) {
		return response;
	} else {
		console.warn('Cue API request returned bad status code', response)
		let error = new Error(response.status);
		error.response = response;
		error.recoveryMessage = `An error occurred (${response.status}). Try again in a few moments.`
		throw error;
	}
}

module.exports = CueApi;
