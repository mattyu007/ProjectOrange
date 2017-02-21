// @flow
import type { Action, ThunkAction } from './types';

function logIn(): Action {
  return {
    type: 'LOGGED_IN',
  };
}

function logOut(): Action {
  return {
    type: 'LOGGED_OUT',
  };
}


module.exports = {logIn, logOut};