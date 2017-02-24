// @flow
import { combineReducers } from 'redux'
import user from './user'
import tabs from './tabs'

module.exports = combineReducers({
  user,
  tabs
});
