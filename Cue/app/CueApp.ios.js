// @flow

import { Navigation } from 'react-native-navigation'
import { CueScreens, registerScreens } from './CueNavigation'
import CueColors from './common/CueColors'
import CueIcons from './common/CueIcons'

export default function startApp(isLoggedIn: boolean) {
  if (isLoggedIn) {
    console.info("Starting tabs")
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
        navBarNoBorder: true,
        statusBarTextColorScheme: 'light',
      }
    })
  } else {
    console.info("Starting login screen")
    Navigation.startSingleScreenApp({
      screen: {
        screen: CueScreens.loginScreen,
        title: 'Login', // TODO: remove
      },
      appStyle: {
        navBarHidden: true,
        statusBarTextColorScheme: 'light',
      }
    })
  }
}
