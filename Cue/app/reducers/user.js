// @flow

import type {Action} from '../actions/types';

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
  if (action.type === 'LOGGED_IN') {
    let {userId, accessToken} = action.data;
    return {
      isLoggedIn: true,
      userId,
      accessToken,
      name: state.name,
    };
  } else if (action.type === 'LOGGED_OUT') {
	  return initialState;
  } else if (action.type === 'LOADED_USERNAME') {
    let name = action.name;
    return {
      isLoggedIn: state.isLoggedIn,
      userId: state.userId,
      accessToken: state.accessToken,
      name: name,
    }
  }
  return state;
}

module.exports = user;