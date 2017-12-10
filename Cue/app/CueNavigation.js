import { Navigation } from 'react-native-navigation'

import LoginScreen from './login/LoginScreen'

import LibraryHome from './tabs/library/LibraryHome'
import LibraryListView from './tabs/library/LibraryListView'

import DiscoverHome from './tabs/discover/DiscoverHome'

import SearchHome from './tabs/search/SearchHome'

import AccountHome from './tabs/account/AccountHome'

const CueScreens = {
  loginScreen: 'cue.login.LoginScreen',

  libraryHome: 'cue.tabs.library.LibraryHome',
  libraryListView: 'cue.tabs.library.LibraryListView',

  discoverHome: 'cue.tabs.discover.DiscoverHome',

  searchHome: 'cue.tabs.search.SearchHome',

  accountHome: 'cue.tabs.account.AccountHome',
}

function registerScreens(store, provider) {
  Navigation.registerComponent(CueScreens.loginScreen, () => LoginScreen, store, provider)

  Navigation.registerComponent(CueScreens.libraryHome, () => LibraryHome, store, provider)

  Navigation.registerComponent(CueScreens.discoverHome, () => DiscoverHome, store, provider)

  Navigation.registerComponent(CueScreens.searchHome, () => SearchHome, store, provider)

  Navigation.registerComponent(CueScreens.accountHome, () => AccountHome, store, provider)
}

module.exports = {
  CueScreens,
  registerScreens
}
