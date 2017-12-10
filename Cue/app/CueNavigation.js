import { Navigation } from 'react-native-navigation'

import LoginScreen from './login/LoginScreen'

import LibraryHome from './tabs/library/LibraryHome'
import DeckView from './tabs/library/DeckView'

import DiscoverHome from './tabs/discover/DiscoverHome'

import SearchHome from './tabs/search/SearchHome'

import AccountHome from './tabs/account/AccountHome'

export const CueScreens = {
  loginScreen: 'cue.login.LoginScreen',

  libraryHome: 'cue.library.LibraryHome',
  deckView: 'cue.library.deck.DeckView',

  discoverHome: 'cue.discover.DiscoverHome',

  searchHome: 'cue.search.SearchHome',

  accountHome: 'cue.account.AccountHome',
}

export function registerScreens(store, provider) {
  Navigation.registerComponent(CueScreens.loginScreen, () => LoginScreen, store, provider)

  Navigation.registerComponent(CueScreens.libraryHome, () => LibraryHome, store, provider)
  Navigation.registerComponent(CueScreens.deckView, () => DeckView, store, provider)

  Navigation.registerComponent(CueScreens.discoverHome, () => DiscoverHome, store, provider)

  Navigation.registerComponent(CueScreens.searchHome, () => SearchHome, store, provider)

  Navigation.registerComponent(CueScreens.accountHome, () => AccountHome, store, provider)
}
