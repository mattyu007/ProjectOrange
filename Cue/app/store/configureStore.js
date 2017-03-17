// @flow

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import promise from './promise';
var reducers = require('../reducers');
var createLogger = require('redux-logger');
var {AsyncStorage} = require('react-native');

var isDebuggingInChrome = __DEV__;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

var createCueStore = applyMiddleware(thunk, promise, logger)(createStore);

function configureStore(onComplete: ?() => void) {
  const store = autoRehydrate()(createCueStore)(reducers);
  persistStore(store, {storage: AsyncStorage, blacklist: ['tabs', 'discover']}, onComplete);
  
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
