// @flow
import type { Action, PromiseAction, ThunkAction } from './types';
import AuthenticationApi from '../api/Authentication';
import FacebookApi from '../api/Facebook';
import { LoginManager, AccessToken,  } from 'react-native-fbsdk';
import { loadLibrary } from './library';
import CueApi from '../api/CueApi';

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



async function loadUsername(name): PromiseAction {
  return {
    type: 'LOADED_USERNAME',
    name,
  };
}

function serverLogin(): ThunkAction {
  return (dispatch, getState) => {
    const login = _serverLogin();

    // Loading data happens async
    login.then(
      (result) => {
        dispatch(result[0]);
        dispatch(loadLibrary());
        FacebookApi.getName(data=>{dispatch(loadUsername(data.name))});
      }
    ).catch(
      (e) => {
        //If Cue auth fails, logout of facebook
        LoginManager.logOut();
        throw e;
    });
    return login;
  };
}

async function _serverLogin() {
  const fbAccessToken = await AccessToken.getCurrentAccessToken();
  let facebookUserId = fbAccessToken.userID;
  let facebookAccessToken = fbAccessToken.accessToken;

  let timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 10000, 'Timed out while authenticating with Cue server');
  })
  let cueUser = await Promise.race
    ([timeout, AuthenticationApi.authenticate(facebookUserId, facebookAccessToken)]);
  let userId = cueUser['user-id'];
  let accessToken = cueUser['access-token'];
  return Promise.all([
    Promise.resolve(logIn(userId, accessToken)),
  ]);
}

module.exports = {logIn, logOut, serverLogin};
