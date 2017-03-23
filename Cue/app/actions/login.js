// @flow
import type { Action, PromiseAction, ThunkAction } from './types';
import AuthenticationApi from '../api/Authentication';
import FacebookApi from '../api/Facebook';
import { LoginManager, AccessToken,  } from 'react-native-fbsdk';
import { loadLibrary } from './library';
import CueApi from '../api/CueApi';
import UserApi from '../api/UserApi';


function logIn(cueUserId: string, cueAccessToken: string): Action {
  CueApi.setAuthHeader(cueUserId, cueAccessToken);
  return {
    type: 'LOGGED_IN',
    data: {
      userId: cueUserId,
   	  accessToken: cueAccessToken,
    },
  };
}


function logOut(): Action {
  LoginManager.logOut()
  CueApi.setAuthHeader(null, null);
  return {
    type: 'LOGGED_OUT',
  };
}


async function loadUsername(name: string): PromiseAction {
  UserApi.setName(name).catch(e => console.warn('Could not set name on Cue server'))
  return {
    type: 'LOADED_USERNAME',
    name,
  };
}


function serverLogin(): ThunkAction {
  return (dispatch, getState) => {
    return _serverLogin().then(cueUser => {
      dispatch(logIn(cueUser['user_id'], cueUser['access_token']));
      dispatch(loadLibrary());

      // Get name from Facebook.
      FacebookApi.getName(data => dispatch(loadUsername(data.name)));
    }).catch(e => {
      // Log out of Facebook if Cue auth fails.
      LoginManager.logOut();
      throw e;
    });
  };
}


async function _serverLogin() {
  const fbAccessToken = await AccessToken.getCurrentAccessToken();
  let facebookUserId = fbAccessToken.userID;
  let facebookAccessToken = fbAccessToken.accessToken;

  let timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 10000, 'Timed out while authenticating with Cue server');
  })
  return Promise.race(
    [timeout, AuthenticationApi.authenticate(facebookUserId, facebookAccessToken)]);
}


module.exports = {logIn, logOut, serverLogin};
