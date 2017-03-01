// @flow
import { combineReducers } from 'redux';
import user from './user';
import tabs from './tabs';
import library from './library';

module.exports = combineReducers({
  user,
  tabs,
  library
});
