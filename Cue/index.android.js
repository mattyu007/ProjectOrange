// @flow
const {AppRegistry} = require('react-native');
const setup = require('./app/setup');

// AppRegistry.registerComponent('Cue', setup);

import FBSDK from 'react-native-fbsdk'
window.FB = FBSDK

import { Provider } from 'react-redux'
import configureStore from './app/store/configureStore'

import { Navigation } from 'react-native-navigation'
import { CueScreens, registerScreens } from './app/CueNavigation'

import CueApi from './app/api/CueApi'

import CueColors from './app/common/CueColors'
import CueIcons from './app/common/CueIcons'


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

  startApp()
})

function startApp() {
  let isLoggedIn = store.getState().user.isLoggedIn

  if (true || isLoggedIn) {
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Library',
          screen: CueScreens.libraryHome,
          icon: CueIcons.tabLibrary,
          selectedIcon: CueIcons.tabLibrarySelected,
          title: 'Library', // TODO: Remove
        },
        {
          label: 'Discover',
          screen: CueScreens.discoverHome,
          icon: CueIcons.tabDiscover,
          selectedIcon: CueIcons.tabDiscoverSelected,
          title: 'Discover', // TODO: Remove
        },
        {
          label: 'Search',
          screen: CueScreens.searchHome,
          icon: CueIcons.tabSearch,
          selectedIcon: CueIcons.tabSearchSelected,
          title: 'Search', // TODO: Remove
        },
        {
          label: 'Account',
          screen: CueScreens.accountHome,
          icon: CueIcons.tabAccount,
          selectedIcon: CueIcons.tabAccountSelected,
          title: 'Account', // TODO: Remove
        },
      ],
      tabsStyle: {
        tabBarSelectedButtonColor: CueColors.primaryTint,
      },
      appStyle: {
        navBarTextColor: CueColors.toolbarText,
        navBarBackgroundColor: CueColors.primaryTint,
        navBarButtonColor: CueColors.toolbarText,

        // iOS:
        statusBarTextColorScheme: 'light',
      }
    })
  } else {
    Navigation.startSingleScreenApp({
      screen: {
        screen: CueScreens.loginScreen,
        title: 'Login', // TODO: remove
      }
    })
  }
}
