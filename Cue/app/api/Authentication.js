// @flow
import CueApi from './CueApi';

var AuthenticationApi = {
	authenticate(userId: ?string, accessToken: ?string) {
		let url = '/api/v1/auth';
		let method = 'POST'
		let body = JSON.stringify({
				user_id: userId,
				access_token: accessToken,
			})
		return CueApi.fetch(url, method, body);
	},
}

module.exports = AuthenticationApi;