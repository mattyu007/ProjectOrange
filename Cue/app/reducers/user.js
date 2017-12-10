// @flow

import type { Action } from '../actions/types';
import startApp from '../CueApp'

export type State = {
  isLoggedIn: boolean;
  userId: ?string;
  accessToken: ?string;
  name: ?string;
};

const initialState = {
  isLoggedIn: false,
  userId: null,
  accessToken: null,
  name: null,
};

function user(state: State = initialState, action: Action): State {
  let shouldRestartApp = false

  if (action.type === 'LOGGED_IN') {
    shouldRestartApp = true

    let {userId, accessToken} = action.data;
    state = {
      isLoggedIn: true,
      userId,
      accessToken,
      name: state.name,
    };
  } else if (action.type === 'LOGGED_OUT') {
    shouldRestartApp = true

	  state = initialState;
  } else if (action.type === 'LOADED_USERNAME') {
    let name = action.name;
    state = {
      isLoggedIn: state.isLoggedIn,
      userId: state.userId,
      accessToken: state.accessToken,
      name: name,
    }
  }

  if (shouldRestartApp) {
    setTimeout(() => {
      startApp(state.isLoggedIn)
    }, 0)
  }

  return state;
}

module.exports = user;
