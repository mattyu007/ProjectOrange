// @flow
var { combineReducers } = require('redux');

module.exports = combineReducers({
  user: require('./user'),
  navigation: require('./navigation'),
});