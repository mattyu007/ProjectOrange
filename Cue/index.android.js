// @flow
const {AppRegistry} = require('react-native');
const setup = require('./app/setup');

// AppRegistry.registerComponent('Cue', setup);

import FBSDK from 'react-native-fbsdk'
window.FB = FBSDK

import { Provider } from 'react-redux'
import configureStore from './app/store/configureStore'

import { registerScreens } from './app/CueNavigation'

import CueApi from './app/api/CueApi'

import startApp from './app/CueApp'


// Rehydrate the Redux store
console.info('Rehdrating store');
const store = configureStore(() => {
  console.info('Rehydrated store', store)

  // Restore the user from the store if possible
  let user = store.getState().user
  console.info('Restoring user state', user)
  CueApi.setAuthHeader(user.userId, user.accessToken)

  // Register screens for react-native-navigation
  registerScreens(store, Provider)

  const isLoggedIn = store.getState().user.isLoggedIn
  startApp(isLoggedIn)
})
