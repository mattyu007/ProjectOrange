// @flow
import type { Action, PromiseAction, ThunkAction } from './types';
import AuthenticationApi from '../api/Authentication';
import FacebookApi from '../api/Facebook';
import { LoginManager, AccessToken,  } from 'react-native-fbsdk';

function logIn(cueUserId: string, cueAccessToken: string): Action {
  return {
    type: 'LOGGED_IN',
    data: {
      userId: cueUserId,
   	  accessToken: cueAccessToken,
    },
  };
}

function logOut(): Action {
  return {
    type: 'LOGGED_OUT',
  };
}



async function loadUsername(data): PromiseAction {
  let name = data.name;
  return {
    type: 'LOADED_USERNAME',
    name,
  };
}

function serverLogin(): ThunkAction {
  return (dispatch) => {
    const login = _serverLogin();

    // Loading username happens async
    login.then(
      (result) => {
        dispatch(result[0]);
        FacebookApi.getName(data=>{dispatch(loadUsername(data))});
      }
    ).catch(
      (e) => {
        //If Cue auth fails, logout of facebook aswell
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