// @flow

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
var reducers = require('../reducers');
var createLogger = require('redux-logger');
var {AsyncStorage} = require('react-native');

var isDebuggingInChrome = __DEV__;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

var createCueStore = applyMiddleware(thunk, logger)(createStore);

function configureStore(onComplete: ?() => void) {
  const store = autoRehydrate()(createCueStore)(reducers);
  persistStore(store, {storage: AsyncStorage, blacklist: ['tabs']}, onComplete);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
