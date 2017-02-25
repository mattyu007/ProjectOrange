// @flow
import { serverURL } from '../env';

var AuthenticationApi = {
	authenticate(userId: ?string, accessToken: ?string) {
		let url = serverURL+'/api/v1/auth';
		let method = 'POST'
		let body = JSON.stringify({
				user_id: userId,
				access_token: accessToken,
			})

		return fetch(url, {
			method: method,
			body: body
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

module.exports = AuthenticationApi;