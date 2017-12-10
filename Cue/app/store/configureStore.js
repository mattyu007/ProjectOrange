// @flow

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import promise from './promise';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import { AsyncStorage } from 'react-native';

var isDebuggingInChrome = __DEV__;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

// const store = createStore(
//   reducers,
//   undefined,
//   compose(
//     applyMiddleware(thunk, promise, logger),
//     autoRehydrate()
//   )
// )
//
// persistStore(store, {storage: AsyncStorage, blacklist: ['tabs', 'discover']})
//
// module.exports = store

var createCueStore = applyMiddleware(thunk, promise, logger)(createStore);

function configureStore(onComplete: ?() => void) {
  const store = autoRehydrate()(createCueStore)(rootReducer);
  persistStore(store, {storage: AsyncStorage, blacklist: ['tabs', 'discover']}, onComplete);

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
