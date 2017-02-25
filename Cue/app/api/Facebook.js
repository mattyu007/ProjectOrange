// @flow
import {
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

var FacebookApi = {
  getName(callback) {
    function processResponse(error, result) {
      if (!error && typeof result === 'string') {
        try {
          result = JSON.parse(result);
        } catch (e) {
          error = e;
        }
      }
      const data = error ? {error} : result;
      callback(data);
    }

    const request = new GraphRequest('/me', {httpMethod: 'GET'}, processResponse);
    new GraphRequestManager().addRequest(request).start();

  }

}


module.exports = FacebookApi;