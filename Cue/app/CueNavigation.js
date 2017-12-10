// @flow
'use strict'

import { Platform, AppRegistry } from 'react-native'

import { Navigation } from 'react-native-navigation'

import LoginScreen from './login/LoginScreen'

import LibraryHome from './tabs/library/LibraryHome'
import DeckView from './tabs/library/DeckView'
import CardEntryView from './tabs/library/CardEntryView'
import PlayDeckSetupView from './tabs/library/play/PlayDeckSetupView'
import PlayDeckView from './tabs/library/play/PlayDeckView'
import DeckSharingOptions from './tabs/library/DeckSharingOptions'
import SyncConflict from './common/SyncConflict'

import DiscoverHome from './tabs/discover/DiscoverHome'
import DeckPreview from './common/DeckPreview'

import SearchHome from './tabs/search/SearchHome'
import SearchTextInput from './tabs/search/SearchTextInput'

import AccountHome from './tabs/account/AccountHome'

export const CueScreens = {
  loginScreen: 'cue.login.LoginScreen',

  libraryHome: 'cue.library.LibraryHome',
  deckView: 'cue.library.DeckView',
  cardEntryView: 'cue.library.CardEntryView',
  playDeckSetupView: 'cue.library.play.PlayDeckSetupView',
  playDeckView: 'cue.library.play.PlayDeckView',
  deckSharingOptions: 'cue.library.DeckSharingOptions',
  syncConflict: 'cue.library.SyncConflict',

  discoverHome: 'cue.discover.DiscoverHome',
  deckPreview: 'cue.discover.DeckPreview',

  searchHome: 'cue.search.SearchHome',
  searchTextInput: 'cue.search.SearchTextInput',

  accountHome: 'cue.account.AccountHome',
}

export function registerScreens(store: any, provider: any) {
  Navigation.registerComponent(CueScreens.loginScreen, () => LoginScreen, store, provider)

  Navigation.registerComponent(CueScreens.libraryHome, () => LibraryHome, store, provider)
  Navigation.registerComponent(CueScreens.deckView, () => DeckView, store, provider)
  Navigation.registerComponent(CueScreens.cardEntryView, () => CardEntryView, store, provider)
  Navigation.registerComponent(CueScreens.playDeckSetupView, () => PlayDeckSetupView, store, provider)
  Navigation.registerComponent(CueScreens.playDeckView, () => PlayDeckView, store, provider)
  Navigation.registerComponent(CueScreens.deckSharingOptions, () => DeckSharingOptions, store, provider)
  Navigation.registerComponent(CueScreens.syncConflict, () => SyncConflict, store, provider)

  Navigation.registerComponent(CueScreens.discoverHome, () => DiscoverHome, store, provider)
  Navigation.registerComponent(CueScreens.deckPreview, () => DeckPreview, store, provider)

  Navigation.registerComponent(CueScreens.searchHome, () => SearchHome, store, provider)
  Navigation.registerComponent(CueScreens.searchTextInput, () => SearchTextInput, store, provider)

  Navigation.registerComponent(CueScreens.accountHome, () => AccountHome, store, provider)
}

type ButtonConfiguration = {
  title: string,
  id: string,
  display?: 'icon' | 'text',
  icon?: number,
}

export function makeButton(config: ButtonConfiguration): any {
  if (!config.icon) {
    return {
      title: config.title,
      id: config.id,
    }
  }

  if (Platform.OS === 'android') {
    if (config.display && config.display === 'text') {
      return {
        title: config.title,
        id: config.id,
      }
    } else {
      return {
        title: config.title,
        id: config.id,
        icon: config.icon
      }
    }
  } else {
    if (config.display && config.display === 'icon') {
      return {
        title: config.title,
        id: config.id,
        icon: config.icon,
      }
    } else {
      return {
        title: config.title,
        id: config.id,
      }
    }
  }
}
